import React from "react";

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
    text_dark: "var(--background-default)"
};

const variantMap: Record<string, { bg: string; border: string; shadow: string }> = {
    default: {
        bg: `bg-[${styleMap.surface_default}]`,
        border: `border-2 border-[${styleMap.border_default}]`,
        shadow: "shadow-lg",
    },
    primary: {
        bg: `bg-[${styleMap.background_elevated}]`,
        border: `border-2 border-[${styleMap.content_primary}]`,
        shadow: "shadow-xl",
    },
    outlined: {
        bg: "bg-transparent",
        border: `border-2 border-[${styleMap.border_default}]`,
        shadow: "shadow-none",
    },
    secondary: {
        bg: `bg-[${styleMap.background_default}]`,
        border: `border border-[${styleMap.border_default}]`,
        shadow: "shadow-md",
    },
};

export interface CardProps {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    image?: string; // image URL
    imageAlt?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    clickable?: boolean;
    variant?: keyof typeof variantMap;
    disabled?: boolean;
    padding?: string; // Tailwind padding classes, e.g. 'p-6'
    margin?: string; // Tailwind margin classes, e.g. 'mb-4'
}

export function Card({
    title,
    subtitle,
    actions,
    image,
    imageAlt = "Card image",
    children,
    className = "",
    style = {},
    onClick,
    clickable = false,
    variant = "default",
    disabled = false,
    padding = "p-6",
    margin = "",
}: CardProps) {
    const variantStyles = (variant in variantMap ? variantMap[variant] : variantMap.default) as { bg: string; border: string; shadow: string };
    const isInteractive = clickable && !disabled && typeof onClick === "function";
    return (
        <section
            className={`relative flex flex-col gap-3 rounded-lg transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[${styleMap.interactive_accentfocus}] ${variantStyles.bg} ${variantStyles.border} ${variantStyles.shadow} ${padding} ${margin} ${className} ${isInteractive ? `cursor-pointer hover:shadow-2xl hover:scale-[1.01]` : ""
                } ${disabled ? "opacity-60 grayscale pointer-events-none" : ""}`}
            style={style}
            tabIndex={isInteractive ? 0 : undefined}
            aria-label={title || undefined}
            role={isInteractive ? "button" : undefined}
            onClick={isInteractive ? onClick : undefined}
            onKeyDown={isInteractive ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
            aria-disabled={disabled || undefined}
        >
            {image && (
                <div className="w-full aspect-[16/9] rounded-md overflow-hidden mb-2 bg-[${styleMap.background_elevated}] flex items-center justify-center">
                    <img
                        src={image}
                        alt={imageAlt}
                        loading="lazy"
                        className="object-cover w-full h-full"
                        style={{ background: styleMap.background_elevated }}
                    />
                </div>
            )}
            {(title || actions) && (
                <header className="flex items-start justify-between mb-1">
                    {title && (
                        <h3 className={`text-[20px] font-black font-[Orbitron] text-[${styleMap.content_primary}] leading-tight`}>{title}</h3>
                    )}
                    {actions && <div className="flex-shrink-0 ml-2">{actions}</div>}
                </header>
            )}
            {subtitle && (
                <div className={`text-[14px] font-semibold font-[Orbitron] text-[${styleMap.content_secondary}] mb-1`}>{subtitle}</div>
            )}
            <div className={`flex-1 text-[16px] font-[Orbitron] text-[${styleMap.content_primary}]`}>{children}</div>
            {disabled && (
                <div className="absolute inset-0 bg-[${styleMap.surface_default}] opacity-40 rounded-lg pointer-events-none" aria-hidden="true" />
            )}
        </section>
    );
} 