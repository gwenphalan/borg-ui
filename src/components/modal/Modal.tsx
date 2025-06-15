import { useEffect, useRef, useContext } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
// import { Button } from "../button/button"; // Your Button component
import { Icon } from "../icon/icon";       // Your Icon component
// import clsx from "clsx";
import { HologramEffect } from "../container/hologram-container";
import { HologramContext } from "../container/hologram-context";
import { twMerge } from "tailwind-merge";

export interface ModalAction {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "destructive";
    disabled?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    actions?: ModalAction[];
    status?: "info" | "warning" | "error" | "success";
    icon?: string;
    className?: string;
    style?: React.CSSProperties;
}

// const statusIconNameMap: Record<string, string> = {
//     error: "error-state",
//     info: "info-state",
//     success: "success-state",
//     warning: "warning-state",
// };

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    // actions = [],
    // status,
    // icon,
    className = "",
    style = {},
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);
    // const titleId = useMemo(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`, []);
    const isHologram = useContext(HologramContext);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        previouslyFocusedElement.current = document.activeElement as HTMLElement;
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") onClose();
            if (event.key === "Tab" && modalRef.current) {
                const focusableElements = Array.from(
                    modalRef.current.querySelectorAll<HTMLElement>(
                        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    )
                ).filter(el => el.offsetParent !== null);
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement?.focus(); event.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement?.focus(); event.preventDefault();
                        }
                    }
                }
            }
        };
        const focusTimeout = setTimeout(() => {
            const focusableQuery = modalRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            const focusableArray = Array.from(focusableQuery || []);
            const elementToFocus = focusableArray.find(el => el.hasAttribute('autofocus')) || focusableArray[0] || modalRef.current;
            if (elementToFocus) (elementToFocus as HTMLElement).focus();
        }, 50);
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            clearTimeout(focusTimeout);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [isOpen, onClose]);

    // Determine the actual icon name to display
    // const modalActualIconName = status ? statusIconNameMap[status] : icon;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleBackdropClick}
        >
            {isHologram ? (
                <HologramEffect>
                    <div
                        ref={modalRef}
                        className={twMerge(
                            "relative w-full max-w-lg rounded-lg shadow-lg bg-background-elevated border border-default",
                            className
                        )}
                        style={style}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-default p-4">
                            <h2 className="text-lg font-bold text-content-primary">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-content-primary cursor-pointer hover:text-interactive-accentfocus transition-colors"
                            >
                                <Icon name="close" size={24} />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-4">{children}</div>
                    </div>
                </HologramEffect>
            ) : (
                <div
                    ref={modalRef}
                    className={twMerge(
                        "relative w-full max-w-lg rounded-lg shadow-lg bg-background-elevated border border-default",
                        className
                    )}
                    style={style}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-default p-4">
                        <h2 className="text-lg font-bold text-content-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-content-primary cursor-pointer hover:text-interactive-accentfocus transition-colors"
                        >
                            <Icon name="close" size={24} />
                        </button>
                    </div>
                    {/* Body */}
                    <div className="p-4">{children}</div>
                </div>
            )}
        </div>
    );

    // Use createPortal to render modal at the document body level
    return createPortal(modalContent, document.body);
}
