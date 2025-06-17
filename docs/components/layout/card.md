# Card

A versatile card component for displaying content in a contained, elevated surface.

## Features

- Multiple variants (default, primary, outlined, secondary)
- Interactive states
- Image support
- Action buttons
- Customizable padding and margins
- Disabled state
- Accessibility support

## Import

```tsx
import { Card } from "@/components/card/card";
```

## Props

| Prop        | Type            | Default        | Description                         |
| ----------- | --------------- | -------------- | ----------------------------------- |
| `title`     | `string`        | -              | Card title                          |
| `subtitle`  | `string`        | -              | Card subtitle                       |
| `actions`   | `ReactNode`     | -              | Action buttons/elements             |
| `image`     | `string`        | -              | URL of the card image               |
| `imageAlt`  | `string`        | `'Card image'` | Alt text for the image              |
| `children`  | `ReactNode`     | -              | Card content                        |
| `className` | `string`        | `''`           | Additional CSS classes              |
| `style`     | `CSSProperties` | `{}`           | Inline styles                       |
| `onClick`   | `() => void`    | -              | Click handler for interactive cards |
| `clickable` | `boolean`       | `false`        | Makes the card interactive          |
| `variant`   | `CardVariant`   | `'default'`    | Card style variant                  |
| `disabled`  | `boolean`       | `false`        | Disables the card                   |
| `padding`   | `string`        | `'p-6'`        | Custom padding (Tailwind classes)   |
| `margin`    | `string`        | `''`           | Custom margin (Tailwind classes)    |

### CardVariant Type

```tsx
type CardVariant = "default" | "primary" | "outlined" | "secondary";
```

## Examples

### Basic Card

```tsx
<Card title="Basic Card">
  <p>This is a basic card with some content.</p>
</Card>
```

### Interactive Card with Image

```tsx
<Card
  title="Interactive Card"
  subtitle="With image and actions"
  image="/path/to/image.jpg"
  clickable
  onClick={() => console.log("Card clicked")}
  actions={<Button>Action</Button>}
>
  <p>Card content with image and interactive elements.</p>
</Card>
```

### Outlined Variant

```tsx
<Card variant="outlined" title="Outlined Card" padding="p-4">
  <p>A card with custom padding and outlined style.</p>
</Card>
```

## Variants

The Card component supports these variants:

- **default**: Standard elevated card
- **primary**: Prominent card with primary color border
- **outlined**: Borderless card with transparent background
- **secondary**: Subtle card with default border

## States

- **Default**: Normal card state
- **Hover**: Visual feedback when clickable
- **Focus**: Focus ring when interactive
- **Disabled**: Grayed out and non-interactive
- **Active**: Visual feedback when clicked

## Accessibility

The Card component includes:

- Proper ARIA roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Disabled state announcements

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--surface-default
--text-light
--text-dark
```

## Design Guidelines

- Use consistent spacing within cards
- Maintain clear visual hierarchy
- Use images that enhance content
- Keep actions clear and accessible
- Consider mobile responsiveness
- Use variants appropriately for context
- Ensure sufficient contrast for content
- Keep content concise and focused
