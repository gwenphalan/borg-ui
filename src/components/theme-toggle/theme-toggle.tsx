import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { useTheme } from '../../hooks/use-theme';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2"
        >
            {theme === 'dark' ? (
                <Icon name="sun" className="h-5 w-5" />
            ) : (
                <Icon name="moon" className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}; 