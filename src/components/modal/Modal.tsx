import { useEffect, useRef, useMemo, useContext } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../button/button"; // Your Button component
import { Icon } from "../icon/icon";       // Your Icon component
import clsx from "clsx";
import { HologramEffect } from "../container/hologram-container";
import { HologramContext } from "../container/hologram-context";

export interface ModalAction {
    label: string;
    onClick: () => void;
    style?: "primary" | "secondary" | "destructive" | "info" | "warn";
    iconName?: string;
    iconPosition?: "left" | "right" | "off";
    autoFocus?: boolean;
    disabled?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    actions?: ModalAction[];
    icon?: string;
    status?: "error" | "info" | "success" | "warning";
    className?: string;
    modalRootId?: string;
}

const styleMap: Record<string, string> = {
    background_default: "var(--background-default)",
    background_elevated: "var(--background-elevated)",
    border_default: "var(--border-default)",
    content_primary: "var(--content-primary)",
    content_secondary: "var(--content-secondary)",
    interactive_accentfocus: "var(--interactive-accentfocus)",
    status_error: "var(--status-error)",
    status_info: "var(--status-info)",
    status_success: "var(--status-success)",
    status_warning: "var(--status-warning)",
    surface_default: "var(--surface-default)",
    text_light: "var(--text-light)",
    text_background_default: "var(--text-background-default)",
};

const statusIconNameMap: Record<string, string> = {
    error: "error-state",
    info: "info-state",
    success: "success-state",
    warning: "warning-state",
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    actions = [],
    icon,
    status,
    className = "",
    modalRootId = "modal-root",
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);
    const titleId = useMemo(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`, []);
    const isHologram = useContext(HologramContext);

    useEffect(() => {
        let element = document.getElementById(modalRootId);
        if (!element) {
            element = document.createElement("div");
            element.setAttribute("id", modalRootId);
            document.body.appendChild(element);
        }
    }, [modalRootId]);

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

    const modalActualIconName = status ? statusIconNameMap[status] : icon;

    const modalInner = (
        <>
            {/* Header Section */}
            <div className={clsx(
                "w-full flex items-center",
                modalActualIconName ? "gap-[14px]" : "gap-[4px]"
            )}>
                {modalActualIconName && (
                    <Icon name={modalActualIconName} size={21} className="flex-shrink-0" />
                )}
                {title && (
                    <h2
                        className={clsx(
                            "flex-1 font-orbitron font-[900] text-[20px] leading-[28px] break-words mt-0",
                            'text-[' + styleMap.content_primary + ']'
                        )}
                        id={titleId}
                    >
                        {title}
                    </h2>
                )}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className={clsx(
                        "w-[26px] h-[26px] p-0 flex items-center justify-center rounded-full transition-colors ml-[4px] mt-[1px]",
                        'text-[' + styleMap.content_primary + '] hover:bg-[' + styleMap.border_default + '] hover:text-[' + styleMap.text_light + ']'
                    )}
                    style={{ minWidth: 26, minHeight: 26 }}
                >
                    <Icon name="x-mark" size={26} />
                </button>
            </div>
            {/* Body Section */}
            <div
                className={clsx(
                    "w-full font-orbitron font-[700] text-[16px] leading-[24px] break-words",
                    'text-[' + styleMap.content_primary + ']'
                )}
            >
                {children}
            </div>
            {/* Footer Section */}
            {actions && actions.length > 0 && (
                <div className="w-full h-[52px] flex justify-end items-end gap-[8px]">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            onClick={action.onClick}
                            variant={action.style === "primary" ? "primary" :
                                action.style === "secondary" ? "secondary" :
                                    action.style === "destructive" ? "destructive" :
                                        action.style === "info" ? "info" :
                                            action.style === "warn" ? "warn" : "default"}
                            icon={action.iconPosition || (action.iconName ? "left" : "off")}
                            iconName={action.iconName}
                            autoFocus={action.autoFocus}
                            disabled={action.disabled}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </>
    );
    const modalBox = (
        <div
            ref={modalRef}
            className={clsx(
                "relative flex flex-col w-full",
                "max-w-[540px]",
                "bg-[" + styleMap.surface_default + "]",
                "rounded-[15px]",
                "outline outline-2 outline-offset-[-2px] outline-[" + styleMap.border_default + "]",
                "shadow-[0px_6px_12px_rgba(0,0,0,0.10)]",
                "p-[24px]",
                "gap-[8px]",
                className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
        >
            {modalInner}
        </div>
    );
    const modalContent = (
        <div
            className={clsx(
                "fixed inset-0 z-50 flex items-center justify-center p-4",
                "transition-opacity duration-300 ease-out",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.60)" }}
            onClick={onClose}
            role="presentation"
        >
            {isHologram ? <HologramEffect>{modalBox}</HologramEffect> : modalBox}
        </div>
    );

    if (typeof document === "undefined") return null;
    const modalRoot = document.getElementById(modalRootId);
    if (!isOpen || !modalRoot) return null;
    return createPortal(modalContent, modalRoot);
}
