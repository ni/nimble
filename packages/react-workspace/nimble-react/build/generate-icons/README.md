# Generate Icons

## Behavior

- Depends on the build output of `nimble-tokens` to generate React wrapper components for icons.
- Generates a React wrapper file for each icon in `src/icons/`.
- **Automatically handles multi-color icons** by detecting them from nimble-components metadata and using the appropriate import path (`icons-multicolor` vs `icons`).

## How to run

This script runs as part of the Nimble React build.

To run manually:

1. Run a Nimble React build.
2. Edit `index.js` for this script and run `npm run build:icons` (can re-run when modifying `index.js` behavior).
