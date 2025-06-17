# Date Picker

A comprehensive date selection component with calendar interface and range support.

## Features

- Calendar view
- Range selection
- Min/max date constraints
- Localization support
- Custom formatting
- Keyboard navigation
- Accessibility support

## Import

```tsx
import { DatePicker } from "@/components/date-picker/date-picker";
```

## Props

| Prop        | Type                   | Default        | Description             |
| ----------- | ---------------------- | -------------- | ----------------------- |
| `value`     | `Date \| null`         | -              | Selected date           |
| `onChange`  | `(date: Date) => void` | -              | Date change handler     |
| `minDate`   | `Date`                 | -              | Minimum selectable date |
| `maxDate`   | `Date`                 | -              | Maximum selectable date |
| `format`    | `string`               | `'MM/dd/yyyy'` | Date format string      |
| `locale`    | `string`               | `'en-US'`      | Localization setting    |
| `disabled`  | `boolean`              | `false`        | Disable date picker     |
| `className` | `string`               | `''`           | Additional CSS classes  |
| `style`     | `CSSProperties`        | `{}`           | Additional CSS styles   |

## Examples

### Basic Date Picker

```tsx
<DatePicker value={selectedDate} onChange={setSelectedDate} />
```

### Date Picker with Range Constraints

```tsx
<DatePicker
  value={date}
  onChange={handleDateChange}
  minDate={new Date("2024-01-01")}
  maxDate={new Date("2024-12-31")}
/>
```

### Custom Formatted Date Picker

```tsx
<DatePicker
  value={date}
  onChange={handleDateChange}
  format="dd MMMM yyyy"
  locale="en-GB"
/>
```

### Disabled Date Picker

```tsx
<DatePicker value={date} onChange={handleDateChange} disabled={true} />
```

## Features

### Calendar View

- Month navigation
- Year selection
- Week starts on Sunday/Monday
- Today highlighting

### Date Selection

- Single date selection
- Range constraints
- Disabled dates
- Clear selection

### Formatting

- Custom date formats
- Localization support
- 12/24 hour display
- Week number display

## Accessibility

The DatePicker component includes:

- ARIA calendar role
- Keyboard navigation
- Screen reader support
- Focus management
- Date announcements

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

- Use clear date format
- Show selected date clearly
- Provide clear navigation
- Consider mobile interaction
- Use appropriate spacing
- Maintain readable text size
- Show valid date ranges
- Consider keyboard users
- Provide clear feedback
- Handle invalid dates
