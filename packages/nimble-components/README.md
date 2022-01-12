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

### Using `nimble-components` in a Webpack Application

If you have an existing application that incorporates a module bundler like [Webpack](https://webpack.js.org/) but doesn't include one of the above frameworks, you can use `@ni/nimble-components` directly. Exact instructions will depend on your application, but here are some common steps:

1. Install the package from [the public NPM registry](https://www.npmjs.com/package/@ni/nimble-components) by running `npm install @ni/nimble-components`.
2. Import the component you want to use from the file you want to use it in. For example: `import '@ni/nimble-components/dist/esm/icons/succeeded';`
3. Add the HTML for the component to your page. You can see sample code for each component in the [Nimble Storybook](https://ni.github.io/nimble/storybook/) by going to the **Docs** tab for the component and clicking **Show code**. For example: `<nimble-succeeded-icon></nimble-succeeded-icon>`.
4. Nimble components are [standard web components (custom elements)](https://developer.mozilla.org/en-US/docs/Web/Web_Components) so you can configure them via normal DOM APIs like attributes, properties, events, and methods. The [Storybook documentation](https://ni.github.io/nimble/storybook/) for each component describes its custom API.

## Theming

This package contains a theming system which enables changing the appearance of controls based on user preferences or application designs. All built in components are styled in several themes. An application can also read the tokens underlying the themes to style other parts of the application or modify the tokens underlying the themes to customize the appearance beyond what Nimble offers.

The theming system is composed of:

1. high-level theme-aware [design tokens](/packages/nimble-components/src/theme-provider/design-tokens.ts) which map low-level values from `nimble-tokens` to CSS variables and TypeScript constants that style parts of controls.
2. a [theme provider component](/packages/nimble-components/src/theme-provider/index.ts) which organizes the higher level tokens into themes.

### Using the Theming System

1. Include the `<nimble-theme-provider>` element on your page and optionally set its `theme` attribute. The theme provider has no appearance of its own but defines tokens that are used by descendant components. It will typically be at the root of the application:

```html
<body>
    <nimble-theme-provider>
        <!-- everything else -->
    </nimble-theme-provider>
</body>
```

2. _Optional_ Add other Nimble components as descendants of the theme provider and they will inherit the theme.
3. _Optional_ Style non-Nimble components using the values which the theme provider defines for tokens.
    - Tokens are exposed as CSS custom properties and as TypeScript constants using the [FAST Design Token](https://www.fast.design/docs/design-systems/design-tokens) implementation.
    - These tokens are not yet documented but you can see their names in [`design-tokens.ts`](/packages/nimble-components/src/theme-provider/design-tokens.ts).
4. _Optional_ Customize the theme for all or part of your application. Approaches for doing this are an area of active research; please reach out to the Nimble team to discuss your use case.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-components/CONTRIBUTING.md) to modify this library.
