import { describe, expect, it } from "vitest";

import { nextTheme, resolveTheme } from "@/lib/theme";

describe("theme toggle rules", () => {
  it("follows the system setting when the visitor has not chosen", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("remembers the visitor's choice over the system setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("switches between light and dark", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});
