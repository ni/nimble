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

### Using in a Module Bundler Application

If you have an existing application that incorporates a module bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en/) but doesn't include one of the above frameworks, you can use `@ni/nimble-components` directly. Exact instructions will depend on your application, but you can find an example in the [Nimble TypeScript example](/examples/nimble-typescript)


### Prototyping in a static webpage

If you have a static webpage without a bundler, you can use `@ni/nimble-components` by including one of the bundled distribution files. For example:

```html
<html>
    <head>
        <script src="https://unpkg.com/@ni/nimble-components/dist/all-components-bundle.js"></script>
    </head>
    <body>
        <nimble-theme-provider theme="light">
            <nimble-button>Hello</nimble-button>
        </nimble-theme-provider>
    </body>
</html>
```

Alternatively, to use the minified bundle: `https://unpkg.com/@ni/nimble-components/dist/all-components-bundle.min.js`. To specify a specific version see the instructions on [unpkg.com](https://unpkg.com/).

Note: Production applications **must not** rely on the `unpkg.com` service. The service is a useful tool for prototyping or reporting issues.

Note: It is recommended that production applications use build tooling to create optimized builds using only required components instead of importing all components via the `all-components-bundle` files.

## Theming

This package contains a theming system which enables changing the appearance of controls based on user preferences or application designs.

The theming system is built on a set of design tokens that define different properties such as fonts, colors, etc. The Nimble components are configured to use these theme-aware design tokens. An application should use the same theme-aware design tokens for parts outside of the components.

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

2. Include one import in your styles for the Nimble fonts. Nimble recommends using SCSS for capabilities such as build-time property checking.

    ```scss
    @import '~@ni/nimble-components/dist/fonts';
    ```

3. As needed, add Nimble components as descendants of the theme provider and they will inherit the theme.

4. As needed, import the theme-aware design tokens in each SCSS file that will leverage the tokens for other parts of your application (for colors, fonts, etc).

    ```scss
    @import '~@ni/nimble-components/dist/tokens';

    .my-element {
        font-family: $ni-nimble-body-font-family;
        font-size: $ni-nimble-body-font-size;
        color: $ni-nimble-body-font-color;
    }
    ```

## Customizing

The goal of the Nimble design system is to provide a consistent style for applications. If you find that Nimble does not expose colors, fonts, sizes, etc. that you need in an application get in touch with the Nimble squad.

## Accessibility

For accessibility information related to nimble components, see [ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-components/CONTRIBUTING.md) to modify this library.
