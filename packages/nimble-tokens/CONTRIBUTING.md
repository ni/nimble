# Contributing

New tokens are added to this package with the Adobe XD Visual Studio plugin.

The source of truth for the colors, fonts, and component design tokens in this repository is an Adobe XD Design Library file maintained by the Visual Design team.

For changes to any token values, work with the Visual Design team to update the library, and then perform the following steps:

1. Ensure you have the [Adobe XD plugin for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Adobe.xd&ssr=false#overview) installed.
2. Open the XD Plugin and load the nimble-tokens-dsp package, by selecting the `nimble-tokens` folder.
3. Click the **DSP Setting** button (bottom left). If the button isn't available, open the XD Plugin settings to confirm that the `XD: Global Editor` setting is **checked** for both user and workspace.
4. Scroll to the bottom of the DSP Setting page, and click the **Re-import** button to update the CC LIBRARY LINK.
5. Save the settings change.
6. Click the **Start Editing** button, and then the **Stop Editing** button, to trigger a token build.
7. Commit these changes to the repo.

For any token metadata changes (e.g. documentation, code snippets, etc.):

1. Follow steps 1-3 above.
2. Click the **Start Editing** button, and make your changes.
3. Click the **Stop Editing** button, to trigger a token build.
4. Commit these changes to the repo.
