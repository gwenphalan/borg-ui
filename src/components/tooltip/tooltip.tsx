import { useRef, useState, useEffect } from "react";

export interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
    disabled?: boolean;
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

const placementMap: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({
    children,
    content,
    placement = "top",
    delay = 200,
    className = "",
    disabled = false,
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    function showTooltip() {
        if (disabled) return;
        timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
    }
    function hideTooltip() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setVisible(false);
    }
    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return (
        <span className="relative inline-flex group" tabIndex={disabled ? -1 : 0} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
            {children}
            {visible && !disabled && (
                <span
                    className={[
                        "absolute z-50 px-3 py-2 rounded shadow-lg text-xs font-medium transition-opacity duration-150",
                        "bg-[var(--background-elevated)] text-[var(--content-primary)] border border-[var(--border-default)]",
                        placementMap[placement],
                        className,
                    ].join(" ")}
                    role="tooltip"
                    style={{
                        background: styleMap.background_elevated,
                        color: styleMap.content_primary,
                        borderColor: styleMap.border_default,
                        pointerEvents: "none",
                        whiteSpace: "pre-line",
                    }}
                >
                    {content}
                </span>
            )}
        </span>
    );
}

export default Tooltip; 