# Nimble Accordion

## Overview

The `nimble-accordion` is a vertical stack of interactive headings. The headings are controls that can be used to reveal or hide content in specific sections. The Nimble accordion is based upon [FAST's accordion component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/accordion).

### Background

[Nimble issue #533: nimble-accordion Component](https://github.com/ni/nimble/issues/533)

[Visual Design](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-85131&mode=design&t=DxDRlqT7MeCPLOxi-0)

---

## Design

Simple accordion group

```
<fast-accordion>
    <fast-accordion-item>
        <span slot="heading">Panel one</span>
        <span slot="icon">^</span>
        Panel one content
    </fast-accordion-item>
    <fast-accordion-item expanded>
        <span slot="heading">Panel two</span>
        <span slot="icon">^</span>
        Panel two content
    </fast-accordion-item>
    <fast-accordion-item>
        <span slot="heading">Panel three</span>
        <span slot="icon">^</span>
        Panel three content
    </fast-accordion-item>
</fast-accordion>
```

Complex accordion group with components in slots and single expand-mode

```
<fast-accordion expand-mode="single">
    <fast-accordion-item>
        <fast-checkbox slot="start"></fast-checkbox>
            <fast-select slot="end">
                <fast-option value="1">Option 1</fast-option>
                <fast-option value="2">Option 2</fast-option>
                <fast-option value="3">Option 3</fast-option>
            </fast-select>
                Accordion one content
            <div slot="heading">Accordion one</div>
    </fast-accordion-item>
    <fast-accordion-item>
        <fast-checkbox slot="start"></fast-checkbox>
            <fast-number-field placeholder="number" slot="end"></fast-number-field>
                Accordion two content
            <div slot="heading">Accordion two</div>
    </fast-accordion-item>
    <fast-accordion-item>
        <fast-checkbox slot="start"></fast-checkbox>
            <fast-select slot="end">
                <fast-option value="1">Option 1</fast-option>
                <fast-option value="2">Option 2</fast-option>
                <fast-option value="3">Option 3</fast-option>
            </fast-select>
            Accordion three content<div slot="heading">Accordion three</div>
    </fast-accordion-item>
    <fast-accordion-item>
        <fast-checkbox slot="start"></fast-checkbox>
            <fast-number-field placeholder="number" slot="end"></fast-number-field>
                Accordion four content
            <div slot="heading">Accordion four</div>
    </fast-accordion-item>
</fast-accordion>
```

### API

[FAST accordion API](https://github.com/microsoft/fast/blob/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)

-   _Component Name:_ `nimble-accordion`
-   _Properties/Attributes:_ appearance (`block`, `outline`, `ghost`), `error-visible` (boolean)
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ `error-visible` and accordion appearances (`block`, `outline`, `ghost`)

    The Figma design includes appearances of the accordion header that reflect those of the `block`, `outline`, and `ghost` buttons. The nimble-button pattern with these styles seems to fit the styling of the accordion, so these styles can be used in the heading css class. The attributes of `block`, `outline`, and `ghost` will most likely be implemented with the name `appearance`. A few styling elements like the background color change on click that is used in the button will have to be removed.

    The Figma design also includes a state that is most likely `error`, as it has a red border and red exclamation mark icon. For this state, the styling of the accordion header button could be altered to have a red border. This could be controlled with a boolean attribute such as `error-visible`, which would have a default of "" in the accordion attributes- when necessary, "error-visible" would be added to the accordion attributes and this would make the accordion switch to the red styling. Adding the error icon could be done by putting the icon in the `end` slot of the accordion heading.

    A css class for the nimble-accordion-item can be used to get a green border (or red for `error-visible`) around the entire accordion (parent and children of accordion).

-   _Slots:_ Unchanged

-   _Component Name:_ `nimble-accordion-item`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ `error-visible`

    A css class for the nimble-accordion-item can be used to get a green border (or red for `error-visible`) around the entire accordion (parent and children of accordion).

-   _Slots:_ Unchanged

### Angular integration

An Angular directive will be created for this component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A blazor wrapper will be created for the component.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No Additional Requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   Partially, extra styling will be needed for the `error-visible` boolean and `Block` / `Outline` / `Ghost` appearances.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   Testing for `error-visible` severity and `Block` / `Outline` / `Ghost` appearances, testing for nesting accordions
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   Documentation for adding nimble components in inner accordion items
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   No Additional Requirements
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No Additional Requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No Additonal Requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

Should we only have arrow icons for open / closed indicators on the accordion, or should other visuals like +/- be implemented as well?
