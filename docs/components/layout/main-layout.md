# Main Layout

The primary layout structure component for organizing page content.

## Features

- Header integration
- Footer integration
- Sidebar support
- Content area
- Responsive design
- Accessibility support

## Import

```tsx
import { MainLayout } from "@/components/layout/main-layout";
```

## Props

| Prop        | Type            | Default | Description            |
| ----------- | --------------- | ------- | ---------------------- |
| `children`  | `ReactNode`     | -       | Main content           |
| `header`    | `ReactNode`     | -       | Header component       |
| `footer`    | `ReactNode`     | -       | Footer component       |
| `sidebar`   | `ReactNode`     | -       | Sidebar content        |
| `className` | `string`        | `''`    | Additional CSS classes |
| `style`     | `CSSProperties` | `{}`    | Additional CSS styles  |

## Examples

### Basic Layout

```tsx
<MainLayout header={<Header />} footer={<Footer />}>
  <main>Page content</main>
</MainLayout>
```

### Layout with Sidebar

```tsx
<MainLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
  <div className="content">
    <h1>Dashboard</h1>
    <p>Main content area</p>
  </div>
</MainLayout>
```

### Custom Layout

```tsx
<MainLayout header={<CustomHeader />} className="min-h-screen">
  <div className="grid grid-cols-12 gap-4">
    <aside className="col-span-3">
      <Navigation />
    </aside>
    <main className="col-span-9">{children}</main>
  </div>
</MainLayout>
```

## Features

### Structure

- Header placement
- Footer placement
- Sidebar integration
- Content area

### Layout

- Responsive design
- Grid system
- Flexible spacing
- Custom widths

### Behavior

- Sticky header
- Fixed sidebar
- Scroll handling
- Mobile adaptation

## Accessibility

The MainLayout component includes:

- Semantic structure
- Skip navigation
- Focus management
- Screen reader support
- Landmark roles

## CSS Variables

The component uses these theme variables:

```css
--background-default
--background-elevated
--border-default
--content-primary
```

## Design Guidelines

- Use consistent spacing
- Consider mobile layout
- Maintain hierarchy
- Handle long content
- Keep navigation accessible
- Test responsive design
- Consider scroll behavior
- Manage z-index stacking
- Ensure sufficient contrast
- Use appropriate widths
