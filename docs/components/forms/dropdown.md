# Dropdown

A searchable dropdown component with single/multi-select support, following Borg UI's design principles.

## Features

- Single and multi-select modes
- Search functionality
- Custom options with icons
- Keyboard navigation
- Disabled states
- Group management
- Custom styling

## Import

```tsx
import { Dropdown } from "@/components/dropdown/Dropdown";
```

## Props

| Prop           | Type                                  | Default       | Description                               |
| -------------- | ------------------------------------- | ------------- | ----------------------------------------- |
| `options`      | `DropdownOption[]`                    | -             | Array of options to display               |
| `value`        | `string \| string[]`                  | -             | Selected value(s)                         |
| `onChange`     | `(value: string \| string[]) => void` | -             | Callback when selection changes           |
| `isOpen`       | `boolean`                             | -             | Controlled open state                     |
| `onOpenChange` | `(isOpen: boolean) => void`           | -             | Callback to toggle open state             |
| `placeholder`  | `string`                              | `'Select...'` | Text to display when no value is selected |
| `label`        | `string`                              | -             | Optional label for the dropdown           |
| `disabled`     | `boolean`                             | `false`       | Whether the dropdown is disabled          |
| `fullWidth`    | `boolean`                             | `false`       | Whether to take full width of container   |
| `multiSelect`  | `boolean`                             | `false`       | Enable multi-select mode                  |

### DropdownOption Type

```tsx
interface DropdownOption {
  value?: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  isSeparator?: boolean;
  disabledReason?: React.ReactNode;
}
```

## Examples

### Basic Dropdown

```tsx
<Dropdown
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option"
/>
```

### Multi-select Dropdown

```tsx
<Dropdown
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  value={selectedFruits}
  onChange={setSelectedFruits}
  multiSelect
  placeholder="Select fruits"
/>
```

### Dropdown with Icons

```tsx
<Dropdown
  options={[
    { value: "settings", label: "Settings", icon: "settings" },
    { value: "profile", label: "Profile", icon: "user" },
    { value: "logout", label: "Logout", icon: "logout" },
  ]}
  value={selectedOption}
  onChange={setSelectedOption}
/>
```

## States

The Dropdown component supports:

- **Open/Closed**: Controlled by `isOpen` prop
- **Selected**: Single or multiple values
- **Disabled**: Both at dropdown and option level
- **Focused**: Visual feedback on focus
- **Hover**: Visual feedback on option hover

## Accessibility

The Dropdown follows WCAG guidelines with:

- ARIA combobox role
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels and descriptions

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--interactive-accentfocus
--text-background-default
--text-light
--text-dark
```

## Design Guidelines

- Use clear, concise labels for options
- Group related options together
- Use separators to organize long lists
- Provide feedback for disabled options
- Consider keyboard navigation patterns
- Maintain consistent width within forms
- Use icons sparingly and consistently
