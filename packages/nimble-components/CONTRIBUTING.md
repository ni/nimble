# Contributing to Nimble Components

## Package overview

This package contains a library of NI-styled web components.

The library is built on the open source [FAST Design System library](https://fast.design) created by Microsoft. This provides several useful starting points:

1. A small, performant custom element base class, [FAST Element](https://www.fast.design/docs/fast-element/getting-started).
2. [Infrastructure for design system features](https://www.fast.design/docs/design-systems/overview) like design tokens and theming.
3. A library of [core components](https://explore.fast.design/components/) that
    - are unopinionated in their style and easily stylable
    - adherent to browser standards like accessibility
    - while not meeting all of NI's use cases, give us a good starting point and extension capabilities
    - offer a promising future [roadmap](https://github.com/microsoft/fast/tree/master/specs#web-component-specifications)

[This video](https://www.youtube.com/watch?v=OHOKYItVQvc) (1 hour but watchable in less time at 2x) and [this cheat sheet](https://www.fast.design/docs/resources/cheat-sheet/) are great ways to get up to speed with the architecture of FAST in no time. 💨

## Getting started

From the `nimble` directory:

1. Run `npm install`
2. Run `npm run build`
3. Run the different Nimble Components test configurations:

    - To view the components and manually test behaviors in Storybook: `npm run storybook -w @ni/nimble-components`

        **Note**: You will need to refresh your browser window to see style changes made in source.

    - To run the unit tests and re-run the tests on source changes: `npm run tdd:watch -w @ni/nimble-components`

## Visual design spec process

Components added to Nimble are based on specs created by NI visual designers. See [Tips for using Adobe XD to inspect component designs](/packages/nimble-components/docs/xd-tips.md) to learn more about how to navigate these specs.

## Component spec process

Before building a new component, create a spec document to get agreement on the component's behavior, API, and high-level implementation. The spec process is described in the [`/specs` folder](/specs/README.md).

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

6. Update the [Component Status table](/README.md#component-status) to reflect the new component state.

## Develop new components

### Folder structure

Create a new folder named after your component with some core files:

| File                                   | Description                                                                                                                                                                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| specs/\*.md                            | Contains the original API and implementation specifications for the component.                                                                                                                                                                                             |
| index.ts                               | Contains the component class definition and registration. All TypeScript logic contained in the component belongs here.                                                                                                                                                    |
| styles.ts                              | Contains the styles relevant to this component. Note: Style property values that can be shared across components belong in [theme-provider/design-tokens.ts](/packages/nimble-components/src/theme-provider/design-tokens.ts).                                             |
| template.ts                            | Contains the template definition for components that don't use a fast-foundation template.                                                                                                                                                                                 |
| tests/component-name.spec.ts           | Unit tests for this component. Covers behaviors added to components on top of existing Foundation behaviors or behavior of new components.                                                                                                                                 |
| tests/component-name.stories.ts        | Contains the component hosted in Storybook. This provides a live component view for development and testing. In the future, this will also provide API documentation.                                                                                                      |
| tests/component-name-matrix.stories.ts | Contains a story that shows all component states for all themes hosted in Storybook. This is used by Chromatic visual tests to verify styling changes across all themes and states.                                                                                        |
| tests/component-name-docs.stories.ts   | Contains the Storybook documentation for this component. This should provide design guidance and usage information. See [Creating Storybook Component Documentation](/packages/nimble-components/docs/creating-storybook-component-documentation.md) for more information. |

### Add to component bundle

All components should have an import added to `src/all-components.ts` so they are available in bundled distribution files.

### Decide how to build on top of FAST

#### Extend Fast Foundation

If Fast Foundation contains a component similar to what you're adding, create a new class that extends the existing component with any Nimble-specific functionality. Do not prefix the new class name with "Nimble"; namespacing is accomplished through imports. Use `MyComponent.compose()` to add the component to Nimble.

If your component is the canonical representation of the FAST Foundation base class that it extends, then in the argument to `compose` provide a `baseClass` value. No two Nimble components should specify the same `baseClass` value. Make sure to include a test that shows the tag name for the element is found when using `DesignSystem.tagFor(FastFoundationBaseClass)`.

Sometimes you may want to extend a FAST component, but need to make changes to their template. If possible, you should submit a PR to FAST to make the necessary changes in their repo. As a last resort, you may instead copy the template over to the Nimble repo, then make your changes. If you do so, you must also copy over the FAST unit tests for the component (making any adjustments to account for your changes to the template).

Use the `css` tagged template helper to style the component according to Nimble guidelines. See [leveraging-css.md](https://github.com/microsoft/fast/blob/c94ad896dda3d4c806585d1d0bbfb37abdc3d758/packages/web-components/fast-element/docs/guide/leveraging-css.md) for (hopefully up-to-date) tips from FAST.

```ts
import { Button as FoundationButton } from '@microsoft/fast-foundation';
const styles = css`
    ${/* My custom CSS for the nimble fancy button */ ''}
    :host {
        color: gold;
    }
`;
export class Button extends FoundationButton {
    // Add new functionality (or leave empty if just restyling the FAST component)
}
const nimbleButton = Button.compose({
    baseClass: FoundationButton,
    styles
    // ...
});
```

#### Compose Elements into a new Component

If you need to compose multiple elements into a new component, use previously built Nimble elements or basic HTML elements as your template building blocks.
Extend `FoundationElement` and use a simple, unprefixed name, e.g. `QueryBuilder`.

Use the `html` tagged template helper to define your custom template. See [Declaring Templates](https://www.fast.design/docs/fast-element/declaring-templates) for tips from FAST. Reference other nimble components using `DesignSystem.tagFor(NimbleComponentClass)` instead of hard coding the nimble tag name in templates. This improves the maintainability of the repo because it ensures usages of a component will be updated if it is renamed.

### Adhere to architectural philosophies

#### Coding conventions

This package follows the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide) with some exceptions listed in [Coding Conventions](/packages/nimble-components/docs/coding-conventions.md).

#### CSS

Component CSS should follow the patterns described in [CSS Guidelines](/packages/nimble-components/docs/css-guidelines.md).

#### Represent control states as attributes

##### Why attributes over classes

It is common in web development to represent variations of control states using css classes. While it is possible to apply custom styles to web components based on user-added CSS classes, i.e. `:host(.my-class)`, it is not allowed in nimble for the following reasons:

-   The `class` attribute is a user-configured attribute. For native HTML elements it would be surprising if setting a class, i.e. `<div class="my-class">`, caused the element to have a new style that the user did not define in their stylesheet. However, other attributes are expected to have element defined behavior, i.e. `<div hidden>`.
-   Classes set in the `class` attribute are not as well-typed across frameworks. Users have to contort a bit to use exported enums for CSS class strings while attributes and attribute values are well-typed in wrappers.
-   Binding to updates in the `class` attribute is more difficult / not an expected pattern. This makes it difficult to forward configured properties to inner elements. Alternatively, binding to attributes and forwarding bound attribute values in templates is a well supported pattern.

##### Attribute naming convention

-   Do not use attribute names that conflict with native attribute names:
    -   Avoid any names in the [MDN HTML attribute reference list](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#attribute_list) (unless the attribute is trying to match that behavior exactly).
    -   Do a best effort search in relevant working groups for new attributes that may be coming to avoid, i.e. https://github.com/openui and https://github.com/whatwg.
-   Use lower-kebab-case for attributes and enum values that are part of a component's public API.

    ```ts
        @attr({ attribute: 'error-text' })
        public errorText?: string;
    ```

##### Attribute common name patterns

-   For attributes that control the visibility of a part, use either the boolean attribute `<part>-visible` or `<part>-hidden`, i.e. `icon-visible` or `icon-hidden`.

    The default configuration should be the most common configuration and the boolean attribute should be added for the less common alternate configuration that differs from the default. An element should NOT implement both `-visible` and `-hidden` attributes for a given `<part>`, only one or the other.

-   Use the `appearance` attribute to represent mutually exclusive visual modes of a component that represent large style changes. Likely implemented with an attribute behavior.

    An `appearance-variant` attribute may also be used to represent smaller mutually exclusive variations of an appearance. Likely implemented with CSS attribute selectors.

##### Attribute common value patterns

-   When applicable, the default value for an attribute that is allowed to be unconfigured should have the enum name `default` and be the enum value `undefined`.
-   States representing the following ideas should use those names: `success`, `error`, `warning`, `information`.

    Avoid shorthands, i.e. `warn`, `info` and avoid alternatives, i.e. `pass`, `fail`, `invalid`.

##### Responding to attribute values

With an attribute defined there are several ways to react to updates. To minimize performance overhead, prefer in order (may utilize more that one):

1. Respond to attribute values from css:

    ```css
    :host([my-attribute='some-value']) {
        /* ... */
    }
    ```

    Using attribute selectors in CSS is particularly useful if there are relatively few spots peppered throughout the file where style should be overridden based on a configured attribute.

2. Respond to attribute values using a behavior:

    <!-- prettier-ignore -->
    ```ts
    import { css } from '@microsoft/fast-element';
    css`
        /* ... */
    `.withBehaviors(
        // ...
    );
    ```

    Behaviors are useful when a large block of styles is overridden based on the attibute configuration, i.e. on the order of replacing a large chunk of the stylesheet based on the configuration.

    Behaviors should not be used for attributes that change rapidly on a page. Behaviors internally change the stylesheets that are on the page and can trigger expensive style recalculations when stylesheets are added and removed from the page based on the attribute value.

    Behaviors are ideal for attributes that are set initially on an element and are not expected to change often / ever during the element lifetime. In these scenarios they actually provide an important performance advantage by eliminating large chunks of unnecessary styles from the page that the browser would need to evaluate.

3. Respond to the value of an attribute programmatically. This may be done by binding to an attribute value or listening to an attribute value change.

    This should NOT be done for style purposes and instead rely on CSS attribute selectors or behaviors as previously described.

    Some valid use cases are reflecting correct aria values based on the updated attribute or forwarding updates to child components.

#### Comments

At a minimum all classes should have a block comment and ultimately all parts of the public API should have a block comment as well.

### Adhere to accessibility guidelines

Accessibility is a requirement for all new components. For the Nimble design system, this means

-   Focus states are defined for every element and work on all browsers.
-   Colors have sufficient contrast across all themes.

This is a collaborative effort between development and design. Designers will do their due diligence to make sure that designs promote accessiblity, and developers must ensure that each design is implemented and tested across browsers and themes.

Animations can trigger users with vestibular disorders. [WCAG provides guidance](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) to disable certain kinds of animations when the [prefers-reduced-motion CSS media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) is enabled:

> An element which moves into place or changes size while appearing is considered to be animated. An element which appears instantly without transitioning is not using animation. Motion animation does not include changes of color, blurring, or opacity which do not change the perceived size, shape, or position of the element.

Nimble interprets this to mean the following types of animations are permitted with `prefers-reduced-motion` is enabled:

1. Animations which don't involve motion (e.g. fades or color changes)
2. Animations which involve motion but don't significantly affect the perceived size, shape, or position of the object. The only approved example of this is animating border thickness; other candidates can be proposed via PR (along with an update to these docs).
3. Animations which involved motion but the change in size, shape, or position is synchronized with a user interaction (e.g. a mouse drag to move or resize an object or scrolling through a list).

All other motion animations should either be disabled or replaced with a fade animation when `prefers-reduced-motion` is enabled. [Search this repo for `prefers-reduced-motion`](https://github.com/ni/nimble/search?q=prefers-reduced-motion) to find examples of how it's done.

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
import { fancy16X16 } from '@ni/nimble-tokens/dist/icons/js';

const fancyCheckbox = FoundationCheckbox.compose<CheckboxOptions>({
    // To populate an existing slot with an svg icon
    fancyIndicator: fancy16X16.data
    // ...
});
```

### Icon components

The project uses a code generation build script to create a Nimble component for each icon provided by nimble tokens. The script is run as part of the `npm run build` command, and can be run individually by invoking `npm run generate-icons`. The generated icon components are not checked into source control, so the icons must be generated before running the TypeScript compilation. The code generation source can be found at `nimble-components/build/generate-icons`.

### TypeScript integration

For any custom element definition, extend TypeScript's `HTMLElementTagNameMap` to register the new element. For example:

```js
declare global {
    interface HTMLElementTagNameMap {
        // register tag name and type of custom element
        'nimble-button': Button;
    }
}
```

This enables TypeScript to infer the type of a returned element based on its tag name for DOM methods such as `document.createElement()` and `document.querySelector()`.

### Focus delegation

Consider whether or not the `delegatesFocus` shadow DOM option should be set to `true` for the component.

Some guidelines to follow when deciding whether or not to set `delegatesFocus`:

-   For a component built on top of a fast-foundation component, check the fast-foundation component's README.md to see if the component was built with the expectation that focus will be delegated.
-   Non-interactive elements should keep `delegatesFocus` with the default `false` value.
-   Interactive controls that contain no focusable components in the shadow root should keep `delegatesFocus` with the default `false` value.
-   Interactive controls that contain focusable components in the shadow root should set `delegatesFocus` to `true`.
-   Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) or [this table](https://github.com/TakayoshiKochi/tabindex-focus-navigation-explainer/blob/master/TabindexFocusNavigationExplainer.md#proposed-solution) for more information.

If it is determined that the component should delegate focus, it can be configured as shown below:

```js
const nimbleButton = Button.compose({
    // ...
    shadowOptions: {
        delegatesFocus: true
    }
});
```

## Unit tests

Unit tests are written using karma and jasmine in files named `<component-name>.spec.ts`.

The following commands can be run from the `nimble` directory:

### Development commands

-   `npm run tdd:watch -w @ni/nimble-components`: Starts a process for building the components and running the test suite on file changes.

    This command runs headlessly. See [Debugging commands](#debugging-commands) if you need to see the browser or set breakpoints while running.

-   `npm run tdd -w @ni/nimble-components`: Similar to the corresponding `tdd:watch` command but only runs once. Useful for infrastructure changes which do not trigger the watch command.

### Debugging commands

-   `npm run test-chrome:debugger -w @ni/nimble-components`: When run opens a Chrome window that can be used for interactive debugging. Using dev tools set breakpoints in tests and refresh the page, etc.

    You can also take the page url and open it in a different browser to test interactively.

### Test utilities

Test utilities located in [`/src/testing`](/packages/nimble-components/src/testing) may be used for testing:

-   performed inside the `@ni/nimble-components` package or
-   by other packages in the monorepo or users consuming the built package

Test utilties located in [`/src/utilities/tests`](/packages/nimble-components/src/utilities/tests) are just for tests in the `@ni/nimble-components` package and are not shared externally.

#### Fixtures

The jasmine unit tests utilize [`fixture.ts`](/packages/nimble-components/src/utilities/tests/fixture.ts) for component tests. The fixture utility gives tools for managing the component lifecycle. For some usage examples see [`fixture.spec.ts`](/packages/nimble-components/src/utilities/tests/fixture.spec.ts).

## Theming

Nimble includes three NI-brand aligned themes (i.e. `light`, `dark`, & `color`).

When creating a new component, create a `*-matrix.stories.ts` Storybook file to confirm that the component reflects the design intent across all themes and states.

## Token naming

Public names for theme-aware tokens are specified in `src/theme-provider/design-token-names.ts`. Use the following structure when creating new tokens.

`[element]-[part]-[state]-[token_type]`

1. Where **element** is the type to which the token applies (e.g. 'application', 'body', or 'title-plus-1').
2. Where **part** is the specific part of the element to which the token applies (e.g. 'border', 'background', or shadow).
3. Where **state** is the more specific state descriptor (e.g. 'selected' or 'disabled'). Multiple states should be sorted alphabetically.
4. Where **token_type** is the token category (e.g. 'color', 'font', 'font-color', 'height', 'width', or 'size').
