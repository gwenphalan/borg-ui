# Grid

A responsive grid layout system that adapts to different screen sizes.

## Features

- Responsive column layout
- Customizable gap spacing
- Grid item component
- Flexible content support
- Custom class support

## Import

```tsx
import { Grid, GridItem } from "@/components/layout/grid";
```

## Props

### Grid Props

| Prop        | Type             | Default | Description                |
| ----------- | ---------------- | ------- | -------------------------- |
| `children`  | `ReactNode`      | -       | Grid content               |
| `className` | `string`         | `''`    | Additional CSS classes     |
| `...props`  | `HTMLAttributes` | -       | Additional HTML attributes |

### GridItem Props

| Prop        | Type             | Default | Description                |
| ----------- | ---------------- | ------- | -------------------------- |
| `children`  | `ReactNode`      | -       | Grid item content          |
| `className` | `string`         | `''`    | Additional CSS classes     |
| `...props`  | `HTMLAttributes` | -       | Additional HTML attributes |

## Examples

### Basic Grid

```tsx
<Grid>
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>
```

### Custom Grid Layout

```tsx
<Grid className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  <GridItem className="col-span-2">Wide Item</GridItem>
  <GridItem>Regular Item</GridItem>
  <GridItem>Regular Item</GridItem>
</Grid>
```

### Grid with Cards

```tsx
<Grid>
  <GridItem>
    <Card title="Card 1">Content</Card>
  </GridItem>
  <GridItem>
    <Card title="Card 2">Content</Card>
  </GridItem>
  <GridItem>
    <Card title="Card 3">Content</Card>
  </GridItem>
</Grid>
```

## Responsive Behavior

The Grid component has built-in responsive breakpoints:

- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns

## Layout System

The Grid uses CSS Grid with:

- Default gap of 1.5rem (gap-6)
- Responsive column layout
- Equal width columns
- Automatic row creation

## CSS Variables

The component uses these theme variables:

```css
--background-default
--border-default
--content-primary
```

## Design Guidelines

- Maintain consistent spacing between items
- Consider content hierarchy in layout
- Use appropriate column counts for content type
- Ensure responsive behavior works well
- Keep grid items aligned and balanced
- Use grid-gap consistently
- Consider mobile-first design
- Test layouts at different breakpoints
