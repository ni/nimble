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

This package contains a theming system which enables changing the appearance of controls based on user preferences or application designs.

The theming system is built on a set of design tokens that define different properties such as fonts, colors, etc. The nimble components are configured to use these theme-aware design tokens. An application should use the same theme-aware design tokens for parts outside of the components.

The theming system is composed of:

1. Theme-aware design tokens that are used in your stylesheets.
2. A `<nimble-theme-provider>` component that is added around your page contents and is configured for a theme.

### Using the Theming System

1. Include the `<nimble-theme-provider>` element on your page and set its `theme` attribute. The theme provider has no appearance of its own but defines tokens that are used by descendant components. It will typically be at the root of the application:

    ```html
    <body>
        <nimble-theme-provider theme="light">
            <!-- everything else -->
        </nimble-theme-provider>
    </body>
    ```

2. _Optional_: Add Nimble components as descendants of the theme provider and they will inherit the theme.
3. _Optional_: Style non-Nimble components using the values which the theme provider defines for tokens.

    - Tokens are defined in an SCSS file at `@ni/nimble-components/dist/tokens.scss`.
    - It is strongly recommended that you consume tokens by using SCSS in your application. Depending on your build tool configuration, you likely will include the tokens at the start of any SCSS file that leverages the tokens with:

        ```scss
        @import '~@ni/nimble-components/dist/tokens.scss';
        ```

    - Leveraging `tokens.scss` is preferred as your application build process will be aware of changes to token names, etc. If you cannot leverage SCSS, it is possible to use the CSS properties directly although you lose the benefit of build tooling being aware of property definitions.

4. _Not recommended_: Override the value of design tokens to use configurations the design system does not include. For example, if you need to define custom colors for icons that are not available on the current icons. This can be difficult for you to maintain as overriding the value of a design token will typically cause the token to no longer be theme-aware.

    If you are in a situation where you need to override a design token value, please reach out to the Nimble team to discuss your use case.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-components/CONTRIBUTING.md) to modify this library.
