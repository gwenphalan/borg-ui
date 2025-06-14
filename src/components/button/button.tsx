import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from "../icon/icon";

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-[var(--content-primary)] text-[var(--background-default)] hover:bg-[var(--content-primary)]/90 font-orbitron font-[900] text-[14.51px] leading-[29.87px]',
        secondary: 'bg-[var(--border-default)] text-[var(--text-light)] hover:bg-[var(--border-default)]/90 font-orbitron font-[900] text-[14.51px] leading-[29.87px]',
        destructive: 'bg-[var(--status-error)] text-[var(--text-light)] hover:bg-[var(--status-error)]/90 font-orbitron font-[900] text-[14.51px] leading-[29.87px]',
        info: 'bg-[var(--status-info)] text-[var(--text-light)] hover:bg-[var(--status-info)]/90 font-orbitron font-[900] text-[14.51px] leading-[29.87px]',
        warn: 'bg-[var(--status-warning)] text-[var(--background-default)] hover:bg-[var(--status-warning)]/90 font-orbitron font-[900] text-[14.51px] leading-[29.87px]',
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
          icon !== "off" && iconName && children && "gap-x-2"
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
