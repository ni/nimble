# Coding Conventions

This repo follows the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide) with the following exceptions.

## Use const objects instead of TypeScript enums

In order to [present consistent APIs with FAST](https://github.com/microsoft/fast/pull/5930) and follow [modern TypeScript practices](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums), this package doesn't use TypeScript enums.

Instead of this enum:

```ts
const enum ButtonAppearance {
    Outline = 'outline',
    Ghost = 'ghost',
    Block = 'outblockline',
}
```

You can use a `const` object for the enum and a union of its values for the type:

```ts
export const ButtonAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;
export type ButtonAppearance = typeof ButtonAppearance[keyof typeof ButtonAppearance];
```

Put these objects in a file called `types.ts` to make them easier to find and to apply an ESLint configuration that is specific to this pattern. Add a corresponding `types.spec.ts` to ensure the pattern is applied correctly.

To clients, the object and values will behave like an enum:

```ts
import { ButtonAppearance from '../types.ts' }
let appearance: ButtonAppearance = ButtonAppearance.outline;
```

## Default enum values

If one of the enum values represents a default, it should be named `default` and be the first enumerated value.

```ts
export const BannerSeverity = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    information: 'information'
} as const;
```