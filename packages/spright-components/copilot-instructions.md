# Spright Components – AI Instructions

## Context

- **Package**: `@ni/spright-components` (specialized components that must still align with Nimble quality).
- **Prefix**: `spright-` (`DesignSystem.getOrCreate().withPrefix('spright')`).
- **Ownership**: Shared between the Nimble team and the feature team delivering the Spright experience.

## Development Guidelines

- Build/test/storybook commands mirror Nimble components (see [`../nimble-components/copilot-instructions.md`](../nimble-components/copilot-instructions.md)).
- Implement the same component skeleton (registration, template, styles, tests, docs). Link to the Nimble instructions rather than duplicating snippets.
- Document any domain-specific deviations (tokens, behaviors, wrappers) inside the component specs and Storybook docs.

## Requirements vs Nimble

| Requirement                   | Nimble | Spright                                                  |
| ----------------------------- | ------ | -------------------------------------------------------- |
| Approved IxD/ViD/Tech specs   | ✅     | ✅ (can trail by agreement, but gaps must be tracked)    |
| Unit tests + Chromatic matrix | ✅     | ✅                                                       |
| Storybook API docs            | ✅     | ✅                                                       |
| Storybook usage guidance      | ✅     | ⚠️ Optional if domain docs exist elsewhere               |
| Angular/Blazor wrappers       | ✅     | ⚠️ Optional unless downstream apps require them          |
| Accessibility polish          | ✅     | ⚠️ Temporary gaps allowed but must be logged             |
| Tech debt tolerance           | Low    | Medium – but issues must have owners and follow-up dates |

Legend: ✅ required, ⚠️ optional/negotiated

## Code Ownership

- Nimble team reviews for architecture, tokens, accessibility, and repo health.
- Contributing team owns roadmap delivery, bug fixes, and maintenance for Spright-specific behaviors.
- Coordinate on design tokens and shared utilities to avoid divergence from Nimble.
