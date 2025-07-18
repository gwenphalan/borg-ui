export function Footer() {
    return (
        <footer className="w-full">
            <div className="mx-auto px-6 py-3">
                <div className="text-center text-sm text-(--content-secondary)">
                    © 2025 Powered by{' '}
                    <a
                        href="https://github.com/gwenphalan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--content-primary) hover:underline hover:text-(--interactive-accentfocus) transition-colors"
                    >
                        Gwen
                    </a>{' '}
                    | Built with 💚
                </div>
            </div>
        </footer>
    );
} 