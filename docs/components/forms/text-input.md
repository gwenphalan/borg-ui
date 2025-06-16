# Text Input

The Text Input component is a versatile form control that supports various input types, validation rules, error states, and dropdown functionality. It follows the Borg UI design system with Star Trek Borg aesthetics.

## Features

- Multiple input types support
- Built-in validation system
- Error and warning states
- Dropdown functionality
- Character count limit
- Password strength validation
- Clearable input option
- Accessible by default
- Customizable styling

## Usage

```tsx
import { TextInput } from '@borg/ui';

// Basic usage
<TextInput
  label="Username"
  value={username}
  onChange={setUsername}
  placeholder="Enter username"
/>

// With validation
<TextInput
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  validationRules={{
    minLength: 8,
    passwordStrength: {
      requireUppercase: true,
      requireNumber: true,
      requireSpecial: true
    }
  }}
/>

// With dropdown
<TextInput
  label="Country"
  value={country}
  onChange={setCountry}
  dropdownOptions={['USA', 'Canada', 'UK']}
  onOptionSelect={handleCountrySelect}
/>
```

## Props

| Prop              | Type                                                                        | Default     | Description                            |
| ----------------- | --------------------------------------------------------------------------- | ----------- | -------------------------------------- |
| `label`           | `string`                                                                    | `undefined` | Label text for the input               |
| `value`           | `string`                                                                    | Required    | Current input value                    |
| `onChange`        | `(value: string) => void`                                                   | Required    | Handler for value changes              |
| `placeholder`     | `string`                                                                    | `""`        | Placeholder text                       |
| `className`       | `string`                                                                    | `""`        | Additional CSS classes                 |
| `disabled`        | `boolean`                                                                   | `false`     | Whether the input is disabled          |
| `error`           | `boolean`                                                                   | `false`     | Force error state                      |
| `warning`         | `boolean`                                                                   | `false`     | Force warning state                    |
| `errorMessage`    | `string`                                                                    | `undefined` | Custom error message                   |
| `warningMessage`  | `string`                                                                    | `undefined` | Custom warning message                 |
| `dropdownOptions` | `string[]`                                                                  | `undefined` | Options for dropdown mode              |
| `onOptionSelect`  | `(option: string) => void`                                                  | `undefined` | Handler for dropdown selection         |
| `maxLength`       | `number`                                                                    | `undefined` | Maximum character length               |
| `autoComplete`    | `string`                                                                    | `undefined` | HTML autocomplete attribute            |
| `name`            | `string`                                                                    | `undefined` | Input name for forms                   |
| `type`            | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'`    | Input type                             |
| `isClearable`     | `boolean`                                                                   | `false`     | Show clear button when input has value |

### Validation Rules

The `validationRules` prop accepts an object with the following properties:

```typescript
{
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  custom?: (value: string) => string | undefined;
  passwordStrength?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecial?: boolean;
  };
}
```

## States

### Normal

- Default state with primary content color
- Hover state with subtle background change
- Focus state with primary border color

### Error

- Red border and icon
- Error message below input
- Triggered by validation rules or error prop

### Warning

- Yellow border and icon
- Warning message below input
- Triggered by validation rules or warning prop

### Disabled

- Reduced opacity
- Not interactive
- Cursor not-allowed

## Validation

### Built-in Validation

- Required field
- Minimum length
- Maximum length
- Pattern matching
- Email format (for type="email")
- Password strength rules

### Password Strength Validation

- Minimum length
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters

### Custom Validation

Custom validation function that returns an error message or undefined:

```tsx
<TextInput
  validationRules={{
    custom: (value) => {
      if (value.includes("admin")) {
        return 'Username cannot contain "admin"';
      }
      return undefined;
    },
  }}
/>
```

## Dropdown Mode

When `dropdownOptions` is provided, the input becomes a combobox with dropdown functionality:

- Click to open dropdown
- Type to filter options
- Select option to fill input
- Keyboard navigation support
- Automatic width matching
- Selected state indication

## Accessibility

- Proper label association
- ARIA attributes for states
- Keyboard navigation
- Focus management
- Screen reader support
- Clear button with aria-label
- Dropdown with role="menu"

## Design Tokens

The component uses these design tokens:

- `--content-primary`: Text and border colors
- `--content-secondary`: Placeholder text
- `--status-error`: Error state
- `--status-warning`: Warning state
- `--background-default`: Background color

## Examples

### Email Input with Validation

```tsx
<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="Enter your email"
  validationRules={{
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }}
/>
```

### Password Input with Strength Validation

```tsx
<TextInput
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  validationRules={{
    passwordStrength: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true,
    },
  }}
/>
```

### Searchable Dropdown

```tsx
<TextInput
  label="Country"
  value={country}
  onChange={setCountry}
  placeholder="Select or type to search"
  dropdownOptions={countries}
  onOptionSelect={handleCountrySelect}
  isClearable
/>
```

### Character Limited Input

```tsx
<TextInput
  label="Tweet"
  value={tweet}
  onChange={setTweet}
  maxLength={280}
  placeholder="What's happening?"
/>
```
