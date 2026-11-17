import { Moon, Sun } from "lucide-react";

import { applyTheme, nextTheme } from "@/lib/theme";

/** Icons swap through CSS (.dark on <html>), so server and client render the same markup. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      onClick={() => {
        const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        applyTheme(nextTheme(current));
      }}
    >
      <Sun className="sun" aria-hidden="true" />
      <Moon className="moon" aria-hidden="true" />
    </button>
  );
}
