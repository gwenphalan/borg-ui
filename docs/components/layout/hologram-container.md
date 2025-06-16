# Hologram Container

A specialized container component that adds Star Trek Borg-style hologram effects to its contents.

## Features

- Holographic bloom effect
- Animated scanlines
- Flicker animation
- Border glow effects
- Responsive design
- Context provider for nested components

## Import

```tsx
import {
  HologramContainer,
  HologramEffect,
} from "@/components/container/hologram-container";
```

## Props

### HologramContainer Props

| Prop        | Type            | Default | Description            |
| ----------- | --------------- | ------- | ---------------------- |
| `children`  | `ReactNode`     | -       | Container content      |
| `className` | `string`        | `''`    | Additional CSS classes |
| `style`     | `CSSProperties` | -       | Additional CSS styles  |

### HologramEffect Props

| Prop       | Type        | Default | Description                |
| ---------- | ----------- | ------- | -------------------------- |
| `children` | `ReactNode` | -       | Content to apply effect to |

## Examples

### Basic Hologram Container

```tsx
<HologramContainer>
  <div>Content with hologram effects</div>
</HologramContainer>
```

### Custom Styled Container

```tsx
<HologramContainer className="my-8" style={{ minHeight: "400px" }}>
  <div>Custom styled hologram content</div>
</HologramContainer>
```

### Using HologramEffect Separately

```tsx
<Overlay>
  <HologramEffect>
    <div>Content with only the hologram effect</div>
  </HologramEffect>
</Overlay>
```

## Effect Parameters

The hologram effect includes:

### Bloom Effect

- Standard Deviation: 10
- Amplitude: 3.5
- Exponent: 0.8
- Opacity: 0.4

### Container Styling

- Border Color: rgba(94, 255, 148, 0.6)
- Box Shadow: rgba(94, 255, 148, 0.15)
- Box Shadow Blur: 10px

### Background Effects

- Scanline Color: rgba(255,255,255,0.08)
- Gradient Colors:
  - Dark: rgba(18, 16, 16, 0)
  - Darker: rgba(0, 0, 0, 0.25)
  - Green: rgba(1, 15, 0, 0.8)
  - Darker Green: rgba(0, 32, 0, 0.8)

### Animation

- Scanlines Duration: 8s
- Flicker Duration: 0.07s

## Context

The component provides a HologramContext that can be used by child components to detect if they're within a hologram container:

```tsx
const isHologram = useContext(HologramContext);
```

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--interactive-accentfocus
```

## Design Guidelines

- Use for important UI elements that need emphasis
- Consider performance impact of effects
- Ensure content remains readable
- Use sparingly to maintain visual hierarchy
- Test animations on different devices
- Consider reduced motion preferences
- Maintain consistent border effects
- Balance effect intensity with usability
