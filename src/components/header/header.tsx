import { Menu } from '../menu/menu';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Documentation', href: '/docs' },
    {
        label: 'GitHub',
        href: 'https://github.com/gwenphalan',
        external: true,
    },
];

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-[var(--background-default)]/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/icon.png" alt="Borg UI Icon" className="h-8 w-8" />
                    <h1 className="text-xl font-bold">Borg UI</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <nav className="hidden md:flex">
                        <Menu items={navItems} />
                    </nav>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}; 