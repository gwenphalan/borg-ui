import { ReactNode } from 'react';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div>
            <Header />
            <main className="container flex-1 py-8">{children}</main>
            <Footer />
        </div>
    );
}; 