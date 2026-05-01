---
name: component-review
description: This skill should be used when the user asks to "review this component PR", "review this Nimble component", "review this OK component change", "check component best practices", "review Storybook and wrapper changes", or "propose review feedback responses" for component work in this repository. Also use it when updating older OK components to match newer sibling implementations and current repo review standards.
version: 0.3.3
---

# Component Review

Review component changes in this repository with a code-review mindset focused on bugs, regressions, missing tests, repo conventions, incomplete documentation, and example-app completeness.

Use this skill for pull requests that add or modify component source, wrappers, Storybook stories, docs, or example app usage. Cover both the component implementation and the surrounding integration surface.

## Scope

Inspect changes in these areas when present:

- Web component source in `packages/nimble-components`, `packages/ok-components`, or `packages/spright-components`
- Angular wrappers in `packages/angular-workspace`
- Storybook stories and docs in `packages/storybook`
- Example app usage in `packages/angular-workspace/example-client-app`, Blazor examples, and other example apps touched by the component surface
- Change files, component status docs, and specs when the PR claims new component functionality

Load <references/repository-best-practices.md> before writing findings when the review touches styling, FAST templates, wrappers, Storybook, or validation commands.

## Review Workflow

### 1. Gather Context

Read the changed files and identify the component surface area:

- Source class, template, styles, tests, and `types.ts`
- Wrapper directives/modules and any exported enum-like types
- Storybook API story, matrix story, MDX docs, and component-status references
- Example app usage across every impacted framework surface and localized strings
- Beachball change files and PR description when the change affects published packages

If the review is for a pull request, inspect unresolved review comments and group them by file.

### 2. Check Supporting PR Artifacts

Review the PR structure and release metadata as part of the change quality bar:

- Check beachball change files for the right change type, a client-impact-focused description, and the GitHub obfuscated email format
- If a bumped monorepo package is only a devDependency consumer, check whether `dependentChangeType` should be `none`
- Treat oversized or multi-purpose PRs as review feedback when the scope is hard to reason about
- Treat vague PR titles or descriptions as review feedback when they obscure client impact, test gaps, or rollout risk

### 3. Check the Component API

Verify that public API choices are intentional:

- Confirm default attribute values are justified and documented
- Confirm appearance values and other enum-like APIs are exported where clients need them
- Confirm appearance mode names match Nimble naming standards such as `underline`, `outline`, `block`, and `frameless` unless the design intentionally defines a different public API
- Confirm attribute names follow repo conventions and avoid unnecessary special cases
- Confirm examples and docs reflect the actual default behavior

Treat unexplained default choices as review feedback, especially for visual appearances.

Treat non-standard appearance naming as review feedback unless it is backed by an intentional design decision and applied consistently across source, wrappers, docs, and examples.

### 4. Check Template and Logic Boundaries

Keep TypeScript logic out of FAST templates when it grows past trivial binding:

- Move multi-line event handling into `index.ts`
- Prefer component tag constants over hard-coded tag names in templates
- Treat FAST event handlers carefully; return `true` unless preventing default is intended
- Do not use nullish coalescing in template bindings; review conditional binding patterns against the existing template guidance in the repo
- Question unconditional tooltip/title behavior in Nimble-grade components, but accept simpler behavior in OK components when the tradeoff is reasonable
- Treat size or style calculations in TypeScript as review feedback when they could be expressed in template or CSS instead
- Treat direct DOM manipulation in `index.ts` as review feedback unless it is clearly required by the component architecture

### 5. Check Lifecycle and Cleanup

Review long-lived behavior and cleanup paths when components register listeners or subscriptions:

- Check that event listeners are cleaned up in `disconnectedCallback`
- Check that FAST notifier or observable subscriptions are cleaned up in `disconnectedCallback`
- Treat retained references to detached DOM or subscriptions as high-priority review feedback

### 6. Check Test Architecture

For new component development, review test structure and client-facing testing support, not just test coverage:

- Prefer page objects for new Nimble component tests so internal DOM details and timing are encapsulated
- Check whether the page object is placed under the component's `/testing` folder and exposed from the package testing entrypoint when clients are expected to consume it
- Check that page objects do not expose raw `Element` types; prefer methods that return primitive values or narrow interaction helpers
- Check that all functionality is covered by automated tests
- Check that tests are at the appropriate level, such as unit tests versus Chromatic coverage
- If behavior is not covered by automated tests, expect explicit justification in the PR description
- Treat direct DOM-heavy tests in new Nimble components as review feedback when a page object should exist instead
- Use existing examples such as stepper page objects and the Nimble contributing guide folder structure as the comparison point when reviewing generated component code

### 7. Check CSS Against Repo Patterns

Review styling for consistency and maintainability:

- Check that styles are ordered according to repo CSS conventions
- Prefer design tokens and token math over hard-coded measurements
- Prefer shared style helpers like `userSelectNone` over raw browser-specific CSS
- Do not set size-related attributes to `inherit` without a very specific, justified reason
- For sizes without a context-specific token, prefer the fixed 4px-grid size ramp instead of hard-coded pixel values
- Remove explicit line-height or spacing overrides unless they are necessary and justified
- Treat `unset` and `revert` with suspicion; expect deliberate use backed by actual CSS behavior, not guesswork
- Avoid styling client-provided slotted content unless the component intentionally defines layout guidance
- Prefer layout models built on `flex` or `grid`, or `inline-flex` / `inline-grid` for inline layouts, and question templates that mix many display modes to achieve layout
- Keep spacing and alignment consistent across appearances unless the design requires divergence
- Check hover, focus, and transition rules together to avoid flicker or mismatched state changes
- Check whether motion needs a `prefers-reduced-motion` fallback
- For new Nimble control styles, check that states are organized with the CSS cascade-layer stack described in the Nimble CSS guidelines
- Treat missing or ad hoc layer organization in new Nimble controls as review feedback, especially when hover, focus-visible, active, disabled, and top-level overrides are being introduced

### 8. Check Stories and Docs

Treat Storybook as part of the public contract:

- Ensure all supported appearances and important usage patterns have stories
- Keep MDX docs aligned with story names, defaults, and appearance guidance
- Ensure important public events and methods are documented when clients are expected to use them
- Use Nimble body font and color tokens for raw text in story examples
- For FV stories in this directory, suggest non-matrix examples to use references from the TV show "The Simpsons"
- When a newer OK component story uses `okWarning` or design-token text wrappers, check older sibling OK stories for the same drift
- Treat newly introduced accessibility violations in Storybook as review findings, not polish
- Confirm nested accordion guidance, incubating warnings, and component-status updates when relevant

Missing example parity is review feedback, not polish.

### 9. Check Framework and Example Integration

Review wrappers and example apps with repo-specific expectations:

- Confirm Angular wrappers re-export public enum-like types when clients need them
- Prefer `BooleanValueOrAttribute` plus `toBooleanProperty` for Angular directive boolean inputs so OK wrappers match the Nimble wrapper coercion pattern instead of relying on raw `booleanAttribute` transforms
- Confirm wrapper property names and transforms match repo patterns
- Do not add `i18n` markers to example-client-app strings; the example app is not localized
- Confirm every example app that should demonstrate the component has been updated, not just the first touched app
- Treat missing updates in Angular, Blazor, React, or other repo example apps as review feedback when the component is available there
- Confirm build-order assumptions when wrappers consume generated `dist/esm` output from components

### 10. Check Related Changes

Review consistency against nearby components, not just the files in the PR:

- When a behavior changes in one component, check whether sibling or analogous components should change too
- Use newer OK component implementations as comparison points for older OK siblings when they cover the same problem space more cleanly
- Treat inconsistent handling across known parallel implementations as review feedback; examples called out in repo guidance include select, combobox, and user-mention listbox behavior

### 11. Check TypeScript Hygiene

Review TypeScript choices for maintainability and correctness:

- Treat lint-rule disables as unusual and expect strong justification
- Treat broad or convenience-driven non-null assertions as review feedback; they should only appear where TypeScript cannot express a proven invariant cleanly

### 12. Validate the Change

Run the smallest relevant validation set for the touched packages. Prefer package-level validation over a full monorepo build unless the change requires broader coverage.

Use the commands in <references/repository-best-practices.md> as the default validation set.

When the review covers example app updates, run each relevant example app and confirm the updated component renders and behaves correctly instead of relying on static code inspection alone.

Treat "example app was not run" as a testing gap unless environment constraints make runtime validation impossible.

If unrelated pre-existing failures block broader validation, say so explicitly and distinguish them from issues introduced by the reviewed change.

If the review touches unstable Chromatic stories, prefer guidance that rebuilds or stabilizes snapshots over accepting known-bad snapshots.

## Output Format

Present findings first, ordered by severity, with file references and concrete reasoning. After findings, include:

- Open questions or assumptions
- Proposed reviewer-thread replies for comments that do not need code changes
- A short validation summary

If no issues are found, say so explicitly and note any remaining testing gaps or unverified areas.

## Review Priorities

Favor high-signal feedback:

- Bugs and behavioral regressions
- Accessibility and interaction issues
- API mismatches between source, wrappers, and docs
- Style-system violations that increase maintenance cost
- Release metadata issues in beachball files or PR descriptions that hide client impact
- Memory leaks from listener or subscription cleanup omissions
- Missing page objects or testing entrypoints for new Nimble components
- Missing automated coverage or wrong test level for supported behavior
- Missing CSS layer organization in new Nimble control styles
- Template binding patterns that violate repo guidance, including nullish coalescing misuse
- Cross-component consistency gaps where a change should be evaluated against sibling implementations
- Missing test or story coverage for supported behaviors

Do not spend review attention on low-value formatting churn when deeper behavioral issues exist.---
name: component-review
description: This skill should be used when the user asks to "review this component PR", "review this Nimble component", "review this OK component change", "check component best practices", "review Storybook and wrapper changes", or "propose review feedback responses" for component work in this repository. Also use it when updating older OK components to match newer sibling implementations and current repo review standards.
version: 0.3.4
---

# Component Review

Review component changes in this repository with a code-review mindset focused on bugs, regressions, missing tests, repo conventions, incomplete documentation, and example-app completeness.

Use this skill for pull requests that add or modify component source, wrappers, Storybook stories, docs, or example app usage. Cover both the component implementation and the surrounding integration surface.

## Scope

Inspect changes in these areas when present:

- Web component source in `packages/nimble-components`, `packages/ok-components`, or `packages/spright-components`
- Angular wrappers in `packages/angular-workspace`
- Storybook stories and docs in `packages/storybook`
- Example app usage in `packages/angular-workspace/example-client-app`, Blazor examples, and other example apps touched by the component surface
- Change files, component status docs, and specs when the PR claims new component functionality

Check that files live in the current grouped ownership layout for the library surface, such as `ok/fv/<component>` and matching framework example folders, instead of older flat paths.

Load <references/repository-best-practices.md> before writing findings when the review touches styling, FAST templates, wrappers, Storybook, or validation commands.

## Review Workflow

### 1. Gather Context

Read the changed files and identify the component surface area:

- Source class, template, styles, tests, and `types.ts`
- Wrapper directives/modules and any exported enum-like types
- Storybook API story, matrix story, MDX docs, and component-status references
- Example app usage across every impacted framework surface and localized strings
- Beachball change files and PR description when the change affects published packages

If the review is for a pull request, inspect unresolved review comments and group them by file.

### 2. Check Supporting PR Artifacts

Review the PR structure and release metadata as part of the change quality bar:

- Check beachball change files for the right change type, a client-impact-focused description, and the GitHub obfuscated email format
- If a bumped monorepo package is only a devDependency consumer, check whether `dependentChangeType` should be `none`
- Treat oversized or multi-purpose PRs as review feedback when the scope is hard to reason about
- Treat vague PR titles or descriptions as review feedback when they obscure client impact, test gaps, or rollout risk
- When component-status docs have been split into per-library data files, review the correct data module instead of only the older aggregate story file

### 3. Check the Component API

Verify that public API choices are intentional:

- Confirm default attribute values are justified and documented
- Confirm appearance values and other enum-like APIs are exported where clients need them
- Confirm appearance mode names match Nimble naming standards such as `underline`, `outline`, `block`, and `frameless` unless the design intentionally defines a different public API
- Confirm attribute names follow repo conventions and avoid unnecessary special cases
- Confirm examples and docs reflect the actual default behavior
- Check naming consistency across human-readable names, TypeScript symbol names, and custom-element tags, for example `Fv Search Input`, `FvSearchInput`, and `fv-search-input`

Treat unexplained default choices as review feedback, especially for visual appearances.

Treat non-standard appearance naming as review feedback unless it is backed by an intentional design decision and applied consistently across source, wrappers, docs, and examples.

### 4. Check Template and Logic Boundaries

Keep TypeScript logic out of FAST templates when it grows past trivial binding:

- Move multi-line event handling into `index.ts`
- Prefer component tag constants over hard-coded tag names in templates
- Treat FAST event handlers carefully; return `true` unless preventing default is intended
- Do not use nullish coalescing in template bindings; review conditional binding patterns against the existing template guidance in the repo
- Question unconditional tooltip/title behavior in Nimble-grade components, but accept simpler behavior in OK components when the tradeoff is reasonable
- Treat size or style calculations in TypeScript as review feedback when they could be expressed in template or CSS instead
- Treat direct DOM manipulation in `index.ts` as review feedback unless it is clearly required by the component architecture
- When a component is a narrow opinionated variant of an existing field or foundation control, prefer extending or composing the closest existing implementation over re-implementing behavior from scratch

### 5. Check Lifecycle and Cleanup

Review long-lived behavior and cleanup paths when components register listeners or subscriptions:

- Check that event listeners are cleaned up in `disconnectedCallback`
- Check that FAST notifier or observable subscriptions are cleaned up in `disconnectedCallback`
- Treat retained references to detached DOM or subscriptions as high-priority review feedback

### 6. Check Test Architecture

For new component development, review test structure and client-facing testing support, not just test coverage:

- Prefer page objects for new Nimble component tests so internal DOM details and timing are encapsulated
- Check whether the page object is placed under the component's `/testing` folder and exposed from the package testing entrypoint when clients are expected to consume it
- Check that page objects do not expose raw `Element` types; prefer methods that return primitive values or narrow interaction helpers
- Check that all functionality is covered by automated tests
- Check that tests are at the appropriate level, such as unit tests versus Chromatic coverage
- If behavior is not covered by automated tests, expect explicit justification in the PR description
- Treat direct DOM-heavy tests in new Nimble components as review feedback when a page object should exist instead
- Use existing examples such as stepper page objects and the Nimble contributing guide folder structure as the comparison point when reviewing generated component code

### 7. Check CSS Against Repo Patterns

Review styling for consistency and maintainability:

- Check that styles are ordered according to repo CSS conventions
- Prefer design tokens and token math over hard-coded measurements
- Prefer shared style helpers like `userSelectNone` over raw browser-specific CSS
- Require internal component-only CSS custom properties to use the `--ni-private-` prefix, including in OK components
- Treat newly introduced public sizing CSS custom properties as review feedback unless the design explicitly requires a public token-like contract; prefer sizing the host element or exposed parts with normal CSS instead
- Do not set size-related attributes to `inherit` without a very specific, justified reason
- For sizes without a context-specific token, prefer the fixed 4px-grid size ramp instead of hard-coded pixel values
- Remove explicit line-height or spacing overrides unless they are necessary and justified
- Treat `unset` and `revert` with suspicion; expect deliberate use backed by actual CSS behavior, not guesswork
- Avoid styling client-provided slotted content unless the component intentionally defines layout guidance
- Prefer layout models built on `flex` or `grid`, or `inline-flex` / `inline-grid` for inline layouts, and question templates that mix many display modes to achieve layout
- Keep spacing and alignment consistent across appearances unless the design requires divergence
- Check hover, focus, and transition rules together to avoid flicker or mismatched state changes
- Check whether motion needs a `prefers-reduced-motion` fallback
- For new Nimble control styles, check that states are organized with the CSS cascade-layer stack described in the Nimble CSS guidelines
- When cascade layers are used, require the exact layer list from the CSS guidelines: `@layer base, hover, focusVisible, active, disabled, top;`
- Treat missing or ad hoc layer organization in new Nimble controls as review feedback, especially when hover, focus-visible, active, disabled, and top-level overrides are being introduced

### 8. Check Stories and Docs

Treat Storybook as part of the public contract:

- Ensure all supported appearances and important usage patterns have stories
- Keep MDX docs aligned with story names, defaults, and appearance guidance
- Ensure important public events and methods are documented when clients are expected to use them
- Use Nimble body font and color tokens for raw text in story examples
- When a newer OK component story uses `okWarning` or design-token text wrappers, check older sibling OK stories for the same drift
- Check Storybook source file placement against the current grouped folder layout, for example `packages/storybook/src/ok/fv/<component>/`, using sibling components as the comparison point when needed
- Keep component-status entries in the correct split data source and preserve local ordering instead of editing an outdated aggregate table
- Treat newly introduced accessibility violations in Storybook as review findings, not polish
- Confirm nested accordion guidance, incubating warnings, and component-status updates when relevant

Missing example parity is review feedback, not polish.

### 9. Check Framework and Example Integration

Review wrappers and example apps with repo-specific expectations:

- Confirm Angular wrappers re-export public enum-like types when clients need them
- Prefer `BooleanValueOrAttribute` plus `toBooleanProperty` for Angular directive boolean inputs so OK wrappers match the Nimble wrapper coercion pattern instead of relying on raw `booleanAttribute` transforms
- Confirm wrapper property names and transforms match repo patterns
- Do not add `i18n` markers to example-client-app strings; the example app is not localized
- Confirm every example app that should demonstrate the component has been updated, not just the first touched app
- Treat missing updates in Angular, Blazor, React, or other repo example apps as review feedback when the component is available there
- Confirm build-order assumptions when wrappers consume generated `dist/esm` output from components
- Treat example-app section components as framework-local demo components, not OK components; avoid `Ok` prefixes on those section component names, selectors, and folders just because they demo OK controls
- Treat unrelated example-app churn outside the touched feature folder as review feedback; app-module wiring should stay minimal and scoped to the feature being added

### 10. Check Related Changes

Review consistency against nearby components, not just the files in the PR:

- When a behavior changes in one component, check whether sibling or analogous components should change too
- Use newer OK component implementations as comparison points for older OK siblings when they cover the same problem space more cleanly
- Treat inconsistent handling across known parallel implementations as review feedback; examples called out in repo guidance include select, combobox, and user-mention listbox behavior
- When repo comments point to a newer sibling component as the ownership or layout model, treat that sibling as the default comparison point for file placement, naming, and Storybook structure

### 11. Check TypeScript Hygiene

Review TypeScript choices for maintainability and correctness:

- Treat lint-rule disables as unusual and expect strong justification
- Treat broad or convenience-driven non-null assertions as review feedback; they should only appear where TypeScript cannot express a proven invariant cleanly

### 12. Validate the Change

Run the smallest relevant validation set for the touched packages. Prefer package-level validation over a full monorepo build unless the change requires broader coverage.

Use the commands in <references/repository-best-practices.md> as the default validation set.

When the review covers example app updates, run each relevant example app and confirm the updated component renders and behaves correctly instead of relying on static code inspection alone.

Treat "example app was not run" as a testing gap unless environment constraints make runtime validation impossible.

If unrelated pre-existing failures block broader validation, say so explicitly and distinguish them from issues introduced by the reviewed change.

If the review touches unstable Chromatic stories, prefer guidance that rebuilds or stabilizes snapshots over accepting known-bad snapshots.

## Output Format

Present findings first, ordered by severity, with file references and concrete reasoning. After findings, include:

- Open questions or assumptions
- Proposed reviewer-thread replies for comments that do not need code changes
- A short validation summary

If no issues are found, say so explicitly and note any remaining testing gaps or unverified areas.

## Review Priorities

Favor high-signal feedback:

- Bugs and behavioral regressions
- Accessibility and interaction issues
- API mismatches between source, wrappers, and docs
- Style-system violations that increase maintenance cost
- File-placement and ownership-layout regressions across grouped OK surfaces
- Release metadata issues in beachball files or PR descriptions that hide client impact
- Memory leaks from listener or subscription cleanup omissions
- Missing page objects or testing entrypoints for new Nimble components
- Missing automated coverage or wrong test level for supported behavior
- Missing CSS layer organization in new Nimble control styles
- Template binding patterns that violate repo guidance, including nullish coalescing misuse
- Cross-component consistency gaps where a change should be evaluated against sibling implementations
- Missing test or story coverage for supported behaviors

Do not spend review attention on low-value formatting churn when deeper behavioral issues exist.