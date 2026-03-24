import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("hsc-dark-mode");
      if (stored !== null) return stored === "true";
    } catch {}
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    try {
      localStorage.setItem("hsc-dark-mode", String(isDark));
    } catch {}
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);
  return { isDark, setIsDark, toggle };
}
