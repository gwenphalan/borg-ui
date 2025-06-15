import React from "react";

const variantMap: Record<string, string> = {
    default: "card-base",
    primary: "bg-background-elevated border-2 border-content-primary shadow-xl p-6 transition-all flex flex-col gap-3 rounded-lg",
    outlined: "bg-transparent border-2 border-default shadow-none p-6 transition-all flex flex-col gap-3 rounded-lg",
    secondary: "bg-background-default border border-default shadow-md p-6 transition-all flex flex-col gap-3 rounded-lg",
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
    const variantStyles = variantMap[variant] || variantMap.default;
    const isInteractive = clickable && !disabled && typeof onClick === "function";
    
    // Apply custom padding if provided, otherwise use variant default
    const paddingClass = padding !== "p-6" ? padding : "";
    const finalVariantStyles = paddingClass ? variantStyles.replace("p-6", paddingClass) : variantStyles;
    
    return (
        <section
            className={`relative outline-hidden focus-ring ${finalVariantStyles} ${margin} ${className} ${
                isInteractive ? "cursor-pointer hover-shadow hover-scale" : ""
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
                <div className="w-full aspect-video rounded-md overflow-hidden mb-2 bg-background-elevated flex items-center justify-center">
                    <img
                        src={image}
                        alt={imageAlt}
                        loading="lazy"
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            {(title || actions) && (
                <header className="flex items-start justify-between mb-1">
                    {title && (
                        <h3 className="text-xl font-black font-orbitron text-content-primary leading-tight">{title}</h3>
                    )}
                    {actions && <div className="shrink-0 ml-2">{actions}</div>}
                </header>
            )}
            {subtitle && (
                <div className="text-sm font-semibold font-orbitron text-content-secondary mb-1">{subtitle}</div>
            )}
            <div className="flex-1 text-base font-orbitron text-content-primary">{children}</div>
            {disabled && (
                <div className="absolute inset-0 bg-surface-default opacity-40 rounded-lg pointer-events-none" aria-hidden="true" />
            )}
        </section>
    );
} 