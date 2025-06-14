import { ReactNode } from 'react';

interface HologramContainerProps {
    children: ReactNode;
}

export function HologramContainer({ children }: HologramContainerProps) {
    return (
        <div className="relative z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--interactive-accentfocus)]/5 to-transparent pointer-events-none" />
            <div className="relative backdrop-blur-md [&>*]:relative [&>*]:z-[1] [&>*]:before:content-[''] [&>*]:before:absolute [&>*]:before:inset-[-1px] [&>*]:before:bg-gradient-to-br [&>*]:before:from-[var(--interactive-accentfocus)] [&>*]:before:via-transparent [&>*]:before:to-[var(--interactive-accentfocus)] [&>*]:before:opacity-10 [&>*]:before:z-[-1] [&>*]:before:rounded-inherit [&>*]:before:pointer-events-none [&>*]:hover:before:opacity-20 [&>*]:before:transition-opacity [&>*]:before:duration-300 [&>*]:before:ease-in-out">
                {children}
            </div>
        </div>
    );
} 