# @unimatrix-01/ui

A modern React UI component library with a holographic theme, built with TypeScript, Tailwind CSS, and React.

## Features

- 🎨 Modern holographic design system
- 📦 20+ reusable components
- 🎯 Built with TypeScript
- 🎨 Styled with Tailwind CSS
- 📱 Fully responsive
- ♿ Accessibility-first
- 🎯 Zero runtime CSS-in-JS
- 📦 Tree-shakeable
- 🎨 Built-in icon system with project override support

## Installation

```bash
npm install @unimatrix-01/ui
# or
yarn add @unimatrix-01/ui
# or
pnpm add @unimatrix-01/ui
```

## Quick Setup

We provide a setup script to quickly get started:

```bash
# Install the package
npm install @unimatrix-01/ui

# Run the setup script
npm run setup

# Set up icons
npm run setup-icons
```

This will:

1. Install the package
2. Set up the theme system
3. Download default icons
4. Install the VS Code extension for easy icon management

## Usage

First, ensure your project is set up with React and Tailwind CSS. Then, import the main stylesheet in your application's entry point:

```tsx
import "@unimatrix-01/ui/dist/style.css";
```

Then, import the components you need:

```tsx
import { Button, Card, Modal } from "@unimatrix-01/ui";

function App() {
  return <Button>Click me</Button>;
}
```

### Icon System

The library includes a flexible icon system that automatically handles two types of icons:

1.  **Built-in Icons**: A curated set of commonly used icons is included directly in the package for immediate use (e.g., `check`, `arrow`, `calendar`).
2.  **Project-specific Icons**: You can add your own custom SVG icons to your project, and the `Icon` component will load them dynamically.

**How to Use Custom Icons:**

To add your own icons, place your SVG files in the `public/icons` directory of your project. The component will automatically find them.

**Example:**

1.  Add `my-custom-icon.svg` to `your-project/public/icons/`.
2.  Use it in your code:

    ```tsx
    import { Icon } from "@unimatrix-01/ui";

    <Icon name="my-custom-icon" />;
    ```

**Important Note:** The dynamic loading of project-specific icons relies on **Vite** and an SVGR plugin (like `vite-plugin-svgr`) to transform SVGs into React components. If you are using a different build tool (e.g., Webpack, Next.js), this feature may not work out of the box and might require additional configuration.

### Tailwind CSS Setup

Add the library's component paths to your `tailwind.config.js` file to ensure Tailwind processes the classes used in the components:

```js
module.exports = {
  content: [
    // ... your content configuration
    "./node_modules/@unimatrix-01/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ... your theme configuration
    },
  },
  plugins: [],
};
```

### Base App Setup with Holographic Effects

To set up your app with the holographic and warp speed effects, follow these steps:

1. First, import the required components:

```tsx
import { HologramContainer, WarpSpeedBackground } from "@unimatrix-01/ui";
```

2. Wrap your app's root component with the `WarpSpeedBackground` and `HologramContainer`:

```tsx
function App() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen text-[var(--text-light)]">
      <WarpSpeedBackground />
      <HologramContainer>{/* Your app content goes here */}</HologramContainer>
    </div>
  );
}
```

3. For proper modal support, ensure your modals are rendered inside the `HologramContainer`:

```tsx
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen text-[var(--text-light)]">
      <WarpSpeedBackground />
      <HologramContainer>
        {/* Your app content */}
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

        {/* Modal will inherit holographic effects when rendered inside HologramContainer */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Holographic Modal"
        >
          Modal content here
        </Modal>
      </HologramContainer>
    </div>
  );
}
```

4. Add the required CSS variables to your global styles:

```css
:root {
  --background-default: #000000;
  --background-elevated: #1a1a1a;
  --border-default: #333333;
  --content-primary: #ffffff;
  --content-secondary: #888888;
  --interactive-accentfocus: #00ff9f;
  --status-error: #ff3264;
  --status-info: #00a3ff;
  --status-warning: #ffb800;
  --surface-default: #000000;
  --text-light: #ffffff;
  --text-background-default: #ffffff;
  --text-dark: #000000;
}
```

The `WarpSpeedBackground` component provides a dynamic, animated background effect, while the `HologramContainer` adds the holographic styling to all content within it. The holographic effect includes:

- Subtle transparency
- Glowing borders
- Light refraction effects
- Dynamic hover states

Note: The holographic effects work best on dark backgrounds and may need to be adjusted based on your specific design requirements.

## Component Documentation

### Avatar

A circular or square avatar component that can display an image, initials, or both.

```tsx
import { Avatar } from '@unimatrix-01/ui';

// Basic usage
<Avatar src="https://example.com/avatar.jpg" alt="User Name" />

// With initials
<Avatar initials="JD" status="online" size="md" />

// With status
<Avatar
  src="https://example.com/avatar.jpg"
  alt="User Name"
  status="busy"
  size="lg"
  rounded={false}
/>
```

Props:

- `src`: string - Image source URL
- `alt`: string - Alt text for the image
- `initials`: string - Initials to display if no image
- `status`: 'online' | 'offline' | 'away' | 'busy' - Status indicator
- `size`: 'sm' | 'md' | 'lg' - Size of the avatar
- `rounded`: boolean - Whether the avatar is rounded (default: true)

### Badge

A small badge component for displaying status, counts, or labels.

```tsx
import { Badge } from '@unimatrix-01/ui';

// Basic usage
<Badge>Default</Badge>

// Variants
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// Pill style
<Badge pill>Pill Badge</Badge>

// Removable badge
<Badge removable onRemove={() => console.log('removed')}>
  Removable
</Badge>
```

Props:

- `variant`: 'default' | 'info' | 'success' | 'warning' | 'error'
- `pill`: boolean - Whether to use pill style
- `removable`: boolean - Whether the badge can be removed
- `onRemove`: () => void - Callback when badge is removed

### Button

A versatile button component with multiple styles and variants.

```tsx
import { Button } from '@unimatrix-01/ui';

// Basic usage
<Button>Click me</Button>

// With icon
<Button icon="left" iconName="placeholder">Icon Left</Button>
<Button icon="right" iconName="placeholder">Icon Right</Button>

// Style types
<Button styleType="primary">Primary</Button>
<Button styleType="secondary">Secondary</Button>
<Button styleType="destructive">Destructive</Button>
<Button styleType="info">Info</Button>
<Button styleType="warn">Warning</Button>
```

Props:

- `styleType`: 'primary' | 'secondary' | 'destructive' | 'info' | 'warn'
- `icon`: 'left' | 'right' | 'off'
- `iconName`: string - Name of the icon to display
- `disabled`: boolean
- `onClick`: (event: React.MouseEvent) => void

### Card

A flexible card component for displaying content in a contained box.

```tsx
import { Card } from '@unimatrix-01/ui';

// Basic usage
<Card title="Card Title" subtitle="Card Subtitle">
  Card content goes here
</Card>

// With image
<Card
  title="Card with Image"
  subtitle="With thumbnail"
  image={imageUrl}
  actions={<Button>Action</Button>}
>
  Content
</Card>

// Variants
<Card variant="primary" title="Primary Card">Content</Card>
<Card variant="outlined" title="Outlined Card">Content</Card>

// Clickable card
<Card
  title="Clickable Card"
  clickable
  onClick={() => console.log('clicked')}
>
  Click me
</Card>
```

Props:

- `title`: string
- `subtitle`: string
- `image`: string - URL of the card image
- `variant`: 'default' | 'primary' | 'outlined'
- `clickable`: boolean
- `disabled`: boolean
- `actions`: ReactNode - Action buttons or elements
- `onClick`: () => void

### Checkbox

A checkbox input component with support for indeterminate state.

```tsx
import { Checkbox } from '@unimatrix-01/ui';

// Basic usage
<Checkbox
  checked={checked}
  onChange={setChecked}
  label="Checkbox Label"
/>

// Indeterminate state
<Checkbox
  checked={checked}
  indeterminate={indeterminate}
  onChange={handleChange}
  label="Indeterminate Checkbox"
/>

// Disabled states
<Checkbox disabled checked={false} label="Disabled Unchecked" />
<Checkbox disabled checked={true} label="Disabled Checked" />
```

Props:

- `checked`: boolean
- `indeterminate`: boolean
- `disabled`: boolean
- `label`: string
- `onChange`: (checked: boolean) => void

### Chip

A small, interactive element for displaying tags, filters, or selections.

```tsx
import { Chip } from '@unimatrix-01/ui';

// Basic usage
<Chip label="Default" />

// Variants
<Chip label="Primary" variant="primary" />
<Chip label="Info" variant="info" />
<Chip label="Warning" variant="warning" />
<Chip label="Error" variant="error" />

// Sizes
<Chip label="Small" size="sm" />
<Chip label="Large" size="lg" />

// With icon
<Chip
  label="With Icon"
  icon={<Icon name="placeholder" size={16} />}
/>

// Closable
<Chip
  label="Closable"
  closable
  onClose={() => console.log('closed')}
/>
```

Props:

- `label`: string
- `variant`: 'default' | 'primary' | 'info' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: ReactNode
- `closable`: boolean
- `onClose`: () => void
- `clickable`: boolean
- `onClick`: () => void

### DatePicker

A date selection component with support for single date, range, and multiple dates.

```tsx
import { DatePicker } from '@unimatrix-01/ui';

// Single date
<DatePicker
  label="Single Date"
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
  clearable
/>

// Date range
<DatePicker
  label="Date Range"
  value={dateRange}
  onChange={setDateRange}
  pickerType="range"
  placeholder="Pick a date range"
  clearable
/>

// Multiple dates
<DatePicker
  label="Multiple Dates"
  value={dates}
  onChange={setDates}
  pickerType="multiple"
  placeholder="Pick multiple dates"
  clearable
/>
```

Props:

- `label`: string
- `value`: Date | [Date, Date] | Date[]
- `onChange`: (value: Date | [Date, Date] | Date[]) => void
- `pickerType`: 'single' | 'range' | 'multiple'
- `placeholder`: string
- `clearable`: boolean
- `disabled`: boolean
- `error`: boolean
- `helperText`: string
- `value`: Date | Date[] | [Date | null, Date | null] | null
- `onChange`: (value: Date | Date[] | [Date, Date] | [Date | null, Date | null] | null) => void
- `pickerType?`: 'single' | 'range' | 'multiple' | 'month' | 'year'
- `placeholder?`: string
- `disabled?`: boolean
- `readOnly?`: boolean
- `minDate?`: Date
- `maxDate?`: Date
- `dateFormat?`: string
- `clearable?`: boolean
- `open?`: boolean
- `onOpenChange?`: (open: boolean) => void
- `error?`: boolean
- `helperText?`: string

### Dropdown

A dropdown menu component with support for single and multi-select.

```tsx
import { Dropdown } from '@unimatrix-01/ui';

// Basic usage
<Dropdown
  label="My Dropdown"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { isSeparator: true },
    { value: 'option3', label: 'Option 3 (Disabled)', disabled: true }
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Select an option..."
/>

// Multi-select
<Dropdown
  label="Multi-Select"
  options={options}
  value={selected}
  onChange={handleChange}
  multiSelect={true}
  placeholder="Select options..."
/>
```

Props:

- `label`: string
- `options`: DropdownOption[]
- `value`: string | string[]
- `onChange`: (value: string | string[]) => void
- `multiSelect`: boolean
- `placeholder`: string
- `disabled`: boolean
- `error`: boolean
- `helperText`: string
- `isOpen`: boolean
- `onOpenChange`: (isOpen: boolean) => void
- `fullWidth?`: boolean

### Icon

A component for displaying icons with customizable size and color.

```tsx
import { Icon } from '@unimatrix-01/ui';

// Basic usage
<Icon name="placeholder" size={32} color="#00FF9F" />

// Different sizes
<Icon name="check" size={16} color="#FF3264" />
<Icon name="arrow" size={24} color="#8888FF" />
```

Props:

- `name`: string - Icon name
- `size`: number - Size in pixels
- `color`: string - Color value
- `className?`: string

### Menu

A navigation menu component with support for horizontal and vertical layouts.

```tsx
import { Menu } from '@unimatrix-01/ui';

// Horizontal menu
<Menu
  items={[
    {
      label: "Home",
      href: "/",
      icon: <Icon name="placeholder" size={18} />
    },
    {
      label: "Features",
      children: [
        { label: "Feature A", href: "/features/a" },
        { label: "Feature B", href: "/features/b" }
      ]
    }
  ]}
/>

// Vertical menu
<Menu
  items={menuItems}
  orientation="vertical"
/>
```

Props:

- `items`: MenuItem[]
- `orientation`: 'horizontal' | 'vertical'
- `activePath`: string
- `onPathChange`: (path: string) => void
- `className?`: string
- `onOptionSelect?`: (option: string) => void
- `maxLength?`: number
- `autoComplete?`: string
- `name?`: string

### Modal

A modal dialog component for displaying content in an overlay.

```tsx
import { Modal } from '@unimatrix-01/ui';

// Basic usage
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Basic Modal"
  actions={[
    {
      label: "Close",
      onClick: () => setIsOpen(false),
      style: "primary"
    }
  ]}
>
  Modal content
</Modal>

// With status
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Status Modal"
  status="info"
  actions={[
    {
      label: "OK",
      onClick: () => setIsOpen(false),
      style: "info"
    }
  ]}
>
  Content
</Modal>
```

Props:

- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `status`: 'info' | 'success' | 'warning' | 'error'
- `icon`: string
- `actions`: ModalAction[]

### Radio

A radio button component for single selection from a group of options.

```tsx
import { Radio } from '@unimatrix-01/ui';

// Basic usage
<Radio
  name="group"
  value="option1"
  checked={selected === "option1"}
  onChange={handleChange}
  label="Option 1"
/>

// Disabled state
<Radio
  name="group"
  value="option2"
  checked={false}
  onChange={() => {}}
  label="Disabled"
  disabled
/>
```

Props:

- `name`: string
- `value`: string
- `checked`: boolean
- `onChange`: (value: string) => void
- `label`: string
- `disabled`: boolean

### Table

A data table component with sorting, filtering, and pagination.

```tsx
import { Table } from "@unimatrix-01/ui";

// Basic usage
<Table
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
  ]}
  data={tableData}
  pageSize={10}
  filterText={filter}
  onFilterTextChange={setFilter}
  showPagination={true}
/>;
```

Props:

- `columns`: TableColumn[]
- `data`: any[]
- `pageSize`: number
- `filterText`: string
- `onFilterTextChange`: (text: string) => void
- `showPagination`: boolean
- `selectable`: boolean
- `selectedRows`: number[]
- `onSelectedRowsChange`: (rows: number[]) => void

### TextInput

A text input component with support for various states and validations.

```tsx
import { TextInput } from '@unimatrix-01/ui';

// Basic usage
<TextInput
  label="Username"
  value={value}
  onChange={setValue}
  placeholder="Enter username"
/>

// With validation
<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  validationRules={{
    required: true,
    email: true
  }}
  errorMessage="Please enter a valid email"
/>

// With dropdown
<TextInput
  label="Country"
  value={country}
  onChange={setCountry}
  dropdownOptions={["USA", "Canada", "UK"]}
  placeholder="Select country"
/>
```

Props:

- `label`: string
- `value`: string
- `onChange`: (value: string) => void
- `type`: string
- `placeholder`: string
- `disabled`: boolean
- `error`: boolean
- `warning`: boolean
- `validationRules`: ValidationRules
- `errorMessage`: string
- `dropdownOptions`: string[]

### TextArea

A multi-line text input component.

```tsx
import { TextArea } from '@unimatrix-01/ui';

// Basic usage
<TextArea
  label="Description"
  value={value}
  onChange={setValue}
  placeholder="Enter description"
  lineHeight={4}
  maxLength={100}
/>

// With error state
<TextArea
  label="Error State"
  value={value}
  onChange={setValue}
  error
  errorMessage="This is an error message"
  lineHeight={3}
  maxLength={50}
/>
```

Props:

- `label`: string
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `lineHeight`: number
- `maxLength`: number
- `error`: boolean
- `warning`: boolean
- `errorMessage`: string
- `warningMessage`: string
- `disabled`: boolean
- `className?`: string
- `autoComplete?`: string
- `name?`: string
- `validationRules?`: object

### TimePicker

A time selection component with various formats and options.

```tsx
import { TimePicker } from '@unimatrix-01/ui';

// Basic usage
<TimePicker
  label="Time"
  value={time}
  onChange={setTime}
  placeholder="Pick a time"
  clearable
/>

// 12-hour format
<TimePicker
  label="12-Hour Format"
  value={time}
  onChange={setTime}
  format="hh:mm A"
  placeholder="hh:mm AM/PM"
/>

// With seconds
<TimePicker
  label="With Seconds"
  value={time}
  onChange={setTime}
  showSeconds
  placeholder="hh:mm:ss"
/>

// With time constraints
<TimePicker
  label="Business Hours"
  value={time}
  onChange={setTime}
  minTime={new Date(0, 0, 0, 9, 0, 0)}
  maxTime={new Date(0, 0, 0, 17, 0, 0)}
  placeholder="09:00 - 17:00"
/>
```

Props:

- `label`: string
- `value`: Date | null
- `onChange`: (value: Date | null) => void
- `format`: string
- `showSeconds`: boolean
- `step`: number
- `minTime`: Date
- `maxTime`: Date
- `placeholder`: string
- `clearable`: boolean
- `disabled`: boolean
- `error`: boolean
- `helperText`: string
- `readOnly?`: boolean
- `onClear?`: () => void
- `open?`: boolean
- `onOpenChange?`: (open: boolean) => void

### Toggle

A toggle switch component for boolean values.

```tsx
import { Toggle } from '@unimatrix-01/ui';

// Basic usage
<Toggle
  checked={checked}
  onToggle={setChecked}
/>

// Disabled states
<Toggle
  checked={false}
  disabled
  onToggle={() => {}}
/>
<Toggle
  checked={true}
  disabled
  onToggle={() => {}}
/>
```

Props:

- `checked`: boolean
- `onToggle`: (checked: boolean) => void
- `disabled`: boolean
- `className`: string

### Tooltip

A tooltip component for displaying additional information.

```tsx
import { Tooltip } from '@unimatrix-01/ui';

// Basic usage
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>

// Different placements
<Tooltip content="Right tooltip" placement="right">
  <button>Right</button>
</Tooltip>

// With custom content
<Tooltip content={<span>Custom <b>JSX</b> content</span>}>
  <button>Custom Content</button>
</Tooltip>
```

Props:

- `content`: ReactNode
- `placement`: 'top' | 'right' | 'bottom' | 'left'
- `disabled`: boolean

## Quick Start

Setting up a new Borg UI project is now easier than ever! You can create a new project with just one command:

```bash
npx @unimatrix-01/ui
```

This interactive setup script will:

1. Ask for your project name
2. Let you choose your preferred React setup (Vite, Next.js, or Create React App)
3. Create a new project with all necessary dependencies
4. Set up the essential Borg UI files
5. Configure your project with the Borg UI theme and components

### Manual Setup

If you prefer to set up Borg UI manually in an existing project:

1. Install the package:

```bash
npm install @unimatrix-01/ui
```

2. Add the essential files to your project:

```typescript:src/App.tsx
import { useState } from "react";
import { HologramContainer } from "@unimatrix-01/ui";
import { WarpSpeedBackground } from "@unimatrix-01/ui";
import { MainLayout } from "./MainLayout";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <WarpSpeedBackground />
      <HologramContainer>
        <MainLayout isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />
      </HologramContainer>
    </div>
  );
}

export default App;
```

```typescript:src/MainLayout.tsx
import type { ReactNode } from "react";
import { Menu, Icon, Button } from "@unimatrix-01/ui";
import type { MenuItem } from "@unimatrix-01/ui";

interface MainLayoutProps {
  children?: ReactNode;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function MainLayout({ children, isDarkMode, onThemeToggle }: MainLayoutProps) {
  const menuItems: MenuItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Icon name="placeholder" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Features",
      children: [
        { label: "Feature A", href: "/features/a" },
        { label: "Feature B", href: "/features/b" },
      ],
      icon: <Icon name="placeholder" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Settings",
      align: "right" as const,
      children: [
        { label: "Profile", href: "/profile" },
        { label: "Settings", href: "/settings" },
        { label: "-", divider: true },
        { label: "Logout", onClick: () => alert("Logged out") },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-[var(--background-elevated)] border-b border-[var(--border-default)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[var(--content-primary)]">Borg UI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                icon="left"
                iconName={isDarkMode ? "sun" : "moon"}
                onClick={onThemeToggle}
                styleType="secondary"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
          <Menu items={menuItems} />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-[var(--background-elevated)] border-t border-[var(--border-default)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-[var(--content-secondary)]">© 2024 Borg UI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Terms</a>
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Privacy</a>
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

```css:src/App.css
/* Borg UI App Styles */
:root {
  /* Light Theme Variables */
  --background-default: #ffffff;
  --background-elevated: #f8f9fa;
  --border-default: #e9ecef;
  --content-primary: #212529;
  --content-secondary: #6c757d;
  --interactive-accentfocus: #0d6efd;
  --status-error: #dc3545;
  --status-info: #0dcaf0;
  --status-warning: #ffc107;
  --surface-default: #ffffff;
  --text-light: #f8f9fa;
  --text-background-default: #ffffff;
  --text-dark: #212529;
}

.dark {
  /* Dark Theme Variables */
  --background-default: #1a1a1a;
  --background-elevated: #2d2d2d;
  --border-default: #404040;
  --content-primary: #e9ecef;
  --content-secondary: #adb5bd;
  --interactive-accentfocus: #0d6efd;
  --status-error: #dc3545;
  --status-info: #0dcaf0;
  --status-warning: #ffc107;
  --surface-default: #2d2d2d;
  --text-light: #f8f9fa;
  --text-background-default: #1a1a1a;
  --text-dark: #212529;
}

/* Global Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-default);
  color: var(--content-primary);
}

/* Smooth Transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-elevated);
}

::-webkit-scrollbar-thumb {
  background: var(--content-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--content-primary);
}
```

```css:src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Borg UI styles */
@import './App.css';

/* Additional global styles */
html {
  scroll-behavior: smooth;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--interactive-accentfocus);
  outline-offset: 2px;
}

/* Selection styles */
::selection {
  background-color: var(--interactive-accentfocus);
  color: var(--text-light);
}
```

3. Import the styles in your main entry file (usually `src/main.tsx` or `src/index.tsx`):

```typescript
import "./index.css";
```

4. Start your development server:

```bash
npm run dev
```

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Name]
