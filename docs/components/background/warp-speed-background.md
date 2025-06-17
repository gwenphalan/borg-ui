# Warp Speed Background

An animated background component that creates a Star Trek warp speed effect.

## Features

- Animated star field
- Customizable speed
- Performance optimized
- Custom styling
- Responsive design

## Import

```tsx
import { WarpSpeedBackground } from "@/components/background/warp-speed-background";
```

## Props

| Prop        | Type            | Default | Description                |
| ----------- | --------------- | ------- | -------------------------- |
| `speed`     | `number`        | `1`     | Animation speed multiplier |
| `starCount` | `number`        | `1000`  | Number of stars to render  |
| `className` | `string`        | `''`    | Additional CSS classes     |
| `style`     | `CSSProperties` | `{}`    | Additional CSS styles      |
| `paused`    | `boolean`       | `false` | Pause animation            |

## Examples

### Basic Warp Speed Background

```tsx
<WarpSpeedBackground />
```

### Custom Speed and Stars

```tsx
<WarpSpeedBackground speed={2} starCount={2000} />
```

### Paused Animation

```tsx
<WarpSpeedBackground paused={isPaused} className="opacity-50" />
```

### With Content Overlay

```tsx
<div className="relative">
  <WarpSpeedBackground />
  <div className="relative z-10">
    <h1>Welcome to Cyberspace</h1>
    <p>Your content here</p>
  </div>
</div>
```

## Features

### Animation

- Smooth star movement
- Variable speed control
- Pause/resume support
- Performance optimized

### Styling

- Custom class support
- Responsive design
- Opacity control
- Z-index management

### Performance

- Canvas-based rendering
- RAF optimization
- Memory management
- Cleanup on unmount

## Technical Details

### Star Generation

- Random position distribution
- Depth-based size variation
- Speed-based trail length
- Color variation

### Animation Loop

- RequestAnimationFrame
- Delta time calculation
- Performance monitoring
- Memory cleanup

## CSS Variables

The component uses these theme variables:

```css
--background-default
--content-primary
```

## Design Guidelines

- Consider content readability
- Adjust speed appropriately
- Use appropriate star density
- Control opacity for contrast
- Consider mobile performance
- Manage z-index stacking
- Test different viewports
- Monitor performance impact
- Consider reduced motion
- Use as accent, not focus

## Performance Considerations

- Limit star count on mobile
- Use appropriate speed values
- Monitor frame rate impact
- Consider background blur
- Manage memory usage
- Handle window resize
- Cleanup resources properly
- Test on various devices
