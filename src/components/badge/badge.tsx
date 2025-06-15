import React from "react";

export interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "info" | "success" | "warning" | "error";
    pill?: boolean;
    icon?: React.ReactNode;
    className?: string;
    removable?: boolean;
    onRemove?: () => void;
}


const variantMap: Record<string, string> = {
    default: `bg-background-elevated text-content-primary border border-default`,
    info: `bg-status-info text-light`,
    success: `text-content-primary bg-background-default`,
    warning: `text-status-warning bg-background-default`,
    error: `bg-status-error text-light`,
};

export function Badge({
    children,
    variant = "default",
    pill = false,
    icon,
    className = "",
    removable = false,
    onRemove,
}: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
                pill ? "rounded-full" : "rounded-md",
                variantMap[variant],
                className,
            ].join(" ")}
            style={{
                background: variant === "default" ? "var(--background-elevated)" : undefined,
                color: variant === "default" ? "var(--content-primary)" : undefined,
            }}
        >
            {removable && (
                <button
                    type="button"
                    aria-label="Remove badge"
                    onClick={onRemove}
                    className="mr-1 flex items-center justify-center w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--interactive-accentfocus)] cursor-pointer"
                    tabIndex={0}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
            {icon && <span className="mr-1 flex items-center">{icon}</span>}
            {children}
        </span>
    );
} 