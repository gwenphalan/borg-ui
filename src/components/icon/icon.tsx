import { cn } from '@/lib/utils';

// No need to import React unless using JSX outside of function bodies

export interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export function Icon({ name, className, size = 24, color }: IconProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src={`/icons/${name}.svg`}
        alt={`${name} icon`}
        width={size}
        height={size}
        style={{ color }}
      />
    </div>
  );
}

Icon.displayName = "Icon"; 