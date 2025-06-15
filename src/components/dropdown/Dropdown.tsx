import React, {
    useRef,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import type { DropdownProps, DropdownOption } from './types';
import { Icon } from '../icon/icon';
import { Overlay } from '../overlay/Overlay';


const MENU_ID = 'dropdown-menu-id';

export function Dropdown({
    options,
    value,
    onChange,
    isOpen,
    onOpenChange,
    placeholder = 'Select...',
    label,
    disabled = false,
    fullWidth = false,
    multiSelect = false,
}: DropdownProps & { multiSelect?: boolean }) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    // const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Multi-select logic
    const isMulti = !!multiSelect;
    const selectedValues: string[] = useMemo(() => isMulti ? (Array.isArray(value) ? value : []) : [], [isMulti, value]);

    // Filter out separators for focusable items
    const focusableOptions = useMemo(
        () =>
            options
                .map((opt, idx) => ({ ...opt, idx }))
                .filter((opt) => !opt.isSeparator),
        [options]
    );

    // Find selected option(s)
    const selectedOption = useMemo(() => {
        if (isMulti) {
            return options.filter((opt) => !opt.isSeparator && typeof opt.value === 'string' && selectedValues.includes(opt.value as string));
        } else {
            return options.find((opt) => !opt.isSeparator && typeof opt.value === 'string' && opt.value === value);
        }
    }, [options, value, isMulti, selectedValues]);

    // Set focus to selected or first enabled item when menu opens
    useEffect(() => {
        if (isOpen) {
            let idx = focusableOptions.findIndex(
                (opt) => !opt.disabled && opt.value === value
            );
            if (idx === -1) {
                idx = focusableOptions.findIndex((opt) => !opt.disabled);
            }
            // setFocusedIndex(idx === -1 ? null : idx);
        } else {
            // setFocusedIndex(null);
        }
    }, [isOpen, value, focusableOptions]);

    // Click handler remains unchanged but now toggles open via onOpenChange
    const handleButtonClick = useCallback(() => {
        if (disabled) return;
        onOpenChange(!isOpen);
    }, [disabled, isOpen, onOpenChange]);

    // Option click handler
    const handleOptionClick = useCallback(
        (opt: DropdownOption) => {
            if (opt.disabled || !opt.value) return;
            if (isMulti) {
                let newSelected: string[];
                if (selectedValues.includes(opt.value)) {
                    newSelected = selectedValues.filter(v => v !== opt.value);
                } else {
                    newSelected = [...selectedValues, opt.value];
                }
                onChange(newSelected);
            } else {
                onChange(opt.value);
                onOpenChange(false);
            }
        },
        [onChange, onOpenChange, isMulti, selectedValues]
    );

    // Option mouse enter handler
    const handleOptionMouseEnter = useCallback(
        (/*idx: number*/) => {
            // setFocusedIndex(idx);
        },
        []
    );

    // ARIA: active descendant id
    // const activeDescendantId =
    //     isOpen && focusedIndex !== null && focusableOptions[focusedIndex]
    //         ? `dropdown-option-${focusableOptions[focusedIndex]?.idx}`
    //         : undefined;

    // Classes and styles for congruency with TextInput
    const containerClasses = `${fullWidth ? 'w-full' : ''}` + (label ? ' flex flex-col gap-1' : '');
    const labelClasses = "label-base";
    const buttonClasses = `input-base ${
        isOpen ? 'focus-state' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} input-focus-ring`;

    // Button label
    let buttonLabel: string;
    if (isMulti) {
        if (Array.isArray(selectedOption) && selectedOption.length > 0) {
            buttonLabel = selectedOption.map((opt: DropdownOption) => opt.label ?? '').filter(Boolean).join(', ');
        } else {
            buttonLabel = placeholder;
        }
    } else {
        buttonLabel = (selectedOption && !Array.isArray(selectedOption) && selectedOption.label) ? selectedOption.label : placeholder;
    }

    return (
        <div className={containerClasses}>
            {label && (
                <label className={labelClasses} id={`dropdown-label-${MENU_ID}`}>
                    {label}
                </label>
            )}
            <button
                ref={buttonRef}
                type="button"
                className={buttonClasses}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={MENU_ID}
                aria-label={label ? undefined : placeholder}
                aria-labelledby={label ? `dropdown-label-${MENU_ID}` : undefined}
                disabled={disabled}
                onClick={handleButtonClick}
                tabIndex={0}
            >
                <span className="flex-1 text-left truncate font-extrabold">
                    {buttonLabel}
                </span>
                <button
                    type="button"
                    className={`chevron-button ${isOpen ? 'open' : ''}`}
                    tabIndex={-1}
                    disabled={disabled}
                >
                    <Icon
                        name="chevron"
                        size={20}
                        color={disabled ? "var(--border-default)" : "var(--content-primary)"}
                    />
                </button>
            </button>
            <Overlay
                reference={buttonRef.current}
                open={isOpen}
                onOpenChange={onOpenChange}
                placement="bottom-start"
                matchWidth
                className="dropdown-base"
            >
                {options.length === 0 && (
                    <div className="px-4 py-2 text-content-secondary text-sm">No options</div>
                )}
                {options.map((opt, idx) => {
                    if (opt.isSeparator) {
                        return <div key={`separator-${idx}`} className="h-px border-default my-1" role="separator" />;
                    }
                    const isSelected = isMulti
                        ? typeof opt.value === 'string' && selectedValues.includes(opt.value)
                        : !opt.disabled && typeof opt.value === 'string' && value !== null && opt.value === value;
                    return (
                        <button
                            key={opt.value || idx}
                            className={`dropdown-item ${
                                isSelected ? 'dropdown-item-selected' : ''
                            } ${
                                opt.disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleOptionClick(opt)}
                            onMouseEnter={() => handleOptionMouseEnter()}
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={opt.disabled}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={opt.disabled}
                            tabIndex={-1}
                        >
                            {opt.icon && (
                                <Icon
                                    name={opt.icon}
                                    size={16}
                                    color={opt.disabled ? "var(--content-secondary)" : "var(--content-primary)"}
                                    className="shrink-0 mr-2"
                                />
                            )}
                            <span className="truncate flex-1">{opt.label}</span>
                        </button>
                    );
                })}
            </Overlay>
        </div>
    );
} 