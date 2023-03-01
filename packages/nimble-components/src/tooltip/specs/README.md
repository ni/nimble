# Nimble Tooltip

## Overview

The `nimble-tooltip` is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. The Nimble tooltip is based upon [FAST's tooltip component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/tooltip)

The nimble-tooltip project will first be implemented as a prototype, open issues listed below will be addressed once the prototype is functional.

### Background

[Nimble issue #309: Tooltip](https://github.com/ni/nimble/issues/309)

[Visual desgin spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/)

---


## Potential approaches

Below we enumerate several different design approaches from which we may choose one or more as our ideal API surface.

### Prior art
- [Angular Material Tooltip](https://material.angular.io/components/tooltip/overview) - Uses Angular specific functionality (Directive)
- [Carbon Design System](https://carbondesignsystem.com/components/tooltip/usage#live-demo) - Tooltip component takes anchor element as content.
- [Atlassian Design System](https://atlassian.design/components/tooltip/examples) - Tooltip component takes anchor element as content
- [Adobe Spectrum (React)](https://react-spectrum.adobe.com/react-spectrum/Tooltip.html) - Separate wrapper component around tooltip and anchor elements.
- [FAST](https://explore.fast.design/components/fast-tooltip) - Tooltip associated with anchor element by id.

### Associate by `id`
This is the FAST approach, and the current implementation. The tooltip has an `anchor` attribute which takes the `id` of the anchor element.
```html
<nimble-tooltip anchor="previewButton">...</nimble-tooltip>
<nimble-button id="previewButton">Preview</nimble-button>
```

**Pros**
- No additional implementation cost
- Familiar pattern, e.g. `<label>` element with `for` attribute, `aria-labelledby` attribute, `aria-describedby` attribute
- Reasonable DOM structure, i.e. tooltip sibling of anchor element

**Cons**
- Annoying to have to give anchor element an `id`
- <span style="color:red">**Not condusive to use in shared components because `id` values must be unique**</span>

### Tooltip slotted in anchor element
The anchor element defines a `slot` for the tooltip and takes the tooltip as content.
```html
<nimble-button>
    Preview
    <nimble-tooltip slot="tooltip">...</nimble-tooltip>
</nimble-button>
```

**Pros**
- Familiar slotting pattern
- Logical DOM structure (element contains its tooltip)
- May not need `nimble-tooltip` element at all -- could slot tooltip content directly without wrapping in `nimble-tooltip` element

**Cons**
- Expensive to implement and maintain. <span style="color:red">**Requires forking and modifying the template of every component that wants to support a tooltip.**</span> (Though code duplication could be avoided by using shared template fragments.) Tooltip implementation leaks into every other component.
- Cannot apply tooltip to native elements, like `<div>`

### Tooltip implemented by each component
There is no tooltip component, but instead, each component that wants to support a tooltip makes it a part of its template. Those components have an attribute like `tooltip` that takes the text to display in the tooltip. If the tooltip needs to support more than just unformated text, that approach would be a variation of "Tooltip slotted in anchor element", where there is no explicit tooltip element.
```html
<nimble-button tooltip="This is tooltip text">Preview</nimble-button>
```

**Pros**
- Simple, intuitive API (similar to existing `title` attribute)
- No dedicated tooltip component

**Cons**
- Expensive to implement and maintain. <span style="color:red">**Requires forking and modifying the template of every component that wants to support a tooltip.**</span> (Though code duplication could be avoided by using shared template fragments.) Cannot leverage FAST implementation?
- <span style="color:red">**Does not support rich tooltip content (which is probably a requirement)**</span>
- Cannot apply tooltip to native elements, like `<div>`

### Tooltip takes anchor element as content
The tooltip element wraps the anchor element. If the tooltip takes other content (e.g. the text for the tooltip itself), the anchor element would need to specify something like `slot="anchor"` to distinguish it from that other content.
```html
<nimble-tooltip>
    <nimble-button slot="anchor">Preview</nimble-button>
    This is the tooltip text.
</nimble-tooltip>
```

**Pros**
- Easy to implement
- Proven pattern: used by Carbon and Atlassian Design Systems

**Cons**
- Confusing DOM structure. Both the things _in_ the tooltip and the thing _associated_ with the tooltip are child content.

### Wrapper element around tooltip and anchor elements
There is a separate wrapper element that takes both the tooltip and the anchor as children.
```html
<nimble-tooltip-connection>
    <nimble-tooltip>...</nimble-tooltip>
    <nimble-button>Preview</nimble-button>
</nimble-tooltip-connection>
```

**Pros**
- Easy to implement
- Proven pattern: used by Adobe Spectrum Design System
- Reasonable DOM structure, i.e. tooltip sibling of anchor element

**Cons**
- Additional element required

---

## Design

### API

[FAST tooltip API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)

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

### Future Improvements

Eventually we want the following API:
- for simple use cases where we only need plain text in our tooltip, we assign that text to an attribute on a Nimble component
- for tooltips with arbitrary content, we slot tooltip components into other Nimble components
- for tooltips on native HTML elements, we associate tooltip components to those elements by `id`

Today we only have support for the `id`-based part of that API. FAST has plans to make it easier to modify/extend templates, at which point it will clear the way for us to develop the slot-based part of the API. We will put further development of the Nimble tooltip on hold until that time.

### Angular integration

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component.

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
