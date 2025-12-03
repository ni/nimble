# Ok Components – AI Instructions

## Key References

- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Ownership, code quality, and documentation requirements.

## Context

- **Package**: `@ni/ok-components` (incubating experiments built on Nimble patterns).
- **Prefix**: `ok-` when registering custom elements via `DesignSystem.getOrCreate().withPrefix('ok')`.
- **Ownership**: Feature team owns implementation; Nimble team owns shared tooling and reviews for repo health.

## Build & Workflow

- Use the same commands as Nimble components (see [`../nimble-components/copilot-instructions.md`](../nimble-components/copilot-instructions.md)).
- Generate beachball change files whenever the package changes.
- Provide Storybook docs/matrix + unit tests for every new component, even while incubating.

## Requirements vs Nimble

| Area                 | Nimble             | Ok                                                |
| -------------------- | ------------------ | ------------------------------------------------- |
| Spec completeness    | Required           | Optional – document scope gaps in Storybook       |
| Accessibility polish | Required           | In-progress allowed, but note limitations         |
| Framework wrappers   | Required over time | Optional unless feature explicitly needs wrappers |
| Owner team           | Nimble             | Contributing feature team                         |

## Expectations

- Follow the coding, styling, and testing conventions in the Nimble instructions; only deviate if explicitly documented in the component specs.
- Clearly call out incubating gaps in docs (e.g., Storybook banner, component status table ⚠️ entry).
- Contributing team is responsible for addressing regressions, flaky tests, and build perf issues originating from this package.
