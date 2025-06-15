import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from "../icon/icon";

const buttonVariants = cva(
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
        outline: 'border border-input bg-background hover:bg-accent',
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
    const isIconOnly = icon !== "off" && iconName && !children;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isIconOnly && "p-2.5",
          icon !== "off" && iconName && children && "gap-2"
        )}
        ref={ref}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} className="w-5 h-5" />
        )}
        {children}
        {icon === "right" && iconName && (
          <Icon name={iconName} className="w-5 h-5" />
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
