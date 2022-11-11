<div align="center">
    <p><b>ni | nimble | tokens</b></p>
</div>

# Nimble Tokens

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-tokens.svg)](https://www.npmjs.com/package/@ni/nimble-tokens)

NI base design tokens. Design tokens are primitive elements of component style like color, typography, and spacing. **These should generally not be consumed directly by applications**. See below for guidance.

## Getting Started

If you are using one of the following frameworks you should consume tokens via components implemented in the following libraries. These libraries provide styled components that use the design tokens to implement several color themes.

1. Angular: See the [nimble-angular](/angular-workspace/projects/ni/nimble-angular) documentation.
2. Blazor WebAssembly or Blazor Server: See the [nimble-blazor](/packages/nimble-blazor) documentation.
3. Vanilla / Frameworkless: See the [nimble-components](/packages/nimble-components) documentation.

## Using Theme-Aware Tokens

The above libraries also offer a theming system which is independent of other components from the library. Adopting this theming system can be a cheaper way to update a legacy application to approximate the NI brand without the development and testing burden of adopting a new component library.

Applications should typically use this theming system rather than depending on `nimble-tokens` directly. See [the theming documentation in `nimble-components`](/packages/nimble-components/README.md#theming) for more information.

## Using Nimble Base Tokens Directly

In limited special cases, you may consume base Nimble tokens directly. This is only recommended in cases where the theme-aware tokens don't work (for example desktop applications or legacy browsers that don't support custom elements) as these tokens are unaware of themes and don't contain guidance mapping them to specific component parts.

To add the Nimble tokens package to your application, install it from [the public NPM registry](https://www.npmjs.com/package/@ni/nimble-tokens) by running `npm install @ni/nimble-tokens`.

### Understanding Base Color Tokens

You can [view the available color tokens here](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/fed406fd-7568-40a9-8b1a-359f54c23186/). To understand their meaning, explore other pages of the document in Specs Mode (click the `</>` icon on the right side) and view how color tokens are applied to Nimble components.

### Using Base Tokens

The tokens are available in several formats:

#### CSS and SCSS variables

Tokens like colors, font families, and spacing are available as CSS and SCSS variables.

1. Assuming your application uses the [Webpack css-loader](https://webpack.js.org/loaders/css-loader/#url), in your application CSS, add `@import url('@ni/nimble-tokens/dist/styledictionary/css/variables.css');` (replacing `css` with `scss` as needed).
2. Use the variables from that file to style your UI:
```css
body { background-color: var(--ni-nimble-base-white); }
```

#### JavaScript and TypeScript

Tokens like colors, font families, and spacing are also available as JavaScript and TypeScript string constants.
- colors are represented as hex RGB strings like: `#ff8126`
- font families and fallbacks are represented as comma separated strings like: `Roboto, Microsoft YaHei, Hiragino Kaku Gothic Pro, sans-serif`
- spacing is represented in CSS units like: `12px`

In your application JavaScript or TypeScript code, import the token strings you want to use:

```js
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
```

#### Other formats

Tokens values are also available as:
 - [C# strings](/packages/nimble-tokens/dist/styledictionary/csharp/colors.cs)
 - [XAML resources](/packages/nimble-tokens/dist/styledictionary/xaml/colors.xaml)

#### Icons

Icons are included in the `nimble-tokens` package, but (like tokens) icons should primarily consumed through framework-specific components. If your desktop application requires icons as `.ico` files, ask a Nimble team member for a copy of the `NimbleTokens.x.x.xx.nupkg` file.


#### Font Faces

Nimble provides font definitions for every font family used by a token. To ensure these fonts are available to your application, include `@ni/nimble-tokens/dist/fonts/css/fonts.css` in your application code.


## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-tokens/CONTRIBUTING.md) to modify this library.
