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
    buttonClassName = '',
    menuClassName = '',
    itemClassName = '',
    itemSelectedClassName = '',
    itemDisabledClassName = '',
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
    const buttonBase =
        'w-full min-w-0 flex items-center bg-surface-default rounded-[5px] outline-2 px-[11px] py-[11px] relative transition-colors duration-150 font-orbitron ' +
        (disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer');
    const buttonText =
        'w-full min-w-0 text-base font-extrabold font-orbitron p-0 m-0 break-words text-left truncate flex-1 text-content-primary';
    const buttonChevron = 'ml-[14px] flex items-center justify-center';
    // const buttonRing =
    //     isOpen ? "ring-2 ring-[var(--content-primary)]" : "";
    // const buttonWidth = fullWidth ? 'w-full' : '';

    const menuBase =
        'min-w-[180px] rounded-lg shadow-lg bg-background-elevated border border-default p-2 flex flex-col space-y-1 z-50 font-orbitron ' +
        menuClassName;

    const itemBase =
        'flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base transition-colors duration-150 ease-in-out text-left select-none bg-transparent text-content-primary hover:text-content-primary hover:bg-background-default cursor-pointer w-full group';
    const itemSelected =
        'outline outline-2 outline-[var(--interactive-accentfocus)] outline-offset-[-2px] text-content-primary bg-background-default';
    const itemDisabled = 'bg-transparent text-content-secondary opacity-50 cursor-not-allowed !hover:bg-transparent !hover:text-content-secondary';
    const separatorClass = 'h-px border-default my-1';

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
        <div className={`${fullWidth ? 'w-full' : ''}` + (label ? ' flex flex-col gap-[5px]' : '')}>
            {label && (
                <label
                    className="text-xs font-black uppercase tracking-[2px] font-orbitron mb-1 text-content-primary"
                    id={`dropdown-label-${MENU_ID}`}
                >
                    {label}
                </label>
            )}
            <button
                ref={buttonRef}
                type="button"
                className={[
                    buttonBase,
                    isOpen ? 'outline outline-2 outline-[var(--content-primary)] outline-offset-[-1px]' : 'focus-visible:outline-2 focus-visible:outline-[var(--interactive-accentfocus)] outline-offset-[-1px]',
                    buttonClassName,
                ].join(' ')}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={MENU_ID}
                aria-label={label ? undefined : placeholder}
                aria-labelledby={label ? `dropdown-label-${MENU_ID}` : undefined}
                disabled={disabled}
                onClick={handleButtonClick}
                tabIndex={0}
                style={{
                    background: "var(--surface-default)",
                    outlineColor: isOpen ? "var(--content-primary)" : "var(--border-default)",
                    outlineOffset: -1,
                    outlineStyle: 'solid',
                    outlineWidth: 2,
                }}
            >
                <span className={buttonText}>{buttonLabel}</span>
                <span className={buttonChevron}>
                    <Icon
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={disabled ? "var(--border-default)" : "var(--content-primary)"}
                    />
                </span>
            </button>
            <Overlay
                reference={buttonRef.current}
                open={isOpen}
                onOpenChange={onOpenChange}
                placement="bottom-start"
                matchWidth
                className={menuBase}
                style={{
                    background: "var(--surface-default)",
                    borderColor: "var(--border-default)",
                }}
            >
                {options.length === 0 && (
                    <div className="px-4 py-2 text-content-secondary text-sm">No options</div>
                )}
                {options.map((opt, idx) => {
                    if (opt.isSeparator) {
                        return <div key={`separator-${idx}`} className={separatorClass} role="separator" />;
                    }
                    // const focusIdx = focusableOptions.findIndex((f) => f.idx === idx);
                    const isSelected = isMulti
                        ? typeof opt.value === 'string' && selectedValues.includes(opt.value)
                        : !opt.disabled && typeof opt.value === 'string' && value !== null && opt.value === value;
                    return (
                        <div
                            id={`dropdown-option-${idx}`}
                            key={opt.value || idx}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={opt.disabled}
                            tabIndex={-1}
                            className={
                                opt.disabled
                                    ? [
                                        'flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base transition-colors duration-150 ease-in-out text-left select-none bg-transparent text-content-secondary opacity-50 cursor-not-allowed w-full',
                                        itemDisabled,
                                        itemDisabledClassName,
                                    ].join(' ')
                                    : [
                                        itemBase,
                                        itemClassName,
                                        isSelected ? [itemSelected, itemSelectedClassName].join(' ') : '',
                                    ].join(' ')
                            }
                            onClick={() => handleOptionClick(opt)}
                            onMouseEnter={() => handleOptionMouseEnter()}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {opt.icon && (
                                opt.disabled ? (
                                    <Icon
                                        name={opt.icon}
                                        size={16}
                                        color={"var(--content-secondary)"}
                                        className="shrink-0 mr-2"
                                    />
                                ) : (
                                    <Icon
                                        name={opt.icon}
                                        size={16}
                                        className="shrink-0 mr-2 text-content-primary group-hover:bg-background-default"
                                    />
                                )
                            )}
                            <span className="truncate flex-1">{opt.label}</span>
                        </div>
                    );
                })}
            </Overlay>
        </div>
    );
} 