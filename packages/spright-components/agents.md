# Spright Components – AI Instructions

## Overview

Specialized components that serve specific domain needs while maintaining Nimble's quality standards.

- **Prefix**: `spright-`
- **Status**: Production-grade, domain-specific.

## Build & Test

Run these commands from the repo root:

- **Build**: `npm run build -w @ni/spright-components`
- **Test**: `npm run tdd:watch -w @ni/spright-components`

## Key References

- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Ownership, code quality, and documentation requirements.

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

## Development Guidelines

- Implement the same component skeleton (registration, template, styles, tests, docs) as Nimble.
- Link to Nimble instructions rather than duplicating snippets.

## Common Pitfalls

- ❌ **Duplicating Nimble Patterns**: Link to `nimble-components` docs instead of copying code snippets.
- ❌ **Missing Specs**: An approved spec is required before development.
- ❌ **Skipping Visual Tests**: Storybook visual tests are mandatory.
