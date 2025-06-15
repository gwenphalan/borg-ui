import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { Overlay } from "../overlay/Overlay";
import { Icon } from "../icon/icon";


export interface TimePickerProps {
    value?: Date | string | number | null;
    onChange: (value: Date | string | number | null) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    format?: string;
    step?: number;
    showSeconds?: boolean;
    disableHours?: (hour: number) => boolean;
    disableMinutes?: (minute: number) => boolean;
    disableSeconds?: (second: number) => boolean;
    minTime?: Date | string | number;
    maxTime?: Date | string | number;
    clearable?: boolean;
    onClear?: () => void;
    defaultValue?: Date | string | number | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    inputClassName?: string;
    panelClassName?: string;
    error?: boolean;
    helperText?: string;
    id?: string;
}

function parseToDate(val: Date | string | number | null | undefined, is12HourFormat?: boolean): Date | null {
    if (!val) return null;
    if (val instanceof Date) return new Date(val);
    if (typeof val === "number") return new Date(val);
    if (typeof val === "string") {
        const now = new Date();
        const isoDate = Date.parse(val);
        if (!isNaN(isoDate)) return new Date(isoDate);
        const timeRegex = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i;
        const match = val.match(timeRegex);
        if (match) {
            let hours = parseInt(match[1]!, 10);
            const minutes = parseInt(match[2]!, 10);
            const seconds = match[3] ? parseInt(match[3], 10) : 0;
            const ampm = match[4]?.toLowerCase();
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
            if (is12HourFormat && ampm) {
                if (hours < 1 || hours > 12) return null;
                if (ampm === "pm" && hours < 12) hours += 12;
                if (ampm === "am" && hours === 12) hours = 0;
            } else if (!is12HourFormat && ampm) { return null; }
            else { if (hours < 0 || hours > 23) return null; }
            if (minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
            const d = new Date(now);
            d.setHours(hours, minutes, seconds, 0);
            return d;
        }
    }
    return null;
}

function formatTime(date: Date | null, formatStr = "HH:mm", showSecondsOverride = false): string {
    if (!date) return "";
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const useSeconds = showSecondsOverride || formatStr.includes(":ss") || /s{1,2}/.test(formatStr);
    if (formatStr.includes("A") || formatStr.includes("a")) {
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;
        return `${h.toString().padStart(formatStr.includes("hh") ? 2 : 1, "0")}:${m.toString().padStart(2, "0")}${useSeconds ? ":" + s.toString().padStart(2, "0") : ""} ${ampm}`;
    }
    return `${date.getHours().toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${useSeconds ? ":" + s.toString().padStart(2, "0") : ""}`;
}


export function TimePicker({
    value,
    onChange,
    label,
    placeholder = "Select time...",
    disabled = false,
    readOnly = false,
    format = "HH:mm",
    step = 1,
    showSeconds = false,
    disableHours,
    disableMinutes,
    disableSeconds,
    minTime,
    maxTime,
    clearable = false,
    onClear,
    defaultValue = null,
    open: controlledOpen,
    onOpenChange,
    className, style, /*inputClassName,*/ panelClassName, error, helperText, id
}: TimePickerProps) {
    const is12Hour = /a|A/.test(format);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const getInitialDate = () => parseToDate(value ?? defaultValue, is12Hour);
    const [internalValue, setInternalValue] = useState<Date | null>(getInitialDate());
    const [inputValue, setInputValue] = useState<string>(formatTime(internalValue, format, showSeconds));

    const [pendingHour, setPendingHour] = useState<number | null>(null);
    const [pendingMinute, setPendingMinute] = useState<number | null>(null);
    const [pendingSecond, setPendingSecond] = useState<number | null>(null);
    const [pendingAmPm, setPendingAmPm] = useState<"AM" | "PM">("AM");

    const inputRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<Array<HTMLButtonElement | null>>>([[], [], [], []]);

    const min = useMemo(() => parseToDate(minTime, is12Hour), [minTime, is12Hour]);
    const max = useMemo(() => parseToDate(maxTime, is12Hour), [maxTime, is12Hour]);

    const setIsOpen = useCallback((newOpenState: boolean) => {
        if (disabled || readOnly) return;
        if (onOpenChange) onOpenChange(newOpenState);
        else setUncontrolledOpen(newOpenState);
    }, [onOpenChange, disabled, readOnly]);

    useEffect(() => {
        const newDateVal = parseToDate(value, is12Hour);
        setInternalValue(newDateVal);
        setInputValue(formatTime(newDateVal, format, showSeconds));
    }, [value, is12Hour, format, showSeconds]);

    useEffect(() => {
        if (isOpen) {
            const dateToSync = internalValue ?? new Date();
            let h = dateToSync.getHours();
            setPendingMinute(dateToSync.getMinutes());
            setPendingSecond(dateToSync.getSeconds());
            if (is12Hour) {
                const ampm = h >= 12 ? "PM" : "AM";
                h = h % 12;
                if (h === 0) h = 12;
                setPendingAmPm(ampm);
            }
            setPendingHour(h);
        }
    }, [isOpen, internalValue, is12Hour]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        if (onClear) onClear();
        setIsOpen(false);
    };

    const commitPendingTime = () => {
        let h = pendingHour ?? 0;
        if (is12Hour) {
            if (pendingAmPm === 'PM' && h !== 12) h += 12;
            if (pendingAmPm === 'AM' && h === 12) h = 0;
        }
        const newDate = internalValue ? new Date(internalValue) : new Date();
        newDate.setHours(h, pendingMinute ?? 0, pendingSecond ?? 0, 0);
        onChange(newDate);
        setIsOpen(false);
    };

    const isHourDisabled = (hour: number) => {
        if (disableHours?.(hour)) return true;
        if (!min && !max) return false;
        let h24 = hour;
        if (is12Hour) {
            const ampm = pendingAmPm;
            if (ampm === "AM") h24 = hour === 12 ? 0 : hour;
            else h24 = hour === 12 ? 12 : hour + 12;
        }
        if (min && h24 < min.getHours()) return true;
        if (max && h24 > max.getHours()) return true;
        return false;
    };

    const isMinuteDisabled = (minute: number) => {
        let h24 = pendingHour;
        if (is12Hour && h24) {
            if (pendingAmPm === 'PM' && h24 < 12) h24 += 12;
            if (pendingAmPm === 'AM' && h24 === 12) h24 = 0;
        }
        if (disableMinutes?.(minute)) return true;
        if (!min && !max || h24 === null) return false;
        if (min && h24 === min.getHours() && minute < min.getMinutes()) return true;
        if (max && h24 === max.getHours() && minute > max.getMinutes()) return true;
        return false;
    };

    const isSecondDisabled = (second: number) => {
        let h24 = pendingHour;
        if (is12Hour && h24) {
            if (pendingAmPm === 'PM' && h24 < 12) h24 += 12;
            if (pendingAmPm === 'AM' && h24 === 12) h24 = 0;
        }
        if (disableSeconds?.(second)) return true;
        if (!min && !max || h24 === null || pendingMinute === null) return false;
        if (min && h24 === min.getHours() && pendingMinute === min.getMinutes() && second < min.getSeconds()) return true;
        if (max && h24 === max.getHours() && pendingMinute === max.getMinutes() && second > max.getSeconds()) return true;
        return false;
    };

    const hours = useMemo(() => Array.from({ length: is12Hour ? 12 : 24 }, (_, i) => is12Hour ? (i + 1) : i), [is12Hour]);
    const minutes = useMemo(() => Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step), [step]);
    const seconds = useMemo(() => Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step), [step]);

    const renderColumn = (
        items: (number | string)[],
        selectedValue: number | string | null,
        onSelect: (val: number | string) => void,
        isDisabled: (val: number) => boolean,
        colRef: React.RefObject<HTMLDivElement>,
        itemRefArray: (HTMLButtonElement | null)[]
    ) => (
        <div ref={colRef} className="flex-1 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--content-secondary)] scrollbar-track-[var(--surface-default)] px-1">
            {items.map((item, index) => {
                const disabled = typeof item === 'number' ? isDisabled(item) : false;
                const isSelected = item === selectedValue;
                return (
                    <button
                        key={item}
                        ref={el => itemRefArray[index] = el}
                        onClick={() => !disabled && onSelect(item)}
                        className={`w-full text-center p-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background-default'} ${isSelected ? 'bg-[var(--interactive-accentfocus)] text-[var(--text-background-default)] font-bold' : ''}`}
                        disabled={disabled}
                    >
                        {typeof item === 'number' ? item.toString().padStart(2, '0') : item}
                    </button>
                )
            })}
        </div>
    );

    // Custom hook for scrolling to selected item
    function useScrollToSelected(colRef: React.RefObject<HTMLDivElement>, items: (string | number)[], selectedValue: string | number | null, itemRefArray: (HTMLButtonElement | null)[]) {
        useEffect(() => {
            if (isOpen && colRef.current && selectedValue !== null) {
                const idx = items.findIndex(i => i === selectedValue);
                const itemEl = itemRefArray[idx];
                if (itemEl) {
                    const col = colRef.current;
                    const itemRect = itemEl.getBoundingClientRect();
                    const colRect = col.getBoundingClientRect();
                    col.scrollTop = itemEl.offsetTop - col.offsetTop - (colRect.height / 2) + (itemRect.height / 2);
                }
            }
        }, [isOpen, selectedValue, colRef, items, itemRefArray]);
    }

    const hourColRef = useRef<HTMLDivElement>(null);
    const minuteColRef = useRef<HTMLDivElement>(null);
    const secondColRef = useRef<HTMLDivElement>(null);
    const ampmColRef = useRef<HTMLDivElement>(null);

    useScrollToSelected(hourColRef, hours, pendingHour, itemRefs.current[0]);
    useScrollToSelected(minuteColRef, minutes, pendingMinute, itemRefs.current[1]);
    useScrollToSelected(secondColRef, seconds, showSeconds ? pendingSecond : null, itemRefs.current[2]);
    useScrollToSelected(ampmColRef, ["AM", "PM"], is12Hour ? pendingAmPm : null, itemRefs.current[3]);


    const panelContent = (
        <div className={`overlay-panel ${panelClassName}`} style={{ width: showSeconds ? (is12Hour ? 290 : 220) : (is12Hour ? 220 : 150) }}>
            <div className="flex p-2">
                {renderColumn(hours, pendingHour, val => setPendingHour(val as number), isHourDisabled, hourColRef, itemRefs.current[0])}
                {renderColumn(minutes, pendingMinute, val => setPendingMinute(val as number), isMinuteDisabled, minuteColRef, itemRefs.current[1])}
                {showSeconds && renderColumn(seconds, pendingSecond, val => setPendingSecond(val as number), isSecondDisabled, secondColRef, itemRefs.current[2])}
                {is12Hour && renderColumn(["AM", "PM"], pendingAmPm, val => setPendingAmPm(val as "AM" | "PM"), () => false, ampmColRef, itemRefs.current[3])}
            </div>
            <div className="p-2 border-t border-default">
                <button
                    onClick={commitPendingTime}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[var(--interactive-accentfocus)] rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--interactive-accentfocus)]"
                >
                    OK
                </button>
            </div>
        </div>
    );

    // Determine state classes
    const containerClasses = `flex flex-col gap-1 w-full ${className ?? ''}`;
    const labelClasses = `label-base ${
        error ? 'text-status-error' : 'text-content-primary'
    }`;
    const inputClasses = `input-base ${
        error ? 'error-state' :
        isOpen ? 'focus-state' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} input-focus-ring`;

    return (
        <div className={containerClasses} style={style} id={id}>
            {label && (
                <label className={labelClasses}>
                    {label}
                </label>
            )}
            <div
                ref={inputRef}
                className={inputClasses}
                onClick={() => !disabled && !readOnly && setIsOpen(true)}
            >
                <span className="flex-1 text-left truncate">
                    {inputValue || (
                        <span className="text-content-secondary">
                            {placeholder}
                        </span>
                    )}
                </span>
                {clearable && inputValue && !disabled && !readOnly && (
                    <button
                        type="button"
                        className="clear-button"
                        aria-label="Clear time"
                        tabIndex={0}
                        onClick={handleClear}
                    >
                        <Icon name="close" size={10} />
                    </button>
                )}
                <button
                    type="button"
                    className="icon-button"
                    tabIndex={-1}
                    aria-label="Open time picker"
                    disabled={disabled || readOnly}
                    onClick={e => {
                        e.stopPropagation();
                        if (!disabled && !readOnly) setIsOpen(true);
                    }}
                >
                    <Icon name="clock" size={20} />
                </button>
            </div>
            {helperText && <p className={`helper-text ${error ? 'error' : 'info'}`}>{helperText}</p>}

            <Overlay
                reference={inputRef.current}
                open={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom-start"
                className="z-50"
            >
                {panelContent}
            </Overlay>
        </div>
    );
}