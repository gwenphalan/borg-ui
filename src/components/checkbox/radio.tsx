import React, { useId } from "react";

// Using only the necessary colors from your styleMap for clarity

export interface RadioProps {
    checked: boolean;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    "aria-label"?: string;
    label?: string;
    name: string;
    value: string;
    id?: string;
}

export function Radio({
    checked,
    onChange,
    disabled = false,
    className = "",
    "aria-label": ariaLabelProp,
    label,
    name,
    value,
    id: providedId,
}: RadioProps) {
    const generatedId = useId();
    const actualId = providedId || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const accessibleName = ariaLabelProp || (label ? undefined : "Radio option");

    const customVisualClasses: string[] = [
        "w-5",
        "h-5",
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
        "border",
        "transition-colors",
        "transition-transform",
        "duration-100",
        "ease-in-out",
    ];

    if (disabled) {
        customVisualClasses.push(
            "bg-border-default",
            "border-border-default",
        );
    } else if (checked) {
        // CHECKED (enabled)
        customVisualClasses.push(
            "bg-content-primary",
            "border-content-primary",
        );
        customVisualClasses.push("group-hover:scale-[1.05]");
    } else {
        // UNCHECKED (enabled)
        customVisualClasses.push(
            "bg-border-default",
            "border-border-default",
        );
        customVisualClasses.push(
            "group-hover:border-content-primary",
        );
        customVisualClasses.push(
            "peer-focus:border-content-primary",
        );
    }

    if (!disabled) {
        customVisualClasses.push(
            "peer-focus:outline",
            "peer-focus:outline-2",
            "peer-focus:outline-offset-1",
            "peer-focus:outline-content-primary",
        );
    }

    const labelTextColorClass = disabled
        ? "text-border-default"
        : "text-content-primary";

    return (
        <label
            htmlFor={actualId}
            className={`group inline-flex items-center gap-2 select-none focus:outline-none ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                } ${className}`}
        >
            <input
                type="radio"
                id={actualId}
                name={name}
                value={value}
                className="sr-only peer"
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
                aria-label={accessibleName}
            />
            <span className={customVisualClasses.join(" ")}>
                {!disabled && checked && (
                    <span className="w-[6px] h-[6px] rounded-full bg-border-default" />
                )}
            </span>
            {label && (
                <span
                    className={`font-semibold font-orbitron text-sm ${labelTextColorClass}`}
                >
                    {label}
                </span>
            )}
        </label>
    );
}
