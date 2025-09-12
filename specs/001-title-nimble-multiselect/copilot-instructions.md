# GitHub Copilot Instructions: nimble-multiselect

## Context
You are implementing the `nimble-multiselect` component for the Nimble design system. This is a multi-select version of `nimble-select`, allowing users to choose multiple options from a dropdown list.

## Key Requirements
- Extend `nimble-select` functionality to support multiple selections
- Display comma-separated summary of selected items
- Inject `nimble-icon-check` into start slot of selected options
- Maintain all existing nimble-select features: filtering, keyboard navigation, accessibility
- Use FAST framework and TypeScript
- Follow Nimble coding patterns and conventions

## Implementation Approach
1. Base on existing `nimble-select` in `/packages/nimble-components/src/select/`
2. Use `FormAssociatedSelect` with `multiple=true`
3. Override `selectedOptionsChanged` to handle multi-selection and icon injection
4. Update `displayValue` for summary
5. Ensure proper form integration with proxy select
6. Add comprehensive tests and Storybook stories

## Code Patterns
- Use FAST compose API for component registration
- Follow existing Nimble component structure (index.ts, template.ts, styles.ts)
- Use Nimble design tokens for styling
- Implement accessibility with ARIA attributes
- Handle edge cases: disabled options, groups, filtering

## Testing
- Write unit tests for component logic
- Create page objects for integration tests
- Add Storybook stories for visual testing
- Test keyboard navigation and screen reader support

## Files to Reference
- `/packages/nimble-components/src/select/` - Base implementation
- `/packages/nimble-components/src/multiselect/` - Current prototype
- `/packages/storybook/src/nimble/select/` - Storybook examples
- Nimble design tokens and icons

## Deliverables
- Complete, working `nimble-multiselect` component
- Tests passing
- Storybook stories functional
- Documentation updated
- No linting or TypeScript errors
