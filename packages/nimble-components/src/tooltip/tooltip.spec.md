# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

### Background

[Nimble issue #309: Tooltip](https://github.com/ni/nimble/issues/309)

[Visual desgin spec](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---

## Design

### API

[FAST tooltip API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

Plan to extend API to support all cases shown in visual design XD document. Will add
once tooltip is sucessfully implemented with one case.

Plan to first implment the tooltip and let the user choose which type of tooltip (general, error, info) they want
Additional changes to API expected in the future, but will not be included in first pass of implementation. Listed in Future Imrovements and Open Issues

-   _Component Name:_ `nimble-tooltip`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ None
-   _Slots:_ Unchanged
-   _Template:_ Unchanged

### Future Improvements

Attribute for switching between error and info states of tooltip
Easier integration with other nimble components

### Angular integration

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No additional requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   FAST API most likely won't be sufficient for creating extra states in spec, will be adressed later on.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   Will look at options as building, testing may be difficult because only displayed on hover.
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No additional requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   Aria-describedBy recommendation in storybook docs for tooltip for developers
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No additional requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No additional requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

When user is using nimble tooltip and nimble components, is there an easier way to add a tooltip so they wouldn't have to anchor to an html element every time they want a tooltip?
- Update nimble controls to have tooltip show and be tooltip aware
- Create a tooltip in the shadow dom internally, would not require a separate tooltip element.
- If we don't do anything, at least provide an easy way to create unique ids.

Can tooltip be found by screen reader?

For testing, can we force the tooltip to be visible without hover? [Possible Ideas](https://stackoverflow.com/questions/62043424/mock-hover-state-in-storybook)

Mobile tooltip is not very functional- have to click on button to show tooltip, and clicking away does not make it disappear
