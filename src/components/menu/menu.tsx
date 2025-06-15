import React, { useState, useRef, useEffect, MouseEvent } from "react";
import type { ReactNode } from "react";
import { Icon } from "../icon/icon";
import { Overlay } from "../overlay/Overlay";

// Theming style map (required by project conventions)

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
    currentPath,
    style,
}: MenuProps) {
    const navMenuRef = useRef<HTMLElement>(null);

    const leftItems = items.filter(item => !item.align || item.align === 'left');
    const rightItems = items.filter(item => item.align === 'right');

    function isItemActive(item: MenuItem): boolean {
        if (typeof item.isActive === "boolean") return item.isActive;
        if (item.href && currentPath) return item.href === currentPath;
        return false;
    }

    // Render function now uses a dedicated component for each item
    function renderMenuItems(itemsToRender: MenuItem[], isVerticalLayout: boolean = false): ReactNode {
        return itemsToRender.map((item, idx) => (
            <MenuItemComponent
                key={`${item.label}-${idx}`}
                item={item}
                isVertical={isVerticalLayout}
                itemClassName={itemClassName}
                dropdownClassName={dropdownClassName}
                isItemActive={isItemActive}
            />
        ));
    }

    const menuOrientationClass = orientation === "horizontal"
        ? "flex items-center justify-between space-x-2"
        : "flex flex-col space-y-1";

    return (
        <nav
            ref={navMenuRef}
            className={`relative ${menuOrientationClass} ${className}`}
            style={style}
            role="menubar"
        >
            <ul className={orientation === 'horizontal' ? 'flex items-center space-x-2' : 'flex flex-col space-y-1'}>
                {renderMenuItems(leftItems, orientation === "vertical")}
            </ul>
            {rightItems.length > 0 && (
                <ul className={orientation === 'horizontal' ? 'flex items-center space-x-2' : 'flex flex-col space-y-1'}>
                    {renderMenuItems(rightItems, orientation === "vertical")}
                </ul>
            )}
        </nav>
    );
}

// --- MenuItemComponent ---
// A dedicated component to handle each menu item's state and rendering
function MenuItemComponent({
    item,
    isVertical,
    itemClassName,
    dropdownClassName,
    isItemActive,
}: {
    item: MenuItem;
    isVertical: boolean;
    itemClassName: string;
    dropdownClassName: string;
    isItemActive: (item: MenuItem) => boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef<HTMLLIElement>(null);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const active = isItemActive(item);
    const disabled = !!item.disabled;
    const hovered = isHovered && !disabled && !active;

    const baseItemClass = `flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base transition-colors duration-150 ease-in-out text-left select-none no-underline group ${itemClassName} ${item.className || ''} ${isVertical ? 'w-full' : ''}`;

    const activeClass = "text-content-primary bg-background-default";
    const hoverClass = "hover:text-content-primary hover:bg-background-default";
    const disabledClass = "bg-transparent text-content-secondary opacity-50 cursor-not-allowed";
    const defaultClass = "bg-transparent text-content-primary";

    const itemStateClass = active ? activeClass : (disabled ? disabledClass : `${defaultClass} ${hoverClass}`);
    const finalItemClass = `${baseItemClass} ${itemStateClass}`;

    const iconColor = active || hovered ? 'var(--background-default)' : (disabled ? 'var(--content-secondary)' : 'var(--content-primary)');

    const handleItemClick = (event: MouseEvent<HTMLElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
        if (item.onClick) {
            item.onClick(event as MouseEvent<HTMLButtonElement>);
        }
        if (!hasChildren && item.href) {
            // Let navigation happen
        } else {
            // Could close all menus here if needed
        }
    };

    const content = (
        <>
            {item.icon && (
                <span className="h-5 w-5 flex-shrink-0 mr-2 flex items-center">
                    {typeof item.icon === "string" ? <Icon name={item.icon} size={20} color={iconColor} /> : item.icon}
                </span>
            )}
            <span className="flex-1 font-semibold">{item.label}</span>
            {hasChildren && (
                <Icon name="chevron-down" size={20} color={iconColor} className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            )}
        </>
    );

    let itemNode: ReactNode;
    if (item.href && !disabled) {
        itemNode = <a href={item.href} className={finalItemClass} onClick={handleItemClick} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{content}</a>;
    } else {
        itemNode = <button type="button" className={finalItemClass} onClick={handleItemClick} disabled={disabled}>{content}</button>;
    }

    if (item.divider) {
        return <li className={isVertical ? "my-1 border-t border-default w-full" : "mx-2 border-l border-default h-6 self-center"} role="separator" />;
    }

    if (item.customComponent) {
        return <li>{item.customComponent}</li>;
    }

    return (
        <li
            ref={itemRef}
            className={`relative ${isVertical ? 'w-full' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {itemNode}
            {hasChildren && (
                <Overlay
                    reference={itemRef.current}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    placement={isVertical ? 'right-start' : 'bottom-start'}
                    className={`z-50 min-w-[180px] rounded-lg shadow-lg bg-background-elevated border border-default p-2 flex flex-col space-y-1 ${dropdownClassName}`}
                    style={{ background: 'var(--background-elevated)' }}
                >
                    <ul>
                        {item.children!.map((child, idx) => (
                            <MenuItemComponent
                                key={`${child.label}-${idx}`}
                                item={child}
                                isVertical={true}
                                itemClassName={itemClassName}
                                dropdownClassName={dropdownClassName}
                                isItemActive={isItemActive}
                            />
                        ))}
                    </ul>
                </Overlay>
            )}
        </li>
    );
} 