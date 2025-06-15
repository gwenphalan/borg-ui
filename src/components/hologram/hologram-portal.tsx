import type { ReactNode } from "react";

interface HologramPortalProps {
    children: ReactNode;
    isOpen: boolean;
}

export function HologramPortal({ children, isOpen }: HologramPortalProps) {
    if (!isOpen) return null;

    return <>{children}</>;
} 