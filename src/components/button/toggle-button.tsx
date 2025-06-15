import { forwardRef, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../icon/icon";
import clsx from "clsx";

type StyleKey = "destructive" | "info" | "secondary" | "primary" | "warn";

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
        toggled: "bg-(--status-error) text-(--text-light) border-2 border-transparent",
        untoggled: "bg-transparent text-(--text-light) border-2 border-(--status-error)",
      },
      info: {
        toggled: "bg-(--status-info) text-(--text-light) border-2 border-transparent",
        untoggled: "bg-transparent text-(--text-light) border-2 border-(--status-info)",
      },
      secondary: {
        toggled: "bg-(--border-default) text-(--text-light) border-2 border-transparent",
        untoggled: "bg-transparent text-(--text-light) border-2 border-(--border-default)",
      },
      primary: {
        toggled: "bg-(--content-primary) text-(--background-default) border-2 border-transparent",
        untoggled: "bg-transparent text-(--text-light) border-2 border-(--content-primary)",
      },
      warn: {
        toggled: "bg-(--status-warning) text-(--background-default) border-2 border-transparent",
        untoggled: "bg-transparent text-(--text-light) border-2 border-(--status-warning)",
      },
    };

    const stylesForType = styleMap[styleType];
    const colorClasses = currentToggledState
      ? stylesForType.toggled
      : stylesForType.untoggled;

    const shadow = "shadow-md";
    const pillShape = state === "focus" ? "rounded-xl" : "rounded-full";
    const transition = "transition-all duration-200 ease-out";
    const cursor = "cursor-pointer";
    const focusRing = "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--content-primary)";

    const isIconOnly = icon !== "off" && iconName && !label;

    let paddingClasses = "";
    if (isIconOnly) {
      paddingClasses = "p-2.5";
    } else {
      paddingClasses = "px-4 py-2";
    }

    const iconColor = currentToggledState
      ? styleType === "primary"
        ? "#08140B"
        : styleType === "warn"
        ? "#333333"
        : "#fff"
      : styleType === "primary"
      ? "#D0FFDD"
      : "#fff";

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={clsx(
          "inline-flex items-center justify-center relative",
          "inline-flex items-center justify-center relative gap-2",
          "h-10",
          isIconOnly ? "w-10" : "", // Use w-10 for icon-only to ensure square shape
          shadow,
          colorClasses,
          pillShape,
          transition,
          cursor,
          focusRing,
          "hover:scale-105 hover:shadow-lg",
          "active:scale-95",
          paddingClasses,
          className
        )}
        aria-pressed={currentToggledState}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={iconColor} />
        )}
        {label && (
          <span className={clsx("font-semibold text-sm leading-none flex-1 text-right")}>{label}</span>
        )}
        {icon === "right" && iconName && (
          <Icon name={iconName} className="w-5 h-5" color={iconColor} />
        )}
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton"; 