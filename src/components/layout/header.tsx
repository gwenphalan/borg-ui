import { ThemeToggle } from '../theme-toggle/theme-toggle';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <span className="font-bold">Borg UI</span>
                    </a>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <a
                            className="transition-colors hover:text-foreground/80"
                            href="/features"
                        >
                            Features
                        </a>
                        <a
                            className="transition-colors hover:text-foreground/80"
                            href="/docs"
                        >
                            Documentation
                        </a>
                        <a
                            className="transition-colors hover:text-foreground/80"
                            href="https://github.com/gwenphalan"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}; 