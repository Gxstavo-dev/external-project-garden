import { Moon, Sun } from "lucide-react";

import { switchTheme } from "@/lib/theme";

/** Icons swap through CSS (.dark on <html>), so server and client render the same markup. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        switchTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <Sun className="sun" aria-hidden="true" />
      <Moon className="moon" aria-hidden="true" />
    </button>
  );
}
