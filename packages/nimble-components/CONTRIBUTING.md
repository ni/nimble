# Contributing to Nimble Components

## Package overview

This package contains a library of NI-styled web components.

The library is built on the open source [FAST Design System library](https://fast.design) created by Microsoft. This provides several useful starting points:
1. A small, performant custom element base class, [FAST Element](https://www.fast.design/docs/fast-element/getting-started).
1. [Infrastructure for design system features](https://www.fast.design/docs/design-systems/overview) like design tokens and theming.
1. A library of [core components](https://explore.fast.design/components/) that
    - are unopinionated in their style and easily stylable
    - adherent to browser standards like accessibility
    - while not meeting all of NI's use cases, give us a good starting point and extension capabilities
    - offer a promising future [roadmap](https://github.com/microsoft/fast/tree/master/specs#web-component-specifications)

[This video](https://www.youtube.com/watch?v=OHOKYItVQvc) (1 hour but watchable in less time at 2x) is a great way to get up to speed with the architecture of FAST in no time. 💨

## Getting started

From the `nimble` directory:
1. Run `npm install`
1. Run `npm run build`
1. Run the different Nimble Components test configurations: 
    - To view the components and manually test behaviors in Storybook: `npm run storybook -w @ni/nimble-components`
    
        **Note**: You will need to refresh your browser window to see style changes made in source.

    - To run the unit tests and re-run the tests on source changes: `npm run tdd:watch -w @ni/nimble-components`

Next steps: See the [Development workflow](#development-workflow) for creating components and the workflow for making changes.

## Development workflow

1. When creating new components, create the folder structure and decide how to implement the component as described in [Develop new components](#develop-new-components).
2. Run the Storybook command from the `nimble` directory:

    `npm run storybook -w @ni/nimble-components`

    Storybook will build its own copy of the component in a temporary folder which is separate from the normal build.

3. Make functional and style changes to the component.

    The storybook will hot reload when you save changes, but the styles will not. On each save that changes `index.ts` or `styles.ts`, **you will need to refresh your browser window to see style changes**.

4. Create or update tests.

    To build and run the tests once, from the `nimble` directory run:

    `npm run tdd -w @ni/nimble-components`

    To watch for changes and automatically re-run tests on changes, from the `nimble` directory run:

    `npm run tdd:watch -w @ni/nimble-components`

    See [Unit tests](#unit-tests) for additional available commands.

5. Create changelists for your work by running the following from the `nimble` directory:

    `npm run change`

## Develop new components

### Folder structure

Create a new folder named after your component with some core files:

| File                      | Description |
| ------------------------- | ----------- |
| index.ts                  | Contains the component class definition and registration. All Typescript logic contained in the component belongs here. |
| styles.ts                 | Contains the styles relevant to this component. Note: Style property values that can be shared across components belong in [theme-provider/design-tokens.ts](src/theme-provider/design-tokens.ts). |
| template.ts               | Contains the template definition for components that don't use a fast-foundation template. |
| tests/component-name.spec.ts | Unit tests for this component. Covers behaviors added to components on top of existing Foundation behaviors or behavior of new components. |
| tests/component-name.stories.ts | Contains the Storybook documentation for this component. This should provide API documentation for the component and relevant usage information. |

### Decide how to build on top of FAST

If fast-foundation already contains the component you're adding, use `FoundationElement.compose()` to add the component to Nimble.
Use the `css` tagged template helper to style the component according to Nimble guidelines. See [leveraging-css.md](https://github.com/microsoft/fast/blob/c94ad896dda3d4c806585d1d0bbfb37abdc3d758/packages/web-components/fast-element/docs/guide/leveraging-css.md) for (hopefully up-to-date) tips from FAST.

```ts
import { Button as FoundationButton } from '@microsoft/fast-foundation';
const styles = css`
    ${
        /* My custom CSS for the nimble fancy button */ ''
    }
    :host { color: gold; }
`;
const nimbleFancyButton = FoundationButton.compose({
    styles,
    // ...
});
```

If fast-foundation contains a component similar to what you're adding, extend the existing component with Nimble-specific functionality.
When you extend a foundation component, do not prefix the class name with "Nimble." Namespacing is accomplished through imports.

```ts
import { Button as FoundationButton } from '@microsoft/fast-foundation';
class Button extends FoundationButton {
    // Add new functionality
}
const nimbleButton = Button.compose({
    // ...
});
```

If you need to compose multiple elements into a new component, use previously built Nimble elements or basic HTML elements as your template building blocks.
Extend `FoundationElement` and use a simple, unprefixed name, e.g. `QueryBuilder`.
Use the `html` tagged template helper to define your custom template. See [declaring-templates.md](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-element/docs/guide/declaring-templates.md) for (hopefully up-to-date) tips from FAST.
**TODO: if you're reading this section because you're adding a brand new thing, congratulations! You have won the honor of filling out this section.**

### Adhere to architectural philosophies

At a minimum all classes should have a block comment and ultimately all parts of the public API should have a block comment as well.

When configuring different variants of a single element, use behaviors.
```ts
import { css } from '@microsoft/fast-element';
css`
    /* ... */
`.withBehaviors(
    // ...
);
```

### Adhere to accessibility guidelines

Accessibility is a requirement for all new components. For the Nimble design system, this means
- Focus states are defined for every element and work on all browsers.
- Colors have sufficient contrast across all themes.
- **TODO: UX to fill out requirements.**

This is a collaborative effort between development and design. Designers will do their due diligence to make sure that designs promote accessiblity, and developers must ensure that each design is implemented and tested across browsers and themes.

### Comment CSS

To comment on CSS inside the `css` tagged template helper, use template literal strings with an empty string. This helps minified code output.

```ts
const styles = css`
    :host {
        ${
            /*
             * Placing comments in template literals removes them from the compiled code and
             * helps to minify the code output.
             */ ''
        }
        color: gold;
    }
`;
```

### Leveraging icons

Nimble components should leverage inline svg icons from nimble tokens. The icons are exported from nimble tokens as svg strings similar to the following format:

```ts
export const fancy16X16: {
  name: 'fancy_16_x_16';
  data: string;
} = {
  name: 'fancy_16_x_16',
  data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><!-- svg path data --></svg>`
};
```

Use the `data` property to get the svg string:

```ts
import { fancy16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

const fancyCheckbox = FoundationCheckbox.compose<CheckboxOptions>({
    // To populate an existing slot with an svg icon
    fancyIndicator: `${fancy16X16.data}`
    // ...
});
```

## Unit tests

Unit tests are written using karma and jasmine in files named `<component-name>.spec.ts`.

The following commands can be run from the `nimble` directory:

### Development commands

- `npm run tdd:watch -w @ni/nimble-components`: Starts a process for building the components and running the test suite on file changes.

   This command runs headlessly. See [Debugging commands](#debugging-commands) if you need to see the browser or set breakpoints while running.
- `npm run tdd -w @ni/nimble-components`: Similar to the corresponding `tdd:watch` command but only runs once. Useful for infrastructure changes which do not trigger the watch command.

### Debugging commands

- `npm run test-chrome:debugger -w @ni/nimble-components`: When run opens a Chrome window that can be used for interactive debugging. Using dev tools set breakpoints in tests and refresh the page, etc.

    You can also take the page url and open it in a different browser to test interactively.

### Test utilities

The jasmine unit tests utilize [`fixture.ts`](src/tests/utilities/fixture.ts) for component tests. The fixture utility gives tools for managing the component lifecycle. For some usage examples see [`fixture.spec.ts`](src/tests/utilities/fixture.spec.ts).

## Linting

`nimble-components` is linted with `eslint` and `prettier-eslint`. Use `npm run lint` and `npm run prettier` to confirm that your changes are valid. Even better, install the recommended VS Code extensions for both linting packages.Configure **Prettier ESLint** as the default formatter and to format on save.
