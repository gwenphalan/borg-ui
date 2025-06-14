import React from "react";

// No need to import React unless using JSX outside of function bodies

export interface IconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number | string;
}

// Import all SVGs from src/icons
const iconModules = import.meta.glob<{ default: React.FC<React.SVGProps<SVGSVGElement>> }>(
  "../icons/*.svg",
  { eager: true }
);

export function Icon({
  name,
  className = "",
  color = "currentColor",
  size = 24,
}: IconProps) {
  const iconPath = `../icons/${name}.svg`;
  const IconComponent = iconModules[iconPath]?.default;

  if (IconComponent) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
        }}
      >
        <IconComponent
          color={color}
          width={size}
          height={size}
          aria-hidden="true"
          focusable="false"
        />
      </span>
    );
  }

  // Fallback: use public/icons as an <img> if not found in src/icons
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <img
        src={`/icons/${name}.svg`}
        width={size}
        height={size}
        style={{ color }}
        aria-hidden="true"
        alt={name}
        loading="lazy"
      />
    </span>
  );
}

Icon.displayName = "Icon"; 