# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

The nimble-tooltip project will first be implemented as a prototype, open issues listed below will be addressed once the prototype is functional.

### Background

[Nimble issue #309: Tooltip](https://github.com/ni/nimble/issues/309)

[Visual desgin spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---

## Design

### API

[FAST tooltip API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

The tooltip will significantly differ from the FAST API in the way that a tooltip is associated with an "anchor" element. The FAST API provides two ways to associate a tooltip with the anchor: by `id` and by assigning the element directly to the tooltip's `anchorElement` property. We will internally make use of the latter, but the client will associate the two by wrapping them together in a container element:

```
<nimble-tooltip-connection>
    <nimble-tooltip>...</nimble-tooltip>
    <nimble-button>Hover To See Tooltip</nimble-button>
</nimble-tooltip-connection>
```

The `nimble-tooltip-connection` element takes exactly one `nimble-tooltip` and one non-tooltip element as contents. It will error if anything else is given. The connection element has no other public API. In its `connectedCallback`, we will assign the non-tooltip element to the tooltip's `anchorElement` property.

The state of the tooltip can be changed by setting the `error`, or `information` class. If neither of these classes are applied, the tooltip will use the `default` appearance- a state that does not require a CSS class. When the tooltip has the `error` or `information` class applied, an icon can optionally be visible in the tooltip by setting the `icon-visible` class. The `icon-visible` class will have no impact on the tooltip when it has the `default` appearance. This will allow clients to easily switch between `default` and `error` without also having to change whether or not the `icon-visible` class is applied.

Two local css variables will be created for the tooltips- one that controls the border color of the tooltip, and one that controls the background color of the tooltip. These variables will be changed based on the css classes described above.

CSS constants for the `error`, `information`, and `default` states will be added to make configuring tooltip classes easier. `icon-visible` will not have constants, as it is easier to style the icon component itself.

The tooltip will have a custom template based on FAST's template. In addition to the HTML that is in FAST's template, the template wll contain the two icons needed for the information and error states as shown in the XD spec. These icons will always be part of the template and their visibility will be controlled by a combination of the `icon-visible` class and the state classes.

-   _Component Name:_ `nimble-tooltip`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ `icon-visible` and the special states of the tooltip (`error` and `information`)
-   _Slots:_ Unchanged
-   _Template:_ Unchanged

### Angular integration

An Angular directive will be created for the tooltip component. The component will not have form association, so a `ControlValueAccessor` will not be created. No directive will be created for the `nimble-tooltip-connection` component since it has no programmatic API.

### Blazor integration

A Blazor wrapper will be created for the tooltip component and the connection component.

### Accessibility

One key part of tooltip accessibility is setting `aria-describedby` on the anchor element so that it references the tooltip's `id`. The version of FAST that we use does not do this for us (it was added in a later [re-implementation of the tooltip](https://github.com/microsoft/fast/commit/555f1b2cd614a1d5a9bc3985fb892d040c110cb3)). If the user has not assigned the `nimble-tooltip` element an `id`, we will generate one in the `nimble-tooltip-connection`'s `connectedCallback`. We will use a concatenation of `Math.random()` and `Date.now()` to generate a value that is extremely likely to be unique. We will then assign the `id` value to the anchor's `aria-describedby`.

The `nimble-tooltip` will have `role="tooltip"`. We will keep this on the host element, since that is the element whose `id` value we're assigning to `aria-describedby`.

In order for `aria-describedby` to always be able to find the tooltip element, we will re-use a [pattern for hiding it](https://github.com/ni/nimble/blob/0802dad32f1f90df5ded9b64d46d6ddf2aeb2222/packages/nimble-components/src/banner/styles.ts#L76) that does not actually change its `display` or `visibility` or remove it from the DOM. We have used this approach before for the banner, dialog, and button.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No additional requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   No additional requirements
    -   Version of error / information tooltips with icons will also be included.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   No additional requirements
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No additional requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   No additional requirements
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No additional requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No additional requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

Mobile tooltip is not very functional- have to click on button to show tooltip, and clicking away does not make it disappear

When should we use the tooltip vs. the title attribute? MDN [lists many issues with the title element](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title#accessibility_concerns). Needs to be discussed with team and designers.
