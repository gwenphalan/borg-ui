import React from "react";
import { cn } from "../../lib/utils";

// No need to import React unless using JSX outside of function bodies

export interface IconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number | string;
}

type SVGProps = { color: string; size: number | string };

type SVGComponent = React.FC<SVGProps>;

const icons: Record<string, SVGComponent> = {
  arrow: ({ color, size }) => (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: ({ color, size }) => (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Error state icon (updated)
  "error-state": ({ size }) => (
    <svg width={size} height={size} viewBox="6 4 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#error-clip)">
        <circle cx="16.5" cy="14.5" r="10.5" fill="#FF3264" />
        <path d="M14.8893 14.5L10 9.61069L11.6107 8L16.5 12.8893L21.3893 8L23 9.61069L18.1107 14.5L23 19.3893L21.3893 21L16.5 16.1107L11.6107 21L10 19.3893L14.8893 14.5Z" fill="#08140B" />
      </g>
      <defs>
        <clipPath id="error-clip">
          <rect x="6" y="4" width="21" height="21" rx="10.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // Warning state icon (updated)
  "warning-state": ({ size }) => (
    <svg width={size} height={size} viewBox="31 4 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#warning-clip)">
        <circle cx="41.5" cy="14.5" r="10.5" fill="#FFC000" />
        <path d="M31.3291 4.32905C31.7671 3.89097 32.4769 3.89097 32.915 4.32905L37.4082 8.82124C38.5591 7.99046 39.972 7.49996 41.5 7.49995C43.0903 7.49995 44.556 8.03131 45.7314 8.92476L48.6289 6.02827C48.9996 5.65754 49.6009 5.65757 49.9716 6.02827C50.3424 6.39902 50.3424 7.0003 49.9716 7.37105L47.0742 10.2675C47.9682 11.4431 48.4999 12.9091 48.5 14.5C48.5 16.0281 48.0087 17.4407 47.1777 18.5917L51.6718 23.0849C52.1098 23.523 52.1099 24.2338 51.6718 24.6718C51.2338 25.1099 50.523 25.1098 50.0849 24.6718L45.5918 20.1777C44.4407 21.0087 43.0281 21.5 41.5 21.5C39.9718 21.4999 38.5592 21.0087 37.4082 20.1777L32.915 24.6718C32.477 25.1096 31.7671 25.1094 31.3291 24.6718C30.891 24.2337 30.891 23.523 31.3291 23.0849L35.8212 18.5917C34.9905 17.4408 34.5 16.0279 34.5 14.5C34.5 12.972 34.9905 11.5591 35.8212 10.4082L31.3291 5.91499C30.891 5.4769 30.891 4.76714 31.3291 4.32905ZM41.5 10.2998C39.1804 10.2998 37.2998 12.1804 37.2998 14.5C37.2998 16.8195 39.1804 18.7001 41.5 18.7001C43.8195 18.7001 45.7001 16.8195 45.7001 14.5C45.7001 12.1804 43.8195 10.2998 41.5 10.2998Z" fill="#08140B" />
      </g>
      <defs>
        <clipPath id="warning-clip">
          <rect x="31" y="4" width="21" height="21" rx="10.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // Success state icon (updated)
  "success-state": ({ size }) => (
    <svg width={size} height={size} viewBox="56 4 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#success-clip)">
        <circle cx="66.5" cy="14.5" r="10.5" fill="#00FF9F" />
        <path fillRule="evenodd" clipRule="evenodd" d="M73.0323 10.1185L64.649 20.8817L60.0323 16.1398L61.3953 14.7398L64.4892 17.9175L71.5271 8.88169L73.0323 10.1185Z" fill="#08140B" />
      </g>
      <defs>
        <clipPath id="success-clip">
          <rect x="56" y="4" width="21" height="21" rx="10.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // Info state icon (new)
  "info-state": ({ size }) => (
    <svg width={size} height={size} viewBox="81 4 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#info-clip)">
        <circle cx="91.5" cy="14.5" r="10.5" fill="#20A0FF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M91.5 11.875C92.4665 11.875 93.25 12.6585 93.25 13.625V20.625C93.25 21.5915 92.4665 22.375 91.5 22.375C90.5335 22.375 89.75 21.5915 89.75 20.625V13.625C89.75 12.6585 90.5335 11.875 91.5 11.875Z" fill="#08140B" />
        <path fillRule="evenodd" clipRule="evenodd" d="M89.75 9.25C89.75 8.2835 90.5335 7.5 91.5 7.5H91.5175C92.484 7.5 93.2675 8.2835 93.2675 9.25C93.2675 10.2165 92.484 11 91.5175 11H91.5C90.5335 11 89.75 10.2165 89.75 9.25Z" fill="#08140B" />
      </g>
      <defs>
        <clipPath id="info-clip">
          <rect x="81" y="4" width="21" height="21" rx="10.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // Unified chevron icon (always points down; rotate via CSS for other directions)
  "chevron": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 6L8 11L13 6" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
  // Aliases for backward compatibility
  "chevron-down": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 6L8 11L13 6" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
  "chevron-up": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 6L8 11L13 6" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
  // Calendar icon
  "calendar": ({ color, size }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 20 20" style={{ color }}>
      <rect
        x="3"
        y="5"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 2v2M13 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="7" y="9" width="2" height="2" rx="1" fill="currentColor" />
    </svg>
  ),
  // Clock icon
  "clock": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  // Close/X icon
  "close": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M2 2L8 8M8 2L2 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Left arrow for navigation
  "arrow-left": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  // Right arrow for navigation  
  "arrow-right": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  // User icon
  "user": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a9 9 0 0 1 13 0" />
    </svg>
  ),
  // Settings / Cog icon
  "settings": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  // Logout icon (simple arrow)
  "logout": ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

// Preload any user-supplied SVGs that live in src/assets/icons (optional).
// This uses Vite's glob import so that the dependency scanner is happy even when
// the directory is missing or empty.
const projectIconModules: Record<string, () => Promise<any>> = import.meta.glob(
  "../../assets/icons/**/*.svg"
);

async function loadIcon(name: string): Promise<React.ComponentType<React.SVGProps<SVGSVGElement>>> {
  const keyCandidates = [
    `../../assets/icons/${name}.svg`,
  ];

  for (const key of keyCandidates) {
    if (key in projectIconModules) {
      const mod = await projectIconModules[key]();
      return (mod as any).ReactComponent || (mod as any).default || (() => null);
    }
  }

  // Fallback: try to load from public /icons folder in consumer projects.
  try {
    const pkgIcon = await import(/* @vite-ignore */ `/icons/${name}.svg?react`);
    return pkgIcon.ReactComponent || pkgIcon.default;
  } catch {
    return () => null;
  }
}

function DynamicSvgIcon({ name, className = "", color = "currentColor", size = 24 }: IconProps) {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null);

  React.useEffect(() => {
    let mounted = true;

    loadIcon(name).then((Component) => {
      if (mounted) {
        setIconComponent(() => Component);
      }
    });

    return () => {
      mounted = false;
    };
  }, [name]);

  if (!IconComponent) {
    return null;
  }

  return (
    <span
      className={cn("inline-flex", className)}
      style={{ color, width: size, height: size }}
    >
      <IconComponent
        className={cn(className)}
        style={{ color, width: size, height: size }}
      />
    </span>
  );
}

export function Icon({ name, className = "", color = "currentColor", size = 24 }: IconProps) {
  const IconSvg = icons[name];
  if (IconSvg) {
    return (
      <span
        className={cn("inline-flex", className)}
        style={{ color, width: size, height: size }}
      >
        <IconSvg color={color} size={size} />
      </span>
    );
  }
  // Fallback to dynamic SVG import
  return <DynamicSvgIcon name={name} className={className} color={color} size={size} />;
}

Icon.displayName = 'Icon'; 