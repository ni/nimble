# Nimble Table Column Select

## Overview

_The name of the component, along with a high-level description._

### Background

_Relevant historical or background information_
_Link to Interaction Design spec_
_Link to Visual Design spec_
_Link to relevant work items, related existing issues, etc._

### Non-goals

_A list of use cases, features, or functionality which are **not** goals for the component._

### Features

_A list of the key features unique to this component._

### Risks and Challenges

_Notable risks or challenges associated with implementing the component. Would we need to make any breaking changes in order to achieve this component's goals?_

### Prior Art/Examples

_Screenshots and/or links to existing, canonical, or exemplary implementations of the component._

---

## Design

```html
<nimble-table id-field-name="rowId">
    <nimble-table-column-text field-name="name">Name</nimble-table-column-text>

    <nimble-table-column-select
        mode="static"
        field-name="country"
        onchange="countryChanged()"
    >
        Country
        <nimble-list-option value="1">USA</nimble-list-option>
        <nimble-list-option value="2">Canada</nimble-list-option>
        <nimble-list-option value="3">Mexico</nimble-list-option>
        <nimble-list-option value="4" disabled>N/A</nimble-list-option>
    </nimble-table-column-select>

    <nimble-table-column-select
        mode="dynamic"
        display-field-name="city"
        is-selected-item-disabled-field-name="selectedItemDisabled"
        beforeselectopen="populateCities()"
        onchange="cityChanged()"
    >
        City
    </nimble-table-column-select>
</nimble-table>
```

```ts
const data = [
    { rowId=1, country: 1, city: 'Chicago' },
    { rowId=2, country: 2, city: 'Winnipeg' },
    { rowId=3, country: 1, city: 'Austin' },
    { rowId=4, country: 3, city: 'Guadalajara' },
];

countryChanged(rowId, newValue) {
    const rowIndex = this.data.findIndex(x => x.rowId === rowId);
    this.data[rowIndex].country = newValue;
    this.data[rowIndex].city = '';
    this.table.setData(this.data);
}

populateOptions(rowId, select: NimbleSelect) {
    const country = getCountryForRow(rowId);
    let cities = [];
    if (country === countries.USA) {
        cities = ['Chicago', 'New York', 'Austin'];
    } else if (country === countries.Canada) {
        cities = ['Winnipeg', 'Victoria'];
    } else if (country = countries.Mexico) {
        cities = ['Guadalajara', 'Mexico City'];
    }
    createListOptionChildren(select, cities);
}

cityChanged(rowId, newValue) {
    const rowIndex = this.data.findIndex(x => x.rowId === rowId);
    this.data[rowIndex].city = newValue;
    this.table.setData(this.data);
}

```

Open questions:

1. appearance modes
1. error-visible and error-text
1. disable per-row
1. drop down position
1. future select APIs like icons, filtering, virtualization
1. row could move as a result of value change if it's being sorted/grouped
1. grouping for display value case. OK to group same display value even if different options?

_Describe the design of the component, thinking through several perspectives:_

-   _A customer using the component on a web page._
-   _A developer building an app with the component and interacting through HTML/CSS/JavaScript._
-   _A designer customizing the component._

_Include code snippets showing basic component use and any interesting configurations._

_For each section below, consider adding an "Alternatives" sub-section to describe any design alternatives and discuss why they were rejected._

### API

_The key elements of the component's public API surface:_

-   _Component Name_
-   _Props/Attrs: to match native element APIs, prefer primitive types rather than complex configuration objects and expose fields as both properties on the TypeScript class and attributes on the HTML element_
-   _Methods_
-   _Events_
-   _CSS Classes and CSS Custom Properties that affect the component_
-   _How native CSS Properties (height, width, etc.) affect the component_

_Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity._

### Anatomy

_Outline the component structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:_

-   _Slot Names_
-   _Host Classes_
-   _Slotted Content/Slotted Classes_
-   _CSS Parts_

_Work closely with the visual design partner to co-develop the API and anatomy along side the visual design._

### Angular integration

_Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration. Depending on the contributor's needs, implementing Angular integration may be deferred but the initial spec should still document what work will be needed._

### Blazor integration

_Describe the plan for Blazor support. See the [nimble-blazor CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) for details. Depending on the contributor's needs, implementing Blazor integration may be deferred but the initial spec should still document what work will be needed._

### Visual Appearance

_Work with Visual Design to create Figma files and other design assets. Be sure to account for the various component states, including hover, active, etc. as well as validity, and appearance variants._

---

## Implementation

_Important aspects of the planned implementation with careful consideration of web standards and integration._

_Highlight any alternative implementations you considered in each section._

_If you think a section doesn't apply or don't know what to write, please DO NOT delete it. Either mark it "N/A" or leave it blank and the Nimble team can help you fill it in._

### States

_Key component states, valid state transitions, and how interactions trigger a state transition._

### Accessibility

_Consider the accessibility of the component, including:_

-   _Keyboard Navigation and Focus_
-   _Form Input and Autofill_
-   _Use with Assistive Technology. For example:_
    -   _All components should define a role and support labels / being labelled so that assistive technology can identify them_
    -   _The implications shadow dom might have on how roles and attributes are presented in the accessibility tree_
    -   _Components which delegate focus require all global ARIA attributes to be enumerated_
-   _Behavior with browser configurations like "Prefers reduced motion"_

### Mobile

_Consider how the component will behave on mobile devices, including:_

-   _Overflow behavior when screen space is constrained_
-   _Interactions that are affected by touch rather than a pointer device (e.g. hover)_
-   _Integration with common mobile experiences like native pickers, on-screen keyboards, and dictation_

### Globalization

_Consider whether the component has any special globalization needs such as:_

-   _Special RTL handling_
-   _Swapping of internal icons/visuals_
-   _Localization_

### Security

_Are there any security implications surrounding the component?_

### Performance

_Are there any performance pitfalls or challenges with implementing the component?_

### Dependencies

_Will implementing the component require taking on any dependencies?_

-   _3rd party libraries_
-   _Upcoming standards we need to polyfill_
-   _Dependencies on other fast components or utilities_

_Do any of these dependencies bring along an associated timeline?_

### Test Plan

_What is the plan for testing the component, if different from the normal path? Note that the normal plan includes unit tests for basic state/behavior as well as end-to-end tests to validate the specific user stories described above._

### Tooling

_Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?_

### Documentation

_What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?_

---

## Open Issues

_Highlight any open questions for discussion during the spec PR. Before the spec is approved these should typically be resolved with the answers being incorporated in the spec document._
