# Time Picker

A time selection component with 12/24 hour format support and interval controls.

## Features

- 12/24 hour format
- Minute intervals
- AM/PM selection
- Keyboard input
- Custom formatting
- Accessibility support

## Import

```tsx
import { TimePicker } from "@/components/time-picker/time-picker";
```

## Props

| Prop        | Type                     | Default | Description             |
| ----------- | ------------------------ | ------- | ----------------------- |
| `value`     | `string`                 | -       | Selected time value     |
| `onChange`  | `(time: string) => void` | -       | Time change handler     |
| `format`    | `'12h' \| '24h'`         | `'12h'` | Time format             |
| `interval`  | `number`                 | `15`    | Minute interval         |
| `minTime`   | `string`                 | -       | Minimum selectable time |
| `maxTime`   | `string`                 | -       | Maximum selectable time |
| `disabled`  | `boolean`                | `false` | Disable time picker     |
| `className` | `string`                 | `''`    | Additional CSS classes  |
| `style`     | `CSSProperties`          | `{}`    | Additional CSS styles   |

## Examples

### Basic Time Picker

```tsx
<TimePicker value={selectedTime} onChange={setSelectedTime} />
```

### 24-Hour Format

```tsx
<TimePicker
  value={time}
  onChange={handleTimeChange}
  format="24h"
  interval={30}
/>
```

### Time Range Constraints

```tsx
<TimePicker
  value={time}
  onChange={handleTimeChange}
  minTime="09:00"
  maxTime="17:00"
/>
```

### Custom Interval

```tsx
<TimePicker value={time} onChange={handleTimeChange} interval={5} />
```

## Features

### Time Format

- 12-hour format (AM/PM)
- 24-hour format
- Custom intervals
- Range constraints

### Input Methods

- Dropdown selection
- Keyboard input
- Scroll selection
- Clear value

### Validation

- Format validation
- Range checking
- Required field
- Error states

## Accessibility

The TimePicker component includes:

- ARIA time role
- Keyboard navigation
- Screen reader support
- Focus management
- Time announcements

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--interactive-accentfocus
--text-light
--text-dark
```

## Design Guidelines

- Use clear time format
- Show format indicator
- Provide clear input method
- Consider mobile interaction
- Use appropriate intervals
- Maintain readable text size
- Show valid time ranges
- Consider keyboard users
- Provide clear feedback
- Handle invalid times
