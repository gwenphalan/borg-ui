import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../icon';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--background-elevated)] transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Icon name="sun" size={20} color="var(--content-primary)" />
            ) : (
                <Icon name="moon" size={20} color="var(--content-primary)" />
            )}
        </button>
    );
} 