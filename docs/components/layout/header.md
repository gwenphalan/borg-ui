# Header

A top-level navigation and branding component for application layout.

## Features

- Responsive design
- Navigation menu
- Branding area
- Action buttons
- Theme integration
- Accessibility support

## Import

```tsx
import { Header } from "@/components/layout/header";
```

## Props

| Prop         | Type            | Default | Description             |
| ------------ | --------------- | ------- | ----------------------- |
| `logo`       | `ReactNode`     | -       | Logo/branding element   |
| `navigation` | `MenuItem[]`    | -       | Navigation menu items   |
| `actions`    | `ReactNode`     | -       | Action buttons/elements |
| `className`  | `string`        | `''`    | Additional CSS classes  |
| `style`      | `CSSProperties` | `{}`    | Additional CSS styles   |

### MenuItem Type

```tsx
interface MenuItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: MenuItem[];
}
```

## Examples

### Basic Header

```tsx
<Header
  logo={<Logo />}
  navigation={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]}
/>
```

### Header with Actions

```tsx
<Header
  logo={<Logo />}
  navigation={navigationItems}
  actions={
    <div className="flex gap-2">
      <ThemeToggle />
      <Button>Sign In</Button>
    </div>
  }
/>
```

### Responsive Header

```tsx
<Header
  logo={<Logo />}
  navigation={navigationItems}
  className="hidden md:flex"
/>
```

## Features

### Layout

- Fixed positioning
- Responsive design
- Mobile menu
- Sticky header

### Navigation

- Menu items
- Dropdown support
- Active states
- Mobile drawer

### Branding

- Logo placement
- Title display
- Custom branding
- Link support

## Accessibility

The Header component includes:

- ARIA navigation role
- Keyboard navigation
- Screen reader support
- Focus management
- Skip navigation link

## CSS Variables

The component uses these theme variables:

```css
--background-elevated
--border-default
--content-primary
--content-secondary
--interactive-accentfocus
```

## Design Guidelines

- Keep navigation clear
- Use consistent spacing
- Consider mobile layout
- Maintain brand visibility
- Use clear labels
- Consider scroll behavior
- Keep actions accessible
- Test responsive design
- Ensure sufficient contrast
- Handle long labels
