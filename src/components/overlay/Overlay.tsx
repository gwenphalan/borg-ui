import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
    Placement,
    Middleware,
} from "@floating-ui/react";
import React from "react";

export interface OverlayProps {
    reference: HTMLElement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    placement?: Placement;
    offsetPx?: number;
    matchWidth?: boolean;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

export function Overlay({
    reference,
    open,
    onOpenChange,
    placement = "bottom-start",
    offsetPx = 8,
    matchWidth = false,
    className = "",
    style,
    children,
}: OverlayProps) {
    const { x, y, strategy, refs } = useFloating({
        strategy: "fixed",
        placement,
        open,
        onOpenChange,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(offsetPx),
            flip(),
            shift({ padding: 8 }),
            matchWidth
                ? size({
                    apply({ rects, elements }) {
                        Object.assign(elements.floating.style, {
                            width: `${rects.reference.width}px`,
                        });
                    },
                })
                : undefined,
        ].filter(Boolean) as Middleware[],
    });

    useEffect(() => {
        if (reference) {
            refs.setReference(reference);
        }
    }, [reference, refs]);

    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            const target = e.target as Node;
            if (
                reference &&
                !reference.contains(target) &&
                refs.floating.current &&
                !refs.floating.current.contains(target)
            ) {
                onOpenChange(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, reference, refs.floating, onOpenChange]);

    if (!open) return null;

    return (
        <div
            ref={refs.setFloating}
            className={className}
            style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 99999,
                ...style,
            }}
        >
            {children}
        </div>
    );
} 