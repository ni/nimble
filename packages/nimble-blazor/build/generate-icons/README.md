# Generate Icons

## Behavior

- Depends on the build output of `nimble-tokens` to generate icon Angular integrations.
- Generates a Razor component file for each icon.

## How to run

This script runs as part of the Nimble Blazor build.

To run manually:

1. Run a Nimble Blazor build.
2. Edit `index.js` for this script and run `npm run generate-icons` (can re-run when modifying `index.js` behavior).
