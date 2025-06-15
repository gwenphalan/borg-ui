import { useRef, useState, useEffect } from "react";
import { Icon } from "../icon/icon";


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

    // Character count
    const charCount = value.length;

    // Generate a unique name for autofill if not provided
    const inputName = name || (autoComplete === 'on' ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    // Determine state classes
    const containerClasses = `w-full flex flex-col gap-1 ${className} relative font-orbitron`;
    const labelClasses = `label-base ${isFocused ? 'text-content-primary' :
            showError ? 'text-status-error' :
                showWarning ? 'text-status-warning' :
                    'text-content-primary'
        }`;
    const textareaClasses = `input-base min-h-[80px] ${error ? "error-state" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } input-focus-ring placeholder:text-content-secondary`;

    return (
        <div className={containerClasses}>
            <label className={labelClasses}>
                {label}
            </label>
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    className={textareaClasses}
                    style={{
                        minHeight: `${lineHeight * 1.5}em`,
                        maxHeight: `${lineHeight * 1.5}em`,
                        lineHeight: '1.5em',
                        overflowY: 'auto'
                    }}
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
                    <span className="absolute right-3 top-3 flex items-center">
                        <Icon name="error-state" size={21} />
                    </span>
                )}
                {showWarning && (
                    <span className="absolute right-3 top-3 flex items-center">
                        <Icon name="warning-state" size={21} />
                    </span>
                )}
                {/* Character count */}
                {maxLength && (
                    <span className="char-count absolute right-3 bottom-3">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
            {/* Error/Warning message */}
            {showError && errorText && (
                <span className="helper-text error">{errorText}</span>
            )}
            {showWarning && warningText && (
                <span className="helper-text warning">{warningText}</span>
            )}
        </div>
    );
} 