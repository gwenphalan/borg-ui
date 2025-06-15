import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                primary: 'bg-content-primary text-background-default hover:bg-content-primary/90 font-orbitron font-black text-sm leading-normal',
                secondary: 'bg-border-default text-light hover:bg-border-default/90 font-orbitron font-black text-sm leading-normal',
                destructive: 'bg-status-error text-light hover:bg-status-error/90 font-orbitron font-black text-sm leading-normal',
                info: 'bg-status-info text-light hover:bg-status-info/90 font-orbitron font-black text-sm leading-normal',
                warn: 'bg-status-warning text-background-default hover:bg-status-warning/90 font-orbitron font-black text-sm leading-normal',
                'outline-primary': 'border-2 border-content-primary text-content-primary bg-transparent hover:bg-content-primary hover:text-background-default font-orbitron font-black text-sm leading-normal',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
); 