# Contributing

## Repository layout

- assets: Managed by Adobe XD DSP plugin
- assets-*: Store various assets referenced by tokens. ie fonts, icons, etc.
- data: Managed by Adobe XD DSP plugin
- dist: Managed by Adobe XD DSP plugin
- dist-*: Build output for assets needing processing

## Editing Tokens
New tokens are added to this package with the Adobe XD Visual Studio plugin.

The source of truth for the colors, fonts, and component design tokens in this repository is an Adobe XD Design Library file maintained by the Visual Design team.

For changes to any token values, work with the Visual Design team to update the library, and then perform the following steps:

1. Ensure you have the [Adobe XD plugin for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Adobe.xd&ssr=false#overview) installed.
2. Open the XD Plugin and load the nimble-tokens-dsp package by selecting the `nimble-tokens` folder.
3. Click the **DSP Setting** button (bottom left). If the button isn't available, open the XD Plugin settings to confirm that the `XD: Global Editor` setting is **checked** for both user and workspace.
4. Scroll to the bottom of the DSP Setting page and click the **Re-import** button to update the CC LIBRARY LINK.
5. Save the settings change.
6. Click the **Start Editing** button and then the **Stop Editing** button to trigger a token build.
7. Commit these changes to the repo.

For any token metadata changes (e.g. documentation, code snippets, etc.):

1. Follow steps 1-3 above.
2. Click the **Start Editing** button and make your changes.
3. Click the **Stop Editing** button to trigger a token build.
4. Commit these changes to the repo.

## Updating icons

1. [Export high-quality, optimized SVG files](https://helpx.adobe.com/illustrator/how-to/export-svg.html) from the Adobe Illustrater icon source file.
2. Add and/or replace the updated SVG files in the `assets/icons` folder.
3. (TODO: automate) From the `nimble-icons` directory, run `npm run generate-dsp` to update the DSP definition with the latest icons.
4. Create a PR to push the changes to this repository.
