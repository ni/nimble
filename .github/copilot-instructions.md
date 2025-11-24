# Nimble Design System - AI Coding Agent Instructions

## Project Overview

Nimble is a multi-framework design system providing NI-styled web components built on FAST Foundation. The monorepo delivers components for vanilla JS/TS, Angular, Blazor, and React applications.

**Key architecture:**
- **Core**: `@ni/nimble-components` - Web components using FAST Element, custom elements, and Shadow DOM
- **Tokens**: `@ni/nimble-tokens` - Base design tokens (colors, typography, spacing)
- **Framework wrappers**: Angular directives, Blazor Razor components, React wrappers via `@lit/react`
- **Variants**: Nimble (general-purpose), Spright (specialized), Ok (experimental)

## Essential Developer Workflows

For detailed setup and workflow instructions, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

### Common Commands
```bash
# Build
npm install && npm run build

# Development (Watch Mode)
# Open Command Palette → Run Task → Create Watch Terminals

# Storybook (View components)
npm run storybook

# Testing
npm run tdd:watch -w @ni/nimble-components    # Unit tests (watch)
npm run test-webkit -w @ni/nimble-components  # WebKit testing
```

### Change Management
Every PR affecting published packages **must** include a change file. See [`CONTRIBUTING.md`](../CONTRIBUTING.md#beachball-change-file) for details.
```bash
npm run change  # Run before creating PR
```

## Component Development Patterns

For detailed component development guidelines, see [`packages/nimble-components/CONTRIBUTING.md`](../packages/nimble-components/CONTRIBUTING.md).

### Web Component Structure
Standard structure for `src/component-name/`:
- `index.ts`: Component class & registration
- `styles.ts`: Styles using design tokens
- `template.ts`: HTML template
- `tests/*.spec.ts`: Unit tests

**Critical Patterns:**

1. **Import tokens:**
   ```typescript
   import { bodyFont } from '../theme-provider/design-tokens';
   ```

2. **Register custom elements:**
   ```typescript
   declare global {
       interface HTMLElementTagNameMap {
           'nimble-button': Button;
       }
   }
   ```

3. **Extend FAST Components:**
   ```typescript
   import { Button as FoundationButton } from '@ni/fast-foundation';

   export class Button extends FoundationButton { ... }

   const nimbleButton = Button.compose({
       baseClass: FoundationButton,
       styles,
       template
   });
   ```

4. **Use const objects instead of TypeScript enums:**
   ```typescript
   // types.ts
   export const ButtonAppearance = {
       outline: 'outline',
       ghost: 'ghost',
       block: 'block'
   } as const;
   export type ButtonAppearance = typeof ButtonAppearance[keyof typeof ButtonAppearance];
   ```

### Framework Integration

- **Angular**: Directives with `ControlValueAccessor` for form controls
- **Blazor**: Razor components inheriting `ComponentBase`
- **React**: Auto-generated wrappers via `@lit/react`

See package-specific CONTRIBUTING.md files for wrapper implementation details.

### Testing
- **Unit tests**: Required, use `fixture` helper. Run with `npm run tdd:watch -w @ni/nimble-components`
- **Visual tests**: Required matrix stories for Chromatic
- **Browser testing**: Chrome, Firefox, WebKit (use `npm run test-webkit`)

## Styling & Design Tokens

Use design tokens from `theme-provider/design-tokens.ts` for all colors, fonts, and spacing. New components should use CSS Cascade Layers (`@layer base, hover, focusVisible, active, disabled, top`).

See [`packages/nimble-components/docs/css-guidelines.md`](../packages/nimble-components/docs/css-guidelines.md) for complete styling patterns and conventions.

## Storybook Documentation

All components require:
- `component-name.stories.ts`: Interactive documentation with API controls
- `component-name-matrix.stories.ts`: Visual regression tests for Chromatic
- `component-name.mdx`: Usage guidance and design specs

See [`packages/storybook/CONTRIBUTING.md`](../packages/storybook/CONTRIBUTING.md) for file structure and story patterns.

## Common Pitfalls

- ❌ Don't edit files without running formatter (`npm run format`)
- ❌ Don't use CSS classes for component states (use attributes)
- ❌ Don't hardcode tag names in templates (import tags)
- ❌ Don't forget to test in Chrome, Firefox, and WebKit
- ❌ Don't create PR without beachball change file

## Key Files Reference

- Architecture: `../docs/Architecture.md`
- Component specs: `../specs/README.md`
- CSS guidelines: `../packages/nimble-components/docs/css-guidelines.md`
- Coding conventions: `../packages/nimble-components/docs/coding-conventions.md`
- Design tokens: `../packages/nimble-components/src/theme-provider/design-tokens.ts`
- Component status: Check Storybook component status table
