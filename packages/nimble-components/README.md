<div align="center">
    <p><b>ni | nimble | components</b></p>
</div>

# Nimble Components

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-components.svg)](https://www.npmjs.com/package/@ni/nimble-components)

NI-styled web components for web applications.

## Getting Started

### Framework Support

If you are using one of the following frameworks see associated wrapper documentation:

1. Angular: See the [nimble-angular](/angular-workspace/projects/ni/nimble-angular) documentation.
2. Blazor WebAssembly or Blazor Server: See the [nimble-blazor](/packages/nimble-blazor) documentation.

### Using `nimble-components` Without a Framework

To use `@ni/nimble-components` directly, follow these steps:

1. Install from [the public NPM registry](https://www.npmjs.com/package/@ni/nimble-components) by running `npm install @ni/nimble-components`.
2. Import the component you want to use from the file you want to use it in. For example: `import '@ni/nimble-components/dist/esm/icons/succeeded';`
3. Add the HTML for the component to your page. You can see sample code for each component in the [Nimble Storybook](https://ni.github.io/nimble/storybook/) by going to the **Docs** tab for the component and clicking **Show code**. For example: `<nimble-succeeded-icon></nimble-succeeded-icon>`.
4. Nimble components are [standard web components (custom elements)](https://developer.mozilla.org/en-US/docs/Web/Web_Components) so you can configure them via normal DOM APIs like attributes, properties, events, and methods. The [Storybook documentation](https://ni.github.io/nimble/storybook/) for each component describes its custom API.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-components/CONTRIBUTING.md) to modify this library.
