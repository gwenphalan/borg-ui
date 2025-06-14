export function Footer() {
    return (
        <footer className="w-full bg-[var(--background-elevated)] border-t border-[var(--border-default)] py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm text-[var(--content-secondary)]">
                    © 2025 Powered by{' '}
                    <a
                        href="https://github.com/gwenphalan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--content-primary)] hover:underline"
                    >
                        Gwen
                    </a>{' '}
                    | Built with 💚
                </div>
            </div>
        </footer>
    );
} 