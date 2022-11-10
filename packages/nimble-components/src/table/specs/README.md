# Nimble Table High Level Design

## Problem Statement

Tables are used widely throughout NI, and are a common component in design systems. Third-party tables currently in use within NI web products have been unsatisfactory on multiple fronts, and so we have found it necessary to introduce a table into the `nimble-components` library.

## Links To Relevant Work Items and Reference Material

- [Nimble Table Issue](https://github.com/ni/nimble/issues/283)
- [Nimble Table Research Issue](https://github.com/ni/nimble/issues/285)
- [Nimble Table Project Page](https://github.com/orgs/ni/projects/11)
- [Nimble Table Research Lucid Board](https://lucid.app/lucidspark/31f2314d-dd8e-46fd-8fc1-6e9f66700bb3/edit?viewport_loc=-6023%2C-26311%2C35411%2C20921%2CloaYwcZLRray4&invitationId=inv_38839ad5-72b2-4975-ab7a-6d8be33c960c)

## Implementation / Design

We have decided to build our table using [TanStack Table](https://tanstack.com/table/v8) as the data model, and create the UI ourselves using typical FAST-based templates. Using TanStack Table provides a lot of lift for the state management/API of the table, including:
- Row selection
- Column sizing/sorting/orderin/pinning
- Grouping
- Expand/collapse
- Hierarchical data

The bulk of the effort, then, comes from creating the expected UI pieces and then hooking them up to the TanStack model, along with the various APIs we need to design for the table component itself.

### Virtualization

In order for the Nimble table to support numbers of rows in the thousands or higher, it's imperative that the DOM representation of the rows is virtualized, meaning only the necessary elements are in the DOM at any given moment.

TanStack offers another library that helps out with this in [TanStack Virtual](https://tanstack.com/virtual/v3). This library essentially provides a means for supplying a set of state (i.e., the scrollable element, number of total rows, size estimate for row, etc...), and returns a set of "virtual items" that provide the state needed to render the appropriate views. Many of our prototype branches demonstate how we leveraged this, such as [`tanstack-virtualized-nimble-table`](https://github.com/ni/nimble/tree/tanstack-virutalized-nimble-table) ([Storybook](https://60e89457a987cf003efc0a5b-haosfwmjoq.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story)).

### Column Customization

Clients require the need to customize the columns for their data. This includes showing values as text, date-time, icons, or hyperlinks (to name just a few), as well as type-specific column configuration like data formatters. Moreover, we want the components used for rendering cell data to be Nimble components when possible.

A declarative API can allow for this, like the following:
```
<nimble-table>
    <nimble-text-field-column columnId="firstName" columnTitle="First Name"></nimble-text-field-column>
    <nimble-text-field-column columnId="lastName" columnTitle="Last Name"></nimble-text-field-column>
    <nimble-number-field-column columnId="age" columnTitle="Age" step="1"></nimble-number-field-column>
</nimble-table>
```

Here, each column element (i.e. `nimble-text-field-column`), is a custom element that gets slotted into a named slot on the `nimble-table`, and would implement a public interface. That interface would provide the method to return the custom content for a particular cell in that column. Something like the following:
```
export interface IColumnProvider {
    getColumnTemplate: () => ViewTemplate<unknown, TableCell>;
    columnId?: string;
    columnTitle?: string;
}
```

This allows us to provide the declarative API for column configuration such that it can be leveraged by any web framework that supports custom elements such as Angular or Blazor, as the column components are just standard web components.



## Alternative Implementations / Designs

### Perspective

[Perspective](https://perspective.finos.org/) is a framework for working with and visualizing table data in a highly performant way. By moving all of the various processing tasks, such as sorting and filtering, into a separate web-worker thread, it allows the UI to remain responsive.

This could ultimately allow the table to handle the visualization of a dataset that could number in the millions of rows, with essentially no loss of performance in the UI.

Additionally, it provided a plugin component system that would allow clients to easily switch between different visualizations over the same data set (i.e. switch between a table and a chart).

The main obstacle with the framework is that it wasn't really built to deal with hierarchical data, but Excel-like data instead, that could

## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*
