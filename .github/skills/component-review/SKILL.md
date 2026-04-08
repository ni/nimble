---
name: component-review
description: This skill should be used when the user asks to "review this component PR", "review this Nimble component", "review this OK component change", "check component best practices", "review Storybook and wrapper changes", or "propose review feedback responses" for component work in this repository.
version: 0.1.0
---

# Component Review

Review component changes in this repository with a code-review mindset focused on bugs, regressions, missing tests, repo conventions, and incomplete documentation.

Use this skill for pull requests that add or modify component source, wrappers, Storybook stories, docs, or example app usage. Cover both the component implementation and the surrounding integration surface.

## Scope

Inspect changes in these areas when present:

- Web component source in `packages/nimble-components`, `packages/ok-components`, or `packages/spright-components`
- Angular wrappers in `packages/angular-workspace`
- Storybook stories and docs in `packages/storybook`
- Example app usage in `packages/angular-workspace/example-client-app`
- Change files, component status docs, and specs when the PR claims new component functionality

Load [references/repository-best-practices.md](references/repository-best-practices.md) before writing findings when the review touches styling, FAST templates, wrappers, Storybook, or validation commands.

## Review Workflow

### 1. Gather Context

Read the changed files and identify the component surface area:

- Source class, template, styles, tests, and `types.ts`
- Wrapper directives/modules and any exported enum-like types
- Storybook API story, matrix story, MDX docs, and component-status references
- Example app usage and localized strings

If the review is for a pull request, inspect unresolved review comments and group them by file.

### 2. Check the Component API

Verify that public API choices are intentional:

- Confirm default attribute values are justified and documented
- Confirm appearance values and other enum-like APIs are exported where clients need them
- Confirm attribute names follow repo conventions and avoid unnecessary special cases
- Confirm examples and docs reflect the actual default behavior

Treat unexplained default choices as review feedback, especially for visual appearances.

### 3. Check Template and Logic Boundaries

Keep TypeScript logic out of FAST templates when it grows past trivial binding:

- Move multi-line event handling into `index.ts`
- Prefer component tag constants over hard-coded tag names in templates
- Treat FAST event handlers carefully; return `true` unless preventing default is intended
- Question unconditional tooltip/title behavior in Nimble-grade components, but accept simpler behavior in OK components when the tradeoff is reasonable

### 4. Check CSS Against Repo Patterns

Review styling for consistency and maintainability:

- Prefer design tokens and token math over hard-coded measurements
- Prefer shared style helpers like `userSelectNone` over raw browser-specific CSS
- Remove explicit line-height or spacing overrides unless they are necessary and justified
- Avoid styling client-provided slotted content unless the component intentionally defines layout guidance
- Keep spacing and alignment consistent across appearances unless the design requires divergence
- Check hover, focus, and transition rules together to avoid flicker or mismatched state changes
- Check whether motion needs a `prefers-reduced-motion` fallback

### 5. Check Stories and Docs

Treat Storybook as part of the public contract:

- Ensure all supported appearances and important usage patterns have stories
- Keep MDX docs aligned with story names, defaults, and appearance guidance
- Use Nimble body font and color tokens for raw text in story examples
- Confirm nested accordion guidance, incubating warnings, and component-status updates when relevant

Missing example parity is review feedback, not polish.

### 6. Check Framework and Example Integration

Review wrappers and example apps with repo-specific expectations:

- Confirm Angular wrappers re-export public enum-like types when clients need them
- Confirm wrapper property names and transforms match repo patterns
- Even in `example-client-app`, keep Angular template `i18n` and `i18n-*` markers that are required by lint for user-facing literals and attributes
- Confirm build-order assumptions when wrappers consume generated `dist/esm` output from components

### 7. Validate the Change

Run the smallest relevant validation set for the touched packages. Prefer package-level validation over a full monorepo build unless the change requires broader coverage.

Use the commands in [references/repository-best-practices.md](references/repository-best-practices.md) as the default validation set.

If unrelated pre-existing failures block broader validation, say so explicitly and distinguish them from issues introduced by the reviewed change.

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
- Missing test or story coverage for supported behaviors

Do not spend review attention on low-value formatting churn when deeper behavioral issues exist.