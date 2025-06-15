import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-content-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-md hover:scale-105 hover:shadow-lg active:scale-95',
    {
        variants: {
            variant: {
                default: 'bg-background-default text-text-light border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                primary: 'bg-content-primary text-text-dark border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                secondary: 'bg-border-default text-text-light border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                destructive: 'bg-status-error text-text-light border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                info: 'bg-status-info text-text-light border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                warn: 'bg-status-warning text-text-dark border-2 border-transparent font-orbitron font-semibold text-sm leading-none',
                outline: 'bg-transparent text-text-light border-2 border-background-default font-orbitron font-semibold text-sm leading-none',
                'outline-primary': 'bg-transparent text-text-light border-2 border-content-primary font-orbitron font-semibold text-sm leading-none',
                'outline-secondary': 'bg-transparent text-text-light border-2 border-border-default font-orbitron font-semibold text-sm leading-none',
                'outline-destructive': 'bg-transparent text-text-light border-2 border-status-error font-orbitron font-semibold text-sm leading-none',
                'outline-info': 'bg-transparent text-text-light border-2 border-status-info font-orbitron font-semibold text-sm leading-none',
                'outline-warn': 'bg-transparent text-text-light border-2 border-status-warning font-orbitron font-semibold text-sm leading-none',
                ghost: 'text-content-primary',
                link: 'text-content-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3 py-1.5',
                lg: 'h-11 px-8 py-2.5',
                large: 'h-12 px-10 py-3 text-base',
                icon: 'h-10 w-10 p-2.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
); 