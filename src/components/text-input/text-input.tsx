import { useRef, useState, useEffect } from "react";
import { Icon } from "../icon/icon";
import { Overlay } from "../overlay/Overlay";

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
    onFocus?: () => void;
    isClearable?: boolean;
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
    onFocus,
    isClearable = false,
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

    // Determine classes based on state
    const labelClasses = `label-base ${isFocused || isDropdownOpen ? 'text-content-primary' :
        showError ? 'text-status-error' :
            showWarning ? 'text-status-warning' :
                'text-content-primary'
        }`;

    const inputContainerClasses = `input-base ${showError ? 'error-state' :
        showWarning ? 'warning-state' :
            isFocused || isDropdownOpen ? 'border-content-primary' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`;

    // Handle dropdown open on focus
    function handleFocus() {
        setIsFocused(true);
        if (isDropdown && !isDropdownOpen) {
            setInternalDropdownOpen(true);
        }
        if (onFocus) {
            onFocus();
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

    function handleClear() {
        onChange("");
        inputRef.current?.focus();
    }

    // Character count
    const charCount = value.length;

    // Generate a unique name for autofill if not provided
    const inputName = name || (autoComplete === 'on' ? `textinput-${label?.replace(/\s+/g, '-').toLowerCase() || ''}` : undefined);

    return (
        <div ref={rootRef} className={`w-full flex flex-col gap-1 ${className} relative font-orbitron`}>
            {label && (
                <label className={labelClasses}>
                    {label}
                </label>
            )}
            <div
                className={inputContainerClasses}
                tabIndex={-1}
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                <input
                    ref={inputRef}
                    type={type}
                    className="w-full min-w-0 bg-transparent border-none outline-hidden text-base font-extrabold font-orbitron p-0 m-0 break-words text-content-primary placeholder:text-content-secondary"
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
                {isClearable && value.length > 0 && isFocused && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className="ml-2 flex items-center justify-center rounded-full hover:bg-background-default w-6 h-6 transition-colors"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            handleClear();
                        }}
                        disabled={disabled}
                        aria-label="Clear input"
                    >
                        <Icon name="close" size={16} color="var(--content-primary)" />
                    </button>
                )}
                {/* Dropdown chevron */}
                {isDropdown && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className={`chevron-button ml-3 ${isDropdownOpen ? 'open' : ''}`}
                        onClick={handleDropdownToggle}
                        disabled={disabled}
                        aria-label="Toggle dropdown"
                    >
                        <Icon
                            name="chevron"
                            size={20}
                            color={
                                isFocused || isDropdownOpen ? 'var(--content-primary)' :
                                    showError ? 'var(--status-error)' :
                                        showWarning ? 'var(--status-warning)' :
                                            'var(--content-primary)'
                            }
                        />
                    </button>
                )}
                {/* Error/Warning icons */}
                {showError && (
                    <span className="ml-3 flex items-center">
                        <Icon name="error-state" size={21} />
                    </span>
                )}
                {showWarning && (
                    <span className="ml-3 flex items-center">
                        <Icon name="warning-state" size={21} />
                    </span>
                )}
                {/* Character count */}
                {maxLength && (
                    <span className="ml-2 text-xs text-content-secondary select-none font-orbitron">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
            {/* Error/Warning message */}
            {showError && errorText && (
                <span className="mt-1 text-xs font-orbitron text-status-error">{errorText}</span>
            )}
            {showWarning && warningText && (
                <span className="mt-1 text-xs font-orbitron text-status-warning">{warningText}</span>
            )}
            {/* Dropdown options using Overlay */}
            {isDropdown && (
                <Overlay
                    reference={rootRef.current}
                    open={isDropdownOpen}
                    onOpenChange={setInternalDropdownOpen}
                    placement="bottom-start"
                    matchWidth
                    className="dropdown-base z-50 min-w-[180px]"
                >
                    <div role="menu">
                        {dropdownOptions!.map(option => {
                            const isSelected = value === option;
                            const isDisabled = false; // Add support for disabled options if needed in the future
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    className={`dropdown-item w-full ${isSelected ? 'dropdown-item-selected' : ''
                                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    onClick={() => handleOptionSelect(option)}
                                    role="menuitem"
                                    disabled={isDisabled}
                                >
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