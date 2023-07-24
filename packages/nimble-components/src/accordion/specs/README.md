# Nimble Accordion

## Overview

The `nimble-accordion` is a vertical stack of interactive headings. The headings are controls that can be used to reveal or hide content in specific sections. The Nimble accordion is based upon [FAST's accordion component](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components/fast-foundation/src/accordion).

### Background

[Nimble issue #533: nimble-accordion Component](https://github.com/ni/nimble/issues/533)

[Visual Design](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-85131&mode=design&t=DxDRlqT7MeCPLOxi-0)

---

## Design

Simple accordion group

```
<nimble-accordion>
    <nimble-accordion-item>
        <span slot="heading">Panel one</span>
        <span slot="icon">^</span>
        Panel one content
    </nimble-accordion-item>
    <nimble-accordion-item expanded>
        <span slot="heading">Panel two</span>
        <span slot="icon">^</span>
        Panel two content
    </nimble-accordion-item>
    <nimble-accordion-item>
        <span slot="heading">Panel three</span>
        <span slot="icon">^</span>
        Panel three content
    </nimble-accordion-item>
</nimble-accordion>
```

Complex accordion group with components in slots and single expand-mode

```
<nimble-accordion expand-mode="single">
    <nimble-accordion-item>
        <nimble-checkbox slot="start"></nimble-checkbox>
            <nimble-select slot="end">
                <nimble-option value="1">Option 1</nimble-option>
                <nimble-option value="2">Option 2</nimble-option>
                <nimble-option value="3">Option 3</nimble-option>
            </nimble-select>
                Accordion one content
            <div slot="heading">Accordion one</div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <nimble-checkbox slot="start"></nimble-checkbox>
            <nimble-number-field placeholder="number" slot="end"></nimble-number-field>
                Accordion two content
            <div slot="heading">Accordion two</div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <nimble-checkbox slot="start"></nimble-checkbox>
            <nimble-select slot="end">
                <nimble-option value="1">Option 1</nimble-option>
                <nimble-option value="2">Option 2</nimble-option>
                <nimble-option value="3">Option 3</nimble-option>
            </nimble-select>
            Accordion three content<div slot="heading">Accordion three</div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <nimble-checkbox slot="start"></nimble-checkbox>
            <nimble-number-field placeholder="number" slot="end"></nimble-number-field>
                Accordion four content
            <div slot="heading">Accordion four</div>
    </nimble-accordion-item>
</nimble-accordion>
```

### API

#### Nimble Accordion

[FAST accordion API](https://github.com/microsoft/fast/blob/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)

-   _Component Name:_ `nimble-accordion`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ Unchanged

#### Nimble Accordion Item

[FAST accordion-item API](https://github.com/microsoft/fast/tree/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion-item)

-   _Component Name:_ `nimble-accordion-item`
-   _Properties/Attributes:_
    -   `appearance` - `block`, `outline`, `ghost`
    -   `error-visible` - boolean
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_
    -   `appearance` - `block`, `outline`, `ghost`
    -   `error-visible` - boolean
-   _Slots:_ Unchanged

The Figma design includes appearances of the accordion header that reflect those of the `block`, `outline`, and `ghost` buttons. The nimble-button pattern with these styles mostly fits the styling of the accordion, so these styles will be used. The attributes of `block`, `outline`, and `ghost` will be implemented with the name `appearance`. A few styling elements like the background color change on click that is used in the button will be removed.

The Figma design also includes an `error` state. For this state, the styling of the accordion header button will to have a red border. This will be controlled with a boolean attribute such as `error-visible`, which would have a default of "" in the accordion attributes- when necessary, "error-visible" would be added to the accordion attributes and this would make the accordion switch to the red styling.

A css class for the nimble-accordion-item can be used to get a green border (or red for `error-visible`) around the entire accordion (parent and children of accordion).

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
    -   No Additional Requirements
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No Additional Requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No Additional Requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   No Additional Requirements
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No Additional Requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No Additional Requirements
-   _Security: Any requirements for security?_
    -   No Additional Requirements

---

## Open Issues

Should we only have arrow icons for open / closed indicators on the accordion, or should other visuals like +/- be implemented as well?
