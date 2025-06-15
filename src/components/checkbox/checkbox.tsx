import React, { useRef, useEffect, useId } from "react";
import { Icon } from "../icon/icon"; // Assuming Icon handles its own styling


export interface CheckboxProps {
    checked: boolean;
    onChange: (isChecked: boolean, isNowIndeterminate?: boolean) => void;
    disabled?: boolean;
    className?: string; // Applied to the root label element
    "aria-label"?: string; // For accessibility if no visible label
    indeterminate?: boolean;
    label?: string;
    id?: string; // Allow passing an ID for external label association
}

export function Checkbox({
    checked,
    onChange,
    disabled = false,
    className = "",
    "aria-label": ariaLabelProp,
    indeterminate = false,
    label,
    id: providedId,
}: CheckboxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const actualId = providedId || generatedId;

    

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (indeterminate) {
            onChange(true, false);
        } else {
            onChange(event.target.checked);
        }
    };

    const accessibleName = ariaLabelProp || (label ? undefined : "Checkbox");

    const customVisualClasses: string[] = [
        "w-5",
        "h-5",
        "rounded",
        "flex",
        "items-center",
        "justify-center",
        "border",
        "transition-colors",
        "transition-transform",
        "duration-100",
        "ease-in-out",
    ];

    const iconColor = "var(--border-default)";

    if (disabled) {
        customVisualClasses.push(
            "bg-border-default",
            "border-border-default",
        );
    } else if (checked || indeterminate) {
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
            className={`group inline-flex items-center gap-2 select-none focus:outline-none ${/* Add focus:outline-none here */ ""}
        ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        ${className}`}
        >
            <input
                ref={inputRef}
                type="checkbox"
                id={actualId}
                className="sr-only peer"
                checked={indeterminate ? false : checked}
                disabled={disabled}
                onChange={handleChange}
                aria-label={accessibleName}
            />
            <span className={customVisualClasses.join(" ")}>
                {!disabled &&
                    (indeterminate ? (
                        <span
                            className="w-[10px] h-[10px] rounded-sm bg-border-default"
                        />
                    ) : checked ? (
                        <Icon name="check" size={16} color={iconColor} />
                    ) : null)}
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
