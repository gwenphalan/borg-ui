import React, { useState, useRef } from "react";
import { Overlay } from "../overlay/Overlay";

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

    return (
        <>
            {React.cloneElement(children, {
                ref: triggerRef,
                onMouseEnter: handleOpen,
                onMouseLeave: handleClose,
                onFocus: handleOpen,
                onBlur: handleClose,
            })}
            <Overlay
                reference={triggerRef.current}
                open={isOpen}
                onOpenChange={setIsOpen}
                placement={placement}
                className={[
                    "z-50 px-3 py-2 rounded-sm shadow-lg text-xs font-medium transition-opacity duration-150 border",
                    className,
                ].join(" ")}
                style={{
                    background: "var(--background-elevated)",
                    color: "var(--content-primary)",
                    borderColor: "var(--border-default)",
                    pointerEvents: "none",
                    whiteSpace: "pre-line",
                }}
            >
                {content}
            </Overlay>
        </>
    );
}

export default Tooltip; 