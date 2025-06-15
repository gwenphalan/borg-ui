import type { Theme } from "./theme-types";

export function getThemeProviderValue(theme: Theme, setTheme: (theme: Theme) => void, storageKey: string) {
    return {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        toggleTheme: () => {
            const newTheme = theme === "light" ? "dark" : "light";
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };
} 