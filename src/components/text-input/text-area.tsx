import { useRef, useState, useEffect } from "react";
import { Icon } from "../icon/icon";

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
    text_background_default: "var(--text-background-default)"
};

export interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    warning?: boolean;
    errorMessage?: string;
    warningMessage?: string;
    maxLength?: number;
    lineHeight?: number; // Number of visible lines
    autoComplete?: string;
    name?: string;
    validationRules?: {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        required?: boolean;
        custom?: (value: string) => string | undefined;
    };
}

export function TextArea({
    label,
    value,
    onChange,
    placeholder = "",
    className = "",
    disabled = false,
    error = false,
    warning = false,
    errorMessage,
    warningMessage,
    maxLength,
    lineHeight = 3,
    autoComplete,
    name,
    validationRules,
}: TextAreaProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string | undefined>(undefined);
    const [internalWarning, setInternalWarning] = useState<string | undefined>(undefined);
    const [touched, setTouched] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Validate on value change
    useEffect(() => {
        function validate(val: string) {
            if (!validationRules) return { error: undefined, warning: undefined };
            if (validationRules.required && !val) {
                return { error: 'This field is required.', warning: undefined };
            }
            if (validationRules.minLength && val.length < validationRules.minLength) {
                return { error: `Minimum length is ${validationRules.minLength}.`, warning: undefined };
            }
            if (validationRules.maxLength && val.length > validationRules.maxLength) {
                return { error: undefined, warning: `Maximum length is ${validationRules.maxLength}.` };
            }
            if (validationRules.pattern && !validationRules.pattern.test(val)) {
                return { error: 'Invalid format.', warning: undefined };
            }
            if (validationRules.custom) {
                const customMsg = validationRules.custom(val);
                if (customMsg) return { error: customMsg, warning: undefined };
            }
            return { error: undefined, warning: undefined };
        }
        if (!validationRules) {
            setInternalError(undefined);
            setInternalWarning(undefined);
            return;
        }
        const { error, warning } = validate(value);
        setInternalError(error);
        setInternalWarning(warning);
        if (value === "") setTouched(false);
    }, [value, validationRules]);

    // Determine error/warning state and message
    const showError = (error || (!!internalError && !error && !warning)) && touched;
    const showWarning = !showError && (warning || (!!internalWarning && !error)) && touched;
    const errorText = errorMessage || internalError;
    const warningText = warningMessage || internalWarning;

    // Outline and label color logic
    let outlineColor = styleMap.border_default;
    let labelColor = styleMap.content_primary;
    if (isFocused) {
        outlineColor = styleMap.content_primary;
        labelColor = styleMap.content_primary;
    } else if (showError) {
        outlineColor = styleMap.status_error;
        labelColor = styleMap.status_error;
    } else if (showWarning) {
        outlineColor = styleMap.status_warning;
        labelColor = styleMap.status_warning;
    }

    // Input text color
    let inputColor = styleMap.content_primary;
    if (error || warning || internalError || internalWarning) inputColor = styleMap.content_primary;

    // Character count
    const charCount = value.length;

    // Generate a unique name for autofill if not provided
    const inputName = name || (autoComplete === 'on' ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
        <div className={`w-full flex flex-col gap-[5px] ${className} relative font-[Orbitron]`}>
            <label className="text-[12px] font-black uppercase tracking-[2px] font-[Orbitron]" style={{ color: labelColor }}>
                {label}
            </label>
            <div
                className={
                    `w-full min-w-0 bg-[var(--surface-default)] rounded-[5px] outline-2 px-[11px] py-[11px] relative transition-colors duration-150 font-[Orbitron] ` +
                    (disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text')
                }
                style={{
                    background: styleMap.surface_default,
                    outlineColor,
                    outlineOffset: -1,
                    outlineStyle: 'solid',
                    outlineWidth: 2,
                }}
                tabIndex={-1}
                onClick={() => !disabled && textareaRef.current?.focus()}
            >
                <textarea
                    ref={textareaRef}
                    className="w-full min-w-0 resize-none bg-transparent border-none outline-none text-[16px] font-extrabold font-[Orbitron] p-0 m-0 min-h-0 break-words"
                    style={{ color: inputColor, minHeight: `${lineHeight * 2}em`, lineHeight: '1.5em', maxHeight: `${lineHeight * 2}em`, overflowY: 'auto' }}
                    value={value}
                    onChange={e => {
                        if (!maxLength || e.target.value.length <= maxLength) onChange(e.target.value);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    name={inputName}
                    rows={lineHeight}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => { setIsFocused(false); setTouched(true); }}
                    aria-disabled={disabled}
                />
                {/* Error/Warning icons */}
                {showError && (
                    <span className="ml-[11px] flex items-center absolute right-3 top-3">
                        <Icon name="error-state" size={21} />
                    </span>
                )}
                {showWarning && (
                    <span className="ml-[11px] flex items-center absolute right-3 top-3">
                        <Icon name="warning-state" size={21} />
                    </span>
                )}
                {/* Character count */}
                {maxLength && (
                    <span className="ml-2 text-xs text-[var(--content-secondary)] select-none font-[Orbitron] absolute right-3 bottom-3">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
            {/* Error/Warning message */}
            {showError && errorText && (
                <span className="mt-1 text-xs font-[Orbitron]" style={{ color: styleMap.status_error }}>{errorText}</span>
            )}
            {showWarning && warningText && (
                <span className="mt-1 text-xs font-[Orbitron]" style={{ color: styleMap.status_warning }}>{warningText}</span>
            )}
        </div>
    );
} 