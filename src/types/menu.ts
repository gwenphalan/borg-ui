export interface MenuItem {
    label: string;
    href?: string;
    external?: boolean;
    icon?: React.ReactNode;
    children?: MenuItem[];
    disabled?: boolean;
    divider?: boolean;
    customComponent?: React.ReactNode;
    align?: 'left' | 'right';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isActive?: boolean;
} 