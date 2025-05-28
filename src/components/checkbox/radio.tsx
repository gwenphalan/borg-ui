import React, { useId } from "react";

// Using only the necessary colors from your styleMap for clarity
const styleMap = {
    border_default: "var(--border-default)",
    content_primary: "var(--content-primary)",
};

export interface RadioProps {
    checked: boolean;
    onChange: (value: string) => void; // Radio typically emits its value
    name: string; // Essential for grouping radio buttons
    value: string; // The value this radio button represents
    disabled?: boolean;
    className?: string; // Applied to the root label element
    "aria-label"?: string; // For accessibility if no visible label
    label?: string;
    id?: string; // Allow passing an ID for external label association
}

export function Radio({
    checked,
    onChange,
    name,
    value,
    disabled = false,
    className = "",
    "aria-label": ariaLabelProp,
    label,
    id: providedId,
}: RadioProps) {
    const generatedId = useId();
    const actualId = providedId || generatedId;

    const { border_default, content_primary } = styleMap;

    // Handle change from the native input
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            onChange(event.target.value); // Emit the value of the selected radio
        }
    };

    // Determine accessible name for the input
    const accessibleName = ariaLabelProp || (label ? undefined : "Radio button");

    // --- Styling Logic for the Custom Visual ---
    const customVisualClasses: string[] = [
        "w-5",
        "h-5",
        "rounded-full", // Radio buttons are circular
        "flex",
        "items-center",
        "justify-center",
        "border", // All states have a border
        "transition-colors",
        "transition-transform",
        "duration-100",
        "ease-in-out",
    ];

    const innerDotColor = border_default; // Color for the inner dot when checked

    if (disabled) {
        customVisualClasses.push(
            `bg-[${border_default}]`,
            `border-[${border_default}]`,
        );
        // innerDotColor remains border_default, blending with the background
    } else if (checked) {
        // CHECKED (enabled)
        customVisualClasses.push(
            `bg-[${content_primary}]`, // Bright background
            `border-[${content_primary}]`, // Border matches background
        );
        // innerDotColor is border_default (dark dot on bright background)
        customVisualClasses.push("group-hover:scale-[1.05]"); // Hover scale
    } else {
        // UNCHECKED (enabled)
        customVisualClasses.push(
            `bg-[${border_default}]`, // Dark background
            `border-[${border_default}]`, // Default dark border
        );
        // Hover for unchecked: border becomes content_primary
        customVisualClasses.push(
            `group-hover:border-[${content_primary}]`,
        );
        // Focus for unchecked: border also becomes content_primary
        customVisualClasses.push(
            `peer-focus:border-[${content_primary}]`,
        );
    }

    // Focus outline (applies if not disabled, for all states)
    if (!disabled) {
        customVisualClasses.push(
            `peer-focus:outline`,
            `peer-focus:outline-2`,
            `peer-focus:outline-offset-1`,
            `peer-focus:outline-[${content_primary}]`,
        );
    }

    // Label text color
    const labelTextColorClass = disabled
        ? `text-[${border_default}]`
        : `text-[${content_primary}]`;

    return (
        <label
            htmlFor={actualId}
            className={`group inline-flex items-center gap-2 select-none focus:outline-none ${/* Remove label's default focus outline */ ""}
        ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        ${className}`}
        >
            <input
                type="radio"
                id={actualId}
                name={name} // Group radio buttons
                value={value} // Value of this specific radio
                className="sr-only peer" // Visually hidden, but accessible and functional
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
                aria-label={accessibleName}
            />
            <span className={customVisualClasses.join(" ")}>
                {/* Render inner dot only if checked and not disabled */}
                {checked && !disabled && (
                    <span
                        className={`w-2.5 h-2.5 rounded-full bg-[${innerDotColor}]`} // Slightly smaller inner dot
                    />
                )}
            </span>
            {label && (
                <span
                    className={`font-semibold font-['Orbitron'] text-sm ${labelTextColorClass}`}
                >
                    {label}
                </span>
            )}
        </label>
    );
}
