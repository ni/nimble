# Generate Icons

## Behavior

- Depends on the build output of `nimble-tokens` to generate icon Angular integrations.
- Generates an icon directive file and module file for each icon, and a barrel file.

## How to run

This script runs as part of the Nimble Angular build.

To run manually:

1. Run a Nimble Angular build.
2. Edit `index.js` for this script and run `npm run generate-icons` (can re-run when modifying `index.js` behavior).
