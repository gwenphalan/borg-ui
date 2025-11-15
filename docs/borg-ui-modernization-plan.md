## Borg UI Modernization Plan: Radix Primitives + Tailwind Alignment

### Executive Summary
- Borg UI already uses Tailwind utility classes and some Radix helpers (e.g., `@radix-ui/react-slot` in `Button`), but styling is fragmented between bespoke utilities (`src/styles/global.css`) and component-scoped class strings.【F:src/components/button/button.tsx†L1-L88】【F:src/styles/global.css†L1-L120】
- Theme tokens are defined as CSS custom properties in `src/index.css` and consumed through per-view `styleMap` objects (e.g., routes use `styleMap` props).【F:src/index.css†L12-L106】【F:src/App.tsx†L13-L44】
- Documentation and inventory definitions occasionally drift from implementation (Overlay docs describe a backdrop while the implementation wraps Floating UI positioning), so the plan prioritizes alignment before Radix migration.【F:docs/components/overlay/overlay.md†L1-L123】【F:src/components/overlay/Overlay.tsx†L1-L99】
- Target outcome: consolidate styling into Tailwind v4, introduce Radix primitives for interaction-heavy components, hoist shared `styleMap` usage, and establish codemods/tests/QA pipelines to manage the migration.

---

## 1. Component Inventory Reconciliation
The table cross-references the canonical manifest (`src/data/components.json`), documentation (`docs/components/**`) and implementation exports (`src/index.ts`) to identify gaps and required modernization focus.【F:src/data/components.json†L1-L156】【F:src/index.ts†L1-L79】

| Category | Component (docs path) | Implementation Path | Notes / Gaps |
| --- | --- | --- | --- |
| Actions | Button (`docs/components/actions/button.md`)【F:docs/components/actions/button.md†L1-L160】 | `src/components/button/button.tsx`【F:src/components/button/button.tsx†L1-L88】 | Uses CVA + Tailwind utilities; ensure Radix `Slot` support and align icon color logic with token map. |
|  | Toggle Button (`docs/components/actions/toggle-button.md`) | `src/components/button/toggle-button.tsx` | Confirm styleMap coverage; migrate to Radix `Toggle` primitive. |
|  | Theme Toggle (`docs/components/actions/theme-toggle.md`) | `src/components/theme-toggle/theme-toggle.tsx` | Shares logic with `useTheme`; needs Radix `Switch`? verify naming. |
| Forms | Text Input (`docs/components/forms/text-input.md`)【F:docs/components/forms/text-input.md†L1-L159】 | `src/components/text-input/text-input.tsx` | Heavy custom state + dropdown; migrate to Radix `FormField` patterns and reuse Dropdown trigger. |
|  | Text Area | `src/components/text-input/text-area.tsx` | Align states with Text Input plan. |
|  | Checkbox (`docs/components/forms/checkbox.md`) | `src/components/checkbox/checkbox.tsx`【F:src/components/checkbox/checkbox.tsx†L1-L137】 | Replace custom markup with Radix `Checkbox`; maintain label layout. |
|  | Radio (`docs/components/forms/radio.md`) | `src/components/checkbox/radio.tsx` | Build on Radix `RadioGroup`. |
|  | Toggle (`docs/components/forms/toggle.md`) | `src/components/toggle/toggle.tsx` | Map to Radix `Switch`. |
|  | Dropdown (`docs/components/forms/dropdown.md`) | `src/components/dropdown/Dropdown.tsx`【F:src/components/dropdown/Dropdown.tsx†L1-L219】 | Candidate for Radix `Select` / `DropdownMenu`; currently multi-select + Floating UI. |
|  | Date Picker (`docs/components/forms/date-picker.md`) | `src/components/date-picker/index.tsx` | Uses `react-day-picker`; integrate with Radix Popover for calendar surface. |
|  | Time Picker (`docs/components/forms/time-picker.md`) | `src/components/time-picker/time-picker.tsx` | Align with Radix Popover or Select primitives. |
| Layout | Card (`docs/components/layout/card.md`) | `src/components/card/index.tsx` | Pure presentational – standardize Tailwind tokens. |
|  | Grid (`docs/components/layout/grid.md`) | `src/components/layout/grid.tsx` | Validate CSS grid utilities. |
|  | Header (`docs/components/layout/header.md`) | `src/components/header/index.tsx` | Interacts with Menu; ensure Radix menubar integration. |
|  | Footer (`docs/components/layout/footer.md`) | `src/components/footer/index.tsx` | Styling cleanup only. |
|  | Hologram Container (`docs/components/layout/hologram-container.md`) | `src/components/container/hologram-container.tsx` | Works with `HologramContext`; ensure compatibility. |
|  | Main Layout (`docs/components/layout/main-layout.md`) | `src/components/layout/main-layout.tsx` | Houses page shells; minimal Radix usage. |
| Data Display | Accordion (`docs/components/data-display/accordion.md`) | `src/components/accordion/accordion.tsx` | Replace with Radix `Accordion`. |
|  | Avatar (`docs/components/data-display/avatar.md`) | `src/components/avatar/avatar.tsx` | Potential Radix `Avatar` primitive. |
|  | Badge (`docs/components/data-display/badge.md`) | `src/components/badge/badge.tsx` | Tailwind refactor only. |
|  | Chip (`docs/components/data-display/chip.md`) | `src/components/chip/index.tsx` | Add interactive states; consider Radix `Toggle`/`Badge`. |
|  | Table (`docs/components/data-display/table.md`) | `src/components/table/table.tsx` | Evaluate virtualization; maintain tokens. |
| Navigation | Breadcrumbs (`docs/components/navigation/breadcrumbs.md`) | `src/components/breadcrumbs/index.tsx` | Standardize semantics + Tailwind. |
|  | Menu (`docs/components/navigation/menu.md`) | `src/components/menu/menu.tsx`【F:src/components/menu/menu.tsx†L1-L228】 | Rebuild with Radix `Menubar` / `NavigationMenu`; dropdowns rely on Overlay. |
| Overlay | Modal (`docs/components/overlay/modal.md`)【F:docs/components/overlay/modal.md†L1-L119】 | `src/components/modal/Modal.tsx`【F:src/components/modal/Modal.tsx†L1-L172】 | Replace custom focus trap with Radix `Dialog` + Hologram wrapper. |
|  | Tooltip (`docs/components/overlay/tooltip.md`) | `src/components/tooltip/tooltip.tsx` | Map to Radix `Tooltip`; integrate with Floating UI tokens. |
|  | Overlay (`docs/components/overlay/overlay.md`)【F:docs/components/overlay/overlay.md†L1-L123】 | `src/components/overlay/Overlay.tsx`【F:src/components/overlay/Overlay.tsx†L1-L99】 | Align docs with Floating UI popper vs. backdrop overlay; plan overlay abstraction. |
| Background | Warp Speed Background (`docs/components/background/warp-speed-background.md`) | `src/components/background/warp-speed-background.tsx` | Keep CSS animations; convert to Tailwind keyframes plugin.

**Ambiguities**
- Docs describe Overlay as a backdrop, but implementation is a floating-positioner used by Dropdown/Menu—plan includes splitting into `OverlayBackdrop` vs `FloatingLayer` to avoid confusion.【F:docs/components/overlay/overlay.md†L1-L123】【F:src/components/overlay/Overlay.tsx†L1-L99】
- Dropdown vs Menu share responsibilities (selection vs navigation). Adopt Radix `Select` for form dropdowns and `NavigationMenu`/`Menubar` for navigation; maintain multi-select by wrapping Radix `DropdownMenu` with checkable items.【F:src/components/dropdown/Dropdown.tsx†L1-L219】【F:src/components/menu/menu.tsx†L141-L228】

---

## 2. Global Tailwind & Token Strategy
1. **Token Canonicalization** – Keep CSS variables in `src/index.css`, but mirror them in Tailwind theme extension for class-based consumption (already partially done). Expand to include gradients, shadows, and numeric scales referenced in `StyleGuide.md`.【F:src/index.css†L12-L106】【F:StyleGuide.md†L5-L119】
2. **styleMap Preservation** – Maintain `styleMap` interface as the bridge for host applications. Introduce a shared helper (`createStyleMap()` in `src/styles/theme.ts`) that exports the token record used by routes/components so styleMap stays consistent and tree-shakable.【F:src/App.tsx†L13-L44】
3. **Tailwind Utility Normalization** – Replace custom utility classes defined in `src/styles/global.css` with Tailwind `@layer utilities` definitions or config-driven utilities. Map each class to Tailwind equivalents (see Section 3).【F:src/styles/global.css†L1-L200】
4. **Radix Layering** – Wrap Radix primitives with Tailwind classes that consume tokens (via `data-[state=...]` selectors) to keep theming consistent.

---

## 3. Global CSS → Tailwind Mapping
Key utilities to migrate from `src/styles/global.css` into Tailwind config/plugins.【F:src/styles/global.css†L1-L200】

| Current Utility | CSS Source | Tailwind Replacement | Notes |
| --- | --- | --- | --- |
| `.font-orbitron` | `font-family: 'Orbitron', ...`【F:src/styles/global.css†L8-L13】 | `font-orbitron` (from `tailwind.config.js` `fontFamily`)【F:tailwind.config.js†L24-L35】 | Already defined; remove duplicate class. |
| `.text-xs/.text-sm/...` | Font-size declarations【F:src/styles/global.css†L25-L52】 | Tailwind core text utilities | Confirm Tailwind v4 scales align with px values; extend via theme if needed. |
| `.bg-content-primary` etc. | Background color utilities mapping to CSS vars【F:src/styles/global.css†L58-L102】 | Use Tailwind color names registered in config (`bg-content-primary`) | Already available; ensure config includes missing tokens (interactive focus, gradients). |
| `.border-default` etc. | Border color utilities【F:src/styles/global.css†L118-L135】 | Tailwind `border-border-default` etc. | Keep via config extension. |
| `.p-1/.p-2` etc. | Hard-coded spacing utilities | Use Tailwind spacing scale; extend with fractional sizes if nonstandard. |
| `.input-base`, `.label-base`, `.dropdown-base`, `.input-focus-ring` (later in file) | Compose multiple Tailwind classes | Convert to `@apply` within component-layer CSS modules or create Tailwind `components` layer utilities to keep semantics. |

### Tailwind Config Patch
Append to `tailwind.config.js` to consolidate tokens and custom utilities:

```ts
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gradient-dark-start': 'var(--gradient-dark-start)',
        'gradient-dark-end': 'var(--gradient-dark-end)',
      },
      boxShadow: {
        'dropdown': '0 12px 24px rgba(0,0,0,0.35)',
        'modal': '0 24px 40px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        pill: '46.79px',
        modal: '15px',
      },
      keyframes: {
        'warp-speed': {
          '0%': { transform: 'translateZ(0)' },
          '100%': { transform: 'translateZ(-1000px)' },
        },
      },
      animation: {
        'warp-speed': 'warp-speed 10s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addVariant, addComponents }) {
      addVariant('radix-open', '&[data-state="open"]');
      addVariant('radix-closed', '&[data-state="closed"]');
      addComponents({
        '.input-base': '@apply flex items-center rounded-[5px] border border-border-default bg-surface-default px-[11px] py-[11px] font-orbitron text-base font-extrabold text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accentfocus focus-visible:ring-offset-2',
        '.label-base': '@apply text-[12px] font-black uppercase tracking-[2px] text-content-secondary',
        '.dropdown-base': '@apply mt-2 w-full rounded-lg border border-border-default bg-background-elevated p-2 shadow-dropdown',
      });
    },
  ],
};
```

This removes the need for duplicate definitions in `global.css` while introducing Radix state variants.

---

## 4. Radix Package Strategy
Current dependencies include `@radix-ui/react-slot` only.【F:package.json†L32-L73】 Install full Radix surface via:

```sh
npm install @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-checkbox \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card \
  @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover \
  @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-tooltip
```

- Use `@radix-ui/react-popover` to back Dropdown/DatePicker/time pickers.
- Menus/Breadcrumb overlays rely on `@radix-ui/react-navigation-menu` or `menubar` for keyboard navigation.
- Tooltip/Checkbox/Accordion replace bespoke interactions.

---

## 5. Per-Component Modernization Guidance
### Actions
- **Button** – Keep CVA for variant mapping, but wrap Radix `Slot`/`Primitive.button` inside a new `ButtonRoot` that binds `data-[state]` props. Align icon colors by mapping tokens via shared config rather than switch statements; move icon mapping to Tailwind classes using `data-[variant]` attributes.【F:src/components/button/button.tsx†L1-L88】【F:docs/components/actions/button.md†L1-L160】
- **Toggle Button** – Replace manual state toggling with `@radix-ui/react-toggle`. Use Tailwind variant classes to map `styleMap` tokens and ensure pressed states set `data-state="on"` for styling.
- **Theme Toggle** – Implement via Radix `Switch` or `Toggle` depending on binary vs multi-state. Ensure `ThemeProvider` continues to supply `styleMap`; document light/dark token usage.【F:src/App.tsx†L13-L44】

### Forms
- **Text Input / Text Area** – Extract shared field wrapper (`FormField`) using Tailwind component classes (`.label-base`, `.input-base`). For dropdown functionality, embed Radix `Select` trigger in `TextInput` when `dropdownOptions` exist, ensuring the popover uses tokens for focus/selection states.【F:docs/components/forms/text-input.md†L1-L159】
- **Checkbox** – Swap to Radix `Checkbox.Root` + `Checkbox.Indicator` for consistent keyboard/focus handling. Mirror existing `group-hover` behavior via `radix-*` variants.【F:src/components/checkbox/checkbox.tsx†L48-L137】
- **Radio** – Use Radix `RadioGroup` with Tailwind classes for active/checked states. Preserve `onChange` signature.
- **Toggle** – Replace with Radix `Switch` for accessibility; map `checked` to `data-state` styling and preserve hologram/glow effects via Tailwind `shadow` utilities.
- **Dropdown** – Split responsibilities: form dropdowns to Radix `Select`, complex multi-select to Radix `DropdownMenu` with checkbox items. Maintain tooltip integration for disabled reasons and reuse `OverlayBackdrop` for full-screen interactions.【F:src/components/dropdown/Dropdown.tsx†L67-L219】
- **Date Picker/Time Picker** – Wrap `react-day-picker` inside Radix `Popover` anchored to `TextInput`. Tailwind classes handle grid/day cells (use plugin to generate `.day-selected` etc.).

### Layout
- **Header/Menu Integration** – Use Radix `NavigationMenu` to render top-level navigation with built-in keyboard support, replacing manual `useState` in `MenuItemComponent`. Preserve `Overlay` functionality by migrating to Radix `NavigationMenu.Content` for dropdown surfaces.【F:src/components/menu/menu.tsx†L1-L228】
- **Grid/Main Layout/Card/Footer** – Convert static Tailwind class strings into reusable `@apply` definitions to reduce duplication. Ensure global tokens (spacing, radius) match `StyleGuide`.【F:StyleGuide.md†L29-L119】
- **Hologram Container** – Keep as wrapper but ensure new components expose `className`/`ref` to integrate hologram context.

### Data Display
- **Accordion** – Replace open-state logic with Radix `Accordion.Root`, using `data-state` to trigger color transitions described in docs (open state uses `content-primary` background). Reference `StyleGuide` rounding/shadow tokens.【F:StyleGuide.md†L80-L109】
- **Avatar** – Adopt Radix `Avatar` for fallback initials/image loading; map to existing docs tokens.
- **Badge/Chip** – Stay purely Tailwind; create variants via CVA similar to Button for consistency.
- **Table** – Keep custom logic but ensure interactive headers use Tailwind + tokens. Evaluate Radix `Table` once available (currently experimental), so focus on semantics/ARIA.

### Navigation & Overlay
- **Breadcrumbs** – Ensure accessible ordered list with Tailwind spacing; highlight active crumb using tokens from `StyleGuide`.
- **Menu** – Replace with Radix `NavigationMenu`/`Menubar`, handling nested children via `NavigationMenu.Content`. Use Radix `FocusScope` for submenus to remove manual `Overlay` closing logic.【F:src/components/menu/menu.tsx†L141-L228】
- **Modal** – Implement Radix `Dialog` (Portal, Overlay, Content, Title, Close) while wrapping interior with `HologramEffect` when context flag is true. Map `styleMap` tokens to Tailwind classes for border/background/shadow.【F:src/components/modal/Modal.tsx†L18-L172】
- **Tooltip** – Swap to Radix `Tooltip.Provider`/`Tooltip.Content`, inheriting tokens for background/border/shadow.
- **Overlay** – Split into `OverlayBackdrop` (Radix `Dialog.Overlay` style) and `FloatingLayer` (Radix `Popover`/`DropdownMenu` support). Document difference to align with docs expectation.【F:src/components/overlay/Overlay.tsx†L1-L99】

### Background
- **Warp Speed Background** – Convert CSS animation to Tailwind keyframes/animation defined in config patch (Section 3). Ensure component uses `className={cn('animate-warp-speed', className)}` for composition.

---

## 6. Codemods
### 6.1 Button Migration (jscodeshift)
- **Goal**: Replace direct `buttonVariants` usage with new `ButtonRoot` (Radix). Steps:
  1. Identify `import { Button } from '@/components/button/button'` usages.
  2. Replace JSX `<Button ...>` props to map `variant` → `data-variant`, `size` → `data-size` when customizing.
  3. Insert import for new `Button` barrel once migration done.
- **Command**:
  ```sh
  npx jscodeshift -t codemods/button-to-radix.ts src
  ```
- **Dry Run**: `npx jscodeshift -t codemods/button-to-radix.ts src --dry --print`
- **Limitations**: Complex render props or dynamic component factories may require manual follow-up; codemod only handles direct JSX usage.

### 6.2 styleMap Hoisting (ts-morph)
- **Goal**: Introduce shared `createStyleMap()` import instead of per-file literal definitions.
- **Script Outline**:
  ```ts
  // codemods/stylemap-hoist.ts
  project.getSourceFiles('src/**/*.{ts,tsx}').forEach((file) => {
    const maps = findStyleMapLiterals(file);
    maps.forEach((node) => {
      node.replaceWithText('createStyleMap()');
      ensureImport(file, { namedImports: ['createStyleMap'], moduleSpecifier: '@/styles/theme' });
    });
  });
  ```
- **Command**:
  ```sh
  npx ts-node codemods/stylemap-hoist.ts --dry
  ```
- **Limitations**: Only replaces literal object expressions matching token keys; skip components needing custom overrides.

---

## 7. Worked Examples
### 7.1 Button (Radix `Slot` + Tailwind)
```tsx
// src/components/button/Button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonStyles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-full font-orbitron font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accentfocus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 radix-open:scale-[1.02] radix-closed:scale-100',
  variants: {
    default: 'bg-background-default text-text-light',
    primary: 'bg-content-primary text-text-dark',
    secondary: 'bg-border-default text-text-light',
    destructive: 'bg-status-error text-text-light',
    ghost: 'bg-transparent text-content-primary',
    link: 'bg-transparent text-content-primary underline-offset-4 hover:underline',
  },
  sizes: {
    default: 'h-10 px-4',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10 p-0',
  },
};

type ButtonVariant = keyof typeof buttonStyles.variants;
type ButtonSize = keyof typeof buttonStyles.sizes;

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, variant = 'default', size = 'default', icon, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-variant={variant}
        data-size={size}
        className={cn(buttonStyles.base, buttonStyles.variants[variant], buttonStyles.sizes[size], className)}
        {...props}
      >
        {icon}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
```
- **styleMap Compatibility**: Consumers pass inline styles via `style` or rely on CSS variables; no breaking changes because tokens remain CSS custom properties.
- **Icon Colors**: Replace switch with CSS selectors: e.g., `.data-[variant="primary"] svg { color: var(--text-dark); }` using Tailwind `@layer components`.

### 7.2 Modal/Dialog (Radix `Dialog`)
```tsx
// src/components/modal/Modal.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { HologramEffect } from '@/components/container/hologram-container';
import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  hologram?: boolean;
  className?: string;
}

export function Modal({ open, onOpenChange, title, description, actions, hologram = false, className, children }: React.PropsWithChildren<ModalProps>) {
  const content = (
    <Dialog.Content
      className={cn(
        'relative w-full max-w-lg rounded-modal border border-border-default bg-background-elevated shadow-modal focus:outline-none',
        'radix-open:animate-in radix-open:fade-in-90 radix-open:zoom-in-95 radix-closed:animate-out radix-closed:fade-out-90 radix-closed:zoom-out-95',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <Dialog.Title className="text-lg font-black text-content-primary">{title}</Dialog.Title>
        <Dialog.Close className="p-2 text-content-primary hover:text-interactive-accentfocus">
          <Icon name="close" size={24} />
        </Dialog.Close>
      </div>
      {description && (
        <Dialog.Description className="px-4 pt-2 text-sm text-content-secondary">{description}</Dialog.Description>
      )}
      <div className="p-4 text-content-primary">{children}</div>
      {actions && <div className="flex justify-end gap-3 border-t border-border-default p-4">{actions}</div>}
    </Dialog.Content>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {hologram ? <HologramEffect>{content}</HologramEffect> : content}
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```
- **Focus Management**: Radix handles focus lock/restore; remove manual listeners from current component.【F:src/components/modal/Modal.tsx†L48-L172】
- **Overlay Strategy**: Replace manual `<div className="fixed inset-0" ...>` with `Dialog.Overlay` for consistent semantics.

---

## 8. Prioritized PR Plan
| Priority | Scope | Acceptance Criteria | Tests / Stories | Est. Effort |
| --- | --- | --- | --- | --- |
| 1 | Infrastructure: Tailwind config updates, create `createStyleMap`, migrate global utilities | Tailwind build succeeds; no regressions in existing components | Update Storybook tokens (add new story for tokens), run `npm run lint` | 2d |
| 2 | Overlay split + Menu/Dropdown refactor groundwork | New `OverlayBackdrop` + `FloatingLayer` exported; docs updated to reflect split | Storybook stories for Menu open/close, Dropdown multi-select | 3d |
| 3 | Button & Toggle suite migration to Radix | Button/Toggle/ThemeToggle use Radix primitives, tests for state/ARIA | Add Jest/react-testing-library focus tests, visual regression snapshots | 3d |
| 4 | Form inputs (TextInput/TextArea/Checkbox/Radio/Toggle) | Components use Radix primitives where applicable; styleMap maintained | Storybook controls for states, a11y snapshots via Axe | 4d |
| 5 | Overlay components (Modal/Tooltip) | Modal uses Radix Dialog; Tooltip uses Radix Tooltip; docs reflect API | Cypress smoke test for modal focus trap, Percy diff | 3d |
| 6 | Remaining layout/data display cleanup | Accordions/Avatar etc. updated; docs align | Storybook docs, unit tests for data toggles | 4d |
| 7 | Documentation sweep & codemod cleanup | All docs match implementation; codemod run logs checked in | Update docs navigation manifest | 2d |

---

## 9. Risks & Mitigations
- **Token Drift** – Changing Tailwind config could desync from CSS variables. Mitigate by unit-testing `createStyleMap()` to ensure keys match `:root` declarations and running visual regression on theme toggle.【F:src/index.css†L12-L106】【F:src/App.tsx†L13-L44】
- **Radix Bundle Size** – Adding many Radix packages increases bundle. Use tree-shaking and lazy load heavy components (DatePicker/TimePicker). Monitor via bundle analyzer.
- **Accessibility Regressions** – Ensure Storybook + Axe audits run as part of CI. Document manual QA for keyboard/focus flows.
- **Overlay Behavior Change** – Splitting overlay may break existing Dropdown expectations. Provide shim exports and incremental migration instructions.

---

## 10. QA Strategy
1. **Storybook Regression** – Add stories per component capturing default, hover, focus, disabled states. Use Chromatic/Percy for visual diffs.
2. **Automated A11y** – Run `@storybook/addon-a11y` + `axe` on Button, Modal, Dropdown to validate keyboard/focus traps.
3. **Integration Checks** – In `src/routes/Documentation.tsx`, verify search dropdown + navigation still function with new primitives (Radix `NavigationMenu` + `Select`).【F:src/routes/Documentation.tsx†L1-L182】
4. **Theming QA** – Toggle light/dark via `ThemeProvider` and ensure CSS variables propagate across components.

---

## 11. Overlay & Floating UI Migration Strategy
- **Step 1**: Introduce `OverlayBackdrop` using Radix `Dialog.Overlay`/`Popover.Arrow` semantics for modals/tooltips.
- **Step 2**: Refactor existing `Overlay` usages (Dropdown/Menu) to use Radix `Popover`/`DropdownMenu` while keeping Floating UI for advanced positioning (Radix uses Floating UI under the hood; custom middleware can be ported).【F:src/components/overlay/Overlay.tsx†L37-L99】【F:src/components/dropdown/Dropdown.tsx†L158-L217】
- **Step 3**: For components needing matchWidth or custom offset, leverage Radix `Popover` `alignOffset` and style with Tailwind classes defined in Section 3.
- **Step 4**: Update docs to differentiate between backdrop overlays and floating layers, ensuring inventory reflects both.

---

## 12. Follow-up Documentation & Communication
- Update `docs/components/*` to include Radix usage guidelines and Tailwind utility references per component.
- Add migration guides in `docs/` for consumers (e.g., "How to update custom Button variants"), referencing codemod commands.
- Provide change log entry in `CHANGELOG.md` summarizing Radix/Tailwind alignment.

