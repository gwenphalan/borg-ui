# Checkbox

The Checkbox component is a customizable form control that supports three states: checked, unchecked, and indeterminate. It follows the Borg UI design system with cyberpunk aesthetics.

## Features

- Three-state support (checked, unchecked, indeterminate)
- Custom styling with Star Trek Borg theme
- Hover and focus states
- Disabled state support
- Accessible by default
- Label support
- Scale animation on hover

## Usage

```tsx
import { Checkbox } from '@borg/ui';

// Basic usage
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Enable feature"
/>

// With indeterminate state
<Checkbox
  checked={someChecked}
  indeterminate={someChecked && !allChecked}
  onChange={handleChange}
  label="Select all"
/>

// Disabled state
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  disabled
  label="Unavailable option"
/>
```

## Props

| Prop            | Type                                                         | Default     | Description                                        |
| --------------- | ------------------------------------------------------------ | ----------- | -------------------------------------------------- |
| `checked`       | `boolean`                                                    | Required    | The checked state of the checkbox                  |
| `onChange`      | `(isChecked: boolean, isNowIndeterminate?: boolean) => void` | Required    | Handler for state changes                          |
| `disabled`      | `boolean`                                                    | `false`     | Whether the checkbox is disabled                   |
| `className`     | `string`                                                     | `""`        | Additional CSS classes for the root label element  |
| `aria-label`    | `string`                                                     | `undefined` | Accessible label when no visible label is provided |
| `indeterminate` | `boolean`                                                    | `false`     | Whether the checkbox is in indeterminate state     |
| `label`         | `string`                                                     | `undefined` | Text label for the checkbox                        |
| `id`            | `string`                                                     | `undefined` | Custom ID for external label association           |

## States

### Unchecked

- Default state
- Border color: border-default
- Background: border-default
- Hover: Primary border color

### Checked

- Shows check icon
- Border color: content-primary
- Background: content-primary
- Scale animation on hover

### Indeterminate

- Shows horizontal line
- Border color: content-primary
- Background: content-primary
- Scale animation on hover

### Disabled

- Reduced opacity (70%)
- Cursor not-allowed
- Muted colors
- No hover effects

### Focus

- Primary color outline
- 2px solid outline
- 1px offset
- Visible only when focused with keyboard

## Accessibility

- Uses native checkbox input (visually hidden)
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Label association
- Screen reader support

## Design Tokens

The component uses these design tokens:

- `--border-default`: Border and background color for unchecked state
- `--content-primary`: Border and background color for checked/indeterminate state
- `--text-light`: Text color for labels
- `--text-dark`: Text color for disabled state

## CSS Classes

The checkbox uses Tailwind CSS classes for styling, including:

- Base styles: Size, rounded corners, flexbox
- Interactive states: Hover, focus
- Transitions: Colors, transform
- Font styling (Orbitron font family)
- Custom focus ring

## Examples

### Basic Checkbox Group

```tsx
function CheckboxGroup() {
  const [selections, setSelections] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  return (
    <div className="space-y-2">
      <Checkbox
        checked={selections.option1}
        onChange={(checked) =>
          setSelections((prev) => ({
            ...prev,
            option1: checked,
          }))
        }
        label="Option 1"
      />
      <Checkbox
        checked={selections.option2}
        onChange={(checked) =>
          setSelections((prev) => ({
            ...prev,
            option2: checked,
          }))
        }
        label="Option 2"
      />
      <Checkbox
        checked={selections.option3}
        onChange={(checked) =>
          setSelections((prev) => ({
            ...prev,
            option3: checked,
          }))
        }
        label="Option 3"
      />
    </div>
  );
}
```

### Select All with Indeterminate State

```tsx
function SelectAllExample() {
  const [items, setItems] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  const allSelected = Object.values(items).every((v) => v);
  const someSelected = Object.values(items).some((v) => v);
  const isIndeterminate = someSelected && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    setItems(
      Object.keys(items).reduce(
        (acc, key) => ({
          ...acc,
          [key]: checked,
        }),
        {}
      )
    );
  };

  return (
    <div className="space-y-2">
      <Checkbox
        checked={allSelected}
        indeterminate={isIndeterminate}
        onChange={handleSelectAll}
        label="Select All"
      />
      {Object.entries(items).map(([key, checked]) => (
        <Checkbox
          key={key}
          checked={checked}
          onChange={(checked) =>
            setItems((prev) => ({
              ...prev,
              [key]: checked,
            }))
          }
          label={key}
          className="ml-4"
        />
      ))}
    </div>
  );
}
```

### With Custom Styling

```tsx
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Custom Style"
  className="bg-surface-default p-2 rounded-lg hover:bg-background-elevated"
/>
```
