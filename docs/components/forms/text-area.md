# Text Area

The Text Area component is a multi-line text input that supports validation, error states, and character limits. It follows the Borg UI design system with Star Trek Borg aesthetics.

## Features

- Multi-line text input
- Built-in validation system
- Error and warning states
- Character count limit
- Configurable line height
- Accessible by default
- Customizable styling

## Usage

```tsx
import { TextArea } from '@borg/ui';

// Basic usage
<TextArea
  label="Description"
  value={description}
  onChange={setDescription}
  placeholder="Enter description"
/>

// With validation
<TextArea
  label="Bio"
  value={bio}
  onChange={setBio}
  validationRules={{
    required: true,
    minLength: 50,
    maxLength: 500
  }}
  lineHeight={5}
/>

// With character limit
<TextArea
  label="Message"
  value={message}
  onChange={setMessage}
  maxLength={1000}
  lineHeight={8}
/>
```

## Props

| Prop             | Type                      | Default     | Description                      |
| ---------------- | ------------------------- | ----------- | -------------------------------- |
| `label`          | `string`                  | Required    | Label text for the textarea      |
| `value`          | `string`                  | Required    | Current textarea value           |
| `onChange`       | `(value: string) => void` | Required    | Handler for value changes        |
| `placeholder`    | `string`                  | `""`        | Placeholder text                 |
| `className`      | `string`                  | `""`        | Additional CSS classes           |
| `disabled`       | `boolean`                 | `false`     | Whether the textarea is disabled |
| `error`          | `boolean`                 | `false`     | Force error state                |
| `warning`        | `boolean`                 | `false`     | Force warning state              |
| `errorMessage`   | `string`                  | `undefined` | Custom error message             |
| `warningMessage` | `string`                  | `undefined` | Custom warning message           |
| `maxLength`      | `number`                  | `undefined` | Maximum character length         |
| `lineHeight`     | `number`                  | `3`         | Number of visible lines          |
| `autoComplete`   | `string`                  | `undefined` | HTML autocomplete attribute      |
| `name`           | `string`                  | `undefined` | Input name for forms             |

### Validation Rules

The `validationRules` prop accepts an object with the following properties:

```typescript
{
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  custom?: (value: string) => string | undefined;
}
```

## States

### Normal

- Default state with primary content color
- Hover state with subtle background change
- Focus state with primary border color

### Error

- Red border and icon
- Error message below textarea
- Triggered by validation rules or error prop

### Warning

- Yellow border and icon
- Warning message below textarea
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
- Custom validation function

### Custom Validation

Custom validation function that returns an error message or undefined:

```tsx
<TextArea
  validationRules={{
    custom: (value) => {
      if (value.split("\n").length > 10) {
        return "Maximum 10 lines allowed";
      }
      return undefined;
    },
  }}
/>
```

## Accessibility

- Proper label association
- ARIA attributes for states
- Keyboard navigation
- Focus management
- Screen reader support
- Character count announcement

## Design Tokens

The component uses these design tokens:

- `--content-primary`: Text and border colors
- `--content-secondary`: Placeholder text
- `--status-error`: Error state
- `--status-warning`: Warning state
- `--background-default`: Background color

## CSS Classes

The textarea uses Tailwind CSS classes for styling, including:

- Base styles: Flexbox, rounded corners, transitions
- Interactive states: Hover, focus, active
- Error and warning states
- Font styling (Orbitron font family)
- Responsive sizing

## Examples

### Basic Text Area

```tsx
<TextArea
  label="Comments"
  value={comments}
  onChange={setComments}
  placeholder="Enter your comments"
  lineHeight={4}
/>
```

### With Validation and Character Limit

```tsx
<TextArea
  label="Review"
  value={review}
  onChange={setReview}
  validationRules={{
    required: true,
    minLength: 100,
    maxLength: 1000,
  }}
  maxLength={1000}
  lineHeight={6}
  placeholder="Write your review (minimum 100 characters)"
/>
```

### Custom Validation

```tsx
<TextArea
  label="Code Snippet"
  value={code}
  onChange={setCode}
  validationRules={{
    custom: (value) => {
      if (!value.includes("function")) {
        return "Must include a function definition";
      }
      return undefined;
    },
  }}
  lineHeight={10}
/>
```

### Disabled State

```tsx
<TextArea
  label="Read Only Content"
  value={content}
  onChange={setContent}
  disabled
  lineHeight={4}
/>
```
