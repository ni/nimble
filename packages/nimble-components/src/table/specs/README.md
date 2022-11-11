# Nimble Table High Level Design

## Problem Statement

Tables are used widely throughout NI, and are a common component in design systems. Third-party tables currently in use within NI web products have been unsatisfactory on multiple fronts, and so we have found it necessary to introduce a table into the `nimble-components` library.

## Links To Relevant Work Items and Reference Material

-   [Nimble Table Issue](https://github.com/ni/nimble/issues/283)
-   [Nimble Table Research Issue](https://github.com/ni/nimble/issues/285)
-   [Nimble Table Project Page](https://github.com/orgs/ni/projects/11)
-   [Nimble Table Research Lucid Board](https://lucid.app/lucidspark/31f2314d-dd8e-46fd-8fc1-6e9f66700bb3/edit?viewport_loc=-6023%2C-26311%2C35411%2C20921%2CloaYwcZLRray4&invitationId=inv_38839ad5-72b2-4975-ab7a-6d8be33c960c)

## Implementation / Design

We have decided to build our table using [TanStack Table](https://tanstack.com/table/v8) as the data model, and create the UI ourselves using typical FAST-based templates. Using TanStack Table provides a lot of lift for the state management/API of the table, including:

-   Row selection
-   Column sizing/sorting/ordering/pinning
-   Grouping
-   Expand/collapse
-   Hierarchical data

The bulk of the effort, then, comes from creating the expected UI pieces and then hooking them up to the TanStack model, along with the various APIs we need to design for the table component itself.

### Virtualization

In order for the Nimble table to support numbers of rows in the thousands or higher, it's imperative that the DOM representation of the rows is virtualized, meaning only the necessary elements are in the DOM at any given moment.

TanStack offers another library that helps out with this in [TanStack Virtual](https://tanstack.com/virtual/v3). This library essentially provides a means for supplying a set of state (i.e., the scrollable element, number of total rows, size estimate for row, etc...), and returns a set of "virtual items" that provide the state needed to render the appropriate views. Many of our prototype branches demonstate how we leveraged this, such as [`tanstack-virtualized-nimble-table`](https://github.com/ni/nimble/tree/tanstack-virutalized-nimble-table) ([Storybook](https://60e89457a987cf003efc0a5b-haosfwmjoq.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story)).

## Alternative Implementations / Designs

### Perspective

[Perspective](https://perspective.finos.org/) is a framework for working with and visualizing table data in a highly performant way. By moving all of the various processing tasks, such as sorting and filtering, into a separate web-worker thread, it allows the UI to remain responsive.

Pros

-   Architecture allows visualization to work with a dataset in the millions of rows without performance impact.
-   Plugin system allowing for the creation of various views that can be swapped out to visualize the underlying data.
-   Well tested

Cons

-   Lack of support for hierarchical data
    -   We could support hierarchical data by writing custom state management logic in the table component itself for features like grouping, sorting, and row selection. Some of which negates the performance benefits we would otherwise see for free.
-   Higher cost to implement a solution for, and more code to test/maintain.

Ultimately we decided against using Perspective as one of its most appealing traits, its performance, would in many situations be neutralized by the implementation needed to support use cases like hierarchical data.

### Tabulator

[Tabulator](https://tabulator.info/) is a full-fledged table web component, offering a wide range of features that are well aligned with our needs.

Pros

-   Extensive feature set
-   Good documentation/examples

Cons

-   Virtualization doesn't meet our requirements
-   Not Typescript-based
-   Would need to fork such that we could make the necessary changes for it to meet our performance requirements
-   Zero tests
-   Styling could prove problematic
-   Lack of complete control over DOM introduces risk, or at the very least limits what the designers can ask for

The cost and risk of changing Tabulator such that we could virtualize the rendering in an acceptable way was enough for us to remove it from consideration.
