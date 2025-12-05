# Nimble Design System – Global AI Instructions

## Quick Orientation
- **Core**: Web Components (FAST Foundation) in `packages/nimble-components`.
- **Wrappers**: Angular, Blazor, and React wrappers live in their respective workspaces.
- **Truth**: The `CONTRIBUTING.md` files are the single source of truth. **Read them** before starting complex tasks.

## Core Workflows
```bash
# Install & build everything
npm install && npm run build

# Storybook + tests (run from repo root)
npm run storybook
npm run tdd -w @ni/nimble-components

# Generate change files before PRs that touch published packages
npm run change
```

## Change Management
- Every PR impacting a published package needs a beachball change file (`npm run change`). See the "Beachball change file" section of [`CONTRIBUTING.md`](../CONTRIBUTING.md).
- Keep builds/test scripts passing locally before queuing CI.

## Common Pitfalls
- ❌ Forgetting `npm run change` when touching published packages.
- ❌ Styling component state via classes instead of attributes/behaviors.
- ❌ Hardcoding tag names inside templates instead of importing tag constants.
- ❌ Skipping Storybook docs/matrix updates when component APIs change.
- ❌ Not running formatter/tests before pushing (`npm run format`, `npm run tdd:watch`).

## Key References
- Architecture: `docs/Architecture.md`
- Repo contributing guide: `CONTRIBUTING.md`
- Nimble component guide: `packages/nimble-components/CONTRIBUTING.md`
- CSS guidelines: `packages/nimble-components/docs/css-guidelines.md`
- Storybook authoring guide: `packages/storybook/CONTRIBUTING.md`
- Specs overview: `specs/README.md`
