# Nimble Card

## Overview

The `nimble-card` is a container that is designed to contain arbitrary content specified by a client
application. The `nimble-card` is intended for grouping related content.

### Background

[GitHub Issue #296: nimble-card component](https://github.com/ni/nimble/issues/296)

An IxD and Visual Design spec for the `nimble-card` component have not yet been provided. We will add some
preliminary styling in the interim.

The new Routines UX in SystemLink Enterprise calls for grouping related configuration in a slide-out in labeled
containers. See [Figma: NorthStar Vision for SLE Routines](https://www.figma.com/file/VQ7WIi3qqRG3r19VXqVvem/Stratus-Routines?type=design&node-id=1%3A74129&mode=design&t=KfPTwy4IhHbt42LR-1).
We are designing the `nimble-card` component to address that use case.

---

## Design

The `nimble-card` will not include any built-in content (title, footer, actions, etc.). Some component libraries
do provide a card component with built-in, pre-styled content or pre-styled child components to use inside the card
component. See the [Angular Material `mat-card` component](https://v5.material.angular.io/components/card/overview)
for an example. We could add similar content in the future, but it is not required at this time.

Since we're not providing any built-in content, the API surface area for the `nimble-card` is very small. The template
contains only a slot, and there are no configurable properties on the component. Here is an example usage for
the `nimble-card` component:

```html
<nimble-card>
    <h2>Heading</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <nimble-button>Button</$nimble-button>
</nimble-card>
```

While we don't have a finalized visual design spec, we expect the style will include a background color and a
border, potentially with rounded corners. The GitHub issue mentions several use cases for a card component
that might call for different visual treatments, but we are only solving for the Routines use case at this
time (grouping related configuration in a slide-out). To support other use cases in the future, we could
potentially add appearance variants.

We will hold off on adding new design tokens for the `nimble-card` until we get the visual design more settled,
because we don't know if we will require different tokens from the existing components.

### API

[`fast-card` spec](https://github.com/microsoft/fast/blob/b78c921ec4e49ec9d7ec980f079ec114045df42e/packages/web-components/fast-foundation/src/card/card.spec.md)

-   _Component Name_
    -   `nimble-card`
-   _Properties/Attributes_
    -   _(none)_
-   _Methods_
    -   _(none)_
-   _Events_
    -   _(none)_
-   _CSS Classes and Custom Properties that affect the component_
    -   _(none)_
-   _Slots_
    -   `(default)`
        -   Unchanged. Arbitrary content to be displayed in the `nimble-card``.

### Angular integration

We will create an Angular `nimble-card` directive for the component. The `nimble-card` does not require form integration, so there
is no need for a ControlValueAccessor.

### Blazor integration

We will create a Blazor wrapper the component and define a `NimbleCard` class. The `nimble-card` component supports child content,
so it will need a `ChildContent` parameter.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No additional requirements. The initial `nimble-card` will have no interactions.
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   No additional requirements expected here.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   No additional requirements
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No additional requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   We will set the ARIA role to `region`, based on the intended usage of the component. It may make sense to have clients set
        different roles (such as `group`) based on the purpose of their specific `nimble-card` instance.
    -   No additional requirements, as long as we don't intend to include built-in content like headers/footers. The `nimble-card`
        itself does not receive keyboard focus and tabbing jumps to the first focusable component inside the `nimble-card`.
-   _Mobile: small screens, touch interactions, mobile-specific integrations_
    -   No additional requirements. By default, the `nimble-card` fits its height to its content and grows/shrinks horizontally to
        fit its parent container. Other mobile-friendly considerations are up to the client and the settings on the child components.
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No additional requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No additional requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

None
