import { forwardRef } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Icon } from "../icon/icon"; // Assuming Icon component exists
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: "destructive" | "info" | "secondary" | "primary" | "warn";
  icon?: "off" | "right" | "left";
  iconName?: string;
  label?: string;
  className?: string;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      styleType = "primary",
      icon = "left",
      iconName = "arrow",
      label,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const styleMap: Record<string, string> = {
      destructive: "bg-[var(--status-error)] text-[var(--text-light)] active:opacity-80",
      info: "bg-[var(--status-info)] text-[var(--text-light)] active:opacity-80",
      secondary: "bg-[var(--border-default)] text-[var(--text-light)] active:opacity-80",
      primary: "bg-[var(--content-primary)] text-[var(--background-default)] active:opacity-80",
      warn: "bg-[var(--status-warning)] text-[var(--background-default)] active:opacity-80",
    };

    const textContent = label || children;
    const isIconOnly = icon !== "off" && iconName && !textContent;

    let paddingClasses = "";
    if (isIconOnly) {
      paddingClasses = "p-2.5";
    } else {
      paddingClasses = "px-4 py-2";
    }

    let labelTextColorClass = "";
    // Determine text color for the label based on styleMap
    let iconColor = undefined;
    if (styleMap[styleType]) {
      const buttonClasses = styleMap[styleType].split(" ");
      const textClass = buttonClasses.find((cls) => cls.startsWith("text-"));
      if (textClass) {
        labelTextColorClass = textClass;
        // Extract the color value from the text-[] class
        const match = textClass.match(/text-\[([^\]]+)\]/);
        if (match) {
          iconColor = match[1];
        }
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          "inline-flex items-center justify-center relative", // Base layout
          "h-10",
          isIconOnly ? "w-10" : "",
          "font-semibold text-sm",
          "shadow-md",
          "cursor-pointer",
          // --- Animation & Shape ---
          "rounded-full", // Initial pill shape
          "transition-all duration-200 ease-out", // Updated transition for new effects
          // On hover, scale and increase shadow
          "hover:scale-105 hover:shadow-lg",
          // On click, scale down
          "active:scale-95",
          // --- End Animation & Shape ---
          "focus:outline-none",
          styleMap[styleType],
          paddingClasses,
          icon !== "off" && iconName && textContent && "gap-x-2",
          className
        )}
        {...props}
      >
        {icon === "left" && iconName && (
          <Icon name={iconName} className={clsx("w-5 h-5")} color={iconColor} />
        )}
        {textContent && (
          <span className={clsx("leading-none font-semi-bold", labelTextColorClass)}>
            {textContent}
          </span>
        )}
        {icon === "right" && iconName && (
          <Icon name={iconName} className={clsx("w-5 h-5")} color={iconColor} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
