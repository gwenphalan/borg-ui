# Modal

A modal dialog component that creates focused interactions with hologram effects.

## Features

- Hologram effect support
- Focus management
- Keyboard interaction
- Backdrop click handling
- Custom styling
- Accessibility support

## Import

```tsx
import { Modal } from "@/components/modal/Modal";
```

## Props

| Prop        | Type            | Default | Description               |
| ----------- | --------------- | ------- | ------------------------- |
| `isOpen`    | `boolean`       | -       | Controls modal visibility |
| `onClose`   | `() => void`    | -       | Close handler function    |
| `title`     | `string`        | -       | Modal title               |
| `children`  | `ReactNode`     | -       | Modal content             |
| `className` | `string`        | `''`    | Additional CSS classes    |
| `style`     | `CSSProperties` | `{}`    | Additional CSS styles     |

## Examples

### Basic Modal

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Basic Modal">
  <p>This is a basic modal dialog.</p>
</Modal>
```

### Modal with Custom Content

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Settings"
  className="max-w-xl"
>
  <div className="space-y-4">
    <h3>User Preferences</h3>
    <form>{/* Form content */}</form>
  </div>
</Modal>
```

### Modal with Hologram Effect

```tsx
<HologramContext.Provider value={true}>
  <Modal isOpen={isOpen} onClose={handleClose} title="Hologram Modal">
    <p>Modal with Star Trek Borg hologram effects.</p>
  </Modal>
</HologramContext.Provider>
```

## Features

### Focus Management

- Traps focus within modal
- Restores focus on close
- Keyboard navigation

### Styling

- Hologram effect support
- Custom class support
- Responsive design

### Interaction

- Backdrop click handling
- ESC key closes modal
- Close button

## Accessibility

The Modal component includes:

- ARIA dialog role
- Focus management
- Keyboard navigation
- Screen reader support
- ARIA labels

## CSS Variables

The component uses these theme variables:

```css
--background-elevated
--border-default
--content-primary
--interactive-accentfocus
```

## Design Guidelines

- Use clear, descriptive titles
- Keep content focused
- Consider mobile viewports
- Use appropriate spacing
- Maintain readable text
- Consider backdrop opacity
- Use hologram effects judiciously
- Ensure sufficient contrast
- Handle long content gracefully
- Provide clear close actions
