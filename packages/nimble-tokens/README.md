<div align="center">
    <p><b>ni | nimble | tokens</b></p>
</div>

# Nimble Tokens

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-tokens.svg)](https://www.npmjs.com/package/@ni/nimble-tokens)

NI design tokens to use across NI applications. Design tokens are primitive elements of component style like color, typography, and spacing.

## Getting Started

If you are using one of the following frameworks you should consume tokens via components implemented in the following libraries. These libraries provide styled components that use the design tokens to implement several color themes.

1. Angular: See the [nimble-angular](/angular-workspace/projects/ni/nimble-angular) documentation.
2. Blazor WebAssembly or Blazor Server: See the [nimble-blazor](/packages/nimble-blazor) documentation.
3. Vanilla / Frameworkless: See the [nimble-components](/packages/nimble-components) documentation.

## Using Nimble Tokens Directly

You can consume tokens directly without using a Nimble component library. Adopting only Nimble typography and colors can be a cheaper way to update a legacy application to approximate the NI brand without the development and testing burden of adopting a new component library.

To add the Nimble tokens package to your application, install it from [the public NPM registry](https://www.npmjs.com/package/@ni/nimble-tokens) by running `npm install @ni/nimble-tokens`.

### Understanding Nimble Color Tokens

You can [view the available color tokens here](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/fed406fd-7568-40a9-8b1a-359f54c23186/). To understand their meaning, explore other pages of the document in Specs Mode (click the `</>` icon on the right side) and view how color tokens are applied to Nimble components.

### Using Nimble Tokens

The tokens are available in several formats:

#### CSS and SCSS variables

Tokens like colors, font families, and spacing are available as CSS and SCSS variables.

1. Assuming your application uses the [Webpack css-loader](https://webpack.js.org/loaders/css-loader/#url), in your application CSS, add `@import url('~@ni/nimble-tokens/dist/styledictionary/css/variables.css');` (replacing `css` with `scss` as needed).
2. Use the variables from that file to style your UI:
```css
body { background-color: var(--white); }
```

#### JavaScript and TypeScript

Tokens like colors, font families, and spacing are also available as JavaScript and TypeScript string constants. 
- colors are represented as RGB strings
- font families and fallbacks are represented as comma separated strings
- spacing is represented in CSS units like `"12px"`

In your application JavaScript or TypeScript code, import the token strings you want to use:

```js
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
```

#### Other formats

Tokens values are also available as:
 - [C# strings](/packages/nimble-tokens/dist/styledictionary/csharp/colors.cs)
 - [XAML resources](/packages/nimble-tokens/dist/styledictionary/xaml/colors.xaml)
 - [JSON](/packages/nimble-tokens/dist/styledictionary/properties/colors.json).


#### Font Faces

Nimble provides font definitions for every font family used by a token. To ensure these fonts are available to your application, include `'@ni/nimble-tokens/source/fonts.css'` in your application code.


## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-tokens/CONTRIBUTING.md) to modify this library.
