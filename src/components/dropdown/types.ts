export interface DropdownOption {
    value?: string;
    label?: string;
    icon?: string; // Name of the icon from Icon.tsx (e.g., 'check', 'arrow')
    disabled?: boolean;
    isSeparator?: boolean; // To render a line separator
}

export interface DropdownProps {
    options: DropdownOption[];
    value: string | string[];
    onChange: (value: string | string[]) => void;
    isOpen: boolean; // Controlled open state
    onOpenChange: (isOpen: boolean) => void; // Callback to toggle open state
    placeholder?: string; // Text to display when no value is selected
    label?: string; // Optional label for the dropdown
    disabled?: boolean; // Disables the entire dropdown
    buttonClassName?: string; // Custom classes for the trigger button
    menuClassName?: string; // Custom classes for the dropdown menu container
    itemClassName?: string; // Custom classes for individual dropdown items
    itemActiveClassName?: string; // Custom classes for the active/focused dropdown item
    itemSelectedClassName?: string; // Custom classes for the selected dropdown item
    itemDisabledClassName?: string; // Custom classes for disabled dropdown items
    fullWidth?: boolean; // If the dropdown should take the full width of its container
    menuPosition?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'; // Default to 'bottom-start'
    multiSelect?: boolean;
} 