# Repository Best Practices For Component Review

Use this reference while reviewing component work in the Nimble monorepo.

## Component Surface Checklist

Review all affected surfaces, not just the web component source:

- `index.ts`, `template.ts`, `styles.ts`, `types.ts`, and tests
- Angular wrappers and public exports
- Storybook stories, matrix stories, and MDX docs
- Example app usage
- Change files and component-status docs when applicable

## API And Defaults

- Expect default appearances and default behaviors to be intentional, documented, and reflected in stories.
- Confirm public enum-like values remain available through framework wrappers when clients need to bind against them.
- Confirm examples and docs reflect the actual default state instead of an older design assumption.

## FAST Template Patterns

- Keep multi-line event logic in the component class rather than inline in the template.
- Return `true` from FAST template event handlers unless default prevention is intentional.

Reason:

- FAST template event bindings call `event.preventDefault()` unless the handler returns `true`.
- This behavior is easy to miss and can cause subtle interaction bugs.

- Prefer component tag constants over hard-coded custom-element names inside templates.

## CSS Review Patterns

- Prefer design tokens and token math over hard-coded values.

Examples:

- Prefer `calc(${controlHeight} + (2 * ${dividerWidth}))` over a raw pixel height when the value is derived from existing size tokens.

- Prefer shared helpers over duplicated browser-specific CSS.

Examples:

- Use `userSelectNone` instead of writing `user-select` directly.

- Question explicit `line-height` unless it fixes a real visual or cross-browser issue.
- Avoid styling slotted client content unless the component intentionally defines layout guidance. If the component must recommend spacing, prefer established token values such as `standardPadding` over ad hoc spacing.
- Keep geometry consistent across appearances unless the design explicitly requires a different layout.
- Check hover and focus-visible rules together. Missing transitions or mismatched outline/border behavior often cause flicker.
- Check motion rules against `prefers-reduced-motion` when the component animates movement or shape.

## Storybook And Docs

- Expect API docs and usage docs for OK components in Storybook.
- Ensure stories cover every supported appearance and major usage mode that the docs describe.
- Expect MDX docs to stay in sync with story exports and defaults.
- Use Nimble body font and color tokens for raw text in story examples.

Examples:

- Apply `font: var(${bodyFont.cssCustomProperty});`
- Apply `color: var(${bodyFontColor.cssCustomProperty});`

- Confirm nested accordion guidance remains aligned with the Nimble accordion spec: nested accordions use ghost appearance.

## Wrapper And Example App Review

- Angular wrappers in this repo commonly re-export enum-like types used by public inputs.
- Example-client-app strings should not add `i18n` markers.
- When wrapper builds consume `@ni/ok-components/dist/esm/...`, rebuild the component package before building the Angular workspace.

## Validation Commands

Use the smallest meaningful validation set for the touched packages.

Typical OK component validation:

- `npm run build:components -w @ni/ok-components`
- `npm run test-chrome -w @ni/ok-components`
- `npm run build:ok -w @ni-private/angular-workspace`
- `npm run build:ts -w @ni-private/storybook`

Add broader validation only when the change truly affects it.

If `example-client-app` or another package fails for unrelated pre-existing reasons, call that out separately instead of attributing it to the reviewed change.

## Example Review Responses

Use short, factual replies that explain the action taken or the reason for not changing code.

Examples:

- "Removed the `i18n` markers from the example app. The example-client-app is not localized."
- "Exported the appearance type from the Angular wrapper so consumers can bind to the public API consistently with other wrappers."
- "Replaced the hard-coded height with token math based on `controlHeight` and `dividerWidth`."
- "Moved the toggle logic into the component class to keep TypeScript out of the FAST template."
- "Left the unconditional `title` behavior in place because the lighter-weight OK component tradeoff is acceptable here."
- "Changed the default appearance to `ghost` and updated stories, docs, and tests to match."