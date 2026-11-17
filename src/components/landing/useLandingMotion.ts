import { useEffect, type RefObject } from "react";

/**
 * Ports the original page script: reveal-on-scroll, grid spotlight, scroll progress bar,
 * hero parallax, the quote total count-up, and the scroll/pointer depth choreography.
 * Everything writes CSS custom properties or the `on` class; styles live in landing.css.
 */
export function useLandingMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement,
      type: K,
      fn: (e: WindowEventMap[K]) => void,
    ) => {
      target.addEventListener(type, fn as EventListener, { passive: true });
      cleanups.push(() => target.removeEventListener(type, fn as EventListener));
    };

    const rm = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const grid = root.querySelector<HTMLElement>("[data-grid]");
    const progress = root.querySelector<HTMLElement>("[data-progress]");
    const hero = root.querySelector<HTMLElement>(".hero");

    // Reveal sections as they enter the viewport.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    root.querySelectorAll(".rev").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // Grid spotlight follows the pointer.
    if (!rm && grid) {
      on(window, "pointermove", (e) => {
        const r = grid.getBoundingClientRect();
        grid.style.setProperty("--mx", e.clientX - r.left + "px");
        grid.style.setProperty("--my", e.clientY - r.top + "px");
      });
    }

    // Scroll progress bar and hero parallax.
    on(window, "scroll", () => {
      const h = document.documentElement;
      if (progress) {
        progress.style.width = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100 + "%";
      }
      if (!rm && hero) hero.style.setProperty("--py", window.scrollY * 0.05 + "px");
    });

    // Count-up for numbers marked with data-n.
    root.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => {
      const n = Number(el.dataset["n"]);
      const section = el.closest(".rev");
      if (!section) return;
      let timer = 0;
      let frame = 0;
      const obs = new IntersectionObserver(
        (es, o) => {
          if (!es[0]?.isIntersecting) return;
          o.disconnect();
          if (rm) return;
          const start = () => {
            const t0 = performance.now();
            const step = (t: number) => {
              const k = Math.min(1, (t - t0) / 1200);
              el.textContent = "$" + Math.round(n * (1 - Math.pow(1 - k, 3)));
              if (k < 1) frame = requestAnimationFrame(step);
            };
            frame = requestAnimationFrame(step);
          };
          timer = window.setTimeout(start, 500);
        },
        { threshold: 0.4 },
      );
      obs.observe(section);
      cleanups.push(() => {
        obs.disconnect();
        clearTimeout(timer);
        cancelAnimationFrame(frame);
      });
    });

    if (rm) return () => cleanups.forEach((c) => c());

    // Scroll-scrubbed depth for the hero and feature panels.
    const depthTargets = [...root.querySelectorAll<HTMLElement>(".hero,.pi")];
    const storyTargets = [
      ...root.querySelectorAll<HTMLElement>(
        ".fp.rev,.lead.rev,.logos.rev,.big.rev,.faq.rev,.band.rev",
      ),
    ];
    let depthFrame = 0;
    const clamp = (min: number, max: number, v: number) => Math.max(min, Math.min(max, v));
    const updateDepth = () => {
      depthFrame = 0;
      const vh = window.innerHeight;
      depthTargets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        // Feature pictures move less than the hero so they stay inside their cards.
        const depthRange = el.classList.contains("pi") ? 6 : 30;
        el.style.setProperty("--scroll-depth", clamp(-depthRange, depthRange, -p * 46) + "px");
        el.style.setProperty("--scroll-tilt", clamp(-8, 8, p * 10) + "deg");
        if (el.classList.contains("pi")) {
          el.style.setProperty("--panel-depth", 8 - Math.min(8, Math.abs(p) * 8) + "px");
          el.style.setProperty("--panel-scale", (1 + Math.max(0, 1 - Math.abs(p)) * 0.015).toFixed(3));
          el.style.setProperty("--card-y", clamp(-38, 38, p * 58) + "px");
          el.style.setProperty("--card-rotate", clamp(-8, 8, p * 11) + "deg");
          el.style.setProperty("--card-rx", clamp(-5, 5, -p * 7) + "deg");
        } else {
          const y = clamp(-24, 24, p * 36);
          el.style.setProperty("--hero-y", y + "px");
          el.style.setProperty("--chat-y", -y + "px");
        }
      });
      storyTargets.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const prog = clamp(0, 1, (vh - r.top) / (vh + r.height));
        const distance = (0.5 - prog) * 48;
        const direction = i % 2 ? 1 : -1;
        const drift = (0.5 - prog) * 50 * direction;
        el.style.setProperty("--scroll-y", distance + "px");
        el.style.setProperty("--scroll-x", drift + "px");
        el.style.setProperty("--scroll-rotate", (0.5 - prog) * 15 * direction + "deg");
        el.style.setProperty("--scene-scale", (0.965 + Math.sin(prog * Math.PI) * 0.035).toFixed(3));
        el.style.setProperty("--copy-x", -drift * 0.4 + "px");
        el.style.setProperty("--copy-y", -distance * 0.45 + "px");
        const panel = el.querySelector<HTMLElement>(".pi .mk");
        if (panel) panel.style.setProperty("--glint-x", (prog - 0.5) * 100 + "px");
      });
    };
    const requestDepth = () => {
      if (!depthFrame) depthFrame = requestAnimationFrame(updateDepth);
    };
    on(window, "scroll", requestDepth);
    on(window, "resize", requestDepth);
    requestDepth();
    cleanups.push(() => cancelAnimationFrame(depthFrame));

    // Pointer tilt on devices with a precise pointer.
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      depthTargets.forEach((el) => {
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--pointer-rx", (-y * 7).toFixed(2) + "deg");
          el.style.setProperty("--pointer-ry", (x * 7).toFixed(2) + "deg");
        });
        on(el, "pointerleave", () => {
          el.style.setProperty("--pointer-rx", "0deg");
          el.style.setProperty("--pointer-ry", "0deg");
        });
      });
    }

    return () => cleanups.forEach((c) => c());
  }, [rootRef]);
}
