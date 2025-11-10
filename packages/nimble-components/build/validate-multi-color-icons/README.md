# Validate Multi-Color Icons

## Behavior

- Validates that manually-created multi-color icons in `src/icons-multicolor/` meet requirements.
- Validates that `icon-metadata.ts` entries marked with `multiColor: true` have corresponding files in `src/icons-multicolor/`.
- Validates that icon layer counts don't exceed `MAX_ICON_LAYERS` (6).
- Fails the build if any violations are found.

## How to run

This script runs as part of the icon generation process.

To run manually:

1. Run a Nimble Components build to ensure nimble-tokens is available.
2. Run `npm run validate-multi-color-icons` to bundle and execute the validation.

Or run directly:

```bash
npm run validate-multi-color-icons:bundle
npm run validate-multi-color-icons:run
```

## What it validates

1. **File consistency**: All files in `src/icons-multicolor/` must be marked with `multiColor: true` in `icon-metadata.ts`
2. **Metadata consistency**: All icons marked with `multiColor: true` in `icon-metadata.ts` must have corresponding files in `src/icons-multicolor/`
3. **Layer count**: All multi-color icons must have ≤ 6 layers (cls-1 through cls-6)

## Error handling

The script exits with code 1 and provides clear error messages if:

- A file exists in `src/icons-multicolor/` but isn't marked with `multiColor: true` in `icon-metadata.ts`
- An icon is marked with `multiColor: true` in `icon-metadata.ts` but the file doesn't exist
- An icon has more than 6 color layers

Error messages include remediation steps to fix the issue.
