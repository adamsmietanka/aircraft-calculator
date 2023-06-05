import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: string;
  setTheme: (value: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (value) => set((state) => ({ theme: value })),
    }),
    { name: "theme" }
  )
);
