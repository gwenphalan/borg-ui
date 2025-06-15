import React from "react";

const variantStyles: Record<string, string> = {
    default: "bg-background-elevated border border-border-default text-content-primary",
    primary: "bg-content-primary border border-content-primary text-dark",
    secondary: "bg-surface-default border border-border-default text-content-secondary",
    info: "bg-status-info border border-status-info text-light",
    warning: "bg-status-warning border border-status-warning text-background-default",
    error: "bg-status-error border border-status-error text-light",
};

const sizeMap: Record<string, string> = {
    sm: "text-xs px-2 py-0.5 h-6 min-h-[24px]",
    md: "text-sm px-3 py-1 h-8 min-h-[32px]",
    lg: "text-base px-4 py-2 h-10 min-h-[40px]",
};

export interface ChipProps {
    label: string;
    icon?: React.ReactNode;
    variant?: keyof typeof variantStyles;
    size?: keyof typeof sizeMap;
    closable?: boolean;
    onClose?: () => void;
    onClick?: () => void;
    clickable?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
}

export function Chip({
    label,
    icon,
    variant = "default",
    size = "md",
    closable = false,
    onClose,
    onClick,
    clickable = false,
    disabled = false,
    className = "",
    style = {},
    leading,
    trailing,
}: ChipProps) {
    const isInteractive = clickable && !disabled;

    const finalClassName = `
        inline-flex items-center gap-1 rounded-full font-orbitron font-semibold uppercase tracking-[1px] 
        select-none transition-all duration-150 outline-none
        ${variantStyles[variant] || variantStyles.default}
        ${sizeMap[size] || sizeMap.md}
        ${isInteractive ? "cursor-pointer hover:shadow-md hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-interactive-accentfocus" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
    `;

    return (
        <span
            className={finalClassName}
            style={style}
            tabIndex={isInteractive ? 0 : -1}
            role={isInteractive ? "button" : "status"}
            aria-disabled={disabled || undefined}
            onClick={isInteractive ? onClick : undefined}
            onKeyDown={isInteractive ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            {leading && <span className="mr-1 flex items-center">{leading}</span>}
            {icon && <span className="mr-1 flex items-center">{icon}</span>}
            <span className="whitespace-nowrap font-orbitron">{label}</span>
            {trailing && <span className="ml-1 flex items-center">{trailing}</span>}
            {closable && !disabled && (
                <button
                    type="button"
                    aria-label="Remove chip"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                    className="ml-1 flex items-center justify-center w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-interactive-accentfocus cursor-pointer"
                    tabIndex={0}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </span>
    );
} 