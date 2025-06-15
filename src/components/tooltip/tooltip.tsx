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

const styleMap: Record<string, string> = {
    background_elevated: "var(--background-elevated)",
    content_primary: "var(--content-primary)",
    border_default: "var(--border-default)",
};

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
                    "z-50 px-3 py-2 rounded shadow-lg text-xs font-medium transition-opacity duration-150 border",
                    className,
                ].join(" ")}
                style={{
                    background: styleMap.background_elevated,
                    color: styleMap.content_primary,
                    borderColor: styleMap.border_default,
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