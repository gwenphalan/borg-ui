import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import ReactDOM from "react-dom";
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
    text_background_default: "var(--text-background-default)",
    text_dark: "var(--text-on-primary)",
    text_on_primary: "#000000",
};

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
    locale?: string;
    className?: string;
    style?: React.CSSProperties;
    inputClassName?: string;
    panelClassName?: string;
    error?: boolean;
    helperText?: string;
    portal?: boolean;
    id?: string;
}

function parseToDate(
    val: Date | string | number | null | undefined,
    is12HourFormat?: boolean,
): Date | null {
    if (!val) return null;
    if (val instanceof Date) return new Date(val);
    if (typeof val === "number") return new Date(val);
    if (typeof val === "string") {
        const now = new Date();
        const isoDate = Date.parse(val);
        if (!isNaN(isoDate)) return new Date(isoDate);

        const timeRegex =
            /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i;
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
            } else if (!is12HourFormat && ampm) {
                return null;
            } else {
                if (hours < 0 || hours > 23) return null;
            }
            if (minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59)
                return null;

            const d = new Date(now);
            d.setHours(hours, minutes, seconds, 0);
            return d;
        }
    }
    return null;
}

function formatTime(
    date: Date | null,
    formatStr = "HH:mm",
    showSecondsOverride = false,
): string {
    if (!date) return "";
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const useSeconds =
        showSecondsOverride ||
        formatStr.includes(":ss") ||
        /s{1,2}/.test(formatStr);

    if (formatStr.includes("A") || formatStr.includes("a")) {
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;
        return `${h.toString().padStart(formatStr.includes("hh") ? 2 : 1, "0")}:${m.toString().padStart(2, "0")}${useSeconds ? ":" + s.toString().padStart(2, "0") : ""} ${ampm}`;
    }
    return `${date.getHours().toString().padStart(formatStr.includes("HH") ? 2 : 1, "0")}:${m.toString().padStart(2, "0")}${useSeconds ? ":" + s.toString().padStart(2, "0") : ""}`;
}

function clampTime(date: Date, min?: Date | null, max?: Date | null): Date {
    let timeToClamp = date.getTime();
    if (min) {
        const minComparable = new Date(date);
        minComparable.setHours(
            min.getHours(),
            min.getMinutes(),
            min.getSeconds(),
            min.getMilliseconds(),
        );
        if (date < minComparable) timeToClamp = minComparable.getTime();
    }
    if (max) {
        const maxComparable = new Date(date);
        maxComparable.setHours(
            max.getHours(),
            max.getMinutes(),
            max.getSeconds(),
            max.getMilliseconds(),
        );
        if (date > maxComparable) timeToClamp = maxComparable.getTime();
    }
    return new Date(timeToClamp);
}

function isHourDisabled(
    hour: number,
    is12H: boolean,
    currentAmPm: "AM" | "PM",
    minD?: Date | null,
    maxD?: Date | null,
    disableHoursFn?: (h: number) => boolean,
): boolean {
    if (disableHoursFn?.(hour)) return true;
    if (!minD && !maxD) return false;

    let h24 = hour;
    if (is12H) {
        if (currentAmPm === "AM") h24 = hour === 12 ? 0 : hour;
        else h24 = hour === 12 ? 12 : hour + 12;
    }

    if (minD && h24 < minD.getHours()) return true;
    if (maxD && h24 > maxD.getHours()) return true;
    return false;
}

function isMinuteDisabled(
    minute: number,
    currentHour24: number | null,
    minD?: Date | null,
    maxD?: Date | null,
    disableMinutesFn?: (m: number) => boolean,
): boolean {
    if (disableMinutesFn?.(minute)) return true;
    if (currentHour24 === null || (!minD && !maxD)) return false;

    if (
        minD &&
        currentHour24 === minD.getHours() &&
        minute < minD.getMinutes()
    )
        return true;
    if (
        maxD &&
        currentHour24 === maxD.getHours() &&
        minute > maxD.getMinutes()
    )
        return true;
    return false;
}

function isSecondDisabled(
    second: number,
    currentHour24: number | null,
    currentMinute: number | null,
    minD?: Date | null,
    maxD?: Date | null,
    disableSecondsFn?: (s: number) => boolean,
): boolean {
    if (disableSecondsFn?.(second)) return true;
    if (
        currentHour24 === null ||
        currentMinute === null ||
        (!minD && !maxD)
    )
        return false;

    if (
        minD &&
        currentHour24 === minD.getHours() &&
        currentMinute === minD.getMinutes() &&
        second < minD.getSeconds()
    )
        return true;
    if (
        maxD &&
        currentHour24 === maxD.getHours() &&
        currentMinute === maxD.getMinutes() &&
        second > maxD.getSeconds()
    )
        return true;
    return false;
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
    // locale,
    className = "",
    style = {},
    inputClassName = "",
    panelClassName = "",
    error = false,
    helperText,
    portal = false,
    id,
}: TimePickerProps) {
    const is12Hour = /a|A/.test(format);
    const [internalValue, setInternalValue] = useState<Date | null>(() =>
        parseToDate(value ?? defaultValue, is12Hour),
    );
    const [inputValue, setInputValue] = useState<string>(() =>
        formatTime(internalValue, format, showSeconds),
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isOpen =
        controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const min = useMemo(
        () => parseToDate(minTime, is12Hour),
        [minTime, is12Hour],
    );
    const max = useMemo(
        () => parseToDate(maxTime, is12Hour),
        [maxTime, is12Hour],
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [pendingHour, setPendingHour] = useState<number | null>(null);
    const [pendingMinute, setPendingMinute] = useState<number | null>(null);
    const [pendingSecond, setPendingSecond] = useState<number | null>(null);
    const [pendingAmPm, setPendingAmPm] = useState<"AM" | "PM">("AM");

    const [focusedColumn, setFocusedColumn] = useState<number>(0);
    const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);

    const hoursArray = useMemo( // Renamed to avoid conflict in setIsOpen
        () =>
            is12Hour
                ? Array.from({ length: 12 }, (_, i) => i + 1)
                : Array.from({ length: 24 }, (_, i) => i),
        [is12Hour],
    );
    const minutesArray = useMemo( // Renamed
        () => Array.from({ length: 60 / step }, (_, i) => i * step),
        [step],
    );
    const secondsArray = useMemo(
        () => Array.from({ length: 60 }, (_, i) => i),
        [],
    );
    const ampmOptions = useMemo(() => ["AM", "PM"] as const, []);

    const [lastNavigationMethod, setLastNavigationMethod] = useState<"keyboard" | "mouse">("keyboard");

    const setIsOpen = useCallback(
        (newOpenState: boolean) => {
            if (disabled || readOnly) return;
            if (onOpenChange) onOpenChange(newOpenState);
            if (controlledOpen === undefined) setUncontrolledOpen(newOpenState);

            if (newOpenState) {
                const valToSync =
                    internalValue ??
                    (defaultValue
                        ? parseToDate(defaultValue, is12Hour)
                        : new Date());

                let pAmPm: "AM" | "PM" = "AM";
                let pHour: number | null = null;
                let pMinute: number | null = null;
                let pSecond: number | null = null;

                if (valToSync) {
                    let h = valToSync.getHours();
                    pMinute = valToSync.getMinutes();
                    if (showSeconds) pSecond = valToSync.getSeconds();
                    if (is12Hour) {
                        pAmPm = h >= 12 ? "PM" : "AM";
                        h = h % 12;
                        if (h === 0) h = 12;
                    }
                    pHour = h;
                } else {
                    pHour = is12Hour ? 12 : 0;
                    pMinute = 0;
                    pSecond = 0;
                    pAmPm = "AM";
                }
                setPendingHour(pHour);
                setPendingMinute(pMinute);
                setPendingSecond(pSecond);
                setPendingAmPm(pAmPm);

                const initialFocusedCol = 0;
                let initialFocusedIdx = 0;
                if (pHour !== null) {
                    const hourIdx = hoursArray.findIndex(hr => hr === pHour);
                    if (hourIdx !== -1) initialFocusedIdx = hourIdx;
                }
                setFocusedColumn(initialFocusedCol);
                setFocusedItemIndex(initialFocusedIdx);

            }
        },
        [
            onOpenChange,
            controlledOpen,
            disabled,
            readOnly,
            internalValue,
            defaultValue,
            is12Hour,
            showSeconds,
            hoursArray // Added hoursArray dependency
        ],
    );

    useEffect(() => {
        const newDateVal = parseToDate(value, is12Hour);
        setInternalValue(newDateVal);
        setInputValue(formatTime(newDateVal, format, showSeconds));
    }, [value, format, showSeconds, is12Hour]);

    const commitPendingTime = useCallback(() => {
        if (
            pendingHour === null ||
            pendingMinute === null ||
            (showSeconds && pendingSecond === null)
        ) {
            return internalValue;
        }

        let h = pendingHour;
        const m = pendingMinute;
        const s = showSeconds ? pendingSecond ?? 0 : 0;

        if (is12Hour) {
            if (pendingAmPm === "AM") h = h === 12 ? 0 : h;
            else h = h === 12 ? 12 : h + 12;
        }

        const newDate = internalValue ? new Date(internalValue) : new Date();
        newDate.setHours(h, m, s, 0);
        const clampedDate = clampTime(newDate, min, max);

        setInternalValue(clampedDate);
        onChange(clampedDate);
        setInputValue(formatTime(clampedDate, format, showSeconds));
        return clampedDate;
    }, [
        pendingHour,
        pendingMinute,
        pendingSecond,
        pendingAmPm,
        is12Hour,
        showSeconds,
        internalValue,
        min,
        max,
        onChange,
        format,
    ]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                if (isOpen) {
                    commitPendingTime();
                    setIsOpen(false);
                }
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && isOpen) {
                if (internalValue) {
                    let h = internalValue.getHours();
                    if (is12Hour) {
                        setPendingAmPm(h >= 12 ? "PM" : "AM");
                        h = h % 12;
                        if (h === 0) h = 12;
                    }
                    setPendingHour(h);
                    setPendingMinute(internalValue.getMinutes());
                    if (showSeconds)
                        setPendingSecond(internalValue.getSeconds());
                }
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, setIsOpen, commitPendingTime, internalValue, is12Hour, showSeconds]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        const parsedDate = parseToDate(inputValue, is12Hour);
        if (parsedDate) {
            const clampedDate = clampTime(parsedDate, min, max);
            setInternalValue(clampedDate);
            onChange(clampedDate);
            setInputValue(formatTime(clampedDate, format, showSeconds));
            let h = clampedDate.getHours();
            if (is12Hour) {
                setPendingAmPm(h >= 12 ? "PM" : "AM");
                h = h % 12;
                if (h === 0) h = 12;
            }
            setPendingHour(h);
            setPendingMinute(clampedDate.getMinutes());
            if (showSeconds) setPendingSecond(clampedDate.getSeconds());
        } else {
            setInputValue(formatTime(internalValue, format, showSeconds));
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleInputBlur();
            setIsOpen(false);
        } else if (e.key === "ArrowDown" && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInternalValue(null);
        setInputValue("");
        onChange(null);
        setPendingHour(null);
        setPendingMinute(null);
        setPendingSecond(null);
        if (onClear) onClear();
        setIsOpen(false);
        inputRef.current?.focus();
    };


    const hourColRef = useRef<HTMLDivElement>(null);
    const minuteColRef = useRef<HTMLDivElement>(null);
    const secondColRef = useRef<HTMLDivElement>(null);
    const ampmColRef = useRef<HTMLDivElement>(null);

    const itemRefs = useRef<Array<Array<HTMLButtonElement | null>>>([
        [], // hours
        [], // minutes
        [], // seconds
        [], // ampm
    ]);

    const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        setLastNavigationMethod("keyboard");
        const columnsConfig = [
            { data: hoursArray, visible: true, type: "hour" },
            { data: minutesArray, visible: true, type: "minute" },
            { data: secondsArray, visible: showSeconds, type: "second" },
            { data: ampmOptions, visible: is12Hour, type: "ampm" },
        ];
        const visibleColumns = columnsConfig.filter((col) => col.visible);

        if (
            visibleColumns.length === 0 ||
            focusedColumn >= visibleColumns.length ||
            !visibleColumns[focusedColumn]
        ) {
            return;
        }

        const currentColumn = visibleColumns[focusedColumn]!;
        const currentColumnData = currentColumn.data;
        const currentItemCount = currentColumnData.length;

        let newFocusedItemIndex = focusedItemIndex;
        let newFocusedColumn = focusedColumn;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                newFocusedItemIndex = Math.min(
                    focusedItemIndex + 1,
                    currentItemCount - 1,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                newFocusedItemIndex = Math.max(focusedItemIndex - 1, 0);
                break;
            case "ArrowRight":
                e.preventDefault();
                if (focusedColumn < visibleColumns.length - 1) {
                    newFocusedColumn = focusedColumn + 1;
                    newFocusedItemIndex = 0; // Reset index in new column
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (focusedColumn > 0) {
                    newFocusedColumn = focusedColumn - 1;
                    newFocusedItemIndex = 0; // Reset index in new column
                }
                break;
            case "Enter":
            case " ": // Space
                e.preventDefault();
                if (
                    focusedItemIndex >= 0 &&
                    focusedItemIndex < currentItemCount &&
                    visibleColumns[focusedColumn]
                ) {
                    const selectedVal =
                        currentColumnData[focusedItemIndex];
                    const columnType = visibleColumns[focusedColumn]!.type;

                    if (columnType === "hour")
                        setPendingHour(selectedVal as number);
                    else if (columnType === "minute")
                        setPendingMinute(selectedVal as number);
                    else if (columnType === "second")
                        setPendingSecond(selectedVal as number);
                    else if (columnType === "ampm")
                        setPendingAmPm(selectedVal as "AM" | "PM");
                }
                break;
            default:
                return;
        }
        setFocusedColumn(newFocusedColumn);
        setFocusedItemIndex(newFocusedItemIndex);
    };

    // Scroll focused item into view (for keyboard nav and clicks)
    useEffect(() => {
        if (!isOpen || focusedColumn < 0 || focusedItemIndex < 0) return;
        if (lastNavigationMethod !== "keyboard") return;

        const visibleColumnsConfig = [
            { data: hoursArray, ref: hourColRef, visible: true, type: "hour" },
            { data: minutesArray, ref: minuteColRef, visible: true, type: "minute" },
            { data: secondsArray, ref: secondColRef, visible: showSeconds, type: "second" },
            { data: ampmOptions, ref: ampmColRef, visible: is12Hour, type: "ampm" },
        ];
        const currentVisibleColumnConfig = visibleColumnsConfig.filter(c => c.visible)[focusedColumn];

        if (!currentVisibleColumnConfig) return;

        let itemRefArrayIndex = -1;
        if (currentVisibleColumnConfig.type === "hour") itemRefArrayIndex = 0;
        else if (currentVisibleColumnConfig.type === "minute") itemRefArrayIndex = 1;
        else if (currentVisibleColumnConfig.type === "second") itemRefArrayIndex = 2;
        else if (currentVisibleColumnConfig.type === "ampm") itemRefArrayIndex = 3;

        if (itemRefArrayIndex === -1) return;

        const itemRef = itemRefs.current[itemRefArrayIndex]?.[focusedItemIndex];
        const colRef = currentVisibleColumnConfig.ref;

        if (colRef?.current && itemRef) {
            const col = colRef.current;
            const itemRect = itemRef.getBoundingClientRect();
            const colRect = col.getBoundingClientRect();
            // Center the item
            col.scrollTop = itemRef.offsetTop - col.offsetTop - (colRect.height / 2) + (itemRect.height / 2);
        }
    }, [isOpen, focusedColumn, focusedItemIndex, showSeconds, is12Hour, hoursArray, minutesArray, secondsArray, ampmOptions, lastNavigationMethod]);

    // Scroll to pending values on initial open or when pending values change externally
    useEffect(() => {
        if (!isOpen) return;
        if (lastNavigationMethod === "mouse") return;

        const scrollToPending = (
            colRef: React.RefObject<HTMLDivElement | null>,
            items: ReadonlyArray<number | string>,
            pendingValue: number | string | null,
            itemRefsSubArray: (HTMLButtonElement | null)[] | undefined,
        ) => {
            if (!colRef?.current || pendingValue === null || !itemRefsSubArray)
                return;
            const idx = items.findIndex((item) => item === pendingValue);

            if (idx !== -1 && itemRefsSubArray[idx]) {
                const itemElement = itemRefsSubArray[idx]!;
                const col = colRef.current;
                const itemRect = itemElement.getBoundingClientRect();
                const colRect = col.getBoundingClientRect();
                // Only scroll if not already centered or mostly visible
                const itemCenter = itemElement.offsetTop - col.offsetTop + itemRect.height / 2;
                const viewportCenter = col.scrollTop + colRect.height / 2;
                if (Math.abs(itemCenter - viewportCenter) > itemRect.height) { // Heuristic: if more than one item height away from center
                    col.scrollTop =
                        itemElement.offsetTop -
                        col.offsetTop -
                        colRect.height / 2 +
                        itemRect.height / 2;
                }
            }
        };

        scrollToPending(hourColRef, hoursArray, pendingHour, itemRefs.current[0]);
        scrollToPending(
            minuteColRef,
            minutesArray,
            pendingMinute,
            itemRefs.current[1],
        );
        if (showSeconds) {
            scrollToPending(
                secondColRef,
                secondsArray,
                pendingSecond,
                itemRefs.current[2],
            );
        }
        if (is12Hour) {
            scrollToPending(
                ampmColRef,
                ampmOptions,
                pendingAmPm,
                itemRefs.current[showSeconds ? 3 : 2],
            );
        }
    }, [ // This effect should primarily react to pending values changing
        isOpen, pendingHour, pendingMinute, pendingSecond, pendingAmPm,
        hoursArray, minutesArray, secondsArray, ampmOptions, showSeconds, is12Hour, lastNavigationMethod
    ]);


    let outlineColor = styleMap.border_default;
    let currentLabelColor = styleMap.content_primary;
    if (isOpen) {
        outlineColor = styleMap.content_primary;
        currentLabelColor = styleMap.content_primary;
    } else if (error) {
        outlineColor = styleMap.status_error;
        currentLabelColor = styleMap.status_error;
    }

    let currentInputColor = styleMap.content_primary;
    if (error) currentInputColor = styleMap.status_error;

    const panelContent = isOpen && (
        <div
            ref={panelRef}
            className={`absolute z-50 mt-2 left-0 border rounded-lg shadow-lg p-3 ${panelClassName}`}
            style={{
                backgroundColor: styleMap.background_elevated,
                borderColor: styleMap.border_default,
                width: showSeconds
                    ? is12Hour
                        ? "290px"
                        : "220px"
                    : is12Hour
                        ? "220px"
                        : "150px",
            }}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label={label || "Time selection panel"}
        >
            <div className="flex justify-between gap-1">
                {/* Hours Column */}
                <div
                    className="flex-1 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--content-secondary)] scrollbar-track-[var(--surface-default)] pr-1"
                    ref={hourColRef}
                >
                    <div
                        className="sticky top-0 z-10 bg-[var(--background-elevated)] text-xs font-black font-[Orbitron] text-center py-1"
                        style={{ color: styleMap.content_secondary }}
                    >
                        Hour
                    </div>
                    {hoursArray.map((h, idx) => {
                        const isDisabled = isHourDisabled(
                            h,
                            is12Hour,
                            pendingAmPm,
                            min,
                            max,
                            disableHours,
                        );
                        const isSelected = pendingHour === h;
                        const isFocused =
                            focusedColumn === 0 && focusedItemIndex === idx;
                        return (
                            <button
                                key={`hour-${h}`}
                                ref={(el) => {
                                    if (itemRefs.current[0])
                                        itemRefs.current[0][idx] = el;
                                }}
                                type="button"
                                className={`w-full py-1 px-2 my-0.5 rounded font-[Orbitron] text-sm text-center transition-all duration-100 
                                    ${isSelected ? "bg-[var(--content-primary)] text-[var(--text-dark)] font-black" : "text-[var(--content-primary)]"}
                                    ${isFocused ? "ring-2 ring-[var(--interactive-accentfocus)]" : ""}
                                    ${!isDisabled && !isSelected ? "hover:bg-[var(--interactive-accentfocus)] hover:text-[var(--background-default)]" : ""}
                                    ${isDisabled ? "opacity-40 cursor-not-allowed !bg-transparent !text-[var(--content-secondary)]" : "cursor-pointer"}`}
                                onClick={() => {
                                    setLastNavigationMethod("mouse");
                                    if (!isDisabled) {
                                        setPendingHour(h);
                                        setFocusedColumn(0);
                                        setFocusedItemIndex(idx);
                                    }
                                }}
                                disabled={isDisabled}
                                aria-selected={isSelected}
                                aria-disabled={isDisabled}
                                tabIndex={-1}
                            >
                                {h.toString().padStart(2, "0")}
                            </button>
                        );
                    })}
                </div>
                {/* Minutes Column */}
                <div
                    className="flex-1 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--content-secondary)] scrollbar-track-[var(--surface-default)] px-1"
                    ref={minuteColRef}
                >
                    <div
                        className="sticky top-0 z-10 bg-[var(--background-elevated)] text-xs font-black font-[Orbitron] text-center py-1"
                        style={{ color: styleMap.content_secondary }}
                    >
                        Min
                    </div>
                    {minutesArray.map((m, idx) => {
                        const currentPendingHour24 =
                            pendingHour !== null
                                ? is12Hour
                                    ? pendingAmPm === "AM"
                                        ? pendingHour === 12
                                            ? 0
                                            : pendingHour
                                        : pendingHour === 12
                                            ? 12
                                            : pendingHour + 12
                                    : pendingHour
                                : null;
                        const isDisabled = isMinuteDisabled(
                            m,
                            currentPendingHour24,
                            min,
                            max,
                            disableMinutes,
                        );
                        const isSelected = pendingMinute === m;
                        const isFocused =
                            focusedColumn === 1 && focusedItemIndex === idx;
                        return (
                            <button
                                key={`minute-${m}`}
                                ref={(el) => {
                                    if (itemRefs.current[1])
                                        itemRefs.current[1][idx] = el;
                                }}
                                type="button"
                                className={`w-full py-1 px-2 my-0.5 rounded font-[Orbitron] text-sm text-center transition-all duration-100
                                    ${isSelected ? "bg-[var(--content-primary)] text-[var(--text-dark)] font-black" : "text-[var(--content-primary)]"}
                                    ${isFocused ? "ring-2 ring-[var(--interactive-accentfocus)]" : ""}
                                    ${!isDisabled && !isSelected ? "hover:bg-[var(--interactive-accentfocus)] hover:text-[var(--background-default)]" : ""}
                                    ${isDisabled ? "opacity-40 cursor-not-allowed !bg-transparent !text-[var(--content-secondary)]" : "cursor-pointer"}`}
                                onClick={() => {
                                    setLastNavigationMethod("mouse");
                                    if (!isDisabled) {
                                        setPendingMinute(m);
                                        setFocusedColumn(1);
                                        setFocusedItemIndex(idx);
                                    }
                                }}
                                disabled={isDisabled}
                                aria-selected={isSelected}
                                aria-disabled={isDisabled}
                                tabIndex={-1}
                            >
                                {m.toString().padStart(2, "0")}
                            </button>
                        );
                    })}
                </div>
                {/* Seconds Column (optional) */}
                {showSeconds && (
                    <div
                        className="flex-1 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--content-secondary)] scrollbar-track-[var(--surface-default)] pl-1"
                        ref={secondColRef}
                    >
                        <div
                            className="sticky top-0 z-10 bg-[var(--background-elevated)] text-xs font-black font-[Orbitron] text-center py-1"
                            style={{ color: styleMap.content_secondary }}
                        >
                            Sec
                        </div>
                        {secondsArray.map((s, idx) => {
                            const currentPendingHour24 =
                                pendingHour !== null
                                    ? is12Hour
                                        ? pendingAmPm === "AM"
                                            ? pendingHour === 12
                                                ? 0
                                                : pendingHour
                                            : pendingHour === 12
                                                ? 12
                                                : pendingHour + 12
                                        : pendingHour
                                    : null;
                            const isDisabled = isSecondDisabled(
                                s,
                                currentPendingHour24,
                                pendingMinute,
                                min,
                                max,
                                disableSeconds,
                            );
                            const isSelected = pendingSecond === s;
                            const isFocused =
                                focusedColumn === 2 &&
                                focusedItemIndex === idx;
                            return (
                                <button
                                    key={`second-${s}`}
                                    ref={(el) => {
                                        if (itemRefs.current[2])
                                            itemRefs.current[2][idx] = el;
                                    }}
                                    type="button"
                                    className={`w-full py-1 px-2 my-0.5 rounded font-[Orbitron] text-sm text-center transition-all duration-100
                                        ${isSelected ? "bg-[var(--content-primary)] text-[var(--text-dark)] font-black" : "text-[var(--content-primary)]"}
                                        ${isFocused ? "ring-2 ring-[var(--interactive-accentfocus)]" : ""}
                                        ${!isDisabled && !isSelected ? "hover:bg-[var(--interactive-accentfocus)] hover:text-[var(--background-default)]" : ""}
                                        ${isDisabled ? "opacity-40 cursor-not-allowed !bg-transparent !text-[var(--content-secondary)]" : "cursor-pointer"}`}
                                    onClick={() => {
                                        setLastNavigationMethod("mouse");
                                        if (!isDisabled) {
                                            setPendingSecond(s);
                                            setFocusedColumn(2);
                                            setFocusedItemIndex(idx);
                                        }
                                    }}
                                    disabled={isDisabled}
                                    aria-selected={isSelected}
                                    aria-disabled={isDisabled}
                                    tabIndex={-1}
                                >
                                    {s.toString().padStart(2, "0")}
                                </button>
                            );
                        })}
                    </div>
                )}
                {/* AM/PM Column (12-hour only) */}
                {is12Hour && (
                    <div
                        className="flex-1 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--content-secondary)] scrollbar-track-[var(--surface-default)] pl-1"
                        ref={ampmColRef}
                    >
                        <div
                            className="sticky top-0 z-10 bg-[var(--background-elevated)] text-xs font-black font-[Orbitron] text-center py-1"
                            style={{ color: styleMap.content_secondary }}
                        >
                            AM/PM
                        </div>
                        {ampmOptions.map((period, idx) => {
                            const isSelected = pendingAmPm === period;
                            const ampmColumnIndexInVisible = showSeconds ? 3 : 2;
                            const ampmItemRefIndex = 3; // Always use 3 for itemRefs.current for AM/PM
                            const isFocused =
                                focusedColumn === ampmColumnIndexInVisible &&
                                focusedItemIndex === idx;
                            return (
                                <button
                                    key={period}
                                    ref={(el) => {
                                        if (
                                            itemRefs.current[ampmItemRefIndex]
                                        )
                                            itemRefs.current[
                                                ampmItemRefIndex
                                            ][idx] = el;
                                    }}
                                    type="button"
                                    className={`w-full py-1 px-2 my-0.5 rounded font-[Orbitron] text-sm text-center transition-all duration-100
                                        ${isSelected ? "bg-[var(--content-primary)] text-[var(--text-dark)] font-black" : "text-[var(--content-primary)]"}
                                        ${isFocused ? "ring-2 ring-[var(--interactive-accentfocus)]" : ""}
                                        ${!isSelected ? "hover:bg-[var(--interactive-accentfocus)] hover:text-[var(--background-default)]" : ""}
                                        cursor-pointer`}
                                    onClick={() => {
                                        setLastNavigationMethod("mouse");
                                        setPendingAmPm(period as "AM" | "PM");
                                        setFocusedColumn(ampmColumnIndexInVisible);
                                        setFocusedItemIndex(idx);
                                    }}
                                    aria-selected={isSelected}
                                    tabIndex={-1}
                                >
                                    {period}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`flex flex-col gap-1 ${className}`} style={style} id={id}>
            {label && (
                <label
                    htmlFor={id ? `${id}-input` : undefined}
                    className="text-[12px] font-black uppercase tracking-[2px] font-[Orbitron] mb-1"
                    style={{ color: currentLabelColor }}
                >
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <div
                    className={`w-full flex items-center border-2 rounded-[5px] font-[Orbitron] text-[16px] font-extrabold transition-all duration-150 ${inputClassName} ${disabled ? "opacity-50 bg-[var(--surface-default)]" : "bg-[var(--surface-default)]"}`}
                    style={{
                        borderColor: outlineColor,
                    }}
                >
                    <input
                        id={id ? `${id}-input` : undefined}
                        type="text"
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        className="flex-1 px-[11px] py-[11px] bg-transparent focus:outline-none truncate"
                        style={{ color: currentInputColor }}
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                        aria-label={label || placeholder}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled && !readOnly) setIsOpen(true);
                        }}
                    />
                    {clearable && inputValue && !disabled && !readOnly && (
                        <button
                            type="button"
                            className="ml-1 mr-1 flex items-center justify-center w-5 h-5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--interactive-accentfocus)] focus:border-[var(--interactive-accentfocus)] active:border-[var(--interactive-accentfocus)] cursor-pointer transition-colors"
                            aria-label="Clear time"
                            onClick={handleClear}
                            tabIndex={0}
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
                                    stroke={styleMap.content_primary}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    )}
                    <span
                        className="px-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled && !readOnly) setIsOpen(!isOpen);
                        }}
                        aria-label="Toggle time panel"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                if (!disabled && !readOnly)
                                    setIsOpen(!isOpen);
                            }
                        }}
                    >
                        <Icon
                            name="clock"
                            size={20}
                            color={styleMap.content_secondary}
                        />
                    </span>
                </div>
                {portal && typeof document !== "undefined"
                    ? ReactDOM.createPortal(panelContent, document.body)
                    : panelContent}
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
        </div>
    );
}
