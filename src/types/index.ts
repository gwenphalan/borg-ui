// Common types used across components
export interface BaseProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

export interface ThemeProps {
    isDarkMode?: boolean;
}

export interface SizeProps {
    size?: 'sm' | 'md' | 'lg';
}

export interface VariantProps {
    variant?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
}

export interface StatusProps {
    status?: 'info' | 'warning' | 'error' | 'success';
}

export interface DisabledProps {
    disabled?: boolean;
}

export interface LoadingProps {
    loading?: boolean;
}

export interface IconProps {
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export interface LabelProps {
    label?: string;
    required?: boolean;
}

export interface ErrorProps {
    error?: boolean;
    errorMessage?: string;
}

export interface WarningProps {
    warning?: boolean;
    warningMessage?: string;
}

export interface HelperTextProps {
    helperText?: string;
}

// Utility type for combining props
export type Combine<T, U> = T & Omit<U, keyof T>;

// Common component props
export type CommonProps = Combine<
    BaseProps,
    Combine<
        ThemeProps,
        Combine<
            SizeProps,
            Combine<
                VariantProps,
                Combine<
                    StatusProps,
                    Combine<
                        DisabledProps,
                        Combine<
                            LoadingProps,
                            Combine<
                                IconProps,
                                Combine<
                                    LabelProps,
                                    Combine<
                                        ErrorProps,
                                        Combine<WarningProps, HelperTextProps>
                                    >
                                >
                            >
                        >
                    >
                >
            >
        >
    >
>; 