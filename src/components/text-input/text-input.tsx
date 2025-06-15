import { useRef, useState, useEffect } from "react";
import { Icon } from "../icon/icon";
import { Overlay } from "../overlay/Overlay";

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

export interface TextInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    warning?: boolean;
    errorMessage?: string;
    warningMessage?: string;
    dropdownOptions?: string[];
    onOptionSelect?: (option: string) => void;
    maxLength?: number;
    autoComplete?: string;
    name?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | string;
    validationRules?: {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        required?: boolean;
        custom?: (value: string) => string | undefined;
        passwordStrength?: {
            minLength?: number;
            requireUppercase?: boolean;
            requireLowercase?: boolean;
            requireNumber?: boolean;
            requireSpecial?: boolean;
        };
    };
}

export function TextInput({
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
    dropdownOptions,
    onOptionSelect,
    maxLength,
    autoComplete,
    name,
    type = 'text',
    validationRules,
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [internalDropdownOpen, setInternalDropdownOpen] = useState(false);
    const [internalError, setInternalError] = useState<string | undefined>(undefined);
    const [internalWarning, setInternalWarning] = useState<string | undefined>(undefined);
    const [touched, setTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const isDropdown = !!dropdownOptions;
    const isDropdownOpen = internalDropdownOpen;

    // Validate on value change
    useEffect(() => {
        function validate(val: string) {
            if (!validationRules) return { error: undefined, warning: undefined };
            // Required
            if (validationRules.required && !val) {
                return { error: 'This field is required.', warning: undefined };
            }
            // minLength
            if (validationRules.minLength && val.length < validationRules.minLength) {
                return { error: `Minimum length is ${validationRules.minLength}.`, warning: undefined };
            }
            // maxLength (should be handled by input, but warn if exceeded)
            if (validationRules.maxLength && val.length > validationRules.maxLength) {
                return { error: undefined, warning: `Maximum length is ${validationRules.maxLength}.` };
            }
            // pattern
            if (validationRules.pattern && !validationRules.pattern.test(val)) {
                return { error: 'Invalid format.', warning: undefined };
            }
            // passwordStrength
            if (validationRules.passwordStrength && type === 'password') {
                const { minLength, requireUppercase, requireLowercase, requireNumber, requireSpecial } = validationRules.passwordStrength;
                if (minLength && val.length < minLength) {
                    return { error: `Password must be at least ${minLength} characters.`, warning: undefined };
                }
                if (requireUppercase && !/[A-Z]/.test(val)) {
                    return { error: 'Password must contain an uppercase letter.', warning: undefined };
                }
                if (requireLowercase && !/[a-z]/.test(val)) {
                    return { error: 'Password must contain a lowercase letter.', warning: undefined };
                }
                if (requireNumber && !/[0-9]/.test(val)) {
                    return { error: 'Password must contain a number.', warning: undefined };
                }
                if (requireSpecial && !/[^A-Za-z0-9]/.test(val)) {
                    return { error: 'Password must contain a special character.', warning: undefined };
                }
            }
            // Built-in email validation
            if (type === 'email' && val) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(val)) {
                    return { error: 'Invalid email address.', warning: undefined };
                }
            }
            // Custom
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
        // Reset touched if value is cleared
        if (value === "") setTouched(false);
    }, [value, validationRules, type]);

    // Determine error/warning state and message
    const showError = (error || (!!internalError && !error && !warning)) && touched;
    const showWarning = !showError && (warning || (!!internalWarning && !error)) && touched;
    const errorText = errorMessage || internalError;
    const warningText = warningMessage || internalWarning;

    // Outline and label color logic
    let outlineColor = styleMap.border_default;
    let labelColor = styleMap.content_primary;

    if (isFocused || isDropdownOpen) {
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

    // Handle dropdown open on focus
    function handleFocus() {
        setIsFocused(true);
        if (isDropdown && !isDropdownOpen) {
            setInternalDropdownOpen(true);
        }
    }
    function handleBlur() {
        setIsFocused(false);
        setTouched(true);
    }

    // Handle dropdown toggle
    function handleDropdownToggle() {
        setInternalDropdownOpen((v) => !v);
        if (!isFocused && inputRef.current) inputRef.current.focus();
    }

    // Handle option select
    function handleOptionSelect(option: string) {
        if (onOptionSelect) onOptionSelect(option);
        onChange(option);
        setInternalDropdownOpen(false);
    }

    // Character count
    const charCount = value.length;

    // Click outside to close dropdown is now handled by Overlay component

    // Generate a unique name for autofill if not provided
    const inputName = name || (autoComplete === 'on' ? `textinput-${label?.replace(/\s+/g, '-').toLowerCase() || ''}` : undefined);

    return (
        <div ref={rootRef} className={`w-full flex flex-col gap-[5px] ${className} relative font-[Orbitron]`}>
            {label && (
                <label className="text-[12px] font-black uppercase tracking-[2px] font-[Orbitron]" style={{ color: labelColor }}>
                    {label}
                </label>
            )}
            <div
                className={
                    `w-full min-w-0 flex items-center bg-[var(--surface-default)] rounded-[5px] outline-2 px-[11px] py-[11px] relative transition-colors duration-150 font-[Orbitron] ` +
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
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                <input
                    ref={inputRef}
                    type={type}
                    className="w-full min-w-0 bg-transparent border-none outline-none text-[16px] font-extrabold font-[Orbitron] p-0 m-0 break-words"
                    style={{ color: inputColor }}
                    value={value}
                    onChange={e => {
                        if (!maxLength || e.target.value.length <= maxLength) onChange(e.target.value);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoComplete={autoComplete || (isDropdown ? 'on' : 'off')}
                    name={inputName}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-disabled={disabled}
                />
                {/* Dropdown chevron */}
                {isDropdown && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className="ml-[14px] flex items-center justify-center"
                        onClick={handleDropdownToggle}
                        disabled={disabled}
                        aria-label="Toggle dropdown"
                    >
                        <Icon
                            name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={labelColor}
                        />
                    </button>
                )}
                {/* Error/Warning icons */}
                {showError && (
                    <span className="ml-[11px] flex items-center">
                        <Icon name="error-state" size={21} />
                    </span>
                )}
                {showWarning && (
                    <span className="ml-[11px] flex items-center">
                        <Icon name="warning-state" size={21} />
                    </span>
                )}
                {/* Character count */}
                {maxLength && (
                    <span className="ml-2 text-xs text-[var(--content-secondary)] select-none font-[Orbitron]">
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
            {/* Dropdown options using Overlay */}
            {isDropdown && (
                <Overlay
                    reference={rootRef.current}
                    open={isDropdownOpen}
                    onOpenChange={setInternalDropdownOpen}
                    placement="bottom-start"
                    matchWidth
                    className="z-50 min-w-[180px] rounded-lg shadow-lg bg-[var(--background-elevated)] border border-[var(--border-default)] p-2 flex flex-col space-y-1 font-[Orbitron]"
                    style={{
                        background: styleMap.background_elevated,
                        borderColor: styleMap.border_default,
                    }}
                >
                    <div role="menu">
                        {dropdownOptions!.map(option => {
                            const isSelected = value === option;
                            const isDisabled = false; // Add support for disabled options if needed in the future
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    className={
                                        `flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base transition-colors duration-150 ease-in-out text-left select-none bg-transparent text-[var(--content-primary)] hover:bg-[var(--content-primary)] hover:text-[var(--background-default)] w-full group` +
                                        (isSelected ? ' outline-2 outline-[var(--interactive-accentfocus)] outline-offset-[-2px] bg-[var(--content-primary)] text-[var(--background-default)]' : '') +
                                        (isDisabled ? ' bg-transparent text-[var(--content-secondary)] opacity-50 cursor-not-allowed !hover:bg-transparent !hover:text-[var(--content-secondary)]' : ' cursor-pointer')
                                    }
                                    style={{ fontFamily: 'Orbitron' }}
                                    onClick={() => handleOptionSelect(option)}
                                    role="menuitem"
                                    disabled={isDisabled}
                                >
                                    {/* Future icon slot: <span className=\"mr-2\"></span> */}
                                    <span className="truncate flex-1">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </Overlay>
            )}
        </div>
    );
} 