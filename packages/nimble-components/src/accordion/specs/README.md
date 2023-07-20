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

The functionality of the accordion can be changed by setting the `expand-mode` class, which has states `single` and `multi`(default). When using `single`, only one accordion section can be opened at a time (ex. if you have accordion one open, when you open accordion two, accordion one will close). When using `multi`, any / all accordion sections can be open at any time.

The CustomEvent `change` is included in FAST's API. It fires a custom 'change' event when the button is invoked.

Additonal attributes include: `expanded` which opens the corresponding accordion if true and closes it if false, `id` for declaring the specific id of an accordion item, and `heading-level` which configures the hierarchical aria-level of the heading element.

The [Figma Spec](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A87332&mode=dev) shows accordions inside of accordions- Fast states in their spec: `"Optional support for nested accordions. Ideally this behavior will "just work" and no special behaviors will need to be added to enable/support this. The expectation here should be that an accordion takes content and whatever content is inside the accordion panel respects its own interaction model."` If nesting accordions works then this can be implemented, but it might be worth discussing if doing so is necessary and should be promoted. The tree item provides a similar functionality where items and sections can be nested within each other, so would we want to promote using both / either or let the tree item be for nesting, and the accordion for one level of info (no nesting)?

[This screenshot](https://github.com/ni/nimble/issues/533#issue-1224634916) shows a possible integration of the accordion. It shows the usage of a dropdown select in the inner accordion items. The main conflict with this is that the FAST accordion does not have `start` or `end` slots for the inner accordion items, only for the headers. If this functionality is being used in SystemLink currently, it would most likely need to be included with the nimble-accordion to make switching to Nimble easier for these users.

We can solve this issue without deviating from FAST's template by putting a div with child content in the "content" section of the accordion (where "Accordion one content" is in the code sample above). Within this, we can add css styling to align text and components. Documentation should be added to show users how to include components within inner accordion items.

For styling:

The accordion has 5 css parts from FAST's API:

-   heading (Wraps the Button)
-   button (The button which serves to invoke the item)
-   heading-content (wraps the slot for the heading content within the button)
-   icon (The icon container)
-   region (The wrapper for the accordion item content)

The Figma design includes appearances of the accordion header that reflect those of the `block`, `outline`, and `ghost` buttons. The nimble-button pattern with these styles seems to fit the styling of the accordion, so these styles can be used in the heading css class. The attributes of `block`, `outline`, and `ghost` will most likely be implemented with the name `appearance`. A few styling elements like the background color change on click that is used in the button will have to be removed. An arrow pointing to the right would be included in the `start` slot of the button to signify that the accordion is closed.

The Figma design also includes a state that is most likely `error`, as it has a red border and red exclamation mark icon. For this state, the styling of the accordion header button could be altered to have a red border. This could be controlled with an attribute such as `severity`, which would have a default state of `default` and would not require a css class. Adding the error icon could be done by putting the icon in the `end` slot of the accordion heading.

Once the accordion is open, the arrow pointing right would be replaced with an arrow pointing down in the `start` slot to signify that the accordion is open. A css class for the nimble-accordion-item can be used to get a green border (or red for the `error` state) around the entire accordion (parent and children of accordion).

Extra styling would be required to place Nimble components at the start and end of inner accordion items, as well as to center them.

-   _Component Name:_ `nimble-accordion`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Special states of the accordion (`error`) and a div with children for Nimble components within inner accordion items
-   _Slots:_ Unchanged

### Angular integration

An Angular directive will be created for this component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A blazor wrapper will be created for the component.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   Partially, extra functionality for Nimble components in inner accordion items will be required. Adding this functionality through the `content` section of the accordion will be preferrable because it doesn't require deviating from FAST's API.
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   Partially, extra styling will be needed for the `error` severity and `Block` / `Outline` / `Ghost` appearances.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   Testing for `error` severity and `Block` / `Outline` / `Ghost` appearances.
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   Documentation for adding nimble components in inner accordion items
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   No Additional Requirements
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   -
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   -
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues

Should we promote nesting accordions inside of other accordions, or should we advise against this and direct users to the nimble-tree-view component?

Should the arrow with the accordion have an animation on the accordion open / close? If so, how would we implement this?
