import React, { useState, useRef, MouseEvent } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
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
    const itemRef = useRef<HTMLLIElement>(null);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const active = isItemActive(item);
    const disabled = !!item.disabled;

    const finalItemClass = `
        flex items-center justify-start font-semibold py-2 px-4 rounded-md text-base 
        transition-colors duration-150 ease-in-out text-left select-none no-underline group 
        text-content-primary cursor-pointer 
        hover:bg-content-primary
        disabled:text-content-secondary disabled:opacity-50 disabled:cursor-not-allowed 
        data-[active=true]:bg-background-default data-[active=true]:text-content-primary
        ${itemClassName} ${item.className || ''} ${isVertical ? 'w-full' : ''}
    `;

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
    };

    const content = (
        <>
            {item.icon && (
                <span className="h-5 w-5 shrink-0 mr-2 flex items-center group-hover:text-text-light dark:group-hover:text-text-dark">
                    {typeof item.icon === "string" ? <Icon name={item.icon} size={20} /> : item.icon}
                </span>
            )}
            <span className="flex-1 font-semibold group-hover:text-text-light dark:group-hover:text-text-dark">{item.label}</span>
            {hasChildren && (
                <Icon
                    name="chevron"
                    size={20}
                    className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} group-hover:text-text-light dark:group-hover:text-text-dark`}
                />
            )}
        </>
    );

    let itemNode: ReactNode;
    if (item.href && !disabled) {
        // Use React Router Link for internal navigation, regular anchor for external
        if (item.href.startsWith('http') || item.href.startsWith('mailto:') || item.href.startsWith('tel:')) {
            itemNode = (
                <a
                    href={item.href}
                    className={finalItemClass}
                    data-active={active}
                    onClick={handleItemClick}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {content}
                </a>
            );
        } else {
            itemNode = (
                <Link
                    to={item.href}
                    className={finalItemClass}
                    data-active={active}
                    onClick={handleItemClick}
                >
                    {content}
                </Link>
            );
        }
    } else {
        itemNode = <button type="button" className={finalItemClass} data-active={active} onClick={handleItemClick} disabled={disabled}>{content}</button>;
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
        >
            {itemNode}
            {hasChildren && (
                <Overlay
                    reference={itemRef.current}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    placement={isVertical ? 'right-start' : 'bottom-start'}
                    className={`z-50 min-w-[180px] rounded-lg shadow-lg bg-background-elevated border border-default p-2 flex flex-col space-y-1 ${dropdownClassName}`}
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