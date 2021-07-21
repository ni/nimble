# Contributing: @ni/nimble-components

## Package overview

This package contains a library of NI-styled web components.

The library is built on the open source [FAST Design System library](https://fast.design) created by Microsoft. This provides several useful starting points:
1. A small, performant custom element base class, [FAST Element](https://www.fast.design/docs/fast-element/getting-started).
1. [Infrastructure for design system features](https://www.fast.design/docs/design-systems/overview) like design tokens and theming.
1. A library of [core components](https://explore.fast.design/components/) that are
   - unopinionated in their style and easily stylable
   - adherent to browser standards like accessibility
   - while not meeting all of NI's use cases, give us a good starting point and extension capabilities
   - offer a promising future roadmap

[This video](https://www.youtube.com/watch?v=OHOKYItVQvc) (1 hour but watchable in less time at 2x) is a great way to get up to speed with the architecture of FAST in no time. 💨

## Getting Started

1. From the `nimble` directory:
   1. Run `npm install`
   1. Run `npm run build`
   1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

## Develop New Components

### Create a new folder named after your component with some core files

| File                      | Description |
| ------------------------- | ----------- |
| index.ts                  | Contains the component class definition and registration. All Typescript logic contained in the component belongs here. |
| styles.ts                 | Contains the styles relevant to this component. Note that globally-relevant styles that can be tokenized belong in [theme-provider/design-tokens.ts](src/theme-provider/design-tokens.ts). |
| component-name.stories.ts | Contains the Storybook documentation for this component. This should provide API documentation for the component and relevant usage information. |

TODO: where does it go?
- Templates for things that aren't just a composed Foundation component: index.ts?
- unit tests: TODO once we finalize a framework
- page objects: TODO next to unit tests
- chromatic tests: TODO in a logical place alongside unit test directory structure

### Set up your development environment

To see your component in action, run the commands in **Getting Started** and leave the storybook running. The storybook will hot reload when you save changes, but the styles will not, so on each save that changes index.ts or styles.ts, you'll need to refresh your browser window.

### Decide how to build on top of FAST

If fast-foundation already contains the component you're adding, use `FoundationElement.compose()` to add the component to Nimble.

```ts
import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';
import { styles } from './styles';

const nimbleButton = FoundationButton.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
```

If fast-foundation contains a component similar to what you're adding, extend the existing component with Nimble-specific functionality.

```ts
import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';

class Button extends FoundationButton {
   // Add new functionality
}

const nimbleButton = Button.compose({
   ...
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
```

TODO: If you need to compose multiple elements from fast-foundation into a new component

TODO: If FAST does not contain the requisite building blocks for your component

### Adhere to architectural philosophies

At a minimum all classes should have a block comment and ultimately all parts of the public API should have a block comment as well.

When configuring different variants of a single element, use behaviors. This is a concept taken from fast-elements.
```ts
import { css } from '@microsoft/fast-element';

css`
`.withBehaviors(
   ...
)
```

TODO: naming conventions

TODO: design patterns
