import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from "../icon/icon";

const buttonVariants = cva(
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

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: "off" | "right" | "left";
  iconName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon = "off", iconName, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const getIconColor = () => {
      switch (variant) {
        case "default":
          return "var(--text-light)";
        case "primary":
          return "var(--text-dark)";
        case "secondary":
        case "destructive":
        case "info":
          return "var(--text-light)";
        case "warn":
          return "var(--text-dark)";
        case "outline":
          return "var(--text-light)";
        case "outline-primary":
        case "outline-secondary":
        case "outline-destructive":
        case "outline-info":
        case "outline-warn":
          return "var(--text-light)";
        case "ghost":
        case "link":
          return "var(--content-primary)";
        default:
          return "currentColor";
      }
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          icon !== "off" && iconName && children && "gap-2"
        )}
        ref={ref}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={getIconColor()} />
        )}
        {children}
        {icon === "right" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={getIconColor()} />
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
