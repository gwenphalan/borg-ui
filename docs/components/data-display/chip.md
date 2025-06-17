# Chip

A versatile chip component for displaying compact information, filters, or actions.

## Features

- Multiple variants
- Multiple sizes
- Icon support
- Clickable state
- Removable chips
- Leading/trailing content
- Disabled state
- Accessibility support

## Import

```tsx
import { Chip } from "@/components/chip/chip";
```

## Props

| Prop        | Type            | Default     | Description                |
| ----------- | --------------- | ----------- | -------------------------- |
| `label`     | `string`        | -           | Chip text content          |
| `icon`      | `ReactNode`     | -           | Icon element               |
| `variant`   | `ChipVariant`   | `'default'` | Visual style variant       |
| `size`      | `ChipSize`      | `'md'`      | Chip size                  |
| `closable`  | `boolean`       | `false`     | Show close button          |
| `onClose`   | `() => void`    | -           | Close button click handler |
| `onClick`   | `() => void`    | -           | Chip click handler         |
| `clickable` | `boolean`       | `false`     | Make chip clickable        |
| `disabled`  | `boolean`       | `false`     | Disable chip interactions  |
| `className` | `string`        | `''`        | Additional CSS classes     |
| `style`     | `CSSProperties` | `{}`        | Additional CSS styles      |
| `leading`   | `ReactNode`     | -           | Content before label       |
| `trailing`  | `ReactNode`     | -           | Content after label        |

### ChipVariant Type

```tsx
type ChipVariant =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "warning"
  | "error";
```

### ChipSize Type

```tsx
type ChipSize = "sm" | "md" | "lg";
```

## Examples

### Basic Chip

```tsx
<Chip label="Basic Chip" />
```

### Variant Chips

```tsx
<div className="flex gap-2">
  <Chip variant="primary" label="Primary" />
  <Chip variant="secondary" label="Secondary" />
  <Chip variant="info" label="Info" />
  <Chip variant="warning" label="Warning" />
  <Chip variant="error" label="Error" />
</div>
```

### Interactive Chip

```tsx
<Chip label="Click Me" clickable onClick={() => console.log("Chip clicked")} />
```

### Chip with Icon

```tsx
<Chip label="Settings" icon={<Icon name="settings" size={16} />} />
```

### Closable Chip

```tsx
<Chip label="Remove Me" closable onClose={() => console.log("Chip removed")} />
```

## Variants

The Chip component supports these variants:

- **default**: Standard chip with elevated background
- **primary**: Primary colored chip
- **secondary**: Subtle secondary chip
- **info**: Blue informational chip
- **warning**: Yellow warning chip
- **error**: Red error chip

## Sizes

Available size options:

- **sm**: Small chip (24px height)
- **md**: Medium chip (32px height)
- **lg**: Large chip (40px height)

## States

- **Default**: Normal chip state
- **Clickable**: Interactive chip
- **Disabled**: Non-interactive state
- **With Icon**: Chip with icon
- **Closable**: Chip with close button
- **With Content**: Chip with leading/trailing content

## Accessibility

The Chip component includes:

- Proper ARIA roles
- Keyboard navigation
- Focus management
- Screen reader support
- Disabled state announcements

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--status-info
--status-warning
--status-error
--text-light
--text-dark
```

## Design Guidelines

- Use appropriate variants for context
- Keep labels concise and clear
- Use consistent sizing within groups
- Consider touch targets for mobile
- Use icons meaningfully
- Maintain sufficient spacing
- Group related chips
- Consider disabled state visibility
- Use closable chips when appropriate
- Ensure sufficient contrast
