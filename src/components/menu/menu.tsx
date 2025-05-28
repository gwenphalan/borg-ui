import React, { useState, useRef, useEffect } from "react";
import type { ReactNode, MouseEvent } from "react";
import { Icon } from "../icon/icon";

// Theming style map (required by project conventions)
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
};

// Menu item interface
export interface MenuItem {
    label: string;
    href?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    icon?: ReactNode | string;
    disabled?: boolean;
    isActive?: boolean;
    children?: MenuItem[];
    className?: string;
    divider?: boolean;
    customComponent?: ReactNode;
    align?: 'left' | 'right'; // Optional: for left/right grouping
}

export interface MenuProps {
    items: MenuItem[];
    orientation?: "horizontal" | "vertical";
    className?: string;
    itemClassName?: string;
    dropdownClassName?: string;
    menuVariant?: string;
    currentPath?: string;
    style?: React.CSSProperties;
}

function isIconElement(element: ReactNode): element is React.ReactElement<{ color?: string; size?: number | string }> {
    return React.isValidElement(element) && (element.type as { displayName?: string })?.displayName === 'Icon';
}

export function Menu({
    items,
    orientation = "horizontal",
    className = "",
    itemClassName = "",
    dropdownClassName = "",
    menuVariant = "",
    currentPath,
    style,
}: MenuProps) {
    // Track open dropdowns by index path (e.g., ['L', 0, 1] for first left item's second child)
    const [openDropdown, setOpenDropdown] = useState<(string | number)[] | null>(null);
    const [hoveredIndexPath, setHoveredIndexPath] = useState<(string | number)[] | null>(null);
    const navMenuRef = useRef<HTMLElement>(null); // Changed from menuRef and type to HTMLElement for <nav>

    // Split items into left and right groups if align is set, else all left
    const leftItems = items.filter(item => !item.align || item.align === 'left');
    const rightItems = items.filter(item => item.align === 'right');

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []); // navMenuRef is stable

    // Helper: is item active?
    function isItemActive(item: MenuItem): boolean {
        if (typeof item.isActive === "boolean") return item.isActive;
        if (item.href && currentPath) return item.href === currentPath;
        return false;
    }

    // Render menu items recursively
    function renderMenuItems(
        itemsToRender: MenuItem[],
        baseIndexPath: (string | number)[],
        isVerticalLayout: boolean = false
    ): ReactNode {
        return itemsToRender.map((item, idx) => {
            const indexPath = [...baseIndexPath, idx];
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isOpen =
                openDropdown &&
                openDropdown.length === indexPath.length &&
                openDropdown.every((v, i) => v === indexPath[i]);
            const isActive = isItemActive(item);
            const isDisabled = !!item.disabled;
            const isHovered =
                hoveredIndexPath &&
                hoveredIndexPath.length === indexPath.length &&
                hoveredIndexPath.every((v, i) => v === indexPath[i]);

            // --- Menu Item Classes ---
            let baseItemClass = `flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base transition-colors duration-150 ease-in-out text-left select-none`;
            if (isActive) {
                baseItemClass += ` bg-[var(--content-primary)] text-[var(--background-default)] cursor-pointer`;
            } else if (isDisabled) {
                baseItemClass += ` bg-transparent text-[var(--content-secondary)] opacity-50 cursor-not-allowed`;
            } else {
                baseItemClass += ` bg-transparent text-[var(--content-primary)] hover:bg-[var(--content-primary)] hover:text-[var(--background-default)] cursor-pointer`;
            }
            if (isVerticalLayout) baseItemClass += " w-full";
            if (itemClassName) baseItemClass += ` ${itemClassName}`;
            if (item.className) baseItemClass += ` ${item.className}`;

            // Divider
            if (item.divider) {
                return (
                    <li
                        key={`divider-${indexPath.join("-")}`}
                        className={isVerticalLayout ? `my-1 border-t border-[var(--border-default)] w-full` : `mx-2 border-l border-[var(--border-default)] h-6 self-center`}
                        role="separator"
                    />
                );
            }

            // Custom component
            if (item.customComponent) {
                return (
                    <li key={`custom-${indexPath.join("-")}`}>{item.customComponent}</li>
                );
            }

            // --- Icon Classes ---
            // Icon color: match text color (background_default on active/hover, content_primary otherwise)
            let iconColor = undefined;
            if (isActive || isHovered) iconColor = styleMap.background_default;
            if (isDisabled) iconColor = styleMap.content_secondary;
            // group-hover for hover state
            const iconClass = `h-5 w-5 flex-shrink-0 mr-2 flex items-center transition-colors duration-150 group-hover:text-[var(--background-default)]`;
            // --- Content ---
            const content = (
                <>
                    {item.icon && (
                        <span className={iconClass}>
                            {typeof item.icon === "string"
                                ? <span className={item.icon} />
                                : isIconElement(item.icon)
                                    ? React.cloneElement(item.icon, iconColor ? { color: iconColor, size: 20 } : { size: 20 })
                                    : item.icon}
                        </span>
                    )}
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {hasChildren && (
                        <span
                            className={`ml-2 flex items-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} group-hover:text-[var(--background-default)]`}
                        >
                            <Icon
                                name="chevron-down"
                                size={20}
                                {...(iconColor ? { color: iconColor } : {})}
                                className="h-5 w-5"
                            />
                        </span>
                    )}
                </>
            );

            const handleItemClick = (event: React.MouseEvent<HTMLElement>) => {
                if (isDisabled) {
                    event.preventDefault();
                    return;
                }

                if (hasChildren) {
                    setOpenDropdown(isOpen ? null : indexPath);
                }

                if (item.onClick) {
                    if (!hasChildren) { // Only call item.onClick if there are no children
                        (item.onClick as (e: React.MouseEvent<HTMLElement>) => void)(event);
                        setOpenDropdown(null); // Close other dropdowns if a terminal item is clicked
                    }
                }
                // If it's an 'a' tag, navigation will happen naturally unless event.preventDefault() was called.
            };

            // Render as <a> if href and not disabled, else as <button>
            const commonProps = {
                className: baseItemClass + ' group no-underline',
                tabIndex: isDisabled ? -1 : 0,
                role: 'menuitem',
                onMouseEnter: () => setHoveredIndexPath(indexPath),
                onMouseLeave: () => setHoveredIndexPath(null),
                onClick: handleItemClick, // Use the new handler
            };

            let itemNode: ReactNode;
            if (item.href && !isDisabled) {
                const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
                    href: item.href,
                    ...commonProps, // commonProps now includes onClick
                    target: item.href.startsWith('http') ? '_blank' : undefined,
                    rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                    className:
                        baseItemClass +
                        ' group no-underline ' +
                        (isActive
                            ? ' text-[var(--background-default)] bg-[var(--content-primary)]'
                            : ' text-[var(--content-primary)] hover:text-[var(--background-default)] hover:bg-[var(--content-primary)]'),
                };
                if (isActive) (anchorProps as React.AriaAttributes)['aria-current'] = 'page';
                itemNode = (
                    <a {...anchorProps}>
                        {content}
                    </a>
                );
            } else {
                const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
                    type: 'button',
                    ...commonProps, // commonProps now includes onClick
                    disabled: isDisabled,
                    className: baseItemClass + ' group',
                };
                if (isActive) buttonProps['aria-current'] = 'page';
                itemNode = (
                    <button {...buttonProps}>
                        {content}
                    </button>
                );
            }

            // Dropdown menu
            const dropdownMenu =
                hasChildren && isOpen ? (
                    <ul
                        className={`absolute z-20 mt-2 min-w-[180px] rounded-lg shadow-lg bg-[var(--background-elevated)] border border-[var(--border-default)] p-2 flex flex-col space-y-1 ${dropdownClassName}`}
                        role="menu"
                        style={{ top: '100%', left: 0, background: `var(--background-elevated)` }}
                    >
                        {renderMenuItems(item.children!, indexPath, true)}
                    </ul>
                ) : null;

            return (
                <li
                    key={indexPath.join("-")}
                    className={isVerticalLayout ? "w-full relative" : "relative"}
                    role="none"
                >
                    {itemNode}
                    {dropdownMenu}
                </li>
            );
        });
    }

    // Horizontal menu bar
    if (orientation === "horizontal") {
        return (
            <nav
                ref={navMenuRef} // Attach ref here
                className={`flex items-center justify-between px-6 py-3 ${className}`.trim()}
                style={style}
                aria-label="Main menu"
            >
                {/* Left group */}
                <ul
                    // ref={menuRef} // Ref moved to nav
                    className={`flex items-center space-x-3 ${menuVariant}`}
                    role="menubar"
                >
                    {renderMenuItems(leftItems, ['L'])}
                </ul>
                {/* Right group (if any) */}
                {rightItems.length > 0 && (
                    <ul className="flex items-center space-x-3">
                        {renderMenuItems(rightItems, ['R'])}
                    </ul>
                )}
            </nav>
        );
    }

    // Vertical menu
    return (
        <nav
            ref={navMenuRef} // Attach ref here
            className={`flex flex-col space-y-1 p-2 ${className}`.trim()}
            style={style}
            aria-label="Main menu"
        >
            <ul
                // ref={menuRef} // Ref moved to nav
                className={`flex flex-col space-y-1 ${menuVariant}`}
                role="menu"
            >
                {renderMenuItems(items, ['V'], true)}
            </ul>
        </nav>
    );
} 