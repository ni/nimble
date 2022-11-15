# Nimble Table

## Overview

The `nimble-table` is a component that offers a way to render tabular data in a variety of ways in each column. 

### Background

[Nimble issue #283](https://github.com/ni/nimble/issues/283)

[Nimble Table Research Document](https://lucid.app/lucidspark/31f2314d-dd8e-46fd-8fc1-6e9f66700bb3/edit?viewport_loc=-1060%2C-25492%2C20822%2C12325%2CloaYwcZLRray4&invitationId=inv_38839ad5-72b2-4975-ab7a-6d8be33c960c)

[Table visual design](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b9cee5e2-49a4-425a-9ed4-38b23ba2e313/)

### Non-goals

The `nimble-table` will not offer spreadsheet-like features such as infinite columns, or summary functions.

Additionally, we do not intend for the `nimble-table` to handle data sets of 50K or more on the client-side. Visualizing such sizes of data sets are meant to be enabled through various "data virtualiazation" means, such as the server only sending over subsets of the data at a time, appropriately filtered down to a reasonable size.
  
### Features

 In addition to simply rendering data, the `nimble-table` will provide APIs/interactions that will allow a user to do the following:
- Interactively and programmatically size columns
- Interactively and programmatically sort columns
- Pin columns
- Provide column ordering (programmatically only at first possibly)
- Group rows
- Interactively and programmatically multi-select rows
- Provide hierarchy via the data
- Provide custom column rendering

#### *Action Menus*

Users will be able to provide action menus that will be able to appear within any column.

#### *Performance*

We intend for the `nimble-table` to handle both the rendering and interactive operations, such as sorting, in a near-instantaneous fashion on datasets of at least 10K rows. Between 10K and 100K rows of data on the client-side, however, we expect to see a notable drop in performance.

Clients, at least initially, will be expected to create mechanisms to restrict the amount of data coming to the client-side.

#### *Out of Scope of Initial Release*

The following are features that we intend to prioritize eventually after the initial release:
- Hierarchy and Grouping together
- Custom expanded row content
    - An example would be showing a sub-tree when you expand a row
- Editable cells
- APIs around pagination/infinite scrolling
- High-level configuration APIs
    - Allow for easy getting/setting of total configurable state, which is useful for maintaining state of the table as a user navigates to other pages in an app.
- Filter on any text match across all cells
- Selection configuration.

### Accessibility

The table will provide the necessary means for keyboard interactions and navigation through the cells, as well as expected ARIA labels/roles for the various elements.

### Risks and Challenges

We will be leveraging a couple of third-party libraries, namely [TanStack Table](https://tanstack.com/table/v8) and [TanStack Virtual](https://tanstack.com/virtual/v3), to manage much of the complexity surrounding the table implementation. This presents risk in the form of being able to quickly address any issues that arise. However, these libraries are active and eagerly support outside contribution, so we should be able to contribute as needed.

The other primary risk is simply scope. This is a large, complex component, which can easily grow beyond our initial expectations, due to a variety of unforseen elements, such as missed important features, or misunderstood complexities.

### Prior Art/Examples

SLE Table
![SLE table](./spec-images/sleTable.png)

---

## Design

A user will be able to configure a `nimble-table` component fairly thoroughly through its markup. Including the columns to visualize, how to visualize a column, and in what order. A sketch of the markup should be similar to the following (in Angular):
```html
<nimble-table data="data">
    <nimble-text-field-column slot="columns" columnId="firstName"></nimble-text-field-column>
    <nimble-text-field-column slot="columns" columnId="lastName"></nimble-text-field-column>
    <nimble-text-field-column slot="columns" columnId="profession"></nimble-text-field-column>
    <nimble-menu slot="actionMenu">
        <nimble-menu-item>Item 1</nimble-menu-item>
        <nimble-menu-item>Item 2</nimble-menu-item>
    </nimble-menu>
</nimble-table>
```

Here the `data` property might look something like this:

```
@Input() public data = [
    { firstName: 'Bob', lastName: 'Smith', profession: 'Ostrich wrangler', age: '10'},
    { firstName: 'Sally', lastName: 'Lu', profession: 'Mustache artist', age: '31'},
    { firstName: 'Jim', lastName: 'Beam', profession: 'Beverage enthusiast', age: '21'} ];
```

### API

_Component Name_

`nimble-table`

_Feature APIs_

The various APIs of the `nimble-table` will be split up amongst several different HLD documents. This section will serve to list them out and link to them as they become available:

- [Data API](./table-data-api.md)
- Row Selection API
- Column Definition API
- Grouping API
- Accessibility
- Action Menu

### Anatomy 

*Outline the component structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

*Work closely with the visual design partner to co-develop the API and anatomy along side the visual design.*

### Angular integration 

*Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration.*

### Blazor integration 

*Describe the plan for Blazor support. See the [nimble-blazor CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) for details.*

### Visual Appearance

*Work with Visual Design to create Adobe XD files and other design assets. Be sure to account for the various component states, including hover, active, etc. as well as validity, and appearance variants. Focus primarily on the officially supported design system as well as known community scenarios as appropriate. Consider other popular design systems during this process and, where possible, ensure that common design features that may not be part of the officially supported design system can be accommodated. Work closely with engineering to co-develop the visual design along side the API and anatomy.*

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

*Highlight any alternative implementations you considered in each section.*

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
- *Form Input*
- *Use with Assistive Technology*
  - e.g. The implications shadow dom might have on how roles and attributes are presented to the AT. Components which delegate focus require all global aria-* attributes to be enumerated.

### Globalization

*Consider whether the component has any special globalization needs such as:*

- *Special RTL handling*
- *Swapping of internal icons/visuals*
- *Localization*

### Security

*Are there any security implications surrounding the component?*

### Performance

*Are there any performance pitfalls or challenges with implementing the component?*

### Dependencies

*Will implementing the component require taking on any dependencies?*

- *3rd party libraries*
- *Upcoming standards we need to polyfill*
- *Dependencies on other fast components or utilities*

*Do any of these dependencies bring along an associated timeline?*

### Test Plan

*What is the plan for testing the component, if different from the normal path? Note that the normal plan includes unit tests for basic state/behavior as well as end-to-end tests to validate the specific user stories described above.*

### Tooling

*Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---
## Open Issues

*Highlight any open questions for discussion during the spec PR. Before the spec is approved these should typically be resolved with the answers being incorporated in the spec document.*