# Contributing to Nimble Components

## Package overview

This package contains a library of NI-styled web components. Components are built using [custom elements](https://web.dev/custom-elements-v1/) and [Shadow DOM](https://web.dev/shadowdom-v1/) which are native features in modern browsers.

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

From the repo root directory:

1. Run `npm install`
2. Run `npm run build`
3. Run the different Nimble Components test configurations:
    - To view the components and manually test behaviors in Storybook: `npm run storybook`

        **Note**: You will need to refresh your browser window to see style changes made in source.

    - To run the unit tests and re-run the tests on source changes: `npm run tdd:watch -w @ni/nimble-components`

## Component spec process

Before building a new component, 3 specification documents need to be created:

1. An interaction design (IxD) spec to get agreement on the component's behavior and other core requirements. The spec process is described in the [`/specs` folder](/specs/README.md).
2. A visual design (ViD) spec to get agreement on the component's appearance, spacing, icons, and tokens. The visual design spec should be created in Figma and linked to the component work item and Storybook [Component Status](https://nimble.ni.dev/storybook/?path=/docs/component-status--docs) page.
3. A technical design spec to get agreement on the component's behavior, API, and high-level implementation. The spec process is described in the [`/specs` folder](/specs/README.md).

## Development workflow

1. When creating new components, create the folder structure and decide how to implement the component as described in [Develop new components](#develop-new-components).

2. Create Storybook documentation and tests for the component as described in [`@ni-private/storybook` CONTRIBUTING](/packages/storybook/CONTRIBUTING.md).

3. Run the Storybook command from the repo root: `npm run storybook`.

    This command also causes `nimble-components` (and `spright-components`) to rebuild whenever a source file is changed so that Storybook can reflect the current state.

4. Make functional and style changes to the component.

    The storybook will hot reload when you save changes, but the styles will not. On each save that changes `index.ts` or `styles.ts`, **you will need to refresh your browser window to see style changes**.

5. Create or update tests.

    To build and run the tests once, from the `nimble` directory run:

    `npm run tdd -w @ni/nimble-components`

    To watch for changes and automatically re-run tests on changes, from the `nimble` directory run:

    `npm run tdd:watch -w @ni/nimble-components`

    See [Unit tests](#unit-tests) for additional available commands.

6. Test out the component in each of the 3 major browsers: Chrome, Firefox, and Safari (WebKit).
   For developers on non-Mac platforms, Safari/WebKit can be tested via the Playwright package:
    - To run the unit tests with WebKit, use the command `npm run test-webkit -w @ni/nimble-components` from the `nimble` directory.

7. Create change files for your work by running the following from the `nimble` directory:

    `npm run change`

8. Update the [Component Status table](./src/tests/component-status.stories.ts) to reflect the new component state.

## Develop new components

### Marking a component as incubating

If a component is not ready for general use, it should be marked as "incubating" to indicate that status to clients. A component could be in this state if any of the following are true:

- It is still in development.
- It is missing important features like interaction design, visual design, or accessibility.

Incubating contributions may compromise on the above capabilities but they still must abide by other repository requirements. For example:

- Start development with a spec describing the high level plan and what's in or out of scope
- Coding conventions (element naming, linting, code quality)
- Unit and Chromatic test coverage
- Storybook documentation

To mark a component as incubating:

1. In the component status table, set its status to ⚠️
2. In the component Storybook documentation:
    - add a red text banner to the page indicating that the component is not ready for general use
    - start the Storybook name with "Incubating/" so that it appears in a separate section of the documentation page
3. Add CODEOWNERS from both the contributing team and the Nimble team.

To move a component out of incubating status:

1. Have a conversation with the Nimble team to decide if it is sufficiently complete. The requirements listed at the top of this section must be met. Some feature gaps like framework integration may be OK as long as we don't anticipate that filling them would cause major breaking changes.
2. Update the markings described above to indicate that it is now ready for general use!

### Folder structure

Create a new folder named after your component with some core files:

| File                                 | Description                                                                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| specs/\*.md                          | Contains the original API and implementation specifications for the component.                                                                                                                                                 |
| index.ts                             | Contains the component class definition and registration. All TypeScript logic contained in the component belongs here.                                                                                                        |
| styles.ts                            | Contains the styles relevant to this component. Note: Style property values that can be shared across components belong in [theme-provider/design-tokens.ts](/packages/nimble-components/src/theme-provider/design-tokens.ts). |
| template.ts                          | Contains the template definition for components that don't use a fast-foundation template.                                                                                                                                     |
| types.ts                             | Contains any enum-like types defined by the component                                                                                                                                                                          |
| models/                              | A folder containing any classes or interfaces that are part of the component API or implementation                                                                                                                             |
| components/                          | A folder containing any components that are used within the component but are not exported as public components themselves.                                                                                                    |
| testing/component-name.pageobject.ts | Page object to ease testing of this component.                                                                                                                                                                                 |
| tests/component-name.spec.ts         | Unit tests for this component. Covers behaviors added to components on top of existing Foundation behaviors or behavior of new components.                                                                                     |

### Add to component bundle

All components should have an import added to `src/all-components.ts` so they are available in bundled distribution files.

### Decide how to build on top of FAST

#### Extend Fast Foundation

If Fast Foundation contains a component similar to what you're adding, create a new class that extends the existing component with any Nimble-specific functionality. Do not prefix the new class name with "Nimble"; namespacing is accomplished through imports. Use `MyComponent.compose()` to add the component to Nimble.

If your component is the canonical representation of the FAST Foundation base class that it extends, then in the argument to `compose` provide a `baseClass` value. No two Nimble components should specify the same `baseClass` value.

Sometimes you may want to extend a FAST component, but need to make changes to their template. If possible, you should submit a PR to FAST to make the necessary changes in their repo. As a last resort, you may instead copy the template over to the Nimble repo, then make your changes. If you do so, you must also copy over the FAST unit tests for the component (making any adjustments to account for your changes to the template). When copying over unit tests:

1. Put the FAST tests in a separate file named `<component>.foundation.spec.ts`
2. Update the code to follow NI coding conventions (i.e. linting and formatting)
3. Add a comment at the top of the file that links to the original source in FAST

Use the `css` tagged template helper to style the component according to Nimble guidelines. See [leveraging-css.md](https://github.com/microsoft/fast/blob/c94ad896dda3d4c806585d1d0bbfb37abdc3d758/packages/web-components/fast-element/docs/guide/leveraging-css.md) for (hopefully up-to-date) tips from FAST.

```ts
import { Button as FoundationButton } from '@ni/fast-foundation';
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

#### Compose elements into a new component

If you need to compose multiple elements into a new component, use previously built Nimble elements or basic HTML elements as your template building blocks.
Extend `FoundationElement` and use a simple, unprefixed name, e.g. `QueryBuilder`.

Use the `html` tagged template helper to define your custom template. See [Declaring Templates](https://www.fast.design/docs/fast-element/declaring-templates) for tips from FAST. Reference other nimble components using `import { componentNameTag } ...;` instead of hard coding the nimble tag name in templates. This improves the maintainability of the repo because it ensures usages of a component will be updated if it is renamed.

#### Build a new component without leveraging FAST Foundation or existing Nimble components

If your new component is unique or complex enough that it can't leverage existing components, you will need to write both the template and the logic yourself.

You should still use `fast-element` features to make it easier to build and maintain the component. See the FAST documentation on [Building Components](https://www.fast.design/docs/category/building-components) (particularly [Defining Elements](https://www.fast.design/docs/fast-element/defining-elements) and [Declaring Templates](https://www.fast.design/docs/fast-element/declaring-templates)) to learn the features available to you. You can also look at existing components like the [dialog](/packages/nimble-components/src/dialog/) for examples. Feel free to reach out to the Design System team for guidance!

### Adhere to architectural philosophies

#### Coding conventions

This package follows the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide) with some exceptions listed in [Coding Conventions](/packages/nimble-components/docs/coding-conventions.md).

#### CSS

Component CSS should follow the patterns described in [CSS Guidelines](/packages/nimble-components/docs/css-guidelines.md).

#### Represent control states as attributes

##### Why attributes over classes

It is common in web development to represent variations of control states using css classes. While it is possible to apply custom styles to web components based on user-added CSS classes, i.e. `:host(.my-class)`, it is not allowed in nimble for the following reasons:

- The `class` attribute is a user-configured attribute. For native HTML elements it would be surprising if setting a class, i.e. `<div class="my-class">`, caused the element to have a new style that the user did not define in their stylesheet. However, other attributes are expected to have element defined behavior, i.e. `<div hidden>`.
- Classes set in the `class` attribute are not as well-typed across frameworks. Users have to contort a bit to use exported enums for CSS class strings while attributes and attribute values are well-typed in wrappers.
- Binding to updates in the `class` attribute is more difficult / not an expected pattern. This makes it difficult to forward configured properties to inner elements. Alternatively, binding to attributes and forwarding bound attribute values in templates is a well supported pattern.

##### Attribute naming convention

- Do not use attribute names that conflict with native attribute names:
    - Avoid any names in the [MDN HTML attribute reference list](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#attribute_list) (unless the attribute is trying to match that behavior exactly).
    - Do a best effort search in relevant working groups for new attributes that may be coming to avoid, i.e. https://github.com/openui and https://github.com/whatwg.
    - Avoid any names that are [reserved words](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words) in JavaScript.
- Use lower-kebab-case for attributes and enum values that are part of a component's public API.

    ```ts
        @attr({ attribute: 'error-text' })
        public errorText?: string;
    ```

##### Attribute common name patterns

- For attributes that control the visibility of a part, use either the boolean attribute `<part>-visible` or `<part>-hidden`, i.e. `icon-visible` or `icon-hidden`.

    The default configuration should be the most common configuration and the boolean attribute should be added for the less common alternate configuration that differs from the default. An element should NOT implement both `-visible` and `-hidden` attributes for a given `<part>`, only one or the other.

- Use the `appearance` attribute to represent mutually exclusive visual modes of a component that represent large style changes. Likely implemented with an attribute behavior.

    An `appearance-variant` attribute may also be used to represent smaller mutually exclusive variations of an appearance. Likely implemented with CSS attribute selectors.

##### Attribute common value patterns

- When applicable, the default value for an attribute that is allowed to be unconfigured should be first in the enum object, have a descriptive enum name, such as `default`, `none`, etc, based on the context, and be the enum value `undefined`.
- Boolean attributes must always default to `false`. Otherwise, the configuration in HTML becomes meaningless, as both `<element></element>` and `<element bool-attr></element>` result in `bool-attr` being set to `true`.
- States representing the following ideas should use those names: `success`, `error`, `warning`, `information`.

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
    import { css } from '@ni/fast-element';
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

#### Don't throw exceptions when a component is misconfigured

Components should be robust to having their properties and attributes configured in invalid ways and should typically not throw exceptions. This matches native element behavior and helps avoid situations where client code must be set component state in a specific order.

Instead of throwing an exceptions, components should ignore invalid state and render in a predictable way. This could mean reverting to a default or empty state. This behavior should be covered by auto tests.

Components can also consider exposing an API that checks the validity of the component configuration. Clients can use this to assert about the validity in their tests and to discover why a component is invalid when debugging. See the `nimble-table` for an example of this.

It is acceptable to throw exceptions in production code in other situations. For example:

- when a case gets hit that should be impossible, like an invalid enum value.
- from a component method when it shouldn't be called in the component's current state, like `show()` on a dialog that is already open.

#### Comments

At a minimum all classes should have a block comment and ultimately all parts of the public API should have a block comment as well.

### Adhere to accessibility guidelines

Accessibility is a requirement for all new components. For the Nimble design system, this means

- Focus states are defined for every element and work on all browsers.
- Colors have sufficient contrast across all themes.

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

### Export component tag

Every component should export its custom element tag (e.g. `nimble-button`) in a constant like this:

```ts
export const buttonTag = 'nimble-button';
```

Client code can use this to refer to the component in an HTML template and having a dependency on the export will let a compiled application detect if a tag name changes.

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

- For a component built on top of a fast-foundation component, check the fast-foundation component's README.md to see if the component was built with the expectation that focus will be delegated.
- Non-interactive elements should keep `delegatesFocus` with the default `false` value.
- Interactive controls that contain no focusable components in the shadow root should keep `delegatesFocus` with the default `false` value.
- Interactive controls that contain focusable components in the shadow root should set `delegatesFocus` to `true`.
- Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) or [this table](https://github.com/TakayoshiKochi/tabindex-focus-navigation-explainer/blob/master/TabindexFocusNavigationExplainer.md#proposed-solution) for more information.

If it is determined that the component should delegate focus, it can be configured as shown below:

```js
const nimbleButton = Button.compose({
    // ...
    shadowOptions: {
        delegatesFocus: true
    }
});
```

If delegating focus, you must forward the `tabindex` attribute to any focusable elements in the shadow DOM. Override the `tabIndex` property and mark it as an attribute:

```ts
export class MyComponent {
    ...
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;
}
```

Then in the template, bind the focusable elements' `tabindex` to the host component's property:

<!-- prettier-ignore -->
```html
html<MyComponent>`
    <nimble-button 
        ...
        tabindex="${x => x.tabIndex}">
    </nimble-button>
    // or for an element that isn't focusable by default:
    <div
        ...
        tabindex="${x => {
            const tabindex = x.tabIndex ?? 0;
            return x.disabled ? undefined : `${tabindex}`;
        }">
    </div>`;
```

Add automated tests for the behaviors implemented above. Search for `tabindex` in other components for inspiration.

Across supported browsers, perform one-time manual verification of cases including the following:

1. Setting a negative `tabindex` causes the control to be skipped when tabbing between elements
2. Setting a non-negative `tabindex` causes the correct part(s) of the element to receive focus when tabbing between elements
3. The default `tabIndex` property value reflects the actual behavior when the `tabindex` attribute isn't set

### Leverage mixins for shared APIs across components

TypeScript and the FAST library each offer patterns and/or mechanisms to alter the APIs for a component via a mixin.

FAST provides an `applyMixins` function (which is just an implementation of the [Alternative Pattern](https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern) described in the Typscript docs) to alter the API of a given component with a set of provided mixin classes. For an example, see how the [ToggleButton StartEnd mixin](https://github.com/ni/nimble/blob/6839ee05cf4d72efa6a20cd23e1d830047103745/packages/nimble-components/src/toggle-button/index.ts#L44) is applied.

Another pattern in use within in Nimble is the [Constrained Mixin](https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins) pattern. An example in Nimble is the [FractionalWidth mixin](https://github.com/ni/nimble/blob/6839ee05cf4d72efa6a20cd23e1d830047103745/packages/nimble-components/src/table-column/mixins/fractional-width-column.ts#L16) which `TableColumnText`, for example, [ultimately extends](https://github.com/ni/nimble/blob/6839ee05cf4d72efa6a20cd23e1d830047103745/packages/nimble-components/src/table-column/text/index.ts#L61). This offers the ability for a mixin to extend the functionality of another concrete type and interface with its implementation.

The 'Constrained Mixin' pattern is used for applying mixins that are defined within Nimble, as they do not fundamentally alter existing types, and the `applyMixins` FAST method is used for consuming mixins exported from the FAST library.

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

- `npm run test-webkit:debugger -w @ni/nimble-components`: Similar to `test-chrome:debugger` but for WebKit. Can be run on Windows.

### Test utilities

Test utilities located in [`/src/testing`](/packages/nimble-components/src/testing) may be used for testing:

- performed inside the `@ni/nimble-components` package or
- by other packages in the monorepo or users consuming the built package

Test utilties located in [`/src/utilities/tests`](/packages/nimble-components/src/utilities/tests) are just for tests in the `@ni/nimble-components` package and are not shared externally.

#### Fixtures

The jasmine unit tests utilize [`fixture.ts`](/packages/nimble-components/src/utilities/tests/fixture.ts) for component tests. The fixture utility gives tools for managing the component lifecycle. For some usage examples see [`fixture.spec.ts`](/packages/nimble-components/src/utilities/tests/fixture.spec.ts).

### Disabling tests

If a test is failing on a specific browser but passing on others, it is possible to temporarily mark it to be skipped for that browser by applying the tag `#SkipFirefox`, `#SkipWebkit`, or `#SkipChrome` to the test name:

```ts
// Firefox skipped, see: https://github.com/ni/nimble/issues/####
it('sets title when cell text is ellipsized #SkipFirefox', ...);
```

Before disabling a test, you **must** have investigated the failure and attempted to find a proper resolution. If you still end up needing to disable it, there must be an issue in this repo tracking the failure, and you must add a comment in the source linking to that issue.

## Theming

Nimble includes three NI-brand aligned themes (i.e. `light`, `dark`, & `color`).

## Localization

Most user-visible strings displayed by Nimble components are provided by the client application and are expected to be localized by the application if necessary. However, some strings are built into Nimble components and are provided only in English. An application can provide localized versions of these strings by using design tokens set on label provider elements.

The current label providers:

- `nimble-label-provider-core`: Used for labels for all components without a dedicated label provider
- `nimble-label-provider-rich-text`: Used for labels for the rich text components
- `nimble-label-provider-table`: Used for labels for the table (and table sub-components / column types)

The expected format for label token names is:

- element/type(s) to which the token applies, e.g. `number-field` or `table`
    - This may not be an exact element name, if this label applies to multiple elements or will be used in multiple contexts
- component part/category (optional), e.g. `column-header`
- specific functionality or sub-part, e.g. `decrement`
- the suffix `label` (will be omitted from the label-provider properties/attributes)

Components using localized labels should document them in Storybook. To add a "Localizable Labels" section:

- Their story `Args` should extend `LabelUserArgs`
- Call `addLabelUseMetadata()` and pass their declared metadata object, the applicable label provider tag, and the label tokens that they're using

## Component naming

Component custom element names are specified in `index.ts` when registering the element. Use the following structure when naming components.

`nimble[-category][-variant]-presentation`

1. All Nimble custom elements are prefixed with `nimble-` to avoid name collisions with other component libraries. Applications should choose their own unique prefix if they define their own elements.
2. **category** can be used to group similar components together alphabetically. Examples include `icon` and `table-column`.
3. **variant** can be used to distinguish alternate configurations of one presentation. For example, `anchor-`, `card-`, `menu-`, and `toggle-` are all variants of the `button` presentation. The primary configuration can omit the `variant` segment (e.g. `nimble-button`).
4. **presentation** describes the visual presentation of the component. For example, `button`, `tab`, or `text-field`.

## Theme-aware tokens

Nimble maps [base tokens](/packages/nimble-tokens/CONTRIBUTING.md#editing-base-tokens) to theme-aware tokens which are then used to style components. These tokens automatically adjust to the theme set by the `theme-provider` and relate to specific contexts or components.

To modify the generated tokens, complete these steps:

1. Edit the `design-tokens*` typescript files in `src/theme-provider/`.
2. Rebuild the generated token files by running the repository's build command, `npm run build`.
3. Test your changes locally and create a PR using the normal process.

### Naming

Public names for theme-aware tokens are specified in `src/theme-provider/design-token-names.ts`. Use the following structure when creating new tokens.

`[element]-[part]-[interaction_states]-[remaining_states]-[token_type]`

1. Where **element** is the type to which the token applies (e.g. 'application', 'body', or 'title-plus-1').
2. Where **part** is the specific part of the element to which the token applies (e.g. 'border', 'background', or shadow).
3. Where **interaction_states** is one or more interaction states (e.g. 'active', 'disabled', 'hover', or 'selected'). Multiple values should be sorted alphabetically.
4. Where **remaining_states** the remaining, non-interaction states (e.g. 'accent', 'primary, or 'large'). Multiple values should be sorted alphabetically.
5. Where **token_type** is the token category (e.g. 'color', 'image', 'font', 'font-color', 'height', 'width', or 'size').

### Size ramp

For tokens with multiple sizes, use the following structure for **element** names. E.g. for `title`:

| Element name  |
| ------------- |
| title-plus-2  |
| title-plus-1  |
| title         |
| title-minus-1 |
| title-minus-2 |
