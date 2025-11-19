# Nimble Design System - AI Coding Agent Instructions

## Project Overview

Nimble is a multi-framework design system providing NI-styled web components built on FAST Foundation. The monorepo delivers components for vanilla JS/TS, Angular, Blazor, and React applications.

**Key architecture:**
- **Core**: `@ni/nimble-components` - Web components using FAST Element, custom elements, and Shadow DOM
- **Tokens**: `@ni/nimble-tokens` - Base design tokens (colors, typography, spacing)
- **Framework wrappers**: Angular directives, Blazor Razor components, React wrappers via `@lit/react`
- **Variants**: Nimble (general-purpose), Spright (specialized), Ok (experimental)

## Essential Developer Workflows

### Building & Testing
```bash
# Initial setup
npm install
npm run build

# Development watch mode (creates multiple terminal tabs)
# Open Command Palette → Run Task → Create Watch Terminals

# Component development
npm run storybook                              # View components (auto-refreshes on save, requires manual refresh for styles)
npm run tdd:watch -w @ni/nimble-components    # Run unit tests on file changes

# Test in all browsers (Chrome, Firefox, Safari/WebKit)
npm run test-webkit -w @ni/nimble-components  # WebKit testing via Playwright
```

### Change Management (Beachball)
Every PR affecting published packages **must** include a change file:
```bash
npm run change  # Run before creating PR
```
- Choose semantic version type (`patch`/`minor`/`major`)
- Incubating components can use `patch` for breaking changes
- Write client-facing description (supports markdown, use `\n` for newlines)
- CI automatically publishes on merge based on change files

### Linting & Formatting
```bash
npm run lint    # Check all packages
npm run format  # Auto-fix issues
```
VS Code users: Install recommended extensions for automatic formatting on save.

## Component Development Patterns

### Web Component Structure (`nimble-components`)
```
src/component-name/
├── index.ts                    # Component class, registration
├── styles.ts                   # Component styles using design tokens
├── template.ts                 # HTML template (if not using FAST template)
├── types.ts                    # Enums/types
├── models/                     # Classes/interfaces
├── testing/*.pageobject.ts     # Page object for testing
└── tests/*.spec.ts            # Jasmine/Karma unit tests
```

**Import tokens correctly:**
```typescript
import { bodyFont, borderHoverColor } from '../theme-provider/design-tokens';
import { themeBehavior } from '../utilities/style/theme';
```

**Register custom elements:**
```typescript
declare global {
    interface HTMLElementTagNameMap {
        'nimble-button': Button;  // Enables type inference for createElement/querySelector
    }
}
```

### Extending FAST Components
```typescript
import { Button as FoundationButton } from '@ni/fast-foundation';

export class Button extends FoundationButton {
    // Add Nimble-specific functionality
}

const nimbleButton = Button.compose({
    baseClass: FoundationButton,  // Only one Nimble component per FAST baseClass
    styles,
    template
});
```

### Framework Integration

**Angular** (`nimble-angular`):
- Create directive per component using `@Directive({ selector: 'nimble-button' })`
- Use `Renderer2` to proxy properties to `nativeElement`
- Implement `ControlValueAccessor` for form controls (extend Angular's built-in implementations)
- Test with template bindings: `<my-element>`, `<my-element disabled>`, `[disabled]="value"`, `[attr.disabled]="value"`

**Blazor** (`NimbleBlazor`):
- `.razor` template + `.razor.cs` code-behind
- Inherit from `ComponentBase`, always capture `AdditionalAttributes`
- Two-way binding: Create `Value` param + `ValueChanged` EventCallback
- Custom events require JS interop in `NimbleBlazor.lib.module.js`

**React** (`nimble-react`):
- Auto-generated via `@lit/react`'s `createComponent`
- Icons auto-generated (run `npm run generate-icons`)

### Testing Requirements

**Unit Tests** (Jasmine/Karma):
```bash
npm run tdd -w @ni/nimble-components              # Run once
npm run tdd:watch -w @ni/nimble-components        # Watch mode
npm run test-chrome:debugger -w @ni/nimble-components  # Interactive debugging
```
- Test FAST behaviors + Nimble customizations
- Angular: Test `ControlValueAccessor`, module imports, property binding modes, use `fakeAsync` with `processUpdates()`
- Blazor: Use bUnit for Razor tests, Playwright for acceptance tests requiring JS interop

**Chromatic Visual Tests**:
- Required matrix story: `component-name-matrix.stories.ts` showing all states × themes
- PR checks: `UI Tests` (approve visual changes), `UI Review` (designer feedback)

## Styling & Design Tokens

### Using Design Tokens
```typescript
import {
    bodyFont,
    borderHoverColor,
    fillSelectedColor
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        font: ${bodyFont};
        border-color: ${borderHoverColor};
    }
`;
```

**Theme-aware tokens** return different values per theme (light/dark/color):
```typescript
// Design token defined with theme support
createThemeColorToken('border-color', {
    light: '#e0e0e0',
    dark: '#3d3d3d',
    color: '#ffffff'
});
```

**Theme-specific styles:**
```typescript
import { themeBehavior } from '../utilities/style/theme';
import { Theme } from '../theme-provider/types';

const styles = css`...`.withBehaviors(
    themeBehavior(Theme.light, css`...`),
    themeBehavior(Theme.dark, css`...`)
);
```

### Conventions
- Use **attributes** (not CSS classes) for component states: `disabled`, `appearance="outline"`
- Attributes: lower-kebab-case, avoid native HTML attribute names & JS reserved words
- Each component must use `display()` utility for host styles and box-sizing
- Reference other Nimble components via imported tags: `import { buttonTag } ...` not hardcoded strings

## Storybook Documentation

Required files in `packages/storybook/src/nimble/component-name/`:
```
component-name.stories.ts        # Interactive examples, API controls
component-name-matrix.stories.ts # All states × themes (Chromatic visual tests)
component-name.mdx              # User documentation
```

**Story structure:**
```typescript
import { html } from '@ni/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

export default {
    title: 'Components/Button',
    render: createUserSelectedThemeStory(html`<nimble-button>Click</nimble-button>`)
};
```

## Monorepo Package Management

**Install dependencies:**
```bash
npm install <package> --workspace=@ni/nimble-components
npm install <package> --save-peer --workspace=@ni/nimble-angular  # Peer deps
```

**Cross-package references** use workspace protocol:
```json
{
    "dependencies": {
        "@ni/nimble-tokens": "^8.13.1"  // Published version in package.json
    }
}
```

## Component Lifecycle

1. **Spec Phase**: Create IxD, ViD, and technical design specs (see `/specs/README.md`)
2. **Incubating**: Mark component with ⚠️ status, prefix Storybook title with "Incubating/"
3. **Implementation**:
   - Web component in `nimble-components`
   - Framework wrappers (Angular, Blazor, React)
   - Storybook documentation + matrix stories
   - Unit tests + Chromatic visual tests
4. **Release**: Update component status table, remove incubating markers

## PR Guidelines

1. Create draft PR, self-review
2. Add local peer reviewer (+ Nimble team contact if new contributor)
3. Mark "Ready for review" to add CODEOWNERS
4. Include beachball change file (`npm run change`)
5. Squash merge with PR description as commit message

## Common Pitfalls

- ❌ Don't edit files without running formatter (`npm run format`)
- ❌ Don't use CSS classes for component states (use attributes)
- ❌ Don't hardcode tag names in templates (import tags)
- ❌ Don't forget to test in Chrome, Firefox, and WebKit
- ❌ Don't create PR without beachball change file
- ❌ Don't copy FAST templates without copying tests
- ❌ Angular: Don't bind form values via `[value]` (use `[ngModel]`/`[formControl]`)

## Key Files Reference

- Architecture: `/docs/Architecture.md`
- Component specs: `/specs/README.md`
- CSS guidelines: `/packages/nimble-components/docs/css-guidelines.md`
- Coding conventions: `/packages/nimble-components/docs/coding-conventions.md`
- Design tokens: `/packages/nimble-components/src/theme-provider/design-tokens.ts`
- Component status: Check Storybook component status table
