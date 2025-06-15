import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-provider-context.tsx";
import type { Theme, ThemeProviderProps } from "./theme-types";
import { getThemeProviderValue } from "./theme-provider-value.tsx";

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
    );

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove existing theme classes and data attributes
        root.classList.remove("light", "dark");
        root.removeAttribute("data-theme");

        // Set data-theme attribute for light theme, remove for dark (uses :root)
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
        }
    }, [theme]);

    const value = getThemeProviderValue(theme, setTheme, storageKey);

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
} 