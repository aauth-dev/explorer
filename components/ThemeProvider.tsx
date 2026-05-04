"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = { children: React.ReactNode };

/**
 * `theme` / `light` | `dark` in localStorage (default dark, no system theme) — matches aauth.dev site.
 */
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="theme"
      themes={["dark", "light"]}
    >
      {children}
    </NextThemesProvider>
  );
}
