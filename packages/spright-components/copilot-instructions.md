# Spright Components – AI Instructions

## Key References

- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Ownership, code quality, and documentation requirements.

## Context

- **Package**: `@ni/spright-components` (specialized components that must still align with Nimble quality).
- **Prefix**: `spright-` (`DesignSystem.getOrCreate().withPrefix('spright')`).
- **Ownership**: Shared between the Nimble team and the feature team delivering the Spright experience.

## Development Guidelines

- Build/test/storybook commands mirror Nimble components (see [`../nimble-components/copilot-instructions.md`](../nimble-components/copilot-instructions.md)).
- Implement the same component skeleton (registration, template, styles, tests, docs). Link to the Nimble instructions rather than duplicating snippets.
- Document any domain-specific deviations (tokens, behaviors, wrappers) inside the component specs and Storybook docs.

## Requirements vs Nimble

|                        | `nimble-components` | `spright-components` |
| ---------------------- | :-----------------: | :------------------: |
| Approved spec          |         🟢          |          🟢          |
| Unit tests             |         🟢          |          🟢          |
| Storybook visual tests |         🟢          |          🟢          |
| Storybook API docs     |         🟢          |          🟢          |
| Storybook usage docs   |         🟢          |          🟡          |
| Approved VxD\*         |         🟢          |          🟡          |
| Approved IxD\*         |         🟢          |          🟡          |
| Angular/Blazor support |         🟢          |          🟡          |
| Proper a11y            |         🟢          |          🟡          |
| Minimal tech debt      |         🟢          |          🟡          |
| Mobile support         |         🟡          |          🟡          |

🟢 = required, 🟡 = optional\*By an interaction and/or visual designer

## Code Ownership

- Nimble team reviews for architecture, tokens, accessibility, and repo health.
- Contributing team owns roadmap delivery, bug fixes, and maintenance for Spright-specific behaviors.
- Coordinate on design tokens and shared utilities to avoid divergence from Nimble.
