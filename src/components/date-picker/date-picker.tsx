import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";
import type { CSSProperties } from "react";
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
    text_background_default: "var(--text-background-default)",
    text_dark: "var(--text-dark)",
};

// Types
export type PickerType = "single" | "range" | "multiple" | "month" | "year";

export interface DatePickerProps {
    value?: Date | Date[] | [Date | null, Date | null] | null;
    onChange: (
        value: Date | Date[] | [Date, Date] | [Date | null, Date | null] | null,
    ) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    minDate?: Date;
    maxDate?: Date;
    excludeDates?: Date[] | ((date: Date) => boolean); // Should be Date[]
    highlightDates?: Date[] | ((date: Date) => boolean); // Should be Date[]
    dateFormat?: string;
    pickerType?: PickerType;
    calendarIcon?: React.ReactNode;
    clearable?: boolean;
    onClear?: () => void;
    defaultValue?: Date | Date[] | [Date | null, Date | null] | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    locale?: string;
    className?: string;
    style?: React.CSSProperties;
    inputClassName?: string;
    calendarClassName?: string;
    error?: boolean;
    helperText?: string;
}

// Helper functions
function isSameDay(a: Date, b: Date): boolean {
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isDateInArray(date: Date, arr: Date[]): boolean {
    // arr is strictly Date[] here
    return arr.some((d) => d instanceof Date && isSameDay(d, date));
}

function formatDate(
    date: Date,
    formatStringFromCaller?: string, // Parameter can be string or undefined
    localeFromCaller?: string,     // Parameter can be string or undefined
): string {
    if (!date) return ""; // Handle null/undefined date input early

    // Use nullish coalescing to ensure these are strings.
    // If the caller provides a string, that's used; otherwise, the default is used.
    const finalFormatString: string = formatStringFromCaller ?? "yyyy-MM-dd";
    const finalLocale: string = localeFromCaller ?? "default";

    try {
        const opts: Intl.DateTimeFormatOptions = {};

        // All '.includes' calls are now on 'finalFormatString', which is explicitly a string.
        if (finalFormatString.includes("yyyy") || finalFormatString.includes("YYYY"))
            opts.year = "numeric";
        if (finalFormatString.includes("MMMM")) opts.month = "long";
        else if (finalFormatString.includes("MMM")) opts.month = "short";
        else if (finalFormatString.includes("MM")) opts.month = "2-digit";
        if (finalFormatString.includes("dd") || finalFormatString.includes("DD"))
            opts.day = "2-digit";
        if (finalFormatString.includes("HH")) opts.hour = "2-digit";
        if (finalFormatString.includes("mm")) opts.minute = "2-digit";
        if (finalFormatString.includes("ss")) opts.second = "2-digit";

        if (Object.keys(opts).length === 0) {
            // Fallback to basic ISO if finalFormatString is not recognized for parts
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0",
            )}-${String(date.getDate()).padStart(2, "0")}`;
        }

        // 'finalLocale' is explicitly a string here.
        // date.toLocaleDateString's first argument can be string | string[] | undefined.
        // Passing a string (finalLocale) is valid.
        return date.toLocaleDateString(finalLocale, opts);
    } catch (e) {
        console.error("Error formatting date:", e);
        // Fallback for invalid date or locale issues during formatting
        return date.toISOString().split("T")[0]!;
    }
}


function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

// Main component
export function DatePicker({
    value,
    onChange,
    label,
    placeholder = "Select date...",
    disabled = false,
    readOnly = false,
    minDate,
    maxDate,
    excludeDates,
    highlightDates,
    dateFormat = "yyyy-MM-dd",
    pickerType = "single",
    calendarIcon,
    clearable = false,
    onClear,
    defaultValue = null,
    open: controlledOpen,
    onOpenChange,
    locale = "default",
    className = "",
    style = {},
    inputClassName = "",
    calendarClassName = "",
    error = false,
    helperText,
}: DatePickerProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const setIsOpen = useCallback(
        (val: boolean) => {
            if (onOpenChange) onOpenChange(val);
            if (controlledOpen === undefined) setUncontrolledOpen(val);
        },
        [onOpenChange, controlledOpen],
    );

    const [internalValue, setInternalValue] = useState<
        Date | Date[] | [Date, Date] | null
    >(() => {
        const initialDataSource = value !== undefined ? value : defaultValue;
        if (pickerType === "multiple") {
            if (Array.isArray(initialDataSource)) {
                const validDates: Date[] = [];
                for (const item of initialDataSource) {
                    if (item instanceof Date) {
                        validDates.push(item);
                    }
                }
                return validDates;
            }
            return [];
        }
        if (pickerType === "range") {
            if (
                Array.isArray(initialDataSource) &&
                initialDataSource.length === 2 &&
                initialDataSource[0] instanceof Date &&
                initialDataSource[1] instanceof Date
            ) {
                return [initialDataSource[0], initialDataSource[1]];
            }
            return null;
        }
        if (initialDataSource instanceof Date) return initialDataSource;
        if (
            Array.isArray(initialDataSource) &&
            initialDataSource.length > 0 &&
            initialDataSource[0] instanceof Date &&
            (pickerType === "single" ||
                pickerType === "month" ||
                pickerType === "year")
        ) {
            return initialDataSource[0];
        }
        return null;
    });

    const [tempRange, setTempRange] = useState<[Date | null, Date | null] | null>(
        () => {
            if (pickerType === "range") {
                const initialDataSource = value !== undefined ? value : defaultValue;
                if (Array.isArray(initialDataSource) && initialDataSource.length === 2) {
                    const [start, end] = initialDataSource;
                    if (!(start instanceof Date && end instanceof Date)) {
                        if (
                            (start instanceof Date || start === null) &&
                            (end instanceof Date || end === null)
                        ) {
                            return [start, end];
                        }
                    }
                }
            }
            return null;
        },
    );

    const initialDateForView =
        (Array.isArray(internalValue) ? internalValue[0] : internalValue) ||
        (pickerType === "range" && tempRange ? tempRange[0] : null) ||
        new Date();

    const [viewMonth, setViewMonth] = useState(initialDateForView.getMonth());
    const [viewYear, setViewYear] = useState(initialDateForView.getFullYear());
    const [mode, setMode] = useState<"calendar" | "month" | "year">("calendar");

    const inputRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const enteredYearFrom = useRef<"calendar" | "month">("calendar");

    useEffect(() => {
        if (value === undefined) return;

        if (pickerType === "multiple") {
            if (Array.isArray(value)) {
                const validDates: Date[] = [];
                for (const item of value) {
                    if (item instanceof Date) {
                        validDates.push(item);
                    }
                }
                setInternalValue(validDates);
            } else {
                setInternalValue([]);
            }
        } else if (pickerType === "range") {
            if (Array.isArray(value) && value.length === 2) {
                const [start, end] = value;
                if (start instanceof Date && end instanceof Date) {
                    setInternalValue([start, end]);
                    setTempRange(null);
                } else if (
                    (start instanceof Date || start === null) &&
                    (end instanceof Date || end === null)
                ) {
                    setInternalValue(null);
                    setTempRange([start, end]);
                } else {
                    setInternalValue(null);
                    setTempRange(null);
                }
            } else if (value === null) {
                setInternalValue(null);
                setTempRange(null);
            } else {
                setInternalValue(null);
                setTempRange(null);
            }
        } else {
            if (value instanceof Date) {
                setInternalValue(value);
            } else if (value === null) {
                setInternalValue(null);
            } else if (
                Array.isArray(value) &&
                value.length > 0 &&
                value[0] instanceof Date
            ) {
                setInternalValue(value[0]);
            } else {
                setInternalValue(null);
            }
        }
    }, [value, pickerType]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClick);
            return () => document.removeEventListener("mousedown", handleClick);
        }
    }, [isOpen, setIsOpen]);

    const handleDateSelect = (date: Date) => {
        if (disabled || readOnly) return;

        let newValue: Date | Date[] | [Date, Date] | null = date;

        if (pickerType === "multiple") {
            const arr = (
                Array.isArray(internalValue) ? internalValue : []
            ).filter((d): d is Date => d instanceof Date); // Ensure arr is Date[]
            if (isDateInArray(date, arr)) {
                newValue = arr.filter((d) => !isSameDay(d, date));
            } else {
                newValue = [...arr, date];
            }
            setInternalValue(newValue);
            onChange(newValue);
        } else if (pickerType === "range") {
            const currentStart = tempRange ? tempRange[0] : null;
            const currentEnd = tempRange ? tempRange[1] : null;

            if (!currentStart || (currentStart && currentEnd)) {
                setTempRange([date, null]);
                setInternalValue(null);
                onChange([date, null]); // Notify partial range selection
            } else {
                let rangeTuple: [Date, Date];
                if (date < currentStart) rangeTuple = [date, currentStart];
                else rangeTuple = [currentStart, date];
                setInternalValue(rangeTuple);
                onChange(rangeTuple);
                setTempRange(null);
                setIsOpen(false);
            }
        } else {
            setInternalValue(newValue);
            onChange(newValue);
            if (pickerType === "single") setIsOpen(false);
        }
    };

    const handleMonthSelect = (monthIndex: number) => {
        if (pickerType === "month") {
            const selectedDate = new Date(viewYear, monthIndex, 1);
            setInternalValue(selectedDate);
            onChange(selectedDate);
            setIsOpen(false);
        } else {
            setViewMonth(monthIndex);
            setMode("calendar");
        }
    };

    const handleYearSelect = (year: number) => {
        if (pickerType === "year") {
            const selectedDate = new Date(year, 0, 1);
            setInternalValue(selectedDate);
            onChange(selectedDate);
            setIsOpen(false);
        } else {
            setViewYear(year);
            setMode(enteredYearFrom.current === "calendar" ? "calendar" : "month");
        }
    };

    const isExcluded = (date: Date): boolean => {
        if (!excludeDates) return false;
        // If excludeDates is an array, it's Date[] due to prop type
        if (Array.isArray(excludeDates)) return isDateInArray(date, excludeDates);
        return excludeDates(date);
    };

    const isHighlighted = (date: Date): boolean => {
        if (!highlightDates) return false;
        // If highlightDates is an array, it's Date[] due to prop type
        if (Array.isArray(highlightDates))
            return isDateInArray(date, highlightDates);
        return highlightDates(date);
    };

    const isDisabledDay = (date: Date): boolean => {
        if (
            minDate &&
            new Date(date.toDateString()) < new Date(minDate.toDateString())
        )
            return true;
        if (
            maxDate &&
            new Date(date.toDateString()) > new Date(maxDate.toDateString())
        )
            return true;
        return isExcluded(date);
    };

    const isSelected = (date: Date): boolean => {
        const currentVal =
            pickerType === "range" && tempRange ? tempRange : internalValue;
        if (!currentVal) return false;

        if (
            (pickerType === "single" ||
                pickerType === "month" ||
                pickerType === "year") &&
            currentVal instanceof Date
        ) {
            return isSameDay(date, currentVal);
        }
        if (pickerType === "multiple" && Array.isArray(currentVal)) {
            // currentVal here is Date[] because internalValue for multiple is Date[]
            return isDateInArray(date, currentVal as Date[]);
        }
        if (pickerType === "range" && Array.isArray(currentVal)) {
            const [start, end] = currentVal as [Date | null, Date | null];
            if (start && isSameDay(date, start)) return true;
            if (end && isSameDay(date, end)) return true;
            if (start && end && date > start && date < end) return true;
        }
        return false;
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
        const days: React.ReactNode[] = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(viewYear, viewMonth, d);
            const selected = isSelected(date);
            const highlighted = isHighlighted(date);
            const disabledDay = isDisabledDay(date);

            const dayStyle: CSSProperties = {};
            let dayClasses =
                "w-8 h-8 flex items-center justify-center rounded-md font-[Orbitron] text-sm transition-all duration-100";

            if (selected) {
                dayClasses += ` bg-[var(--interactive-accentfocus)] text-[var(--text-background-default)] font-black`;
            } else if (highlighted) {
                dayClasses += ` bg-[var(--status-info)] text-[var(--content-primary)]`;
            }

            if (disabledDay) {
                dayClasses += " opacity-40 cursor-not-allowed";
            } else if (!selected) {
                dayClasses +=
                    " hover:bg-[var(--background-default)] cursor-pointer";
            }

            days.push(
                <button
                    key={d}
                    type="button"
                    className={dayClasses}
                    style={dayStyle}
                    onClick={() => !disabledDay && handleDateSelect(date)}
                    disabled={disabledDay}
                    tabIndex={-1}
                    aria-selected={selected}
                    aria-disabled={disabledDay}
                >
                    {d}
                </button>,
            );
        }
        return <div className="grid grid-cols-7 gap-1">{days}</div>;
    };

    const getDisplayValue = (): string => {
        const valToFormat =
            pickerType === "range" && tempRange ? tempRange : internalValue;
        if (!valToFormat) return "";

        if (pickerType === "single" && valToFormat instanceof Date)
            return formatDate(valToFormat, dateFormat, locale);
        if (pickerType === "month" && valToFormat instanceof Date)
            return valToFormat.toLocaleString(locale, {
                month: "long",
                year: "numeric",
            });
        if (pickerType === "year" && valToFormat instanceof Date)
            return valToFormat.toLocaleString(locale, { year: "numeric" });

        if (pickerType === "multiple" && Array.isArray(valToFormat)) {
            // valToFormat is Date[] here
            return (valToFormat as Date[])
                .map((d) => formatDate(d, dateFormat, locale))
                .join(", ");
        }
        if (pickerType === "range" && Array.isArray(valToFormat)) {
            const [start, end] = valToFormat as [Date | null, Date | null];
            if (start instanceof Date && end instanceof Date) {
                return `${formatDate(start, dateFormat, locale)} - ${formatDate(
                    end,
                    dateFormat,
                    locale,
                )}`;
            } else if (start instanceof Date) {
                return formatDate(start, dateFormat, locale);
            } else if (end instanceof Date) {
                return formatDate(end, dateFormat, locale);
            }
        }
        return "";
    };

    const calendarIconNode = calendarIcon || (
        <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            style={{ color: styleMap.content_secondary }}
        >
            <rect
                x="3"
                y="5"
                width="14"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M7 2v2M13 2v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <rect x="7" y="9" width="2" height="2" rx="1" fill="currentColor" />
        </svg>
    );

    const displayedValue = getDisplayValue();

    const mainInputStyle: CSSProperties = {
        backgroundColor: styleMap.surface_default,
        color: styleMap.content_primary,
    };
    if (isOpen) {
        mainInputStyle.borderColor = styleMap.content_primary;
    } else if (error) {
        mainInputStyle.borderColor = styleMap.status_error;
    } else {
        mainInputStyle.borderColor = styleMap.border_default;
    }

    // Ensure picker always opens in date mode
    useEffect(() => {
        if (!isOpen && mode !== "calendar") {
            setMode("calendar");
        }
    }, [isOpen, mode]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const resetValue = pickerType === "multiple" ? [] : null;
        onChange(resetValue as any);
        if (pickerType === 'range') setTempRange([null, null]);
        if (onClear) onClear();
    };

    const showClearButton = clearable && !disabled && !readOnly && internalValue && (!Array.isArray(internalValue) || internalValue.length > 0);

    const renderCalendarHeader = () => (
        <div className="flex items-center justify-between mb-4">
            <button onClick={() => {
                const newMonth = viewMonth === 0 ? 11 : viewMonth - 1;
                const newYear = viewMonth === 0 ? viewYear - 1 : viewYear;
                setViewMonth(newMonth);
                setViewYear(newYear);
            }} className="p-1 rounded-full hover:bg-[var(--background-default)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="flex-grow text-center">
                <button onClick={() => setMode('month')} className="font-bold hover:text-[var(--interactive-accentfocus)]">{new Date(viewYear, viewMonth).toLocaleString(locale, { month: 'long' })}</button>
                <button onClick={() => setMode('year')} className="font-bold hover:text-[var(--interactive-accentfocus)] ml-2">{viewYear}</button>
            </div>
            <button onClick={() => {
                const newMonth = viewMonth === 11 ? 0 : viewMonth + 1;
                const newYear = viewMonth === 11 ? viewYear + 1 : viewYear;
                setViewMonth(newMonth);
                setViewYear(newYear);
            }} className="p-1 rounded-full hover:bg-[var(--background-default)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
        </div>
    );

    const renderWeekdays = () => (
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-bold text-center text-[var(--content-secondary)]">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <div key={day}>{day}</div>)}
        </div>
    );

    const isInRange = (date: Date): boolean => {
        if (pickerType !== 'range' || !tempRange) return false;
        const [start, end] = tempRange;
        return !!(start && end && date > start && date < end);
    }

    const renderMonthPicker = () => (
        <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => handleMonthSelect(i)}
                    className="p-2 rounded hover:bg-[var(--background-default)]"
                >
                    {new Date(viewYear, i).toLocaleString(locale, { month: 'short' })}
                </button>
            ))}
        </div>
    );

    const renderYearPicker = () => {
        const years = [];
        for (let i = viewYear - 5; i <= viewYear + 6; i++) {
            years.push(i);
        }
        return (
            <div className="grid grid-cols-4 gap-2">
                {years.map(year => (
                    <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="p-2 rounded hover:bg-[var(--background-default)]"
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`} style={style}>
            {label && (
                <label
                    className="text-[12px] font-black uppercase tracking-[2px] font-[Orbitron] mb-1"
                    style={
                        error
                            ? { color: styleMap.status_error }
                            : { color: styleMap.content_primary }
                    }
                >
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <div
                    ref={inputRef}
                    className={`w-full flex items-center gap-2 border-2 rounded-[5px] px-[11px] py-[11px] font-[Orbitron] text-[16px] font-extrabold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[${styleMap.interactive_accentfocus}] ${inputClassName} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    style={mainInputStyle}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-label={label || placeholder}
                    onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
                    onKeyDown={e => {
                        if ((e.key === "Enter" || e.key === " ") && !disabled && !readOnly) {
                            setIsOpen(!isOpen);
                        }
                    }}
                >
                    <span className="flex-1 text-left truncate">
                        {displayedValue || (
                            <span style={{ color: styleMap.content_secondary }}>
                                {placeholder}
                            </span>
                        )}
                    </span>
                    {showClearButton && (
                        <button
                            type="button"
                            className={`ml-1 flex items-center justify-center w-5 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-[${styleMap.interactive_accentfocus}] cursor-pointer`}
                            aria-label="Clear date"
                            tabIndex={0}
                            onClick={handleClear}
                        >
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 2L8 8M8 2L2 8"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    )}
                    <button
                        type="button"
                        className="ml-1 flex items-center justify-center"
                        tabIndex={-1}
                        aria-label="Open calendar"
                        disabled={disabled || readOnly}
                        onClick={e => {
                            e.stopPropagation();
                            if (!disabled && !readOnly) setIsOpen(!isOpen);
                        }}
                    >
                        {calendarIconNode}
                    </button>
                </div>
                {isOpen && (
                    <Overlay
                        reference={inputRef.current}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        placement="bottom-start"
                        className={`z-50 p-4 bg-[var(--background-elevated)] border border-[var(--border-default)] rounded-lg shadow-xl ${calendarClassName}`}
                        style={{
                            background: styleMap.surface_default,
                            borderColor: styleMap.border_default,
                        }}
                    >
                        {mode === 'calendar' && <><div className="flex flex-col gap-2">{renderCalendarHeader()}{renderWeekdays()}{renderDays()}</div></>}
                        {mode === 'month' && <><div className="flex flex-col gap-2">{renderCalendarHeader()}{renderMonthPicker()}</div></>}
                        {mode === 'year' && <><div className="flex flex-col gap-2">{renderCalendarHeader()}{renderYearPicker()}</div></>}
                    </Overlay>
                )}
            </div>
            {helperText && (
                <div
                    className="text-xs mt-1 font-[Orbitron]"
                    style={
                        error
                            ? { color: styleMap.status_error }
                            : { color: styleMap.content_secondary }
                    }
                >
                    {helperText}
                </div>
            )}
            {pickerType === "range" && tempRange && (
                <div
                    className="text-xs mt-1 font-[Orbitron]"
                    style={{ color: styleMap.content_secondary }}
                >
                    {tempRange[0]
                        ? formatDate(tempRange[0], dateFormat, locale)
                        : "..."}
                    {" - "}
                    {tempRange[1]
                        ? formatDate(tempRange[1], dateFormat, locale)
                        : "..."}
                </div>
            )}
        </div>
    );
}
