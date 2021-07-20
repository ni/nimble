# Contributing: @ni/nimble-components

## Package overview

This package contains NI-styled web components.

## Getting Started

1. From the `nimble` directory:
   1. Run `npm install`
   1. Run `npm run build`
   1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

## Develop New Components

1. Create a new folder named after your component with some core files

| File                      | Description |
| ------------------------- | ----------- |
| index.ts                  | Contains the component class definition and registration. All Typescript logic contained in the component belongs here. |
| styles.ts                 | Contains the styles relevant to this component. Note that globally-relevant styles that can be tokenized belong in [theme-provider/design-tokens.ts](packages/nimble-components/src/theme-provider/design-tokens.ts). |
| component-name.stories.ts | Contains the Storybook documentation for this component. This should provide API documentation for the component and relevant usage information. |

TODO: where does it go?
- Templates for things that aren't just a composed Foundation component: index.ts?
- unit tests: TODO once we finalize a framework
- page objects: TODO next to unit tests
- chromatic tests: TODO in a logical place alongside unit test directory structure

1. Set up your development environment

To see your component in action, run the commands in **Getting Started** and leave the storybook running. The storybook will hot reload when you save changes, but the styles will not, so on each save that changes index.ts or styles.ts, you'll need to refresh your browser window.

1. Decide how to build on top of FAST

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

1. Adhere to architectural philosophies

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
