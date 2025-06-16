# Toggle

The Toggle component is a switch control that provides a visual way to toggle between two states. It features smooth animations, hover effects, and follows the Borg UI design system with Star Trek Borg aesthetics.

## Features

- Smooth state transitions
- Interactive hover effects
- Animated handle with dynamic sizing
- Custom inner icon animation
- Disabled state support
- Accessible by default
- Customizable styling

## Usage

```tsx
import { Toggle } from '@borg/ui';

// Basic usage
<Toggle
  checked={isEnabled}
  onToggle={setIsEnabled}
/>

// Disabled state
<Toggle
  checked={true}
  disabled
/>

// With custom styling
<Toggle
  checked={isActive}
  onToggle={setIsActive}
  className="my-4"
/>
```

## Props

| Prop        | Type                          | Default     | Description                     |
| ----------- | ----------------------------- | ----------- | ------------------------------- |
| `checked`   | `boolean`                     | Required    | The current state of the toggle |
| `disabled`  | `boolean`                     | `false`     | Whether the toggle is disabled  |
| `onToggle`  | `(newState: boolean) => void` | `undefined` | Handler for state changes       |
| `className` | `string`                      | `undefined` | Additional CSS classes          |

## States

### Off State

- Red background color
- Light inner icon
- Handle at left position
- Hover expands handle and icon

### On State

- Primary color background
- Solid inner icon
- Handle at right position
- Hover expands handle

### Disabled

- Reduced opacity (60%)
- Cursor not-allowed
- No hover effects
- No animations

### Animation States

- Stretching animation on click
- Smooth handle movement
- Icon size transitions
- Color transitions

## Animations

The toggle features several carefully timed animations:

- Handle width animation:

  - Default: 25px
  - Hover: 29px
  - During toggle: 47px

- Handle position:

  - Off: Left 2px
  - On (normal): Left 23px
  - On (hover): Left 19px
  - During animation: Left 2px

- Inner icon:
  - Size changes based on state and hover
  - Position adjusts with handle
  - Color transitions with state

Animation timings:

- Stretch duration: 40ms
- Shrink duration: 80ms
- Color transitions: 200ms

## Accessibility

- Uses `role="switch"`
- Proper `aria-checked` state
- `aria-disabled` when disabled
- Screen reader support
- Keyboard navigation
- Focus management

## Design Tokens

The component uses these design tokens:

- `--content-primary`: On state background and icon color
- `--status-error`: Off state background and icon color
- `--background-default`: Handle background color

## CSS Classes

The toggle uses Tailwind CSS classes for styling, including:

- Base styles: Size, rounded corners, positioning
- Interactive states: Hover, disabled
- Transitions: Colors, positions, sizes
- Shadow effects
- Overflow handling

## Examples

### Basic Toggle with Label

```tsx
function ToggleWithLabel({ label }: { label: string }) {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Toggle checked={isEnabled} onToggle={setIsEnabled} />
      <span className="text-content-primary text-sm font-orbitron">
        {label}
      </span>
    </div>
  );
}
```

### Settings Toggle Group

```tsx
function SettingsToggles() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoUpdate: true,
  });

  const updateSetting = (key: keyof typeof settings) => (newState: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: newState,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-content-primary">Notifications</span>
        <Toggle
          checked={settings.notifications}
          onToggle={updateSetting("notifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-content-primary">Dark Mode</span>
        <Toggle
          checked={settings.darkMode}
          onToggle={updateSetting("darkMode")}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-content-primary">Auto Update</span>
        <Toggle
          checked={settings.autoUpdate}
          onToggle={updateSetting("autoUpdate")}
        />
      </div>
    </div>
  );
}
```

### Form Integration

```tsx
function FeatureForm() {
  const [features, setFeatures] = useState({
    advanced: false,
    beta: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-content-primary">Advanced Features</label>
          <Toggle
            checked={features.advanced}
            onToggle={(newState) =>
              setFeatures((prev) => ({
                ...prev,
                advanced: newState,
              }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-content-primary">Beta Access</label>
          <Toggle
            checked={features.beta}
            onToggle={(newState) =>
              setFeatures((prev) => ({
                ...prev,
                beta: newState,
              }))
            }
            disabled={!features.advanced}
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-content-primary text-text-dark px-4 py-2 rounded-full"
      >
        Save Settings
      </button>
    </form>
  );
}
```
