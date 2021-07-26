# Contributing: @ni/nimble-components

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

## Getting Started

From the `nimble` directory:
   1. Run `npm install`
   1. Run `npm run build`
   1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook
      - Note: **you'll need to refresh your browser window to see style changes**.

## Develop New Components

### Create a new folder named after your component with some core files

| File                      | Description |
| ------------------------- | ----------- |
| index.ts                  | Contains the component class definition and registration. All Typescript logic contained in the component belongs here. |
| template.ts               | Contains the template definition for components that don't use a fast-foundation template. |
| styles.ts                 | Contains the styles relevant to this component. Note: Style property values that can be shared across components belong in [theme-provider/design-tokens.ts](src/theme-provider/design-tokens.ts). |
| component-name.stories.ts | Contains the Storybook documentation for this component. This should provide API documentation for the component and relevant usage information. |

### Set up your development environment

To see your component in action, run the commands in **Getting Started** and leave the storybook running. The storybook will hot reload when you save changes, but the styles will not. On each save that changes index.ts or styles.ts, **you'll need to refresh your browser window to see style changes**.

### Decide how to build on top of FAST

If fast-foundation already contains the component you're adding, use `FoundationElement.compose()` to add the component to Nimble.
Use the `css` tagged template helper to style the component according to Nimble guidelines. See [leveraging-css.md](https://github.com/microsoft/fast/blob/c94ad896dda3d4c806585d1d0bbfb37abdc3d758/packages/web-components/fast-element/docs/guide/leveraging-css.md) for (hopefully up-to-date) tips from FAST.

```ts
import { Button as FoundationButton, /* ... */ } from '@microsoft/fast-foundation';
const styles = css`
   /* My custom CSS for the nimble fancy button */
   :host { color: gold; }
`;
const nimbleFancyButton = FoundationButton.compose({
   styles,
   // ...
});
// ...
```

If fast-foundation contains a component similar to what you're adding, extend the existing component with Nimble-specific functionality.
When you extend a foundation component, do not prefix the class name with "Nimble." Namespacing is accomplished through imports.

```ts
import { Button as FoundationButton, /* ... */ } from '@microsoft/fast-foundation';
class Button extends FoundationButton {
   // Add new functionality
}
const nimbleButton = Button.compose({
   ...
});
// ...
```

If you need to compose multiple elements into a new component, use previously built Nimble elements or basic HTML elements as your template building blocks.
Extend `FoundationElement` and use a simple, unprefixed name, e.g. `QueryBuilder`.
Use the `html` tagged template helper to define your custom template. See [declaring-templates.md](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-element/docs/guide/declaring-templates.md) for (hopefully up-to-date) tips from FAST.
When importing the custom type (e.g. `QueryBuilder`), it is necessary to import that type to the template class using the form `import type { QueryBuilder } from './index';` to avoid cyclical dependencies.
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
)
```

### Adhere to accessibility guidelines

Accessibility is a requirement for all new components. For the Nimble design system, this means
- Focus states are defined for every element and work on all browsers.
- Colors have sufficient contrast across all themes.
- **TODO: UX to fill out requirements.**

This is a collaborative effort between development and design. Designers will do their due diligence to make sure that designs promote accessiblity, and developers must ensure that each design is implemented and tested across browsers and themes.

### Write and run tests

**TODO**

- unit tests
- page objects
- chromatic tests
