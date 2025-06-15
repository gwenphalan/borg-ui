import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Overlay } from "../overlay/Overlay";
import { HologramEffect } from "../container/hologram-container";

export interface TooltipProps {
    children: React.ReactElement;
    content: React.ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
    disabled?: boolean;
}


export function Tooltip({
    children,
    content,
    placement = "top",
    delay = 200,
    className = "",
    disabled = false,
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const handleOpen = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (!disabled && !isOpen) {
            timeoutRef.current = window.setTimeout(() => setIsOpen(true), delay);
        }
    };

    const handleClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(false);
    };

    const clonedChildren = React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
        onFocus: handleOpen,
        onBlur: handleClose,
    });

    const tooltipContent = (
        <HologramEffect>
            <div
                className={cn(
                    "z-50 px-3 py-2 rounded-sm shadow-lg text-sm font-medium transition-opacity duration-150 border max-w-48 text-center",
                    className
                )}
                style={{
                    background: "var(--background-elevated)",
                    color: "var(--content-primary)",
                    borderColor: "var(--border-default)",
                    pointerEvents: "none",
                    whiteSpace: "pre-line",
                }}
            >
                {content}
            </div>
        </HologramEffect>
    );

    return (
        <>
            {clonedChildren}
            <Overlay
                reference={triggerRef.current}
                open={isOpen}
                onOpenChange={setIsOpen}
                placement={placement}
            >
                {tooltipContent}
            </Overlay>
        </>
    );
}

export default Tooltip; 