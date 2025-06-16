# Radio

The Radio component is a form control for selecting a single option from a set of choices. It follows the Borg UI design system with Star Trek Borg aesthetics.

## Features

- Single selection support
- Custom styling with cyberpunk theme
- Hover and focus states
- Disabled state support
- Accessible by default
- Label support
- Scale animation on hover

## Usage

```tsx
import { Radio } from '@borg/ui';

// Basic usage
<Radio
  name="options"
  value="option1"
  checked={selectedOption === 'option1'}
  onChange={setSelectedOption}
  label="Option 1"
/>

// Radio group
<div className="space-y-2">
  <Radio
    name="theme"
    value="light"
    checked={theme === 'light'}
    onChange={setTheme}
    label="Light Theme"
  />
  <Radio
    name="theme"
    value="dark"
    checked={theme === 'dark'}
    onChange={setTheme}
    label="Dark Theme"
  />
</div>

// Disabled state
<Radio
  name="settings"
  value="premium"
  checked={false}
  onChange={() => {}}
  disabled
  label="Premium Features (Unavailable)"
/>
```

## Props

| Prop         | Type                      | Default     | Description                                        |
| ------------ | ------------------------- | ----------- | -------------------------------------------------- |
| `checked`    | `boolean`                 | Required    | Whether the radio is selected                      |
| `onChange`   | `(value: string) => void` | Required    | Handler for selection changes                      |
| `disabled`   | `boolean`                 | `false`     | Whether the radio is disabled                      |
| `className`  | `string`                  | `""`        | Additional CSS classes for the root label element  |
| `aria-label` | `string`                  | `undefined` | Accessible label when no visible label is provided |
| `label`      | `string`                  | `undefined` | Text label for the radio                           |
| `name`       | `string`                  | Required    | Name attribute for form submission                 |
| `value`      | `string`                  | Required    | Value attribute for form submission                |
| `id`         | `string`                  | `undefined` | Custom ID for external label association           |

## States

### Unchecked

- Default state
- Border color: border-default
- Background: border-default
- Hover: Primary border color

### Checked

- Shows dot indicator
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

- Uses native radio input (visually hidden)
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Label association
- Screen reader support
- Group navigation with arrow keys

## Design Tokens

The component uses these design tokens:

- `--border-default`: Border and background color for unchecked state
- `--content-primary`: Border and background color for checked state
- `--text-light`: Text color for labels
- `--text-dark`: Text color for disabled state

## CSS Classes

The radio uses Tailwind CSS classes for styling, including:

- Base styles: Size, rounded corners, flexbox
- Interactive states: Hover, focus
- Transitions: Colors, transform
- Font styling (Orbitron font family)
- Custom focus ring

## Examples

### Basic Radio Group

```tsx
function RadioGroup() {
  const [selected, setSelected] = useState("option1");

  return (
    <div className="space-y-2">
      <Radio
        name="group"
        value="option1"
        checked={selected === "option1"}
        onChange={setSelected}
        label="Option 1"
      />
      <Radio
        name="group"
        value="option2"
        checked={selected === "option2"}
        onChange={setSelected}
        label="Option 2"
      />
      <Radio
        name="group"
        value="option3"
        checked={selected === "option3"}
        onChange={setSelected}
        label="Option 3"
      />
    </div>
  );
}
```

### Form Integration

```tsx
function SettingsForm() {
  const [settings, setSettings] = useState({
    theme: "light",
    mode: "auto",
  });

  return (
    <form className="space-y-4">
      <fieldset>
        <legend className="text-content-primary mb-2">Theme</legend>
        <div className="space-y-2">
          <Radio
            name="theme"
            value="light"
            checked={settings.theme === "light"}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                theme: value,
              }))
            }
            label="Light"
          />
          <Radio
            name="theme"
            value="dark"
            checked={settings.theme === "dark"}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                theme: value,
              }))
            }
            label="Dark"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-content-primary mb-2">Mode</legend>
        <div className="space-y-2">
          <Radio
            name="mode"
            value="auto"
            checked={settings.mode === "auto"}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                mode: value,
              }))
            }
            label="Automatic"
          />
          <Radio
            name="mode"
            value="manual"
            checked={settings.mode === "manual"}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                mode: value,
              }))
            }
            label="Manual"
          />
          <Radio
            name="mode"
            value="custom"
            checked={settings.mode === "custom"}
            onChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                mode: value,
              }))
            }
            disabled
            label="Custom (Coming Soon)"
          />
        </div>
      </fieldset>
    </form>
  );
}
```

### With Custom Styling

```tsx
<Radio
  name="custom"
  value="styled"
  checked={isSelected}
  onChange={setIsSelected}
  label="Custom Style"
  className="bg-surface-default p-2 rounded-lg hover:bg-background-elevated"
/>
```
