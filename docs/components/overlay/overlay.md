# Overlay

A flexible overlay component for creating modal backgrounds and loading screens with optional hologram effects.

## Features

- Backdrop blur effect
- Click handling
- Hologram effect support
- Custom styling
- Accessibility support

## Import

```tsx
import { Overlay } from "@/components/overlay/overlay";
```

## Props

| Prop        | Type            | Default | Description                 |
| ----------- | --------------- | ------- | --------------------------- |
| `isVisible` | `boolean`       | -       | Controls overlay visibility |
| `onClick`   | `() => void`    | -       | Click handler function      |
| `children`  | `ReactNode`     | -       | Overlay content             |
| `className` | `string`        | `''`    | Additional CSS classes      |
| `style`     | `CSSProperties` | `{}`    | Additional CSS styles       |
| `blur`      | `boolean`       | `true`  | Enable backdrop blur        |

## Examples

### Basic Overlay

```tsx
<Overlay isVisible={isVisible} onClick={handleClose}>
  <div>Overlay content</div>
</Overlay>
```

### Loading Overlay

```tsx
<Overlay isVisible={isLoading}>
  <div className="flex items-center justify-center">
    <Spinner size="lg" />
  </div>
</Overlay>
```

### Overlay with Hologram Effect

```tsx
<HologramContext.Provider value={true}>
  <Overlay isVisible={true}>
    <div className="text-center">
      <h2>Holographic Overlay</h2>
      <p>With Star Trek Borg effects</p>
    </div>
  </Overlay>
</HologramContext.Provider>
```

### Custom Styled Overlay

```tsx
<Overlay isVisible={true} className="bg-opacity-75" blur={false}>
  <div>Custom background opacity</div>
</Overlay>
```

## Features

### Backdrop

- Blur effect
- Click handling
- Custom opacity

### Styling

- Hologram effect support
- Custom class support
- Responsive design

### Content

- Centered content
- Custom components
- Loading states

## Accessibility

The Overlay component includes:

- ARIA dialog role
- Focus management
- Screen reader support
- ARIA labels
- Keyboard support

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
```

## Design Guidelines

- Use appropriate opacity
- Consider content visibility
- Handle click interactions
- Use blur effect appropriately
- Consider loading states
- Maintain content hierarchy
- Use hologram effects judiciously
- Ensure sufficient contrast
- Test different viewport sizes
- Consider mobile interaction
