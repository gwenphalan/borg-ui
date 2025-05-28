import React, { useState, useMemo, useCallback } from "react";
import { Icon } from "../icon/icon";
import { Checkbox } from "../checkbox/checkbox";

export interface TableColumn<T> {
    key: keyof T | string;
    label: string | React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    render?: (row: T, globalRowIdx: number) => React.ReactNode;
    align?: "left" | "center" | "right";
    minWidth?: number;
    headerClass?: string;
    cellClass?: string;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    pageSize?: number;
    filterText?: string;
    onFilterTextChange?: (text: string) => void;
    showPagination?: boolean;
    className?: string;
    selectable?: boolean;
    selectedRows?: number[];
    onSelectedRowsChange?: (selected: number[]) => void;
}

const styleMap: Record<string, string> = {
    background_default: "var(--background-default)",
    background_elevated: "var(--background-elevated)",
    border_default: "var(--border-default)",
    content_primary: "var(--content-primary)",
    content_secondary: "var(--content-secondary)",
    interactive_accentfocus: "var(--interactive-accentfocus)",
    // ... other styles if needed by the component
};

function getCellValue<T extends Record<string, unknown>>(
    row: T,
    key: string,
): unknown {
    if (!key) return undefined;
    if (key.includes(".")) {
        const parts = key.split('.');
        let currentValue: unknown = row;
        for (const part of parts) {
            if (currentValue && typeof currentValue === 'object' && part in currentValue) {
                currentValue = (currentValue as Record<string, unknown>)[part];
            } else {
                return undefined;
            }
        }
        return currentValue;
    }
    if (key in row) {
        return row[key];
    }
    return undefined;
}

function handleRowSelectionChangeHelper(
    globalRowIndex: number,
    newCheckedState: boolean,
    currentSelectedRows: number[],
    onSelectedRowsChangeCallback: (newSelection: number[]) => void,
) {
    if (newCheckedState) {
        onSelectedRowsChangeCallback(
            Array.from(new Set([...currentSelectedRows, globalRowIndex])),
        );
    } else {
        onSelectedRowsChangeCallback(
            currentSelectedRows.filter((i) => i !== globalRowIndex),
        );
    }
}

export function Table<T extends Record<string, unknown>>({
    columns,
    data,
    pageSize = 10,
    filterText = "",
    onFilterTextChange,
    showPagination = true,
    className = "",
    selectable = false,
    selectedRows = [],
    onSelectedRowsChange,
}: TableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const dataWithGlobalIndices = useMemo(
        () => data.map((row, index) => ({ ...row, __globalIndex: index })),
        [data],
    );

    const filteredData = useMemo(() => {
        if (!filterText) return dataWithGlobalIndices;
        const lower = filterText.toLowerCase();
        return dataWithGlobalIndices.filter((row) =>
            columns.some((col) => {
                const value = getCellValue(row, col.key as string);
                if (value != null) {
                    return String(value).toLowerCase().includes(lower);
                }
                return false;
            }),
        );
    }, [dataWithGlobalIndices, filterText, columns]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        const col = columns.find((c) => c.key === sortKey);
        if (!col) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = getCellValue(a, col.key as string);
            const bVal = getCellValue(b, col.key as string);
            if (aVal === bVal) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortDir === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [filteredData, sortKey, sortDir, columns]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return sortedData;
        const start = (page - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize, showPagination]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (!onSelectedRowsChange) return;
            const currentPageGlobalIndices = paginatedData.map(
                (row) => row.__globalIndex,
            );
            if (checked) {
                onSelectedRowsChange(
                    Array.from(new Set([...selectedRows, ...currentPageGlobalIndices])),
                );
            } else {
                onSelectedRowsChange(
                    selectedRows.filter((idx) => !currentPageGlobalIndices.includes(idx)),
                );
            }
        },
        [onSelectedRowsChange, paginatedData, selectedRows],
    );

    const allOnPageSelected = useMemo(
        () =>
            paginatedData.length > 0 &&
            paginatedData.every((row) => selectedRows.includes(row.__globalIndex)),
        [paginatedData, selectedRows],
    );

    const someOnPageSelected = useMemo(
        () =>
            paginatedData.length > 0 &&
            paginatedData.some((row) => selectedRows.includes(row.__globalIndex)),
        [paginatedData, selectedRows],
    );

    const displayColumns = useMemo(() => {
        const baseCols = selectable
            ? [
                {
                    key: "__select__",
                    label: (
                        <Checkbox
                            checked={allOnPageSelected}
                            indeterminate={someOnPageSelected && !allOnPageSelected}
                            onChange={(newCheckedState) => {
                                handleSelectAll(newCheckedState);
                            }}
                            aria-label="Select all rows on current page"
                        />
                    ),
                    align: "center" as const,
                    // MODIFICATION: Rely on <col> for width, these classes for padding/alignment
                    headerClass: "px-0 text-center",
                    cellClass: "px-0 text-center",
                    sortable: false,
                    render: (row: T & { __globalIndex: number }) => (
                        <Checkbox
                            checked={selectedRows.includes(row.__globalIndex)}
                            onChange={(newCheckedState) => {
                                if (onSelectedRowsChange) {
                                    handleRowSelectionChangeHelper(
                                        row.__globalIndex,
                                        newCheckedState,
                                        selectedRows,
                                        onSelectedRowsChange,
                                    );
                                }
                            }}
                            aria-label={`Select row ${row.__globalIndex + 1}`}
                        />
                    ),
                } as TableColumn<T & { __globalIndex: number }>,
                ...columns,
            ]
            : columns;
        return baseCols as TableColumn<T & { __globalIndex?: number }>[];
    }, [
        selectable,
        columns,
        selectedRows,
        onSelectedRowsChange,
        allOnPageSelected,
        someOnPageSelected,
        handleSelectAll,
    ]);

    function handleSort(col: TableColumn<T & { __globalIndex?: number }>) {
        if (!col.sortable || col.key === "__select__") return;
        if (sortKey === col.key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(col.key as string);
            setSortDir("asc");
        }
    }

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        onFilterTextChange?.(e.target.value);
        setPage(1);
    }

    function handlePageChange(newPage: number) {
        if (newPage >= 1 && newPage <= (totalPages || 1)) {
            setPage(newPage);
        }
    }

    const getHeaderContentAlignmentClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center":
                return "justify-center";
            case "right":
                return "justify-end";
            default:
                return "justify-start";
        }
    };

    return (
        <div
            className={["w-full", className].join(" ")}
            style={{ color: styleMap.content_primary }}
        >
            <div className="flex items-center justify-between mb-2">
                {onFilterTextChange && (
                    <input
                        type="text"
                        value={filterText}
                        onChange={handleFilterChange}
                        placeholder="Filter..."
                        className="px-3 py-1.5 rounded border-2 border-[var(--border-default)] bg-[var(--background-elevated)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--content_primary)]"
                        style={{ color: styleMap.content_primary }}
                    />
                )}
                {showPagination && totalPages > 0 && (
                    <div className="flex items-center gap-2">
                        <button
                            className="px-2 py-1 rounded border-2 border-[var(--border-default)] bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            aria-label="Previous page"
                        >
                            Prev
                        </button>
                        <span className="text-xs">
                            Page {page} / {totalPages || 1}
                        </span>
                        <button
                            className="px-2 py-1 rounded border-2 border-[var(--border-default)] bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages || totalPages === 0}
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto rounded-lg border-2 border-[var(--border-default)] bg-[var(--background-default)]">
                <table className="min-w-full text-sm table-fixed">
                    <colgroup>
                        {displayColumns.map((col) => (
                            <col
                                key={col.key as string}
                                style={{
                                    width:
                                        col.key === "__select__"
                                            ? "40px" // Primary width determinant for select column
                                            : col.minWidth
                                                ? `${col.minWidth}px`
                                                : "120px",
                                }}
                            />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
                            {displayColumns.map((col, colIndex) => {
                                const isFirstDataColumnAfterSelect = selectable && colIndex === 1;
                                const defaultHeaderPadding = isFirstDataColumnAfterSelect
                                    ? "pl-1 pr-2 py-2"
                                    : "px-2 py-2";

                                return (
                                    <th
                                        key={col.key as string}
                                        className={[
                                            col.headerClass || defaultHeaderPadding,
                                            "border-b border-[var(--border-default)] font-semibold select-none group",
                                            col.sortable && col.key !== "__select__"
                                                ? "cursor-pointer"
                                                : "cursor-default",
                                            col.align ? `text-${col.align}` : "text-left",
                                        ].join(" ")}
                                        onClick={() => handleSort(col)}
                                        style={{ background: styleMap.background_elevated }}
                                        aria-sort={
                                            col.sortable &&
                                                col.key !== "__select__" &&
                                                sortKey === col.key
                                                ? sortDir === "asc"
                                                    ? "ascending"
                                                    : "descending"
                                                : undefined
                                        }
                                        tabIndex={
                                            col.sortable && col.key !== "__select__" ? 0 : -1
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                (e.key === "Enter" || e.key === " ") &&
                                                col.sortable &&
                                                col.key !== "__select__"
                                            ) {
                                                e.preventDefault();
                                                handleSort(col);
                                            }
                                        }}
                                    >
                                        <span
                                            className={`flex items-center gap-1 ${getHeaderContentAlignmentClass(col.align)}`}
                                        >
                                            {col.label}
                                            {col.sortable &&
                                                col.key !== "__select__" &&
                                                sortKey === col.key && (
                                                    <Icon
                                                        name="chevron-down"
                                                        size={16}
                                                        className={
                                                            sortDir === "asc" ? "transform rotate-180" : ""
                                                        }
                                                    />
                                                )}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={displayColumns.length}
                                    className="text-center py-6 text-[var(--content-secondary)]"
                                >
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row) => (
                                <tr
                                    key={row.__globalIndex}
                                    className="even:bg-[var(--background-elevated)] hover:bg-[var(--surface-default)] transition-colors"
                                >
                                    {displayColumns.map((col, colIndex) => {
                                        const isFirstDataColumnAfterSelect = selectable && colIndex === 1;
                                        const defaultCellPadding = isFirstDataColumnAfterSelect
                                            ? "pl-1 pr-2 py-2"
                                            : "px-2 py-2";
                                        const cellValue = getCellValue(row, col.key as string);

                                        return (
                                            <td
                                                key={col.key as string}
                                                className={[
                                                    col.cellClass || defaultCellPadding,
                                                    "border-b border-[var(--border-default)]",
                                                    col.align ? `text-${col.align}` : "text-left",
                                                ].join(" ")}
                                                style={{ color: styleMap.content_primary }}
                                            >
                                                {col.render
                                                    ? col.render(row, row.__globalIndex)
                                                    : cellValue === true
                                                        ? <Icon name="check" size={18} color={styleMap.content_primary} />
                                                        : cellValue === false
                                                            ? ""
                                                            : (cellValue as React.ReactNode)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
