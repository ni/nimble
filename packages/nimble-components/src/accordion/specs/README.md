# Nimble Accordion 

## Overview

The `nimble-accordion` is a vertical stack of interactive headings. The headings are controls that can be used to reveal or hide content in specific sections. The Nimble accordion is based upon [FAST's accordion component](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/accordion)

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

The functionality of the accordion can be changed by setting the `expand-mode` class, which as states `single` and `multi`(default). When using `single`, only one accordion section can be open at a time (ex. if you have accordion one open, when you open accordion two, accordion one will close). When using `multi`, any / all accordion sections can be open at any time.

The CustomEvent `change` is included in FAST's API.

Additonal attributes include: `expanded` which sets an accordion to open if true, closed if false, `id` for declaring the specific id of an accordion item, and `heading-level` which configures the hierarchical aria-level of the heading element.

#### Possible Deviation

The [Figma Spec](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A87332&mode=dev) also shows accordions inside of accordions- Fast states in their spec: `"Optional support for nested accordions. Ideally this behavior will "just work" and no special behaviors will need to be added to enable/support this. The expectation here should be that an accordion takes content and whatever content is inside the accordion panel respects its own interaction model."` If nesting accordions works then this can be implemented, but it might be worth discussing if doing so is necessary and should be promoted. The tree item provides a similar functionality where items and sections can be nested within each other, so would we want to promote using one over the other or let the tree item be for nesting, and the accordion for one level of info (no nesting)?

The [Figma Spec](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A87332&mode=dev) also includes a state that is most likely `error`, as it has a red border and red exclamation mark icon. There is no attribute for the appearance type of the accordion in FAST, so an `appearance` attribute would need to be created.

This screenshot shows a possible integration of the [accordion](https://github.com/ni/nimble/issues/533#issue-1224634916). It shows the usage of a dropdown select in the inner accordion items. The main conflict with this is that the FAST accordion does not have slots for `start` or `end` for the inner accordion items, only for the headers. If this functionality is being used in SystemLink currently, it would most likely need to be included with the nimble-accordion to promote users of SystemLink to switch to Nimble.

Currently, components can be added in the innner accordion items at the beginning of the content (in the space that would be used for slot="start")

```
<fast-accordion>
    <fast-accordion-item>
        <span slot="heading">Panel one</span>
        <span slot="icon">^</span>
        <fast-checkbox/>
        Panel one content
    </fast-accordion-item>
</fast-accordion>
```

This does work, but it's not slotted so the text that would go along with the checkbox is not centered and extra styling would be required. Also, the example given in the github issue shows the select component at the end of the inner accordion item (in the space that would be used for slot="end"). Styling this without slot="end" would require more css.

Because of this, if we want to save the functionality that is used in the current SystemLink accordion and promote other users to use Nimble, it might be worth deviating from FAST's API to include slots `start` and `end` for the inner accordion items.

#### Styling

Based on the Figma design for the accordion, the nimble-button pattern seems to fit the styling of the acordion item. A few styling elements like the background color change on click would have to be removed. An arrow pointing to te right would be included in the `start` slot of the button to signify that the accordion is closed.

Once the accordion is open, the arrow pointing right would be replaced with an arrow pointing down in the `start` slot to signify that the accordion is open. A css class for the nimble-accordion-item can be used to get the green border around the entire accordion (parent and children of accordion). The button styling would have to change once the accordion is open, as having a green border around the entire accordion and then another around only the accordion header button could be confusing.Items inside accordions (such as other nimble components or text) would require left padding / margins because the FAST accordion has the inner accordion items right below the header, but the Figma spec has the inner accordion items moved to the right (by about 34px).

For the additonal `error` state, adding an error icon would most likely be done by putting the icon in the `end` slot of the accordion heading. The border color could then be changed to red for that state.

Additionally, if we decide to not deviate from FAST's API, extra styling would be required to include nimble components at the start and end of inner accordion items.


*Include a permalink to FAST's API documentation (from the FAST component spec on GitHub, press `y` to update the URL bar to show the latest commit)*
*Provide a brief summary of the API below. For each section:*
    *If exposing FAST's API without changes, you can just write "Unchanged".*
    *If deviating from FAST's API, highlight and provide an explanation for the changes.*

*The API summary should include:*
- *Component Name* `nimble=accordion`
- *Properties/Attributes* Unchanged
- *Methods* Unchanged
- *Events* Unchanged
- *CSS Classes and Custom Properties that affect the component:* Special states of the accordion (`error`)
- *Slots* `start` and `end` for inner accordion items

### Angular integration 

*Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration. Depending on the contributor's needs, implementing Angular integration may be deferred but the initial spec should still document what work will be needed.*

### Blazor integration 

*Describe the plan for Blazor support. See the [nimble-blazor CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) for details. Depending on the contributor's needs, implementing Blazor integration may be deferred but the initial spec should still document what work will be needed.*

### Additional requirements

*Review the following areas and add brief commentary on each. Highlight any gaps which might require additional work, bugs to be filed to FAST, or write "None" if there are no special requirements.*

- *User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?*
    -   No additional requirements
- *Styling: Does FAST provide APIs to achieve the styling in the visual design spec?*
    -   No, the nimble-button styling will be used for the header button along with other       component-specific designs for inner accordion items
- *Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?*
- *Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?*
    -   No additional requirements
- *Tooling: Any new tools, updates to tools, code generation, etc?*
    -   No additional requirements
- *Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc.*
    -   No Additional Requirements
- *Globalization: special RTL handling, swapping of icons/visuals, localization, etc.*
- *Performance: does the FAST component meet Nimble's performance requirements?*
- *Security: Any requirements for security?*

---

## Open Issues

Should we deviate from FAST for the `error` appearance?

Should we deviate from FAST to include `start` and `end` slots for the inner accordion items?
If not, should we provide guidance / base styling for users to make it easier to add components to the inner accordion items?

Should we promote nesting accordions inside of other accordions, or should we advise against this and direct users to the nimble-tree-view component?

*Highlight any open questions for discussion during the spec PR. Before the spec is approved these should typically be resolved with the answers being incorporated in the spec document.*