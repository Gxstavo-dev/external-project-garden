import { useEffect, type RefObject } from "react";

const CHAR_MS = 16; // typing speed per character
const PAUSE_MS = 90; // pause between lines

type Piece = { original: Text; wrap: HTMLSpanElement; on: HTMLSpanElement; off: HTMLSpanElement; text: string };
/** A number marked with data-n counts up when the typing reaches it. */
type Counter = { el: HTMLElement; to: number; text: string };
type Step = Piece | Counter;
const isCounter = (s: Step): s is Counter => "to" in s;

/**
 * Types out the text of each feature mockup (`.pi .mk`) the first time it scrolls into view.
 * Untyped text stays in place but transparent, so the card never changes size while typing.
 * The original text nodes are put back on cleanup so React's DOM stays intact.
 */
export function useTypewriter(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const cards = [...root.querySelectorAll<HTMLElement>(".pi .mk")];
    const allPieces: Piece[] = [];
    const allCounters: Counter[] = [];
    const frames = new Set<number>();
    const timers = new Set<number>();

    const prepare = (card: HTMLElement) => {
      const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      const seenCounters = new Set<HTMLElement>();
      return nodes.flatMap((original): Step[] => {
        const counterEl = original.parentElement?.closest<HTMLElement>("[data-n]");
        if (counterEl) {
          if (seenCounters.has(counterEl)) return [];
          seenCounters.add(counterEl);
          const counter = { el: counterEl, to: Number(counterEl.dataset["n"]), text: counterEl.textContent ?? "" };
          counterEl.style.visibility = "hidden";
          allCounters.push(counter);
          return [counter];
        }
        const text = original.textContent ?? "";
        const wrap = document.createElement("span");
        wrap.className = "tw";
        const on = document.createElement("span");
        on.className = "tw-on";
        const off = document.createElement("span");
        off.className = "tw-off";
        off.textContent = text;
        wrap.append(on, off);
        original.replaceWith(wrap);
        const piece = { original, wrap, on, off, text };
        allPieces.push(piece);
        return [piece];
      });
    };

    const countUp = (c: Counter, done: () => void) => {
      c.el.style.visibility = "";
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 900);
        c.el.textContent = "$" + Math.round(c.to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) frames.add(requestAnimationFrame(step));
        else done();
      };
      frames.add(requestAnimationFrame(step));
    };

    const type = (pieces: Step[]) => {
      let i = 0;
      const next = () => {
        const piece = pieces[i++];
        if (!piece) return;
        if (isCounter(piece)) {
          countUp(piece, () => timers.add(window.setTimeout(next, PAUSE_MS)));
          return;
        }
        piece.wrap.classList.add("typing");
        const t0 = performance.now();
        const step = (t: number) => {
          const n = Math.min(piece.text.length, Math.floor((t - t0) / CHAR_MS) + 1);
          piece.on.textContent = piece.text.slice(0, n);
          piece.off.textContent = piece.text.slice(n);
          if (n < piece.text.length) {
            frames.add(requestAnimationFrame(step));
          } else {
            piece.wrap.classList.remove("typing");
            piece.wrap.classList.add("typed");
            timers.add(window.setTimeout(next, PAUSE_MS));
          }
        };
        frames.add(requestAnimationFrame(step));
      };
      next();
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          observer.unobserve(e.target);
          const pieces = pending.get(e.target);
          if (pieces) timers.add(window.setTimeout(() => type(pieces), 350));
        }),
      { threshold: 0.45 },
    );
    const pending = new Map<Element, Step[]>();
    cards.forEach((card) => {
      pending.set(card, prepare(card));
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
      timers.forEach((t) => clearTimeout(t));
      allPieces.forEach((p) => p.wrap.replaceWith(p.original));
      allCounters.forEach((c) => {
        c.el.style.visibility = "";
        c.el.textContent = c.text;
      });
    };
  }, [rootRef]);
}
