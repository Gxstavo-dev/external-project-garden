export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "mewflow-theme";

/** A saved choice wins; otherwise follow the system setting. */
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return systemPrefersDark ? "dark" : "light";
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

/** Runs in <head> before paint so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})();`;

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
}

/** Distance from (x, y) to the farthest viewport corner: the reveal circle's final radius. */
export function revealRadius(x: number, y: number, width: number, height: number) {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
}

/**
 * Switches theme with a circular reveal growing from the given point (the toggle).
 * Falls back to a short colour fade where View Transitions are unavailable or motion is reduced.
 */
export function switchTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next = nextTheme(root.classList.contains("dark") ? "dark" : "light");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || typeof document.startViewTransition !== "function") {
    if (!reduced) {
      root.classList.add("theme-fading");
      window.setTimeout(() => root.classList.remove("theme-fading"), 500);
    }
    applyTheme(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const r = revealRadius(x, y, window.innerWidth, window.innerHeight);
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
          filter: ["blur(6px)", "blur(0px)"],
        },
        { duration: 750, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}
