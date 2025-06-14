import { Menu } from '../menu/menu';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import type { MenuItem } from '../../types/menu';

interface HeaderProps {
    title?: string;
    logo?: string;
    menuItems?: MenuItem[];
}

export function Header({
    title = "Borg UI",
    logo,
    menuItems = [
        { label: "Home", href: "/" },
        { label: "Features", href: "/features" },
        { label: "Documentation", href: "/docs" },
        { label: "GitHub", href: "https://github.com/gwenphalan", external: true }
    ]
}: HeaderProps) {
    return (
        <header className="w-full bg-[var(--background-elevated)] border-b border-[var(--border-default)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        {logo && (
                            <img
                                src={logo}
                                alt={`${title} logo`}
                                className="h-8 w-8 mr-3"
                            />
                        )}
                        <span className="text-xl font-bold text-[var(--content-primary)]">
                            {title}
                        </span>
                    </div>

                    <nav className="flex items-center space-x-4">
                        <Menu items={menuItems} />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
} 