# Breadcrumbs

A navigation component that helps users understand their current location in a hierarchical structure.

## Features

- React Router integration
- Icon support
- Responsive design
- Custom styling
- Accessibility support

## Import

```tsx
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
```

## Props

| Prop        | Type               | Default | Description               |
| ----------- | ------------------ | ------- | ------------------------- |
| `items`     | `BreadcrumbItem[]` | -       | Array of breadcrumb items |
| `className` | `string`           | `''`    | Additional CSS classes    |
| `style`     | `CSSProperties`    | -       | Additional CSS styles     |

### BreadcrumbItem Type

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
}
```

## Examples

### Basic Breadcrumbs

```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics" },
  ]}
/>
```

### Breadcrumbs with Icons

```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/", iconName: "home" },
    { label: "Settings", href: "/settings", iconName: "settings" },
    { label: "Profile", iconName: "user" },
  ]}
/>
```

### Custom Styled Breadcrumbs

```tsx
<Breadcrumbs
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reports", href: "/reports" },
    { label: "Annual" },
  ]}
  className="text-sm"
/>
```

## Features

### Navigation

- React Router Link integration
- External link support
- Current page indication

### Icons

- Optional icons for items
- Customizable icon size
- Customizable icon color

### Styling

- Responsive text size
- Custom class support
- Consistent spacing

## Accessibility

The Breadcrumbs component includes:

- ARIA navigation role
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## CSS Variables

The component uses these theme variables:

```css
--content-primary
--content-secondary
```

## Design Guidelines

- Keep labels concise and clear
- Use consistent icon styling
- Maintain readable text size
- Consider mobile display
- Use meaningful separators
- Limit number of levels
- Show full path hierarchy
- Use clear navigation patterns
- Consider truncation for long paths
- Ensure sufficient contrast
