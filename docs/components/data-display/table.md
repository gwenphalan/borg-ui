# Table

A powerful data table component with sorting, filtering, and pagination capabilities.

## Features

- Column sorting
- Text filtering
- Pagination
- Row selection
- Custom cell rendering
- Responsive design
- Accessibility support

## Import

```tsx
import { Table } from "@/components/table/table";
```

## Props

| Prop                   | Type                        | Default | Description                         |
| ---------------------- | --------------------------- | ------- | ----------------------------------- |
| `columns`              | `TableColumn[]`             | -       | Column definitions                  |
| `data`                 | `Record<string, unknown>[]` | -       | Table data                          |
| `pageSize`             | `number`                    | `10`    | Number of rows per page             |
| `filterText`           | `string`                    | `''`    | Text to filter rows                 |
| `onFilterTextChange`   | `(text: string) => void`    | -       | Filter text change handler          |
| `showPagination`       | `boolean`                   | `true`  | Whether to show pagination controls |
| `className`            | `string`                    | `''`    | Additional CSS classes              |
| `selectable`           | `boolean`                   | `false` | Enable row selection                |
| `selectedRows`         | `number[]`                  | `[]`    | Selected row indices                |
| `onSelectedRowsChange` | `(rows: number[]) => void`  | -       | Selection change handler            |

### TableColumn Type

```tsx
interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  minWidth?: number;
  headerClass?: string;
  cellClass?: string;
}
```

## Examples

### Basic Table

```tsx
<Table
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "city", label: "City" },
  ]}
  data={[
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "London" },
    { name: "Bob", age: 35, city: "Tokyo" },
  ]}
/>
```

### Table with Selection

```tsx
<Table
  columns={[
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ]}
  data={data}
  selectable
  selectedRows={selectedRows}
  onSelectedRowsChange={setSelectedRows}
/>
```

### Custom Cell Rendering

```tsx
<Table
  columns={[
    { key: "name", label: "Name" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "error"}>
          {row.status}
        </Badge>
      ),
    },
  ]}
  data={data}
/>
```

## Features

### Sorting

- Click column headers to sort
- Multiple sort directions (asc/desc)
- Visual indicators for sort state

### Filtering

- Text-based filtering across all columns
- Real-time filtering
- Filter input field

### Pagination

- Configurable page size
- Page navigation controls
- Current page indicator

### Selection

- Single/multi-row selection
- Select all functionality
- Selection persistence

## Accessibility

The Table component includes:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Sort state announcements

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

- Use clear column headers
- Maintain consistent column widths
- Consider mobile responsiveness
- Use appropriate cell alignment
- Include loading states
- Provide empty state feedback
- Use selection judiciously
- Keep table width manageable
- Consider row density
- Use appropriate text truncation
