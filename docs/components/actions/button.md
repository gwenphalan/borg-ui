# Button

The Button component is a versatile, customizable button that follows the Borg UI design system. It supports multiple variants, sizes, and can include icons in different positions.

## Features

- Multiple visual variants for different contexts
- Configurable sizes
- Icon support with positioning options
- Accessible by default
- Customizable via className
- Supports all native button attributes
- Hover and active animations

## Usage

```tsx
import { Button } from '@borg/ui';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="lg">
  Large Primary Button
</Button>

// With icon
<Button icon="left" iconName="arrow-right">
  Next
</Button>

// Icon-only button
<Button size="icon" iconName="settings" />
```

## Props

| Prop        | Type                                                                                                                                                                                                                    | Default     | Description                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `variant`   | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'info' \| 'warn' \| 'outline' \| 'outline-primary' \| 'outline-secondary' \| 'outline-destructive' \| 'outline-info' \| 'outline-warn' \| 'ghost' \| 'link'` | `'default'` | The visual style variant of the button               |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'large' \| 'icon'`                                                                                                                                                                        | `'default'` | The size of the button                               |
| `icon`      | `'off' \| 'right' \| 'left'`                                                                                                                                                                                            | `'off'`     | The position of the icon (if `iconName` is provided) |
| `iconName`  | `string`                                                                                                                                                                                                                | `undefined` | The name of the icon to display                      |
| `iconSize`  | `number`                                                                                                                                                                                                                | `undefined` | The size of the icon in pixels                       |
| `asChild`   | `boolean`                                                                                                                                                                                                               | `false`     | Whether to render the button as a child component    |
| `className` | `string`                                                                                                                                                                                                                | `undefined` | Additional CSS classes to apply                      |

Plus all standard HTML button attributes.

## Variants

### Default

- Standard button with background color
- Used for general actions

### Primary

- High emphasis button
- Used for primary actions
- Dark text on primary color background

### Secondary

- Medium emphasis button
- Used for secondary actions
- Light text on secondary color background

### Destructive

- Used for destructive actions
- Light text on error color background

### Info

- Used for informational actions
- Light text on info color background

### Warn

- Used for warning actions
- Dark text on warning color background

### Outline Variants

- Transparent background with colored borders
- Available for all main variants (primary, secondary, destructive, info, warn)

### Ghost

- No background or border
- Only shows text in primary content color

### Link

- Appears as a link
- Includes underline on hover

## Sizes

- `sm`: Small button (h-9)
- `default`: Standard button (h-10)
- `lg`: Large button (h-11)
- `large`: Extra large button (h-12)
- `icon`: Square button for icons only (h-10 w-10)

## Accessibility

- Implements proper ARIA attributes
- Supports keyboard navigation
- Includes focus visible styles
- Disabled state styling

## Design Tokens

The button uses the following design tokens:

- `--text-light`: Light text color
- `--text-dark`: Dark text color
- `--content-primary`: Primary content color
- `--background-default`: Default background color
- `--border-default`: Default border color
- `--status-error`: Error status color
- `--status-info`: Info status color
- `--status-warning`: Warning status color

## CSS Classes

The button uses Tailwind CSS classes for styling, including:

- Base styles: Flexbox, rounded corners, transitions
- Interactive states: Hover, focus, active
- Disabled state styling
- Font styling (Orbitron font family)
- Shadow and scale animations

## Examples

```tsx
// Primary button with right icon
<Button
  variant="primary"
  icon="right"
  iconName="arrow-right"
  size="lg"
>
  Continue
</Button>

// Destructive button with left icon
<Button
  variant="destructive"
  icon="left"
  iconName="trash"
>
  Delete
</Button>

// Icon-only button
<Button
  variant="ghost"
  size="icon"
  iconName="settings"
  aria-label="Settings"
/>

// Outline variant
<Button variant="outline-primary">
  Outlined Button
</Button>
```
