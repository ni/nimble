# Generate Icons

## Behavior

- Depends on the build output of `nimble-tokens` to generate icon components.
- Generates an icon component file for each icon, and an all-icons.ts file which exports all icon components.

## How to run

This script runs as part of the Nimble Components build.

To run manually:

1. Run a Nimble Components build (only need to re-rerun if making components changes).
2. Edit `index.js` for this script and run `npm run generate-icons` (can re-run when modifying `index.js` behavior).
