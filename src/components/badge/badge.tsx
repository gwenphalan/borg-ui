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

const styleMap: Record<string, string> = {
    background_default: "var(--background-default)",
    background_elevated: "var(--background-elevated)",
    border_default: "var(--border-default)",
    content_primary: "var(--content-primary)",
    content_secondary: "var(--content-secondary)",
    interactive_accentfocus: "var(--interactive-accentfocus)",
    status_error: "var(--status-error)",
    status_info: "var(--status-info)",
    status_warning: "var(--status-warning)",
    surface_default: "var(--surface-default)",
    text_light: "var(--text-light)",
    text_background_default: "var(--text-background-default)",
};

const variantMap: Record<string, string> = {
    default: `bg-[var(--background-elevated)] text-[var(--content-primary)] border border-[var(--border-default)]`,
    info: `bg-[var(--status-info)] text-[var(--text-light)]`,
    success: `bg-[var(--content-primary)] text-[var(--background-default)]`,
    warning: `bg-[var(--status-warning)] text-[var(--background-default)]`,
    error: `bg-[var(--status-error)] text-[var(--text-light)]`,
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
                background: variant === "default" ? styleMap.background_elevated : undefined,
                color: variant === "default" ? styleMap.content_primary : undefined,
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