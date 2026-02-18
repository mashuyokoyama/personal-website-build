"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type Theme = "jp" | "en";

interface ThemeContextType {
  theme: Theme;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "jp",
  isTransitioning: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  // pathname から直接算出。EN FV 真っ黒（theme 遅延で白背景＋黒文字になる）を防ぐ
  const theme: Theme = pathname.startsWith("/en") ? "en" : "jp";

  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 1500);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ theme, isTransitioning }}>
      <div
        data-theme={theme}
        className="min-h-screen overflow-y-visible"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: theme === "jp" ? "#ffffff" : "#000000",
          color: theme === "jp" ? "#000000" : "#ffffff",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
