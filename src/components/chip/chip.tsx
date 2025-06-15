import React from "react";


const variantMap: Record<string, { bg: string; border: string; text: string }> = {
    default: {
        bg: `bg-[${styleMap.background_elevated}]`,
        border: `border border-[${styleMap.border_default}]`,
        text: `text-[${styleMap.content_primary}]`,
    },
    primary: {
        bg: `bg-[${styleMap.content_primary}]`,
        border: `border border-[${styleMap.content_primary}]`,
        text: `text-[${styleMap.text_dark}]`,
    },
    secondary: {
        bg: `bg-[${styleMap.surface_default}]`,
        border: `border border-[${styleMap.border_default}]`,
        text: `text-[${styleMap.content_secondary}]`,
    },
    info: {
        bg: `bg-[${styleMap.status_info}]`,
        border: `border border-[${styleMap.status_info}]`,
        text: `text-[${styleMap.text_light}]`,
    },
    warning: {
        bg: `bg-[${styleMap.status_warning}]`,
        border: `border border-[${styleMap.status_warning}]`,
        text: `text-[${styleMap.background_default}]`,
    },
    error: {
        bg: `bg-[${styleMap.status_error}]`,
        border: `border border-[${styleMap.status_error}]`,
        text: `text-[${styleMap.text_light}]`,
    },
};

const sizeMap: Record<string, string> = {
    sm: "text-xs px-2 py-0.5 h-6 min-h-[24px]",
    md: "text-sm px-3 py-1 h-8 min-h-[32px]",
    lg: "text-base px-4 py-2 h-10 min-h-[40px]",
};

export interface ChipProps {
    label: string;
    icon?: React.ReactNode;
    variant?: keyof typeof variantMap;
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
    const variantStyles = (variant in variantMap ? variantMap[variant] : variantMap.default) as { bg: string; border: string; text: string };
    const sizeStyles = sizeMap[size] || sizeMap.md;
    const isInteractive = clickable && !disabled && typeof onClick === "function";
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-orbitron font-semibold uppercase tracking-[1px] select-none transition-all duration-150 outline-none ${variantStyles.bg
                } ${variantStyles.border} ${variantStyles.text} ${sizeStyles} ${isInteractive ? "cursor-pointer hover:shadow-md hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[var(--interactive-accentfocus)]" : ""
                } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
            style={style}
            tabIndex={isInteractive ? 0 : undefined}
            role={isInteractive ? "button" : undefined}
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
                    className="ml-1 flex items-center justify-center w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--interactive-accentfocus)] cursor-pointer"
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