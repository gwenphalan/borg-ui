# Theme Toggle

The Theme Toggle component is a specialized button that allows users to switch between light and dark themes. It uses the `useTheme` hook for theme management and provides a visually intuitive interface with sun/moon icons.

## Features

- Automatic icon switching based on theme
- Ghost button styling for subtle integration
- Icon-only design for space efficiency
- Accessible by default
- Integrated with theme system

## Usage

```tsx
import { ThemeToggle } from '@borg/ui';

// Basic usage
<ThemeToggle />

// In a header
<header>
  <nav>
    <ThemeToggle />
  </nav>
</header>
```

## Implementation Details

The Theme Toggle component is built using the following components and hooks:

- Uses the `Button` component with ghost variant
- Leverages the `useTheme` hook for theme management
- Utilizes icon system for visual feedback

### Props

The component doesn't accept any props as it's a self-contained unit that manages its own state through the theme system.

### Theme Integration

- Uses the `useTheme` hook which provides:
  - `theme`: Current theme state ('light' or 'dark')
  - `toggleTheme`: Function to switch between themes

### Visual Feedback

- Shows a sun icon (☀️) in dark mode
- Shows a moon icon (🌙) in light mode
- Uses ghost variant for subtle appearance
- Fixed icon size of 24px for consistency

## Accessibility

- Includes `aria-label` for screen readers
- Inherits Button component's accessibility features
- Provides clear visual indication of current theme

## Design Guidelines

- Place in consistent locations across the application
- Typically positioned in headers or navigation areas
- Maintain the ghost variant for subtle integration
- Keep the icon-only design for clean UI

## Examples

### In a Navigation Bar

```tsx
function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Logo />
      <div className="flex items-center gap-4">
        <NavLinks />
        <ThemeToggle />
      </div>
    </nav>
  );
}
```

### In a Settings Panel

```tsx
function SettingsPanel() {
  return (
    <div className="space-y-4">
      <h2>Display Settings</h2>
      <div className="flex items-center justify-between">
        <span>Theme Mode</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
```

## Technical Details

- Built on top of the Button component
- Uses ghost variant for subtle appearance
- Icon-only size for compact display
- Automatically manages theme state
- No external props required
- Integrated with application's theme system

## Best Practices

1. Consistent Placement

   - Place in predictable locations
   - Maintain consistent positioning across pages

2. Visual Integration

   - Keep the ghost variant for subtle appearance
   - Maintain the icon-only design

3. Accessibility

   - Preserve the aria-label for screen readers
   - Ensure sufficient contrast in both themes

4. Responsiveness
   - Works well at any screen size
   - Maintains 24px icon size for clarity

## Related Components

- [Button](./button.md) - Base button component used by Theme Toggle
- [Icon](../icon.md) - Icon component used for sun/moon display
