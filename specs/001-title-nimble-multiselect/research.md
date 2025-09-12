# Research: nimble-multiselect Implementation

## Decisions and Rationale

### Decision: Extend nimble-select component for multi-select functionality
**Rationale**: The feature spec requires the same features as nimble-select (filtering, dropdown, etc.), so extending the existing component minimizes duplication and ensures consistency. The prototype already follows this approach.

**Alternatives considered**:
- Build from scratch: Rejected due to code duplication and inconsistency risks.
- Use a different base: Not applicable, as nimble-select is the direct counterpart.

### Decision: Inject nimble-icon-check into selected options' start slot
**Rationale**: Per spec FR-004.1, this provides a visual check indicator without modifying list-option globally. The prototype implements this by dynamically adding the icon element to the option's light DOM.

**Alternatives considered**:
- CSS-only check pseudo-element: Rejected as it may not integrate well with the design system and icon consistency.
- Modify list-option to accept a check prop: Rejected to avoid global changes and maintain separation of concerns.

### Decision: Comma-separated summary for multiple selections
**Rationale**: Spec FR-003.1 specifies comma-separated labels as the default. This is simple and matches common multi-select patterns.

**Alternatives considered**:
- "n items selected": Could be added as an option, but comma-separated is more informative.
- Customizable template: Overkill for initial implementation; can be extended later.

### Decision: Use FAST framework and TypeScript
**Rationale**: Consistent with existing nimble components. The prototype is already implemented in TypeScript using FAST.

**Alternatives considered**:
- Vanilla JS: Rejected due to complexity and lack of type safety.
- Other frameworks: Not applicable, as nimble is FAST-based.

### Decision: Support same filtering modes as nimble-select (none, standard, manual)
**Rationale**: Spec FR-005 requires same filtering behavior. Ensures feature parity.

**Alternatives considered**:
- Simplified filtering: Rejected to maintain consistency.

### Decision: Emit input/change events on selection changes
**Rationale**: Spec FR-006 requires events for form integration. Matches nimble-select behavior.

**Alternatives considered**:
- Custom events: Unnecessary, as standard events suffice.

### Decision: Integrate with forms via proxy select element
**Rationale**: Spec FR-007 requires form submissions to include selected values. nimble-select uses this pattern.

**Alternatives considered**:
- Direct form integration: More complex without proxy.

### Decision: Keyboard navigation equivalent to nimble-select
**Rationale**: Spec FR-008 requires same keyboard support. Ensures accessibility.

**Alternatives considered**:
- Reduced keyboard support: Rejected for accessibility reasons.

### Decision: Accessible API with aria-multiselectable
**Rationale**: Spec FR-009 requires accessibility. aria-multiselectable indicates multi-selection capability.

**Alternatives considered**:
- No aria attributes: Rejected for accessibility violations.

### Decision: Support option groups
**Rationale**: Spec FR-010 requires consistency with nimble-select.

**Alternatives considered**:
- No group support: Rejected for feature parity.

## Technical Research Findings

### Extending FAST Select
- Use FormAssociatedSelect as base, add multiple selection logic.
- Override selectedOptionsChanged to handle multi-selection and icon injection.
- Update displayValue for comma-separated summary.

### Icon Injection
- In selectedOptionsChanged, for each selected option, append nimble-icon-check to its start slot if not present.
- Remove icon when deselected.
- Use document.createElement for icon creation.

### Filtering
- Reuse existing filter logic from select.
- Ensure filteredOptions updates correctly for multi-select.

### Testing
- Use Karma/Jasmine for unit tests.
- Page objects for integration tests.
- Storybook for visual testing.

## Resolved Unknowns
- All NEEDS CLARIFICATION in spec have been addressed.
- Prototype provides working example for most features.
- Remaining work: Complete implementation, fix Storybook styling, add comprehensive tests.
