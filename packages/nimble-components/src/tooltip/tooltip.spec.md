# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

The nimble-tooltip project will first be implemented as a prototype, open issues listed below will be addressed once the prototype is functional.

### Background

[Nimble issue #309: Tooltip](https://github.com/ni/nimble/issues/309)

[Visual desgin spec](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---

## Design

### API

[FAST tooltip API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

Two css classes will be used to determine the type of tooltip to be displayed. The first class will have `default`, `error`, or `information` values, with the following class determining if the corresponding icon is visible or not by using `icon-visible`.

Icons will be available for the error and information states- The corresponding icon can be shown by using the `icon` switcher, which calls the class `icon-visible` when `true`. No icon will be shown for the `default` class so that clients can easily switch between `default` and `error` classes without having to update the icon state.

Two local css variables will be created for the tooltips- one that controls the border color of the tooltip, and one that controls the background color of the tooltip. These variables will be changed based on the css classes described above.

-   _Component Name:_ `nimble-tooltip`
-   _Properties/Attributes:_ Adding `state` attribute
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ None
-   _Slots:_ Unchanged
-   _Template:_ Unchanged

### Future Improvements

Easier integration with other nimble components

### Angular integration

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No additional requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   The `state` attribute described above will be a Nimble-specific API.
    -   Version of error / information tooltips with icons will also be included.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   No additional requirements
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No additional requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   aria-describedby implementation will eventually need to be fixed- currently only works when tooltip attribute is set to visible
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No additional requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No additional requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

When user is using nimble tooltip and nimble components, is there an easier way to add a tooltip so they wouldn't have to anchor to an html element every time they want a tooltip?

-   Update nimble controls to have tooltip show and be tooltip aware
-   Create a tooltip in the shadow dom internally, would not require a separate tooltip element.
-   If we don't do anything, at least provide an easy way to create unique ids.

Can tooltip be found by screen reader?

Mobile tooltip is not very functional- have to click on button to show tooltip, and clicking away does not make it disappear

aria-describedby only shows up when tooltip attribute is set to visible

How can we give each tooltip a custom id?

When should we use the tooltip vs. the title attribute? MDN [lists many issues with the title element](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title#accessibility_concerns). Needs to be discussed with team and designers.

Will the use of separate states for both icon tooltips be sufficient, or should it be changed later on to something different like a switcher (would toggle icon on or off for error and information states)? Would we allow / expect the client to provide or choose an icon, or will the error and info icons always be used?
