# Contributing to Nimble Tokens

## Repository layout

| Folder               | Description                             |
| -------------------- | --------------------------------------- |
| build                | Build scripts for generating files      |
| dist/fonts           | Fonts for use in applications           |
| dist/icons           | Icons for use in applications           |
| dist/styledictionary | JSON token source files                 |
| docs                 | Files used by the documentation         |
| source/icons         | Illustrator files for editing icons     |

## Getting started

1. Build the monorepo, see [Getting Started](/CONTRIBUTING.md#getting-started)

## Editing Base Tokens

Base tokens are generated using the [Style Dictionary](https://styledictionary.com/) build system, which transforms platform-agnostic token definition files into platform-specific output. These JSON definition files are the source of truth for the colors, fonts, and component design tokens in this repository. To modify the generated tokens, complete these steps:

1. Edit the JSON files in `source/styledictionary/properties`. Long term these tokens will be sourced from a Figma design spec but for now it's OK to make manual edits.
2. Rebuild the generated token files by running the repository's build command, `npm run build`.
3. Test your changes locally and create a PR using the normal process.

To style a component with token values, you must first map base tokens to [theme-aware tokens](/packages/nimble-components/CONTRIBUTING.md#theme-aware-tokens).

## Updating icons

### Icon naming

Use [Font Awesome](https://fontawesome.com) names for icons. If Font Awesome doesn't contain an equivalent icon, minimize the use of metaphors; choose descriptive and unambiguous names instead.

| ✅ Descriptive name    | ❌ Metaphor            |
|------------------------|------------------------|
| `key`                  | `access-control`       |
| `cog`                  | `system-configuration` |
| `arrow-left-from-line` | `logout`               |

Add all appropriate metaphors and synonyms to the `icon-metadata.ts` file, so clients can quickly find icons in Storybook. You can find ideas for synonyms in the [Font Awesome metadata](https://github.com/FortAwesome/Font-Awesome/blob/master/metadata/icons.yml).

### Extract icons from Adobe Illustrator

These steps require access to Adobe Illustrator and Perforce so will typically be completed by Brandon O'Keefe, Fred Visser, or another designer.

1. Get the latest copy of the icon source file from NI internal Perforce at `//NIComponents/VisualDesign/ProductionAssets/DiagramPaletteAssets_XML/Nimble/trunk/20.0/source/Nimble_Iconography.ai`.
2. Export high-quality, optimized SVG files from the icon source file, by using the **Export for Screens…** workflow within Adobe Illustrator to export SVG files:

   1. Choose **File » Export » Export for Screens…**

      <img src="docs/ai-export-1.png" width="600">

   2. In the Export for Screen prompt, confirm that files will be exported to the `dist/icons/svg` folder, and that the remaining settings match the screenshot below.

      <img src="docs/ai-export-2.png" width="1000">

   3. Confirm that the SVG settings match the screenshot below.

      <img src="docs/ai-export-3.png" width="600">

   4. Choose to replace any existing files in the `dist/icons/svg` folder.

      <img src="docs/ai-export-4.png" width="600"> 
3. Proceed to the steps below or [create a user story](https://github.com/ni/nimble/issues/new/choose) requesting that the Nimble team perform them. If filing an issue, attach the new and modified SVG files to the issue.

### Adding icons to Nimble

1. Search for all `<defs>.*</defs>` tags in the exported `.svg` files and remove them. This removes all color from the `.svg` files and allows us to dynamically change the fill color.

      <img src="docs/find-replace-5.png" width="1000">

      - **Note:** In rare cases, icons will be provided with multiple fixed colors that are not intended to change with the theme or `severity`. These icons should retain the `<defs>` tags.

2. Confirm the new icon files will build correctly by running: `npm run build -w @ni/nimble-tokens`.
3. Generate and build icon components by running `npm run build -w @ni/nimble-components`. This step will report an error at this point but is necessary to enable the next step.
4. Add metadata for the new icons to `nimble-components/src/icon-base/tests/icon-metadata.ts`.
5. Run `npm run build -w @ni/nimble-components` again. It should now succeed.
6. Preview the built files by running: `npm run storybook`, and review the **Icons** story to confirm that your changes appear correctly. Inspect the icons in each **Severity** and ensure their color changes.
7. Publish a PR with your changes. If there are any new icons, set `changeType` and `dependentChangeType` to minor in the beachball change file.

#### Multi-color (layered) icons

Some icons need more than a single (severity) color. Nimble supports up to six ordered color “layers” per icon. This section is the canonical reference for authoring multi‑color icons.

Workflow overview:

1. In this tokens package, edit the SVG in `source/icons` and apply sequential `cls-1`, `cls-2`, … classes to each colored region that should receive a different themed color. Re‑use a class for shapes sharing a color.
2. Avoid hard‑coded thematic `fill` values. Omit `fill` or use `currentColor` for regions that should inherit the host color. Only keep literal colors for intentionally fixed brand/art portions.
3. In the components package, add or update the corresponding `Icon<Name>` entry in `nimble-components/src/icon-base/tests/icon-metadata.ts` with a `layers` array. Each entry is the exported token name from `theme-provider/design-tokens.ts` (e.g. `warningColor`, `iconColor`). Order matters: index 0 -> `cls-1`, index 1 -> `cls-2`, etc.
4. Run the icon generator (`npm run generate-icons -w @ni/nimble-components`) or a full build. The generator now parses the TypeScript metadata directly (no need for an intermediate two‑pass compile) and will log parsed multi‑color layers.
5. Open Storybook and verify each layer’s color across light/dark themes. Confirm the icon host has `data-multicolor` and inline style variables `--ni-nimble-icon-layer-N-color`.

Authoring checklist:

- Classes: Use contiguous numbering (`cls-1`, `cls-2`, …). Do not skip numbers; fallbacks rely on sequence.
- Max layers: 6 (additional layers will not get distinct CSS variables; consolidate or propose extension first).
- Token names: Prefer existing semantic tokens; propose new tokens in design review rather than hard‑coding colors.
- Metadata key: Must begin with `Icon` (e.g. `IconCirclePartialBroken`) so the generator can strip the prefix to form the component class name.

How colors map:

During generation, each token in `layers` is imported and the component constructor executes:

`this.style.setProperty('--ni-nimble-icon-layer-N-color', 'var(' + token.cssCustomProperty + ')');`

Base styles apply:

```
.cls-1 { fill: var(--ni-nimble-icon-layer-1-color); }
.cls-2 { fill: var(--ni-nimble-icon-layer-2-color, var(--ni-nimble-icon-layer-1-color)); }
... up to 6
```

Each higher layer falls back to the previous, then ultimately to the host `color`, ensuring resilience if metadata or variables are partially missing.

Severity interaction:

`data-multicolor` is added to layered icon hosts; severity‑based single‑color overrides only apply when this attribute is absent, preventing accidental recoloring.

When to use multi‑color:

Reserve layered colors for conveying distinct semantic parts (e.g., partial progress, warning overlay). Don’t add extra colors purely for decoration.

Common pitfalls:

* Missing / non‑sequential `cls-N` classes → unexpected fallback colors.
* Hard‑coded fills overriding theme variables.
* Forgot to add `layers` array → icon treated as single‑color.
* More than 6 layers specified → layers beyond six ignored.

Testing recommendations:

* Visual check in Storybook across light/dark themes and with/without severity attribute.
* Inspect element to confirm CSS variables and `data-multicolor`.
* (Optional) Temporarily change a theme token value to ensure the correct shapes update.

For a quick reference from components, see the abbreviated note in that package’s CONTRIBUTING file.
