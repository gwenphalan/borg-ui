import { ReactNode } from 'react';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <Header />
            <main className="flex flex-1 overflow-hidden">{children}</main>
            <Footer />
        </div>
    );
}; 