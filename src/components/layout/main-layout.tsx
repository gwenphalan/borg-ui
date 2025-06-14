import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ThemeProvider } from '../../context/ThemeContext';
import type { MenuItem } from '../../types/menu';

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    logo?: string;
    menuItems?: MenuItem[];
}

export function MainLayout({
    children,
    title,
    logo,
    menuItems
}: MainLayoutProps) {
    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <Header title={title} logo={logo} menuItems={menuItems} />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
} 