import { Button } from '../button/button';
import { useTheme } from '../../hooks';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            iconName={theme === 'dark' ? 'sun' : 'moon'}
            iconSize={24}
        />
    );
}; 