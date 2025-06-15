import { useContext } from "react";
import type { ReactNode } from "react";
import { HologramContext } from "../container/hologram-context";
import { HologramEffect } from "../container/hologram-container";
import { Portal } from "../../lib/portal";

interface HologramPortalProps {
    children: ReactNode;
    isHologramDescendant?: boolean;
}

export function HologramPortal({
    children,
    isHologramDescendant,
}: HologramPortalProps) {
    const isHologram = useContext(HologramContext);

    const shouldApplyEffect = isHologramDescendant ?? isHologram;

    if (shouldApplyEffect) {
        return (
            <Portal>
                <div style={{ position: 'relative', zIndex: 9999 }}>
                    <HologramEffect>{children}</HologramEffect>
                </div>
            </Portal>
        );
    }

    return <Portal>{children}</Portal>;
} 