import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from "../icon/icon";
import { buttonVariants } from './button-variants';

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: "off" | "right" | "left";
  iconName?: string;
  iconSize?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon = "off", iconName, iconSize, children, type = "button", ...props }, ref) => {
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

    if (size === 'icon') {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          type={type}
          {...props}
        >
          {iconName && <Icon name={iconName} size={iconSize} color={getIconColor()} />}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          icon !== "off" && iconName && children && "gap-2"
        )}
        ref={ref}
        type={type}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} size={iconSize} color={getIconColor()} />
        )}
        {children}
        {icon === "right" && iconName && (
          <Icon name={iconName} size={iconSize} color={getIconColor()} />
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button };
