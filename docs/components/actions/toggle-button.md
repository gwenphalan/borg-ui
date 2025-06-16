# Toggle Button

The Toggle Button component is a stateful button that can be toggled between two states. It supports both controlled and uncontrolled modes, multiple visual styles, and icon integration.

## Features

- Controlled and uncontrolled state management
- Multiple visual styles
- Configurable sizes
- Icon support with positioning options
- Accessible by default
- Customizable via className
- Hover and active animations

## Usage

```tsx
import { ToggleButton } from '@borg/ui';

// Basic usage
<ToggleButton label="Toggle me" />

// Controlled mode
const [isToggled, setIsToggled] = useState(false);
<ToggleButton
  toggled={isToggled}
  onToggledChange={setIsToggled}
  label="Controlled Toggle"
/>

// With icon
<ToggleButton
  icon="left"
  iconName="power"
  label="Power"
/>

// Icon-only toggle
<ToggleButton
  size="icon"
  iconName="wifi"
  aria-label="Toggle WiFi"
/>
```

## Props

| Prop              | Type                                                            | Default     | Description                               |
| ----------------- | --------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `styleType`       | `'destructive' \| 'info' \| 'secondary' \| 'primary' \| 'warn'` | `'primary'` | The visual style of the toggle button     |
| `state`           | `'focus' \| 'default'`                                          | `'default'` | The visual state of the button            |
| `icon`            | `'off' \| 'right' \| 'left'`                                    | `'off'`     | The position of the icon                  |
| `iconName`        | `string`                                                        | `'toggle'`  | The name of the icon to display           |
| `toggled`         | `boolean`                                                       | `undefined` | Controlled mode: the current toggle state |
| `defaultToggled`  | `boolean`                                                       | `false`     | Uncontrolled mode: initial toggle state   |
| `onToggledChange` | `(isToggled: boolean) => void`                                  | `undefined` | Callback when toggle state changes        |
| `label`           | `string`                                                        | `undefined` | Text label for the button                 |
| `size`            | `'default' \| 'sm' \| 'lg' \| 'large' \| 'icon'`                | `'default'` | The size of the button                    |
| `className`       | `string`                                                        | `''`        | Additional CSS classes                    |

Plus all standard HTML button attributes.

## Style Types

### Primary

- Toggled: Dark text on primary color background
- Untoggled: Light text with primary color border

### Secondary

- Toggled: Light text on border-default background
- Untoggled: Light text with border-default border

### Destructive

- Toggled: Light text on error color background
- Untoggled: Light text with error color border

### Info

- Toggled: Light text on info color background
- Untoggled: Light text with info color border

### Warn

- Toggled: Dark text on warning color background
- Untoggled: Light text with warning color border

## Sizes

- `sm`: Small button (h-9)
- `default`: Standard button (h-10)
- `lg`: Large button (h-11)
- `large`: Extra large button (h-12)
- `icon`: Square button for icons only (matches height)

## States

### Default

- Rounded pill shape (rounded-full)
- Standard appearance

### Focus

- More squared corners (rounded-xl)
- Used for special focus states

## Accessibility

- Uses `aria-pressed` to indicate toggle state
- Implements proper focus management
- Supports keyboard interaction
- Includes focus visible styles
- Color contrast compliance

## Design Tokens

The toggle button uses the following design tokens:

- `--text-light`: Light text color
- `--text-dark`: Dark text color
- `--content-primary`: Primary content color
- `--border-default`: Default border color
- `--status-error`: Error status color
- `--status-info`: Info status color
- `--status-warning`: Warning status color

## CSS Classes

The toggle button uses Tailwind CSS classes for styling, including:

- Base styles: Flexbox, rounded corners, transitions
- Interactive states: Hover, focus, active
- Shadow effects
- Scale animations on interaction
- Font styling (semibold, text-sm)

## Examples

```tsx
// Primary toggle with left icon
<ToggleButton
  styleType="primary"
  icon="left"
  iconName="moon"
  label="Dark Mode"
  onToggledChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
/>

// Warning toggle with right icon
<ToggleButton
  styleType="warn"
  icon="right"
  iconName="alert"
  label="Notifications"
  size="lg"
/>

// Info icon-only toggle
<ToggleButton
  styleType="info"
  size="icon"
  iconName="bell"
  aria-label="Toggle Notifications"
/>

// Destructive action toggle
<ToggleButton
  styleType="destructive"
  label="Maintenance Mode"
  defaultToggled={false}
/>
```

## Animations

The component includes smooth animations for:

- State transitions
- Hover effects
- Active state
- Focus state

## Design Guidelines

- Use clear, concise labels that describe the toggled state
- Maintain consistent sizing within the same context
- Use appropriate style types based on the action's context
- Consider using icons to enhance visual comprehension
- Ensure sufficient spacing between multiple toggle buttons
- Use disabled state appropriately to indicate unavailable options

## Best Practices

1. **Controlled vs Uncontrolled**

   - Use controlled mode when you need to manage the state externally
   - Use uncontrolled mode for simple, self-contained toggles

2. **Accessibility**

   - Always provide an aria-label when using icon-only buttons
   - Ensure the toggle state is clearly visible
   - Maintain keyboard navigation support

3. **Visual Feedback**

   - Use appropriate style types to convey meaning
   - Ensure sufficient contrast in both states
   - Utilize animations to provide feedback

4. **State Management**
   - Handle state changes appropriately
   - Provide immediate visual feedback
   - Consider the initial state carefully
