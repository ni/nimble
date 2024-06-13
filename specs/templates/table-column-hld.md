# Table Column [Template]

## Overview

*A high-level description of the column.*

### Background

- *Relevant historical or background information*
- *Link to relevant work items, related existing issues, etc.*

### Features

*A list of the key features unique to this component.*

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component.*

## Implementation / Design

*Describe interesting implementation/design decisions, with justifications and alternates considered.*

*Include code snippets showing basic component use and any interesting configurations.*

Typical usage:

```html
<nimble-table>
    <nimble-table-column-*>
        Column Label
    </nimble-table-column-*>
</nimble-table>
```

### API

#### Column Element

_Element Name_

-   `nimble-table-column-*`

_Props/Attrs_

-   `attr-name`: string (defaults to ...) - Description of the property

_Content_

-   column label (icon and/or text)

_Events_

*List any events along with event detail interface(s).*

#### Cell View Element

_Element Name_

-   `nimble-table-column-*-cell-view`

_Rendering_

*Describe what the cell view will render.*

#### Group Header View Element

*If an existing group header view element will be used instead of creating a new one:*

    A new element will not be created for the group header view. The column will specify the existing `tableColumnTextGroupHeaderViewTag` as the `groupHeaderViewTag` because the header will contain only text.

*Otherwise:*

_Element Name_

-   `nimble-table-column-*-group-header-view`

_Rendering_

*Describe what the group header view will render.*

### Sorting

*Will the column be sortable? Which `TableColumnSortOperation` will be used? Describe any interesting use cases.* 

### Grouping

*Will the column be groupable? Describe any interesting use cases.*

### Sizing

*Will the column use a fractional width, fixed width, or both (via `width-mode` attribute)?*

### Placeholder

*Will the column support a `placeholder` for `undefined` and `null` values? Will the group header view display the standard strings for `undefined` and `null` values, or will there be something unique?*

### Delegated Events

*Will the cells delegate any events to the column element?*

### Focus Recycling

*Will the cell view need to override `focusedRecycleCallback()` to perform any actions when the cell is recycled while it has focus? If so, explain.*

### Interactions

*Will the cell render any interactive elements? You must override `tabbableChildren` on the cell view to return any focusable children. These elements must be initially configured with `tabindex=-1`, and the table will programmatically update `tabIndex` as needed. Make sure that any such elements properly forward the `tabIndex` value to shadow DOM elements.*

### Test Cases

*List any interesting use cases that should be tested.*

### Internationalization

*Will any work be required to handle different locales/languages, e.g. rendering decimal numbers, dates/times, currency, units, etc? Will there be any built-in labels, tooltips, etc. that need to be added to a label-provider?*

### Accessibility

*Describe any work needed to provide proper accessibility.*

### Angular Integration

*Will there be any special considerations to use this column in an Angular app? If not:*

An Angular wrapper will be created for the component. There are no special considerations for Angular.

### Blazor Integration

*Will there be any special considerations to use this column in a Blazor app? If not:*

A Blazor wrapper will be created for the component. There are no special considerations needed for Blazor.

## Open Issues
