# Data Hierarchy

## Problem Statement

There are scenarios where clients want to provide collapsible hierarchy to the rows being presented in the table, where both parent and children rows provide values in typically at least a subset of the same columns.

For example, consider a table of geographic information that included location, population, flag, and possibly other location-related information. The location column could be either a continent, country, state, or any sub-regional construct. It would be reasonable to want to present this information in a way that allowed a user to collapse/expand any outer regional grouping, which itself would contain all rows whose locations existed inside it (e.g. 'United States' would be parent of all rows whose location was a U.S. state).

### Lazy Loading

In addition to just supporting data hierarchy with a fully provided set of data, we also need to support the scenario where a row is presented as a parent, but none of its children are currently represented in the data. Upon expanding the row, the client is then expected to load all of the data for that parent and provide it to the table (via the standard `setData` method).

## Links To Relevant Work Items and Reference Material

- [#890: Design for hierarchical data support in tables](https://github.com/ni/nimble/issues/890)
- [#861: Table hierarchical data support](https://github.com/ni/nimble/issues/861)
- [Prototype using flat list that includes a parentId](https://github.com/ni/nimble/tree/data-hierarchy-flat-list-prototype) with [Storybook](https://60e89457a987cf003efc0a5b-qzwoshcidz.chromatic.com/?path=/story/incubating-table--table&args=data:LargeDataSet)
- [Prototype with user data being hierarchical](https://github.com/ni/nimble/tree/data-hierarchy-prototype) with [Storybook](https://60e89457a987cf003efc0a5b-yncupvnoes.chromatic.com/?path=/story/incubating-table--table&args=data:LargeDataSet)


## Implementation / Design

Users will provide hierarchical data as a flat list (just as they do for non-hierarchical data), but will have to include a field in their data that is representative of the "parent Id" for that record of data.

### `Table` API

The `Table` will provide an attribute that allows users to specify what field in the record will serve as the parentId (if set):

```ts
public Table() {
    ...
    @attr({ attribute: 'parent-id-field-name' })
    public parentIdFieldName?: string;

    // This field would be an option for how we allow a user to specify the field
    // name where they will provide a value indicating whether or not that row
    // is a parent row. See the below discussion on lazy-loading.
    @attr({ attribute: 'is-parent-field-name' })
    public isParentFieldName?: string;
}
```

The `Table` will also provide a `row-expand-toggle` event for when a row is expanded/collapsed that will provide details to the client including which row was expanded/collapsed, and what its new state is:

```ts
interface TableRowExpandedEventDetail {
    newState: boolean;
    recordId?: string;
}
```

_Note: This event will _not_ be emitted for group rows._

#### Lazy Loading API Open Question:

What is the right API to allow a user to denote a particular row as a parent row, despite it not having any children represented in the data. Ultimately the table presentation will have to know if a particular row is meant to be a parent, so it can show the expand/collapse button on the row.

Option 1:

Provide a documented convention that users will have to adopt where they provide a field in their record specifying this state (i.e. a field in the data called something like `niTableIsParentRow`).

Pros:
- Does not require client to spoof child rows in order for parent rows to show as a parent in the table
- Allows the table to maintain its expected data shape of a flat list

Cons:
- It's a convention-based API, and thus less discoverable
- Allows a user to improperly denote a row as a parent even though it will never have children in practice.

Option 2:

Document the strategy currently employed in SLE where the user provides dummy rows "under" the parent, so that the table knows to display the expand/collapse button, and then the user is expected to respond to the expand event to replace the dummy data with the appropriate child data.

Pros:
- No additional APIs needed either by convention, or explicitly on the `Table` API surface

Cons:
- Still not very discoverable
- Requires user to jump through a bit of hoops to get lazy loading to work (maybe this is a reasonable concession in the face of not having to provide a convention-based API).

Option 3:

Make the datatype of data provided to the `Table` support hierarchy.

Pros:
- Does not require client to spoof child rows in order for parent rows to show as a parent in the table.

Cons:
- No clear way to type `TableRecord` in a strong way that supports having a field whose type is an array of `TableRecord`. This could mean that this is also a convention-based API and thus no different than Option 1. Prototyping suggests that their is no noticeable performance distinction between the two options as well.
- Could result in more data manipulation on the client-side to organize it in the expected way

Other?

### Translating flat list to Tanstack-understandable hierarchy

Tanstack provides APIs for us to implement that allow it to return the rows in a hierarchical fashion where child rows are provided as a property on a row called `subRows`. For this to work as expected it is required that a flat list of data (that contains implicit hierarchy) be transformed into a hierarchical data structure.

A third party library called [`performant-array-to-tree`](https://www.npmjs.com/package/performant-array-to-tree) offers an easy, and as the package says, performant means of doing this (in O(n) time). This utility was leveraged in the  [`data-hierarchy-flat-list-prototype`](https://github.com/ni/nimble/tree/data-hierarchy-flat-list-prototype) branch. It comes with an MIT license, and is apparently fully tested, so it seems like it would be suitable to use for this purpose.

### Managing expanded state

Currently, the `Table` defaults to expanding all rows by setting its Tanstack expanded state to the singleton `true`. This means that all group rows will be expanded by default. The Nimble `Table` also provides an implementation of `getIsRowExpanded` which is consumed by `TanStack` that will ultimately result in the per-row state of whether the row is expanded. It is in this implementation, where even if the Tanstack state is set to `true`, we can mark all parent rows, by default, as collapsed, which is required for the lazy-loading scenario.

This is achievable because the Nimble `Table` currently tracks when particular rows are collapsed by their row id, which both group and parent rows have. When the Tanstack state has the singleton value of `true` we know we are in a default expand/collapsed state (meaning the user hasn't interactively changed anything), as otherwise it will be a set of id values matched with a boolean state. This will allow us to implement a behavior in `getIsRowExpanded` that will denote group rows as expanded, but parent rows as collapsed, specifically when the TanStack expanded state is set to `true`.

Once _any_ row has been expanded or collapsed, we must update the Nimble `Table` state where we track collapsed rows with _all_ rows that are currently collapsed. This will be a one-time cost. Prototyping suggests that the performance penalty isn't that noticeable.

### Showing a progress indicator for lazy loading

After a user clicks on a parent row to expand it, and that parent does not have children yet, there could be a noticeable delay between when the user clicked the expand button, and when the children show up in the table. This could happen for a variety of reasons, but commonly might occur due to a slow network request.

It would be helpful for the `Table` to visually represent the state that it is currently waiting on data to be loaded from the client. It can accomplish this fairly easily using existing state with no additional APIs or new components (see [prototype code](https://github.com/ni/nimble/commit/27c92c42f81076c0906e143808a3120962c660e9)).

This ultimately may put the burden on the client to ensure that the `Table` is updated as needed to get rid of any displayed progress indicator, including in scenarios where the expansion of a parent row failed to load any children (possibly due to some client-side error). The `Table` may only guarantee that the progress indicator is shown when a parent row is expanded and it currently has no children, and that it will be removed once children are present.

### ARIA guidance

A parent row would have the same ARIA expectations of any child row, with the additional need to supply the `aria-expanded` attribute when it was expanded.

## Alternative Implementations / Designs

### `TableRecord` hierarchical data structure

By making the `TableRecord` support hierarchy in its structure, it seemed possible that there would have been a performance benefit, as there would be no need to reformat the data internally for Tanstack to consume it properly. However, I believe we can discard this options for the following reasons:

- There is no clear way to provide a strong type for `TableRecord` that would have a reserved field name of something like `subRows` that itself would be typed to an array of `TableRecord`.
- The performance profile between the prototypes of a hierarchical data structure, and a flat list were pretty close with one another.

## Open Issues

See lazy loading open question above.