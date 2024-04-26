# Nimble Storybook

Private package containing the Storybook for the Nimble repo.

## Developer Workflows

When running Storybook locally with `npm run start`, changes to `nimble-components` or `spright-components` will not be reflected in the stories until the modified package is rebuilt and the page is refreshed. To avoid having to manually run `npm run build-components` any time you make a change, you can instead run `npm run build-components:watch` to have the package automatically rebuild whenever it is modified.