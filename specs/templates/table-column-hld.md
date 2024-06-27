# Table Column [Template]

## Overview

_A high-level description of the column._

### Background

-   _Relevant historical or background information_
-   _Link to relevant work items, related existing issues, etc._

### Features

_A list of the key features unique to this component. If adding support for an existing Nimble component's capabilities (e.g. as `nimble-table-column-mapping` does for Nimble icons and `nimble-spinner`), consider which parts of that component's API should be exposed, and whether on a per-column or per-cell basis. Any parts of the API explicitly not supported should be called out below as non-goals._

### Non-goals

_A list of use cases, features, or functionality which are **not** goals for the component._

## Implementation / Design

_Describe interesting implementation/design decisions, with justifications and alternates considered._

_Include code snippets showing basic component use and any interesting configurations._

Typical usage:

```html
<nimble-table>
    <nimble-table-column-*>Column Label</nimble-table-column-*>
</nimble-table>
```

### API

#### Column Element

_Refer to the [table column type philosophy docs](/packages/nimble-components/src/table/specs/table-columns-hld.md#column-type-philosophy) for column creation policies and naming conventions._

_Element Name_

-   `nimble-table-column-*`

_Props/Attrs_

-   `attr-name`: string (defaults to ...) - Description of the property

_Content_

-   column label (icon and/or text)

_Events_

_List any events along with event detail interface(s)._

#### Cell View Element

_Element Name_

-   `nimble-table-column-*-cell-view`

_Rendering_

_Describe what the cell view will render._

#### Group Header View Element

_If an existing group header view element will be used instead of creating a new one:_

    A new element will not be created for the group header view. The column will specify the existing `tableColumnTextGroupHeaderViewTag` as the `groupHeaderViewTag` because the header will contain only text.

_Otherwise:_

_Element Name_

-   `nimble-table-column-*-group-header-view`

_Rendering_

_Describe what the group header view will render._

### Sorting / Grouping

_Will the column be sortable and/or groupable? If so, which `xxx-field-name` attribute will be assigned to `operandDataRecordFieldName`? If sortable, which `TableColumnSortOperation` will be used? Describe any interesting use cases._

### Sizing

_Will the column use a fractional width, fixed width, or both (via `width-mode` attribute)?_

### Placeholder

_What is the behavior of cells and group rows when the value is `undefined` or `null`? Will a `placeholder` be supported to display a specific interpretation for missing values (e.g. showing "Never run" in a date-time column of latest execution times)? Are there additional values (e.g. empty string) for which placeholders or default rendering need to be considered?_

### Delegated Events

_Are there any events emitted by components in cells that a client might be interested in? Because clients cannot easily subscribe to every cell view, such events should be delegated to the column element so that it can emit an equivalent event for clients to subscribe to. Names of delegated events (e.g. `'click'`, `'keydown'`, etc.) should be listed in the `delegatedEvents` property of the column internals options, and the column should set up a listener to handle the `delegated-event` event that emits a new event for clients to listen for._

_Describe here any events that will be delegated (e.g. `click`), the new event name(s) that will be emitted by the column (e.g. `button-click`), and any extra data that will be included in those event details (e.g. `recordId` field). An example follows:_

The `click` event from the button in the cell will be delegated to the column. The column will re-emit these as `button-click` events. The `button-click` event details will include the original event details, plus the `recordId` identifying the row where the click originated:

```ts
interface ButtonColumnClickEventDetail extends PointerEvent {
    recordId: string;
}
```

### Focus Recycling

_Will the cell view need to override `focusedRecycleCallback()` to perform any actions when the cell is recycled while it has focus? Cells are recycled during a virtualized scroll, and `focusedRecycleCallback()` gives columns the opportunity to commit changes and prevent cell view state from being transfered to a different cell. Note that this [may become a moot point](https://github.com/ni/nimble/issues/2202), at which point this section should be removed._

### Interactions

_If the cell will render any interactive elements, indicate which ones will be marked focusable via the cell view's `tabbableChildren`. Confirm that those elements properly forward the `tabIndex` value to shadow DOM elements, or indicate that you will have to update them to do so._

### Test Cases

_List any interesting use cases that should be tested._

### Internationalization

_Will any work be required to handle different locales/languages, e.g. rendering decimal numbers, dates/times, currency, units, etc? Will there be any built-in labels, tooltips, etc. that need to be added to a label-provider?_

### Accessibility

_Describe any work needed to provide proper accessibility._

### Angular Integration

_Will there be any special considerations to use this column in an Angular app? If not:_

An Angular wrapper will be created for the component. There are no special considerations for Angular.

### Blazor Integration

_Will there be any special considerations to use this column in a Blazor app? If not:_

A Blazor wrapper will be created for the component. There are no special considerations needed for Blazor.

## Open Issues
