import { useContext } from "react";
import type { ReactNode } from "react";
import { HologramContext } from "../container/hologram-context";
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

    return (
        <Portal>
            {children}
        </Portal>
    );
} 