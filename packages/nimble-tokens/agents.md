# Nimble Tokens – AI Instructions

## Overview
The source of truth for design tokens (colors, fonts, sizes) and icons.
- **Tooling**: Style Dictionary (tokens), Adobe Illustrator (icons)
- **Output**: SCSS, CSS, TypeScript, and JSON

## Build
Run these commands from the repo root:
- **Build**: `npm run build -w @ni/nimble-tokens`

## Key References
- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Build scripts, editing base tokens, updating icons.

## Workflows
- **Edit Tokens**: Modify JSON in `source/styledictionary/properties`. Run `npm run build`.
- **Add Icons**:
    1. Export optimized SVGs from Illustrator to `dist/icons/svg`.
    2. Remove `<defs>` tags (unless multi-colored).
    3. Run `npm run build -w @ni/nimble-tokens`.
    4. Update `icon-metadata.ts` in `nimble-components`.

## Naming Conventions
- **Icons**: Use Font Awesome names where possible (e.g., `key`, `cog`). Avoid metaphors (`access-control`, `logout`).
