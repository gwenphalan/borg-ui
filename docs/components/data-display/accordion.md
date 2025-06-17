# Accordion

An expandable content section component for organizing and displaying information.

## Features

- Multiple panels
- Animation support
- Icon indicators
- Custom styling
- Accessibility support

## Import

```tsx
import { Accordion } from "@/components/accordion/accordion";
```

## Props

| Prop          | Type              | Default | Description                  |
| ------------- | ----------------- | ------- | ---------------------------- |
| `items`       | `AccordionItem[]` | -       | Array of accordion items     |
| `defaultOpen` | `number[]`        | `[]`    | Initially open panel indices |
| `multiple`    | `boolean`         | `false` | Allow multiple open panels   |
| `className`   | `string`          | `''`    | Additional CSS classes       |
| `style`       | `CSSProperties`   | `{}`    | Additional CSS styles        |

### AccordionItem Type

```tsx
interface AccordionItem {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}
```

## Examples

### Basic Accordion

```tsx
<Accordion
  items={[
    {
      title: "Section 1",
      content: <p>Content for section 1</p>,
    },
    {
      title: "Section 2",
      content: <p>Content for section 2</p>,
    },
  ]}
/>
```

### Accordion with Icons

```tsx
<Accordion
  items={[
    {
      title: "Settings",
      content: <SettingsPanel />,
      icon: <Icon name="settings" />,
    },
    {
      title: "Profile",
      content: <ProfilePanel />,
      icon: <Icon name="user" />,
    },
  ]}
/>
```

### Multiple Open Panels

```tsx
<Accordion items={accordionItems} multiple={true} defaultOpen={[0, 2]} />
```

## Features

### Panels

- Expandable sections
- Custom headers
- Icon support
- Disabled state

### Animation

- Smooth transitions
- Height animation
- Icon rotation
- Custom timing

### Interaction

- Click to expand
- Keyboard support
- Multiple panels
- Default open

## Accessibility

The Accordion component includes:

- ARIA button roles
- Keyboard navigation
- Screen reader support
- Focus management
- Expanded states

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
--content-secondary
--interactive-accentfocus
```

## Design Guidelines

- Use clear titles
- Keep content focused
- Consider panel height
- Use appropriate icons
- Maintain consistency
- Handle long content
- Consider mobile layout
- Use animation judiciously
- Ensure sufficient contrast
- Test keyboard navigation
