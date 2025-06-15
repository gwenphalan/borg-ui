import { forwardRef, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../icon/icon";
import clsx from "clsx";

type StyleKey = "destructive" | "info" | "secondary" | "primary" | "warn";
type ToggleButtonSize = "default" | "sm" | "lg" | "large" | "icon";

export interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: StyleKey;
  state?: "focus" | "default";
  icon?: "off" | "right" | "left";
  iconName?: string;
  toggled?: boolean; // For controlled mode
  defaultToggled?: boolean; // Initial state for uncontrolled mode
  onToggledChange?: (isToggled: boolean) => void;
  label?: string;
  className?: string;
  size?: ToggleButtonSize;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      styleType = "primary",
      state = "default",
      icon = "off",
      iconName = "toggle",
      toggled,
      defaultToggled = false,
      onToggledChange,
      label,
      className = "",
      onClick: propsOnClick,
      size = "default",
      ...props
    },
    ref
  ) => {
    const [internalToggled, setInternalToggled] = useState(defaultToggled);

    const isControlled = toggled !== undefined;
    const currentToggledState = isControlled ? toggled : internalToggled;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const newToggledState = !currentToggledState;
      if (!isControlled) {
        setInternalToggled(newToggledState);
      }
      propsOnClick?.(event);
      onToggledChange?.(newToggledState);
    };

    const styleMap: Record<StyleKey, { toggled: string; untoggled: string }> = {
      destructive: {
        toggled: "bg-status-error text-text-light border-2 border-transparent",
        untoggled: "bg-transparent text-text-light border-2 border-status-error",
      },
      info: {
        toggled: "bg-status-info text-text-light border-2 border-transparent",
        untoggled: "bg-transparent text-text-light border-2 border-status-info",
      },
      secondary: {
        toggled: "bg-border-default text-text-light border-2 border-transparent",
        untoggled: "bg-transparent text-text-light border-2 border-border-default",
      },
      primary: {
        toggled: "bg-content-primary text-text-dark border-2 border-transparent",
        untoggled: "bg-transparent text-text-light border-2 border-content-primary",
      },
      warn: {
        toggled: "bg-status-warning text-text-dark border-2 border-transparent",
        untoggled: "bg-transparent text-text-light border-2 border-status-warning",
      },
    };

    const sizeMap: Record<ToggleButtonSize, { height: string; padding: string; iconPadding: string; fontSize?: string }> = {
      default: { height: "h-10", padding: "px-4 py-2", iconPadding: "p-2.5" },
      sm: { height: "h-9", padding: "px-3 py-1.5", iconPadding: "p-2" },
      lg: { height: "h-11", padding: "px-8 py-2.5", iconPadding: "p-2.5" },
      large: { height: "h-12", padding: "px-10 py-3", iconPadding: "p-3", fontSize: "text-base" },
      icon: { height: "h-10", padding: "p-2.5", iconPadding: "p-2.5" },
    };

    const stylesForType = styleMap[styleType];
    const sizeConfig = sizeMap[size];
    const colorClasses = currentToggledState
      ? stylesForType.toggled
      : stylesForType.untoggled;

    const shadow = "shadow-md";
    const pillShape = state === "focus" ? "rounded-xl" : "rounded-full";
    const transition = "transition-all duration-200 ease-out";
    const cursor = "cursor-pointer";
    const focusRing = "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--content-primary)";

    const isIconOnly = (icon !== "off" && iconName && !label) || size === "icon";

    const paddingClasses = isIconOnly ? sizeConfig.iconPadding : sizeConfig.padding;

    const iconColor = currentToggledState
      ? styleType === "primary"
        ? "var(--text-dark)"
        : styleType === "warn"
          ? "var(--text-dark)"
          : "var(--text-light)"
      : "var(--text-light)";

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={clsx(
          "inline-flex items-center justify-center relative",
          "inline-flex items-center justify-center relative gap-2",
          sizeConfig.height,
          isIconOnly ? `w-${sizeConfig.height.split('-')[1]}` : "", // Match width to height for icon-only
          shadow,
          colorClasses,
          pillShape,
          transition,
          cursor,
          focusRing,
          "hover:scale-105 hover:shadow-lg",
          "active:scale-95",
          paddingClasses,
          sizeConfig.fontSize,
          className
        )}
        aria-pressed={currentToggledState}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={iconColor} />
        )}
        {label && (
          <span
            className={clsx("font-semibold text-sm leading-none flex-1 text-right")}
            style={{ color: iconColor }}
          >
            {label}
          </span>
        )}
        {icon === "right" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={iconColor} />
        )}
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton"; 