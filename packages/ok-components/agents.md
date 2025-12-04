# Ok Components – AI Instructions

## Overview
Incubating and experimental components built on Nimble patterns.
- **Prefix**: `ok-`
- **Status**: Experimental / Pre-production
- **Goal**: Rapid prototyping with a path to graduation.

## Build & Test
Run these commands from the repo root:
- **Build**: `npm run build -w @ni/ok-components`
- **Test**: `npm run tdd:watch -w @ni/ok-components`

## Key References
- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Ownership, code quality, and documentation requirements.

## Requirements vs Nimble
| Area                 | Nimble             | Ok                                                |
| -------------------- | ------------------ | ------------------------------------------------- |
| Spec completeness    | Required           | Optional – document scope gaps in Storybook       |
| Accessibility polish | Required           | In-progress allowed, but note limitations         |
| Framework wrappers   | Required over time | Optional unless feature explicitly needs wrappers |
| Owner team           | Nimble             | Contributing feature team                         |

## Expectations
- Follow Nimble coding/styling/testing conventions unless explicitly documented otherwise.
- Clearly call out incubating gaps in docs (e.g., Storybook banner, component status table ⚠️ entry).
