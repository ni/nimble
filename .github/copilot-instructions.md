# Nimble Design System – AI Coding Agent Instructions

## Quick Orientation
- Multi-framework system (Web Components + Angular, Blazor, React wrappers). Core packages live under `packages/`.
- FAST Foundation is the underlying component model; tokens come from `@ni/nimble-tokens`.
- Variants: Nimble (general), Spright (specialized), Ok (incubating). Each has its own `copilot-instructions.md` for details.

For repo-wide processes and tooling details, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Core Workflows
```bash
# Install & build everything
npm install && npm run build

# Watch mode (recommended): Command Palette → "Run Task" → "Create Watch Terminals"

# Storybook + tests (run from repo root)

npm run tdd:watch -w @ni/nimble-components
npm run test-webkit -w @ni/nimble-components

# Generate change files before PRs that touch published packages
npm run change
```

## Change Management
- Every PR impacting a published package needs a beachball change file (`npm run change`). See the "Beachball change file" section of [`CONTRIBUTING.md`](../CONTRIBUTING.md).
- Keep builds/test scripts passing locally before queuing CI.

## Component Development
- **Guidelines**: Follow [`packages/nimble-components/CONTRIBUTING.md`](../packages/nimble-components/CONTRIBUTING.md).
- **Snippets**: See [`packages/nimble-components/copilot-instructions.md`](../packages/nimble-components/copilot-instructions.md) for registration, styling, and testing templates.
- **Registration**: Use `DesignSystem.getOrCreate().withPrefix(...)`.
- **Bundling**: Update `src/all-components.ts`.

## Styling & Storybook
- **Styling**: Use design tokens (`theme-provider/design-tokens.ts`). See [`docs/css-guidelines.md`](../packages/nimble-components/docs/css-guidelines.md) for cascade layers and utilities.
- **Storybook**: Required for all components (`.stories.ts`, `-matrix.stories.ts`, `.mdx`). See [`packages/storybook/CONTRIBUTING.md`](../packages/storybook/CONTRIBUTING.md).

## Testing Expectations
- Unit tests use Karma/Jasmine fixtures (`npm run tdd:watch -w @ni/nimble-components`).
- Cross-browser coverage: Chrome, Firefox, WebKit (`npm run test-webkit -w @ni/nimble-components`).
- Disable flaky tests only with an issue link and browser-specific skip tag as outlined in package CONTRIBUTING docs.

## Common Pitfalls
- ❌ Forgetting `npm run change` when touching published packages.
- ❌ Styling component state via classes instead of attributes/behaviors.
- ❌ Hardcoding tag names inside templates instead of importing tag constants.
- ❌ Skipping Storybook docs/matrix updates when component APIs change.
- ❌ Not running formatter/tests before pushing (`npm run format`, `npm run tdd:watch`).

## Key References
- Architecture: `../docs/Architecture.md`
- Repo contributing guide: `../CONTRIBUTING.md`
- Nimble component guide: `../packages/nimble-components/CONTRIBUTING.md`
- CSS guidelines: `../packages/nimble-components/docs/css-guidelines.md`
- Storybook authoring guide: `../packages/storybook/CONTRIBUTING.md`
- Specs overview: `../specs/README.md`
