import React from "react";
import { Icon } from "../icon";


export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    iconName?: string;
    iconColor?: string;
    iconSize?: number;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={`w-full flex items-center gap-2 py-2 px-4 rounded-lg ${className}`}
        >
            <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-black font-orbitron uppercase tracking-[2px] text-[${styleMap.content_secondary}]">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    const iconNode = item.icon
                        ? item.icon
                        : item.iconName
                            ? <Icon name={item.iconName} size={item.iconSize ?? 16} color={item.iconColor ?? styleMap.content_primary} />
                            : null;
                    return (
                        <li
                            key={item.label + idx}
                            className="flex items-center gap-1"
                            aria-current={isLast ? "page" : undefined}
                        >
                            {iconNode && (
                                <span className="mr-1 flex items-center text-[${styleMap.content_primary}]">
                                    {iconNode}
                                </span>
                            )}
                            {item.href && !isLast ? (
                                <a
                                    href={item.href}
                                    className={`hover:text-[${styleMap.content_primary}] transition-colors focus-visible:outline-none focus-visible:underline`}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <span className={`text-[${styleMap.content_primary}]`}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <span
                                    className={`mx-2 text-[${styleMap.content_secondary}] select-none`}
                                    aria-hidden="true"
                                >
                                    /
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
} 