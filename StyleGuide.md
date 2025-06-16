# Borg UI - Style Guide

## 1. Core Philosophy

The Borg UI design language emphasizes a futuristic, Star Trek Borg aesthetic, characterized by a dark theme, vibrant accent colors (primarily a bright green), and the "Orbitron" font. Components should be functional, accessible, and visually consistent, providing clear feedback to the user. The design is sharp, with a mix of hard edges and specific rounded corner values.

## 2. Color Palette

All colors are managed via CSS Custom Properties defined in `src/index.css` and accessed in components through the mandatory `styleMap` object.

### Primary Colors:

- `--background-default`: `rgba(8, 20, 11, 1)` - The primary background for the application.
- `--background-elevated`: `rgba(12, 29, 18, 1)` - Used for surfaces that are slightly elevated, like dropdown menus, tooltips, and some input backgrounds.
- `--surface-default`: `rgba(16, 37, 25, 1)` - Background for interactive elements like input fields, modal bodies, and accordion items.
- `--content-primary`: `rgba(0, 255, 159, 1)` - The main accent color for text, icons, active states, and highlights.
- `--content-secondary`: `rgba(0, 178, 115, 1)` - For secondary text, placeholder text, disabled elements, and less emphasized content.
- `--border-default`: `rgba(0, 77, 38, 1)` - Standard border color for components like inputs, modals, tables.
- `--interactive-accentfocus`: `rgba(51, 255, 184, 1)` - Used for focus indicators and selected item highlights.

### Text Colors:

- `--text-light`: `rgba(8, 20, 11, 1)` - Used for text on light/accent backgrounds (e.g., text on a `--content-primary` button).
- `--text-dark`: `rgba(208, 255, 221, 1)` (from `index.css`) or `#003D1E` (seen in Accordion's open state) - For text on darker accent backgrounds. Note: `content-primary` is also frequently used for text.
- `--text-background-default`: `rgba(8, 20, 11, 1)` - (Same as `--background-default`).

### Status Colors:

- `--status-error`: `rgba(255, 50, 100, 1)` - For error messages, icons, and input states.
- `--status-info`: `rgba(32, 160, 255, 1)` - For informational messages and icons.
- `--status-warning`: `rgba(255, 192, 0, 1)` - For warning messages, icons, and input states.
- `--status-success`: (Not explicitly in `index.css` general variables but `success-state` icon uses `#00FF9F` which matches `--content-primary`) - Implied by `content-primary` for success states.

## 3. Typography

- **Font Family**: `Orbitron` is the primary and only font family.
  - Use Tailwind: `font-[Orbitron]`
- **Weights**:
  - Normal/Default: `700` (bold - set in `:root`)
  - Input Fields / Component Text: `font-extrabold` (800)
  - Labels / Titles: `font-black` (900) or `font-black`
- **Sizes**:
  - Form Labels: `12px` (e.g., `text-[12px]`)
  - Input Text / Standard Component Text: `16px` (e.g., `text-[16px]`)
  - Accordion Titles: `18px` (e.g., `text-[18px]`)
  - Modal Titles: `20px` (e.g., `text-[20px]`)
  - Tooltip Text: `text-xs` (Tailwind's 12px)
- **Case**: Labels are often `uppercase`.
- **Tracking**: Labels often use `tracking-[2px]`.
- **Line Height**: Default `1.5`. Specific components may adjust.

## 4. Layout and Spacing

- **General Approach**: Use Flexbox for component internal layout.
- **Padding**:
  - Input-like elements (TextInput, TextArea, Dropdown button): `px-[11px] py-[11px]`.
  - Dropdown/Menu items: `py-2 px-4`.
  - Dropdown menu container: `p-2`.
  - Modal container: `p-[24px]`.
  - Accordion headers: `px-6 py-4`.
- **Margins/Gaps**:
  - Use Tailwind's `gap-` utilities for spacing between elements (e.g., `gap-[5px]` between label and input).
  - `space-y-1` or `space-x-3` for menu items.
- **Full Width**: Components like `TextInput` and `Dropdown` can be `fullWidth` (using `w-full`).

## 5. Borders, Outlines, and Shadows

### Borders:

- **Standard**: `border` or `border-2` with `border-(--border-default)`.
- **Rounded Corners**:
  - Inputs, wrapper elements: `rounded-[5px]`.
  - Dropdown menus, table containers: `rounded-lg` (8px).
  - Modals: `rounded-[15px]`.
  - Accordions: `rounded-[12px]`.
  - Toggles: `rounded-[22px]` (track), `rounded-[13px]` (handle).
  - Buttons (Modal Actions): `rounded-[46.79px]!` (pill shape).
  - Buttons (general if not specified): default to `rounded-md` (6px) from DaisyUI or component-specific.

### Outlines:

- **Input Wrappers**: `outline-2 -outline-offset-1` or `-outline-offset-2`.
  - Default: `outline-(--border-default)`.
  - Focused: `outline-(--content-primary)`.
  - Error: `outline-(--status-error)`.
  - Warning: `outline-(--status-warning)`.
- **Focus Visible (Keyboard Navigation)**:
  - Dropdown button: `focus-visible:outline-2 focus-visible:outline-(--interactive-accentfocus)`.
  - General interactive elements should have clear focus states.

### Shadows:

- **Elevated Elements**: `shadow-lg` for dropdown menus, modals, tooltips.
- **Specific Components**:
  - Toggle: Custom shadows `trackShadow`, `handleBaseShadow`.
  - Accordion (open item): `0px 2px 6px rgba(0,0,0,0.48)`.
  - Modal Action Buttons: `shadow-[0px_3.74px_3.74px_rgba(0,0,0,0.25)]`.

## 6. Interactivity

### Hover States:

- **General Pattern**: For items in menus, dropdowns:
  - Background: `hover:bg-(--content-primary)`.
  - Text: `hover:text-(--background-default)` or `hover:text-(--text-light)`.
- **Buttons**: Specific hover states defined per button type.
- **Toggle**: Handle width changes on hover.

### Focus States:

- **Inputs/Dropdowns**: Outline changes color to `var(--content-primary)` or `var(--interactive-accentfocus)`.
- **Keyboard Focus**: Ensure all interactive elements have a visible focus state (often `-outline-offset-1` or similar).

### Active/Selected States:

- **Dropdown/Menu Items**:
  - Background: `bg-(--content-primary)`.
  - Text: `text-(--background-default)`.
  - Outline: `outline-solid outline-2 outline-(--interactive-accentfocus) -outline-offset-2`.
- **Accordion (Open Item)**:
  - Background: `bg-(--content-primary)`.
  - Text: `text-(--text-dark)`.

### Disabled States:

- **General**: `opacity-50 cursor-not-allowed`.
- **Text/Icon Color**: Often `var(--content-secondary)`.
- **Inputs/Buttons**: Backgrounds may become less prominent or borders might change.

## 7. Iconography

- **Source**: Use the `<Icon />` component (`src/components/icon/icon.tsx`).
- **Sizing**: Common sizes include `16px`, `20px`, `21px`, `24px`, `26px`, `32px`. Icons should be scalable.
- **Color**:
  - Default: `currentColor` (inherits text color).
  - Specific States:
    - Status Icons (`error-state`, `warning-state`, `info-state`, `success-state`): Have intrinsic colors defined in `icon.tsx` that align with status CSS variables.
    - Chevron Icons (Dropdowns, Accordions): Color often matches the parent text or changes with state (e.g., `var(--content-primary)` or `var(--text-dark)`).
    - Disabled icons: `var(--content-secondary)`.
- **Usage**:
  - Form inputs for status (error/warning).
  - Dropdowns/Accordions for open/close indication (e.g., `chevron-down`, `chevron-up`).
  - Buttons for actions (e.g., `x-mark` for close).
  - Table sorting indicators.

## 8. Common Component Patterns

### Input Fields (TextInput, TextArea):

- **Structure**: Label (optional), Wrapper div, Input element, Status icon (optional), Character count (optional), Helper/Error message.
- **Styling**:
  - Wrapper: `bg-(--surface-default)`, `rounded-[5px]`, `outline-2` (color dynamic).
  - Label: `text-[12px] font-black uppercase tracking-[2px] font-[Orbitron]`. Color dynamic with state.
  - Input Text: `text-[16px] font-extrabold font-[Orbitron] text-(--content-primary)`.

### Dropdowns & Menus:

- **Button/Trigger**: Styled similarly to TextInput wrapper. Includes chevron icon.
- **Menu Panel**: `bg-(--background-elevated)`, `border border-(--border-default)`, `rounded-lg`, `shadow-lg`, `p-2`.
- **Items**: `font-semibold py-2 px-4 rounded-md`. States (hover, active, disabled) follow patterns described in "Interactivity".

### Modals:

- **Backdrop**: Semi-transparent dark overlay (`rgba(0, 0, 0, 0.60)`).
- **Container**: `bg-(--surface-default)`, `rounded-[15px]`, `outline-solid outline-2 outline-(--border-default)`, `p-[24px]`.
- **Header**: Title (`font-orbitron font-black text-[20px]`) and close button. Optional status icon.
- **Body**: Flexible content area, text styled with `font-orbitron font-bold text-[16px]`.
- **Footer (Actions)**: Buttons styled specifically (primary, secondary, destructive) with pill shape (`rounded-[46.79px]!`).

### Tables:

- **Container**: `rounded-lg border border-(--border-default) bg-(--background-default)`.
- **Header**: `bg-(--background-elevated)`, `border-b border-(--border-default)`, `font-semibold`.
- **Rows**: `even:bg-(--background-elevated)`, `hover:bg-(--surface-default)`.
- **Cells**: `border-b border-(--border-default)`.

### Toggles:

- **Track**: `rounded-[22px]`. Background uses `var(--content-primary)` (on) or `var(--status-error)` (off - as per its local styleMap meaning "disabled/off").
- **Handle**: `rounded-[13px]`, `bg-(--background-default)`.
- Animated transitions for state changes and hover.

### Accordions:

- **Container**: `rounded-[12px] border-2 border-(--border-default) bg-(--surface-default)`.
- **Header Button**: `font-[Orbitron] text-[18px] font-extrabold`.
  - Closed: `bg-(--surface-default) text-(--content-primary)`.
  - Open: `bg-(--content-primary) text-(--text-dark)`, shadow.
- **Content Panel**: `bg-(--surface-default) text-(--content-secondary)`.

## 9. Theming with `styleMap`

- **Mandatory**: All components MUST define and use a `styleMap: Record<string, string>` object to reference the CSS custom properties from `src/index.css`.
- **Purpose**: Ensures consistency and makes future theming or color adjustments centralized.
- **Example**:
  ```typescript
  const styleMap: Record<string, string> = {
    background_default: "var(--background-default)",
    content_primary: "var(--content-primary)",
    // ... other required theme variables for the component
  };
  // Usage: style={{ backgroundColor: styleMap.background_default }}
  // Or: className={`bg-[${styleMap.background_default}]`}
  ```

## 10. Accessibility (ARIA)

- Use appropriate ARIA attributes (e.g., `aria-expanded`, `aria-selected`, `aria-disabled`, `aria-label`, `role`).
- Ensure keyboard navigability for all interactive components.
- Provide clear focus indicators.

## 11. Responsiveness

- Employ a mobile-first approach as per project guidelines.
- Use Tailwind's responsive prefixes (e.g., `md:`, `lg:`) as needed, though current components show fixed styling more often. Future components should consider responsive adaptations more explicitly if their use case demands it.

This style guide should serve as a living document. As new components are developed or existing ones are refined, update this guide to reflect the evolving design language.
