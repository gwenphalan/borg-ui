import { Link } from 'react-router-dom';
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
        <header className="w-full">
            <div className="flex items-center justify-between px-2 mx-auto">
                <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                    <img src="/icon.png" alt="Borg UI Icon" className="h-7 w-7" />
                    <h1 className="text-lg font-bold text-(--content-primary)">Borg UI</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <nav className="flex">
                        <Menu items={navItems} />
                    </nav>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}; 