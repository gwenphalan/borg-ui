import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from "../icon/icon";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    style?: React.CSSProperties;
}

export function Breadcrumbs({ items, className = "", style }: BreadcrumbsProps) {
    return (
        <nav className={`font-orbitron ${className}`} style={style} aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-black font-orbitron uppercase tracking-wide text-content-secondary">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            {item.iconName && (
                                <span className="mr-1 flex items-center text-content-primary">
                                    <Icon name={item.iconName} size={item.iconSize ?? 16} color={item.iconColor ?? "var(--content-primary)"} />
                                </span>
                            )}
                            {item.href && !isLast ? (
                                <Link
                                    to={item.href}
                                    className="hover:text-content-primary transition-colors focus-visible:outline-hidden focus-visible:underline"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-content-primary">{item.label}</span>
                            )}
                            {!isLast && (
                                <span
                                    className="mx-2 text-content-secondary select-none"
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