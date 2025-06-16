# Tooltip

A tooltip component that provides additional information on hover with optional hologram effects.

## Features

- Multiple placements
- Customizable delay
- Hologram effect support
- Custom content
- Accessibility support

## Import

```tsx
import { Tooltip } from "@/components/tooltip/tooltip";
```

## Props

| Prop        | Type               | Default | Description                  |
| ----------- | ------------------ | ------- | ---------------------------- |
| `children`  | `ReactElement`     | -       | Element to attach tooltip to |
| `content`   | `ReactNode`        | -       | Tooltip content              |
| `placement` | `TooltipPlacement` | `'top'` | Tooltip position             |
| `delay`     | `number`           | -       | Show delay in milliseconds   |
| `className` | `string`           | `''`    | Additional CSS classes       |
| `disabled`  | `boolean`          | `false` | Disable tooltip              |

### TooltipPlacement Type

```tsx
type TooltipPlacement = "top" | "bottom" | "left" | "right";
```

## Examples

### Basic Tooltip

```tsx
<Tooltip content="Additional information">
  <Button>Hover me</Button>
</Tooltip>
```

### Tooltip with Custom Placement

```tsx
<Tooltip content="Right-aligned tooltip" placement="right" delay={200}>
  <Icon name="info" />
</Tooltip>
```

### Tooltip with Hologram Effect

```tsx
<HologramContext.Provider value={true}>
  <Tooltip content="Holographic tooltip">
    <Button>Hover for effect</Button>
  </Tooltip>
</HologramContext.Provider>
```

### Disabled Tooltip

```tsx
<Tooltip content="This won't show" disabled={true}>
  <Button>No tooltip</Button>
</Tooltip>
```

## Features

### Placement

- Top positioning
- Bottom positioning
- Left positioning
- Right positioning

### Styling

- Hologram effect support
- Custom class support
- Responsive design

### Interaction

- Hover trigger
- Customizable delay
- Disable option

## Accessibility

The Tooltip component includes:

- ARIA tooltip role
- Focus management
- Screen reader support
- ARIA labels
- Keyboard support

## CSS Variables

The component uses these theme variables:

```css
--background-elevated
--border-default
--content-primary
--content-secondary
```

## Design Guidelines

- Keep content concise
- Use clear, helpful text
- Consider placement context
- Maintain readable text size
- Use appropriate delay
- Consider mobile interaction
- Use hologram effects sparingly
- Ensure sufficient contrast
- Avoid essential information
- Test different viewport sizes
