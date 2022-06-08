# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

### Background

[Visual desgin spec](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---

## Design

### API

[FAST tooltip API](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

*Provide a brief summary of the API below. For each section:*
    *If exposing FAST's API without changes, you can just write "Unchanged".*
    *If deviating from FAST's API, highlight and provide an explanation for the changes.*

- _Component Name:_ `nimble-tooltip`
- _Properties/Attributes:_ Unchanged
- _Methods:_ Unchanged
- _Events:_ Unchanged
- _CSS Classes and Custom Properties that affect the component:_ ?
- _Slots:_ Unchanged
- _Template:_ ?

[FAST Component tooltip](https://explore.fast.design/components/fast-tooltip)
Is design similar enough or does need styling changes?

### Angular integration 

*Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration.*

### Blazor integration 

*Describe the plan for Blazor support. See the [nimble-blazor CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) for details.*

### Additional requirements

*Review the following areas and add brief commentary on each. Highlight any gaps which might require additional work, bugs to be filed to FAST, or write "None" if there are no special requirements.*

- *User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?*
- *Styling: Does FAST provide APIs to achieve the styling in the visual design spec?*
- *Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?*
- *Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?*
- *Tooling: Any new tools, updates to tools, code generation, etc?*
- *Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc.*
- *Globalization: special RTL handling, swapping of icons/visuals, localization, etc.*
- *Performance: does the FAST component meet Nimble's performance requirements?*
- *Security: Any requirements for security?*

---

## Open Issues

None