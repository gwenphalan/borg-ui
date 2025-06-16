# Badge

A versatile badge component for displaying status, labels, or counts.

## Features

- Multiple variants
- Icon support
- Removable badges
- Pill shape option
- Custom styling
- Accessibility support

## Import

```tsx
import { Badge } from "@/components/badge/badge";
```

## Props

| Prop        | Type           | Default     | Description                 |
| ----------- | -------------- | ----------- | --------------------------- |
| `children`  | `ReactNode`    | -           | Badge content               |
| `variant`   | `BadgeVariant` | `'default'` | Visual style variant        |
| `pill`      | `boolean`      | `false`     | Use pill shape              |
| `icon`      | `ReactNode`    | -           | Icon element                |
| `className` | `string`       | `''`        | Additional CSS classes      |
| `removable` | `boolean`      | `false`     | Show remove button          |
| `onRemove`  | `() => void`   | -           | Remove button click handler |

### BadgeVariant Type

```tsx
type BadgeVariant = "default" | "info" | "success" | "warning" | "error";
```

## Examples

### Basic Badge

```tsx
<Badge>Default</Badge>
```

### Variant Badges

```tsx
<div className="flex gap-2">
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
</div>
```

### Badge with Icon

```tsx
<Badge icon={<Icon name="check" size={12} />}>Verified</Badge>
```

### Removable Badge

```tsx
<Badge removable onRemove={() => console.log("Badge removed")}>
  Removable
</Badge>
```

### Pill Badge

```tsx
<Badge pill>New</Badge>
```

## Variants

The Badge component supports these variants:

- **default**: Standard badge with elevated background
- **info**: Blue informational badge
- **success**: Green success badge
- **warning**: Yellow warning badge
- **error**: Red error badge

## States

- **Default**: Normal badge state
- **With Icon**: Badge with leading icon
- **Removable**: Badge with remove button
- **Pill**: Rounded pill shape
- **Custom**: Custom styled badge

## Accessibility

The Badge component includes:

- Proper ARIA roles
- Keyboard navigation for removable badges
- Screen reader support
- Focus management
- Clear button labels

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--status-info
--status-error
--status-warning
--text-light
```

## Design Guidelines

- Use appropriate variants for context
- Keep content concise
- Use icons sparingly
- Ensure sufficient contrast
- Consider badge placement
- Maintain consistent sizing
- Use removable badges judiciously
- Consider mobile touch targets
- Group related badges
- Use clear, descriptive text
