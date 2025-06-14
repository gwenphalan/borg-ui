import { ReactNode } from 'react';

export interface MenuItem {
    label: string;
    href?: string;
    external?: boolean;
    icon?: ReactNode;
    children?: MenuItem[];
    disabled?: boolean;
    divider?: boolean;
    customComponent?: ReactNode;
    align?: 'left' | 'right';
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    isActive?: boolean;
} 