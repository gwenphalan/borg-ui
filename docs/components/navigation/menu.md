# Menu

A flexible menu component for navigation and dropdown menus with support for nested items.

## Features

- Horizontal and vertical orientations
- Nested submenus
- Icon support
- Active state tracking
- React Router integration
- Custom styling
- Accessibility support

## Import

```tsx
import { Menu } from "@/components/menu/menu";
```

## Props

| Prop                | Type              | Default        | Description                |
| ------------------- | ----------------- | -------------- | -------------------------- |
| `items`             | `MenuItem[]`      | -              | Array of menu items        |
| `orientation`       | `MenuOrientation` | `'horizontal'` | Menu layout direction      |
| `className`         | `string`          | `''`           | Additional CSS classes     |
| `itemClassName`     | `string`          | `''`           | Classes for menu items     |
| `dropdownClassName` | `string`          | `''`           | Classes for dropdown menus |
| `currentPath`       | `string`          | -              | Current active path        |
| `style`             | `CSSProperties`   | -              | Additional CSS styles      |

### MenuItem Type

```tsx
interface MenuItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode | string;
  disabled?: boolean;
  isActive?: boolean;
  children?: MenuItem[];
  className?: string;
  divider?: boolean;
  customComponent?: ReactNode;
  align?: "left" | "right";
}
```

### MenuOrientation Type

```tsx
type MenuOrientation = "horizontal" | "vertical";
```

## Examples

### Basic Menu

```tsx
<Menu
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
  ]}
/>
```

### Menu with Icons and Dropdowns

```tsx
<Menu
  items={[
    {
      label: "Settings",
      icon: "settings",
      children: [
        { label: "Profile", href: "/settings/profile" },
        { label: "Security", href: "/settings/security" },
      ],
    },
    {
      label: "Help",
      icon: "help",
      children: [
        { label: "Documentation", href: "/help/docs" },
        { label: "Support", href: "/help/support" },
      ],
    },
  ]}
/>
```

### Vertical Menu with Dividers

```tsx
<Menu
  orientation="vertical"
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { divider: true },
    { label: "Settings", href: "/settings" },
    { label: "Logout", onClick: handleLogout },
  ]}
/>
```

## Features

### Navigation

- React Router Link integration
- External link support
- Active state tracking
- Click handlers

### Layout

- Horizontal/vertical orientation
- Left/right alignment
- Nested dropdowns
- Dividers

### Styling

- Custom class support
- Icon customization
- Responsive design
- Hover states

## States

- **Default**: Normal menu state
- **Active**: Current selected item
- **Hover**: Mouse over feedback
- **Disabled**: Non-interactive items
- **Open**: Expanded dropdown

## Accessibility

The Menu component includes:

- ARIA menubar role
- Keyboard navigation
- Focus management
- Screen reader support
- ARIA labels and states

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--interactive-accentfocus
--text-light
--text-dark
```

## Design Guidelines

- Use clear, concise labels
- Group related items
- Consider mobile navigation
- Use consistent icon styling
- Maintain readable text size
- Use dividers meaningfully
- Consider dropdown placement
- Keep nested levels minimal
- Ensure sufficient contrast
- Use appropriate spacing
