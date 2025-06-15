import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { useTheme } from '../../hooks/use-theme';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 hover:bg-background-elevated transition-colors"
        >
            {theme === 'dark' ? (
                <Icon
                    name="sun"
                    size={20}
                    color="var(--content-primary)"
                    className="transition-colors"
                />
            ) : (
                <Icon
                    name="moon"
                    size={20}
                    color="var(--content-primary)"
                    className="transition-colors"
                />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}; 