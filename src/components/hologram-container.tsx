import { ReactNode } from 'react';

interface HologramContainerProps {
    children: ReactNode;
}

export function HologramContainer({ children }: HologramContainerProps) {
    return (
        <div className="relative z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--interactive-accentfocus)]/5 to-transparent pointer-events-none" />
            <div className="relative backdrop-blur-md bg-background-default/50">
                {children}
            </div>
        </div>
    );
} 