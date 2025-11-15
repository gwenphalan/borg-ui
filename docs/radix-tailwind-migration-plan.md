## Quick summary

Borg UI leans on CSS custom properties and a mandated `styleMap` per component, but most implementations access the variables directly via inline styles or legacy utility classes instead of the prescribed indirection.

Theme tokens are centralized in `src/index.css` and partially mapped into Tailwind, yet the large `src/styles/global.css` re-implements dozens of Tailwind-like utilities plus bespoke component bases, creating duplication and making it harder to consolidate on Tailwind-only styling.

Interactive primitives such as Dropdown, Modal, Tooltip, Menu, DatePicker, and TimePicker embed custom overlay logic and inline `var(--...)` styling, indicating prime candidates for Radix-powered rewrites that keep the token system intact while retiring the legacy stylesheet.

## Component inventory

| Component | Path | Current styling | Candidate Radix primitive | Accessibility notes | Migration priority | Estimated effort |
| --- | --- | --- | --- | --- | --- | --- |
| Button | `src/components/button/button.tsx` | Tailwind + `cva`, icon colors via raw CSS vars, no `styleMap` bridge yet. | None (keep Slot) | Icon-only buttons rely on color only; ensure `aria-label` guidance. | High | Medium |
| ToggleButton | `src/components/button/toggle-button.tsx` | Tailwind strings, inline style map for colors, manual pressed state handling. | `@radix-ui/react-toggle` | Needs `aria-pressed` (present) but no keyboard focus-ring per design. | High | Medium |
| Toggle (Switch) | `src/components/toggle/toggle.tsx` | Tailwind utility strings with custom shadows; no Radix integration. | `@radix-ui/react-switch` | Manual animation; add focus outline and `aria` syncing. | High | Medium |
| TextInput | `src/components/text-input/text-input.tsx` | Legacy `.input-base`, `.label-base`, inline var usage, custom overlay. | `@radix-ui/react-popover` (for dropdown) | Wrapper div takes focus; ensure input remains primary focus target. | High | Large |
| TextArea | `src/components/text-input/text-area.tsx` | Shares `.input-base`/`.label-base`; inline state styling. | None | Needs accessible error messaging IDs. | Medium | Medium |
| Dropdown | `src/components/dropdown/Dropdown.tsx` | Mix of Tailwind + legacy classes, manual menu logic, `Overlay` helper. | `@radix-ui/react-select` or `@radix-ui/react-popover` + Combobox | Missing active descendant keyboard loop. | High | Large |
| DatePicker | `src/components/date-picker/date-picker.tsx` | Heavy reliance on `.input-base`, `.overlay-panel`, custom calendar grid. | `@radix-ui/react-popover` (calendar) | Calendar lacks labelled roles; keyboard support limited. | High | Large |
| TimePicker | `src/components/time-picker/time-picker.tsx` | Same legacy classes, custom column scroll, manual overlay. | `@radix-ui/react-popover` | Listboxes missing `role`/`aria-activedescendant`. | High | Large |
| Checkbox | `src/components/checkbox/checkbox.tsx` | Tailwind tokens but manual peer/focus logic, no `styleMap` helper. | `@radix-ui/react-checkbox` | Indeterminate handled; ensure label association codified. | Medium | Medium |
| Radio | `src/components/checkbox/radio.tsx` | Tailwind tokens with custom focus ring, manual group wiring. | `@radix-ui/react-radio-group` | Provide group wrapper guidance for `aria-labelledby`. | Medium | Medium |
| Modal | `src/components/modal/Modal.tsx` | Custom portal + focus trap + hologram effect, tailwind classes. | `@radix-ui/react-dialog` | Lacks `Dialog.Title` semantics; add accessible labelling. | High | Large |
| Tooltip | `src/components/tooltip/tooltip.tsx` | Manual hover delay with Overlay + hologram wrapper. | `@radix-ui/react-tooltip` | No `aria-describedby`; pointer-only interactions. | High | Medium |
| Overlay helper | `src/components/overlay/Overlay.tsx` | `@floating-ui/react` wrapper reused by many components. | Replace with Radix portal primitives | Dismiss logic manual; lacks escape key support. | High | Medium |
| Menu | `src/components/menu/menu.tsx` | Tailwind + overlay combos, nested menus via `Overlay`. | `@radix-ui/react-menubar` or `@radix-ui/react-dropdown-menu` | Focus loop + typeahead missing. | High | Large |
| Accordion | `src/components/accordion/accordion.tsx` | Inline styles per state, manual `var(--...)` string templates. | `@radix-ui/react-accordion` | Lacks `aria-controls`/`id` pairing. | Medium | Medium |
| Table | `src/components/table/table.tsx` | Tailwind + inline styles, custom pagination/select logic. | None | Sorting accessible but lacks `scope`/caption. | High | Large |
| Card | `src/components/card/card.tsx` | Uses `.card-base`, other Tailwind utilities, interactive variants. | None | Manage `aria-pressed` when clickable. | Medium | Medium |
| Badge | `src/components/badge/badge.tsx` | Tailwind strings + inline var fallback for default variant. | None | Removable badges need `aria-label` (present). | Medium | Small |
| Chip | `src/components/chip/chip.tsx` | Tailwind tokens with variant map, closable button inline styles. | `@radix-ui/react-toggle-group` (filter chips) | Ensure role toggles consistent. | Medium | Medium |
| Avatar | `src/components/avatar/avatar.tsx` | Tailwind tokens plus inline style for color overlay. | None | Provide fallback `alt` guidance. | Low | Small |
| Breadcrumbs | `src/components/breadcrumbs/breadcrumbs.tsx` | Tailwind tokens referencing CSS vars. | None | Add `aria-current` for last item. | Low | Small |
| ThemeToggle | `src/components/theme-toggle/theme-toggle.tsx` | Delegates to Button variants. | `@radix-ui/react-switch` (optional) | Ensure tooltip/label integration. | Medium | Small |
| Header | `src/components/header/header.tsx` | Tailwind tokens; pulls in Menu & ThemeToggle. | Depends on Menu | Ensure skip-nav support. | Medium | Medium |
| Footer | `src/components/footer/footer.tsx` | Tailwind tokens referencing CSS vars. | None | Add nav landmarks. | Low | Small |
| HologramContainer | `src/components/container/hologram-container.tsx` | Inline `<style>` definitions, not Tailwindizable yet. | None | Keep effect but isolate to opt-in wrapper. | Low | Medium |
| WarpSpeedBackground | `src/components/background/warp-speed-background.tsx` | Canvas-style JS animation, no direct CSS dependency. | None | Ensure SSR guard. | Low | Medium |

## Prioritization & rationale

1. **Foundational atoms** – Buttons, toggles, selection controls, and text inputs underpin most other components, so migrating them first maximizes reuse and enables consistent token usage before higher-order elements refactor.

2. **Overlay & popover ecosystem** – Dropdowns, menus, tooltips, modal dialog, date/time pickers all depend on a robust overlay primitive; replacing the custom `Overlay` with Radix ensures focus management and keyboard support across the board.

3. **Complex composites** – Table, Accordion, Card, and chip/badge surfaces can adopt the new atoms once overlays and inputs stabilize, finishing the purge of legacy classes and inline `var(--...)` usage.

### Incremental migration schedule

| Phase | Scope | Effort bucket |
| --- | --- | --- |
| Phase 1 – Token alignment | Tailwind config expansion, styleMap helper, Button/Toggle/Checkbox refactor. | Small/Medium |
| Phase 2 – Overlay core | Implement Radix-based Dialog, Tooltip, Popover wrapper, retrofit Dropdown/TextInput/ThemeToggle. | Large |
| Phase 3 – Date/Time + Menu | Refactor DatePicker, TimePicker, Menu on new overlay primitives, add command palette style combos. | Large |
| Phase 4 – Data display & layout | Table, Accordion, Card, Badge/Chip, Breadcrumbs/Header/Footer adjustments, retire global utilities. | Medium |
| Phase 5 – Effects cleanup | Hologram/WarpSpeed isolation, optional theming codemods, finalize styleMap deprecation plan. | Medium |

## Detailed migration plan

### Tokens, helpers, and styleMap bridge (Phase 1 prerequisite)

- Add `status-success`, `interactive-accent`, extra radii/shadows, and typography to Tailwind config so utilities directly reference CSS variables without legacy classes.
- Introduce `src/ui/theme.ts` exporting a typed `createStyleMap` helper that returns both a `styleMap` record (`{ surface: 'var(--surface-default)' }`) and a `styleVars(styleMap)` function that can be spread into `style={{ ... }}` or onto a CSS-in-JS `style` prop. Maintain compatibility by exposing the same keys components currently expect per Style Guide.
- Wrap `cn`/`cva` usage with a `withStyleMapVars` helper that applies Tailwind classes but also sets CSS custom properties for any slots still needing inline usage (e.g., gradients or `stroke` colors).

### Buttons & toggles

- **Target API**: Keep `variant`, `size`, `icon` props, add optional `loading` and `fullWidth`. Provide `styleMap` via `createButtonStyleMap()` returning tokens for background/text/border.
- **Radix primitive**: Continue using `Slot` for `asChild`, no additional primitive required.
- **Tailwind baseline**: `inline-flex items-center justify-center rounded-full font-orbitron font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accentfocus disabled:opacity-50 bg-background-default text-text-light`.
- **Example snippet**:

```tsx
const buttonStyleMap = createStyleMap({
  background: 'var(--background-default)',
  contentPrimary: 'var(--content-primary)',
  textLight: 'var(--text-light)',
  textDark: 'var(--text-dark)',
});

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-orbitron font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-interactive-accentfocus disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-background-default text-text-light',
        primary: 'bg-content-primary text-text-dark',
        outline: 'border border-border-default text-text-light',
        ghost: 'text-content-primary',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export const Button = forwardRef<ButtonElement, ButtonProps>(
  ({ variant, size, className, icon, children, style, ...props }, ref) => (
    <Slot
      ref={ref}
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...style, ...styleVars(buttonStyleMap) }}
    >
      {icon === 'left' && <Icon {...iconProps} />}
      {children}
      {icon === 'right' && <Icon {...iconProps} />}
    </Slot>
  )
);
```

- **Steps**:
  1. Implement `createStyleMap` and `styleVars`.
  2. Port Button + ToggleButton to use new helper and `cva`.
  3. Update ThemeToggle to rely on new `variant` tokens to ensure consistent icon colors.

### Switches & Toggle primitives

- Replace `Toggle` with Radix `Switch.Root`/`Switch.Thumb`, mapping states to Tailwind classes referencing CSS vars for background/handle color.
- Keep `ToggleButton` but back it with `@radix-ui/react-toggle`, reusing Button tokens for pill vs. standard shapes.
- Provide consistent `aria-checked` and keyboard toggling; integrate `styleVars` for unique hover shadows.

### Text inputs & text areas

- **Target API**: Preserve `label`, `helper`, `error`, `warning`, `dropdownOptions`, add optional `descriptionId` to tie helper text to `aria-describedby`.
- **Radix primitive**:
  - Standard input: plain `<input>` with Tailwind.
  - Dropdown variant: wrap trigger in `@radix-ui/react-popover` for options list.
- **Tailwind classes**: `flex w-full flex-col gap-1 font-orbitron`, wrapper `relative flex items-center gap-2 rounded-md border-2 border-border-default bg-surface-default px-[11px] py-[11px] focus-within:border-content-primary`.
- **Steps**:
  1. Build reusable `FieldShell` component that renders label, helper, error, using Tailwind tokens (replacing `.label-base`, `.helper-text`).
  2. Implement `Popover` wrapper using Radix with directional classes for dropdown panel.
  3. Refactor TextInput and TextArea to use `FieldShell`, `styleVars` (for background) and new popover.

### Checkbox & Radio

- Wrap Radix `Checkbox.Root` + `Indicator` and `RadioGroup.Root`/`Item`, mapping to Tailwind classes `h-5 w-5 rounded-sm border border-border-default data-[state=checked]:bg-content-primary` etc.
- Provide typed `styleMap` for background/focus colors.

### Dropdown, Menu, and selection surfaces

- Create `ui/primitives/Popover.tsx`, `ui/primitives/Menu.tsx` wrappers over Radix `Popover`, `DropdownMenu`, and `Menubar`, setting consistent surfaces (`bg-background-elevated`, `border-border-default`, `shadow-lg`).
- Adopt new Popover in TextInput (autocomplete), Dropdown component, and nested Menu items.
- Provide utility classes for items: `px-4 py-2 text-sm rounded-md hover:bg-surface-default data-[state=checked]:bg-interactive-accentfocus text-text-dark`.

### Modal (Dialog) – worked example

- **Radix**: Replace custom focus trap with `Dialog.Root`, `Dialog.Trigger`, `Dialog.Overlay`, `Dialog.Content`.
- **Tailwind baseline**: `fixed inset-0 bg-black/60 backdrop-blur-sm`, content `relative w-full max-w-lg rounded-2xl border border-border-default bg-surface-default p-6 shadow-[var(--elevation-modal)]`.
- **Example snippet**:

```tsx
const modalStyleMap = createStyleMap({
  surface: 'var(--surface-default)',
  border: 'var(--border-default)',
  contentPrimary: 'var(--content-primary)',
});

export function Modal({ open, onOpenChange, title, children, actions }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className="fixed inset-0 z-50 m-auto flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border-default bg-surface-default p-6 shadow-2xl focus:outline-none"
          style={styleVars(modalStyleMap)}
        >
          <Dialog.Title className="text-xl font-black text-content-primary">{title}</Dialog.Title>
          <div className="mt-4 flex-1 overflow-y-auto text-base text-content-primary">{children}</div>
          {!!actions?.length && (
            <footer className="mt-6 flex flex-wrap justify-end gap-3">
              {actions.map(({ label, variant = 'primary', ...btn }) => (
                <Button key={label} variant={variant} {...btn}>{label}</Button>
              ))}
            </footer>
          )}
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <Icon name="close" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- **Dependencies**: Use new Button first; ensure hologram effect optionally wraps `Dialog.Content` via `HologramEffect`.

### Tooltip & overlay primitives

- Implement `ui/primitives/Tooltip.tsx` using Radix `Tooltip.Root` with default delay, hooking into `styleMap` for surface/border colors.
- Replace custom Overlay with wrappers; remove `@floating-ui/react` dependency once all consumers migrated.

### DatePicker & TimePicker

- After Popover is ready, create shared `CalendarSurface` component using `date-fns` but integrate Radix Popover/ScrollArea for list columns.
- Factor shared tokens: `panel` `bg-surface-default border-border-default p-4 rounded-lg shadow-xl`.
- Provide accessible grid semantics with `role="grid"`/`aria-selected`.

### Table

- Convert inline `style` to Tailwind: e.g., replace `style={{ color: var(--content-primary) }}` with `text-content-primary`. Ensure zebra striping via Tailwind `odd:bg` tokens.
- Introduce `Table` `styleMap` for border/background; add `caption` option; integrate new Checkbox once ready.

### Accordion

- Replace manual state with Radix `Accordion.Root` `Item` `Trigger` `Content`, hooking `className` to variant tokens for open vs closed backgrounds.

### Cards, badges, chips, avatar

- Migrate `.card-base`, `.helper-text`, `.clear-button` etc. to Tailwind classes or `cva` definitions, referencing tokens via styleMap where necessary.
- Provide variant definitions using `cva` to standardize.

### Layout, header/footer, theme toggle

- Update Header/Footer to consume new Menu and Button tokens.
- For ThemeToggle, optionally wrap `@radix-ui/react-switch` but ensure consistent `aria` label.

### Hologram & WarpSpeed effects

- Encapsulate hologram effect into a Tailwind-friendly container by moving inline `<style>` into CSS modules or Tailwind plugin while keeping effect optional.
- Confirm WarpSpeed effect stays opt-in and SSR-safe (guards already present).

## Global CSS → Tailwind mapping

| Legacy class (global.css) | Recommended replacement |
| --- | --- |
| `.font-orbitron` | Tailwind `font-orbitron` utility (configure in `theme.extend.fontFamily`). |
| `.font-normal` – `.font-black` | Core Tailwind `font-normal`, `font-medium`, etc. |
| `.text-xs` – `.text-3xl` | Tailwind `text-xs`, `text-sm`, etc. |
| `.bg-background-default` | Tailwind `bg-background-default` (already mapped). |
| `.bg-background-elevated` | Tailwind `bg-background-elevated`. |
| `.bg-surface-default` | Tailwind `bg-surface-default`. |
| `.bg-content-primary` | Tailwind `bg-content-primary`. |
| `.bg-status-*` | Tailwind `bg-status-error/info/warning/success` (add success token). |
| `.text-content-primary`/`.text-content-secondary` | Tailwind `text-content-primary`/`text-content-secondary`. |
| `.text-light`/`.text-dark` | Tailwind `text-text-light`/`text-text-dark`. |
| `.border-default` et al. | Tailwind `border-border-default`, `border-content-primary`, etc. |
| `.p-*`, `.px-*`, `.py-*`, `.m-*`, `.gap-*` | Tailwind spacing utilities (already available). |
| `.flex`, `.inline-flex`, `.grid`, `.items-*`, `.justify-*` | Native Tailwind layout utilities. |
| `.w-full`, `.h-full`, `.min-h-screen` | Tailwind width/height classes. |
| `.rounded`, `.rounded-md`, `.rounded-lg`, `.rounded-xl` | Tailwind rounding utilities. |
| `.transition-all`, `.transition-colors`, `.transition-transform` | Tailwind `transition`, `transition-colors`, `transition-transform`. |
| `.shadow*` | Tailwind shadow utilities or custom `shadow-[...]` via plugin if needed. |
| `.btn-base` | Replace with Button `cva` classes; remove. |
| `.input-base` | Replace with `FieldShell` tailwind wrapper; remove. |
| `.label-base` | Tailwind `text-xs uppercase tracking-[2px] font-black`. |
| `.focus-ring` / `.input-focus-ring` | Tailwind `focus-visible:ring-2 focus-visible:ring-interactive-accentfocus`. |
| `.error-state` / `.warning-state` / `.focus-state` | State variants via Tailwind `data-[state=error]:border-status-error` (requires plugin) or `aria-invalid`. |
| `.clear-button` | Tailwind `inline-flex h-5 w-5 items-center justify-center rounded-full hover:opacity-70 focus-visible:ring-2 ring-interactive-accentfocus`. |
| `.icon-button` | Tailwind `inline-flex items-center justify-center text-content-secondary hover:text-content-primary`. |
| `.chevron-button` | Tailwind `inline-flex items-center justify-center text-content-primary transition-transform`. |
| `.dropdown-base` | Tailwind `flex flex-col gap-1 rounded-lg border border-border-default bg-background-elevated p-2 shadow-lg`. |
| `.dropdown-item` | Tailwind `flex items-center w-full rounded-md px-4 py-2 text-sm text-content-primary hover:bg-surface-default`. |
| `.overlay-panel` | Tailwind `rounded-lg border border-border-default bg-surface-default p-4 shadow-2xl`. |
| `.helper-text`, `.char-count` | Tailwind `text-xs text-content-secondary mt-1`. |
| `.card-base` | Tailwind `flex flex-col gap-3 rounded-lg border-2 border-border-default bg-surface-default p-6 transition`. |
| `.hover-scale` / `.hover-shadow` | Tailwind `hover:scale-[1.01]`, `hover:shadow-2xl`. |
| `.modal-overlay` / `.modal-content` | Radix Dialog overlay/content Tailwind classes. |
| `.icon-sm` `.icon-base` `.icon-lg` | Tailwind `h-4 w-4`, etc. |
| `.z-10`, `.z-50` | Tailwind `z-10`, `z-50`. |
| `.focus-ring` overrides | Replace with `focus-visible:ring-2 ring-interactive-accentfocus`. |

Retain only specialized hologram styles (move into dedicated CSS module) and any vendor-specific scrollbars that Tailwind cannot express easily. All other legacy utilities should be removed once replacements land.

## Tailwind / tokens / config changes

```js
// tailwind.config.js
extend: {
  colors: {
    'status-success': 'var(--status-success)',
    'interactive-accent': 'var(--interactive-accentfocus)',
    'surface-muted': 'var(--background-elevated)',
  },
  boxShadow: {
    'elevation-modal': '0 20px 50px -15px rgba(0,0,0,0.6)',
  },
  borderRadius: {
    xl: '0.75rem',
    modal: '15px',
  },
}
```

- Register a custom plugin to emit `data-[state=...]` variants so stateful components can mirror `.error-state` and `.focus-state` behaviors without inline `!important`.
- Short-term `styleMap` strategy: each component exports `styleMap` and spreads `styleVars(styleMap)` onto the root element while relying on Tailwind classes; consumers can still reference `styleMap` for custom overrides per Style Guide.
- Long-term plan: expose a `useBorgTokens()` hook returning token-aware `cx` helpers; deprecate direct `styleMap` usage after client adoption.

## Radix guidance & package list

Install core primitives:

```bash
npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip \
  @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-menubar \
  @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch \
  @radix-ui/react-toggle-group
```

Wrapper pattern recommendations:

- `src/ui/primitives/Dialog.tsx` – exports `DialogRoot`, `DialogContent`, etc., preconfigured with Borg theming (overlay, content classes, hologram opt-in).
- `src/ui/primitives/Popover.tsx` – shared popover with match-width option, ties into `styleVars`.
- `src/ui/primitives/Menu.tsx` – wraps Radix Menu/Menubar to serve Dropdown + navigation needs.
- `src/ui/primitives/Tooltip.tsx` – handles default delay, color scheme, pointer-events.
- `src/ui/primitives/Switch.tsx`, `Checkbox.tsx`, `RadioGroup.tsx`, `Toggle.tsx` – unify state data attributes for Tailwind variants.

Export these primitives so higher-level components compose them without reimplementing focus logic.

## Automation & codemod plan

1. **Utility class replacement**
   - Regex: `class(Name)?="([^\"]*?)btn-base([^\"]*?)"` → replace with `className="{$1} ${buttonVariants({...})}"` in TSX; script via `jscodeshift`.
   - Command: `npx jscodeshift -t scripts/codemods/replace-btn-base.ts src --extensions=tsx`
2. **Inline styleMap cleanup**
   - Regex search for `styleMap\.[a-zA-Z_]+` to capture usage; codemod to import `styleMap` from new `theme.ts` and replace inline `style={{ backgroundColor: styleMap.background_default }}` with Tailwind class `bg-background-default`.
3. **Overlay replacement**
   - Codemod to swap `<Overlay` component usage with new `Popover.Content` or `Dialog` wrappers by matching import `../overlay/Overlay`.
4. **Shared styleMap hoisting**
   - Use `ts-morph` script to create `src/ui/theme.ts` from existing `styleMap` definitions; update components to import from there.
5. **Incremental PR plan**
   - PR 1: Tailwind config & helper utilities + Button/Toggle/Checkbox refactor.
   - PR 2: Popover primitive + TextInput/TextArea (without dropdown).
   - PR 3: Dropdown & Menu rewrite.
   - PR 4: Dialog/Tooltip refactor.
   - PR 5: DatePicker/TimePicker.
   - PR 6: Table/Accordion/Card/Badge/Chip.
   - PR 7: Remove `global.css` utilities, keep hologram effect isolated.

Each PR should include automated codemod patches and visual regression checks.

## Quality, testing and verification

- **Storybook/MDX**: Document pre/post variants per component, especially Buttons, Inputs, Overlay states. Capture tokens via story args for light/dark themes.
- **Visual regression**: Integrate Playwright or Chromatic/Percy snapshots for critical components (Button, Modal, Dropdown, Table). Baseline before migration to catch theming regressions.
- **Accessibility**: Add `@axe-core/react` or `cypress-axe` smoke tests for focus trapping in Dialog, keyboard navigation in Dropdown/Menu, ARIA labelling for inputs. Validate `role="switch"` toggles and `aria-describedby` for helper text.
- **Unit tests**: Leverage React Testing Library to ensure `styleMap` exports remain stable and variant classes toggle correctly.
- **Theming QA**: Add E2E tests flipping `[data-theme="light"]` to ensure CSS variable reliance remains intact.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Existing consumers rely on `.btn-base`/`.input-base` utilities | Ship codemods + migration guide; maintain exports of new Tailwind classes via `styleMap` for transitional period. |
| Removing `Overlay` may break bespoke positioning | Implement Radix Popover/Menu wrappers with match-width and offset options to replicate current behavior before removal. |
| `styleMap` expectation conflicts with Tailwind utilities | Provide helper bridging tokens to CSS vars and document how to combine with classes; plan phased deprecation only after consumers adopt helper. |
| Complex components (DatePicker/TimePicker/Table) have bespoke features | Tackle after foundational primitives; create shared subcomponents (e.g., `CalendarGrid`, `TimeColumn`) to reduce regression surface. |
| Hologram effect adds inline styles incompatible with Tailwind purge | Encapsulate effect into optional wrapper or convert to CSS module to prevent purge issues; update documentation. |
| Visual regressions in dark/light theme due to token remapping | Use visual snapshots across both data-theme modes and run manual QA on gradient-heavy components (Accordion open state, Buttons). |

## Testing

⚠️ `npm test` (not run – read-only planning exercise)
