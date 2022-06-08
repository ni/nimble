# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

### Background

[Nimble issue #309: Tooltip](https://github.com/ni/nimble/issues/309)

[Visual desgin spec](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---

## Design

### API

Plan to extend API to support all cases shown in visual design XD document. Will add
once tooltip is sucessfully implemented with one case.

[FAST tooltip API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

*Provide a brief summary of the API below. For each section:*
    *If exposing FAST's API without changes, you can just write "Unchanged".*
    *If deviating from FAST's API, highlight and provide an explanation for the changes.*

- _Component Name:_ `nimble-tooltip`
- _Properties/Attributes:_ Unchanged
- _Methods:_ Unchanged
- _Events:_ Unchanged
- _CSS Classes and Custom Properties that affect the component:_ ?
- _Slots:_ Unchanged
- _Template:_ Unchanged

### Angular integration 

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration 

A Blazor wrapper will be created for the component.

### Additional requirements

*Review the following areas and add brief commentary on each. Highlight any gaps which might require additional work, bugs to be filed to FAST, or write "None" if there are no special requirements.*

- *User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?*
- *Styling: Does FAST provide APIs to achieve the styling in the visual design spec?*
    FAST API most likely won't be sufficient for creating extra states in spec, will be adressed later on.
- *Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?*
    Will look at options as building, testing may be difficult because only displayed on hover.
- *Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?*
    No additional requirements
- *Tooling: Any new tools, updates to tools, code generation, etc?*
    No additional requirements
- *Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc.*
    -   All accessibility needs should be covered by FAST's implementation. We should do some manual testing to verify that the custom template doesn't break any accessibility behavior.
- *Globalization: special RTL handling, swapping of icons/visuals, localization, etc.*
    No additional requirements
- *Performance: does the FAST component meet Nimble's performance requirements?*
    No additional requirements
- *Security: Any requirements for security?*
    No additional requirements

---

## Open Issues

None