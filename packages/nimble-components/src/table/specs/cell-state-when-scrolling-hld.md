# Nimble Table: Handling Cell State when Scrolling

## Problem Statement

Since the Nimble Table uses virtualization, if the table contains more rows than can be shown in the current table viewport, we will re-use the DOM elements / controls within the table cells as the user scrolls through the table. This is handled by the TanStack virtualizer determining what row indexes are visible at the current scroll position, and then we re-bind the table cell views to the new cell state (including the row data). We need to ensure that cell state isn't incorrectly preserved/ applied to the cells once they represent different row values.

Some of the cell state that would incorrectly apply to new rows (once the user scrolls) is:
- Selected text (which can span multiple rows), for both editable and non-editable cells
- Text cursor position (for editable controls in table cells)
- Pending input (for editable controls in table cells)
- Open popups (action menu or select/combobox cells whose popup is open)

## Links To Relevant Work Items and Reference Material

[#997: Table virtualization: Clear/Commit (and potentially save/restore) row/cell state when scrolling](https://github.com/ni/nimble/issues/997)

## Implementation / Design

When the user scrolls the table, we will:
- Clear text selection (in the table)
- 'Blur' (Lose focus) from any active/focused control in a table cell. Generally this means that whatever text the user began to change in that control will be committed, not discarded. In the case of a focused menu item, we'll close the associated menu via the menu button.

Currently we do not have any plans to try and re-apply that state to the re-bound rows/cells after the scroll. That means that we won't reselect the text / re-focus the previously focused control in a cell / re-open an action menu, after a scroll operation.

### Clearing Text Selection

**Background Info:**  
Note: Selecting text in the table seems buggy (in different ways in different browsers) currently. We may need to investigate it more in the future if we expect it to be a common use case. This is probably due to our use of Shadow DOM.  
Current behavior:
- Chrome: Doubleclicking cell text selects the text of the 1st cell in that row (which may not be what you clicked). You can select a full row's text (or multiple rows) if you drag-select from outside the table bounds. You can select multiple rows' text normally (drag across multiple rows within the table bounds).
- Firefox: You can only select a single cell or column header's text. Once you cross into another cell/column the selection gets cleared. The selection also resets if you start text selection from outside the table, then move your cursor within the table to try to select more text there.
- Safari: Similar to Chrome, except that doubleclicking cell text does not select it, and it's difficult/ nearly impossible to select a single cell's text (multi-row selections are easier).

The DOM API for text selection is [`window.getSelection()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection), but unfortunately the text selection APIs are incomplete / inconsistent across browsers, once you're using them on DOM elements that use Shadow DOM ([StackOverflow reference](https://stackoverflow.com/a/70523247)). In the future there may be a `getComposedRange()` API added that works better with Shadow DOM, however it's not yet finalized and is not yet in any browsers ([webcomponents#79](https://github.com/WICG/webcomponents/issues/79), [getComposedRange() draft proposal](https://w3c.github.io/selection-api/#dom-selection-getcomposedrange), [feedback thread for proposal](https://github.com/w3c/selection-api/issues/161)).  
Note: The specific problem is detecting whether the active text selection is (wholly or partially) within the table. Clearing the text selection, once we decide we want to, is always straightforward (`window.getSelection()?.removeAllRanges()`, `window.getSelection().removeRange(range)`).

There's several potential approaches to detecting if the table contains selected text, but none of them work in all cases / across all browsers. Given a [`Range` instance](https://developer.mozilla.org/en-US/docs/Web/API/Range) (`window.getSelection().getRangeAt(n)`):
- Check if `range.startContainer`/`range.endContainer` is the `nimble-table` (or a descendant)
  - Chrome: This will be `nimble-table` if the text selection includes text before or after the table, plus some text in the table. If the selection is only in the table, these properties will misleadingly give us an ancestor of the table (like `nimble-theme-provider`).
  - Firefox: If text is selected in the table, this is a `#text` node within the Shadow DOM of a cell. It's possible to look for the `nimble-table` as an ancestor via "`node.getRootNode()` + check if `ShadowRoot` + if so, continue/repeat from `shadowRoot.host`".
  - Safari: These are generally incorrect values, such as the ancestor `nimble-theme-provider`, or sometimes `startContainer` = `endContainer` = (a `#text` node from a single cell). Additionally when a text selection starts in the table and ends with text after+outside the table, `startContainer` = `endContainer` = (a `#text` node from outside the table), in which case these properties don't tell us anything about the text selection in the table.
- Check if `range.getBoundingClientRect()` intersects with `table.viewport.getBoundingClientRect()`
  - Chrome/Safari: If the text selection is within the table only, the rect is `0x0` (unusable). If the text selection is partially in table and partially not, the rect will only include the part of the selection not in the table (assuming that part isn't in shadow DOM) (also unusable).
  - Firefox: Rect looks to be correct for all of the selection variants (within the table, and crossing the table's bounds)
- Compare start/end points against a `Range` with the table fully selected (`tableRange = new Range(); tableRange.selectNode(table)`) via `range.compareBoundaryPoints(Range.START_TO_START, tableRange)` and `range.compareBoundaryPoints(Range.END_TO_END, tableRange)`
    - Chrome/Safari: Works when the text selection is fully within the table
    - Chrome: Works when the text selection is partially in the table, partially outside the table
    - Safari: Doesn't work when the text selection is partially in the table, partially outside the table. In that case, the `compareBoundaryPoints` results match what we'd get if the text selection was only before / only after the table (unusable).
    - Firefox: Errors out with a `WrongDocumentError` (i.e. one range is in a shadow root, and the other isn't / is in a different shadow root)
- (Chrome only) Look at `table.shadowRoot.getSelection()`. If non-null and `rangeCount > 0` we have selected text somewhere in the table. Simplest approach, but this API is non-standard / not in the other browsers / may be removed at any time in the future.

**Implementation Plan:**  
Based on the observations above, the current plan to check if the table contains selected text is:  
Get `window.getSelection()`. If null or `rangeCount === 0`, no text is selected. Otherwise, for each `Range`:
- Check if `startContainer`/`endContainer` is the `nimble-table`
- Else, do the `compareBoundaryPoints` check (in a `try/catch`)
- Else, check if `startContainer`/`endContainer` has the `nimble-table` as an ancestor

If any of those `Range` checks succeed, remove that `Range` from the selection.  
**Limitations:**  
  - If text is selected in the table but outside rows (e.g. column header text), it will also be cleared when the user scrolls. There's not a good way to differentiate the text location that works in each browser, so that seems like an acceptable compromise.
  - (Safari only) If text selection is partially in the table and partially before/ after it, there isn't any way for us to detect that case. So Safari will still have text incorrectly selected after the scroll in that case.

**Planned API:**  
This logic will be in the Nimble Virtualizer class, called from `handleVirtualizerChange()` (called when the user scrolls). It will apply to all Nimble tables / all column types, without an opt-out option.

### Blur Focused Controls in Cells

**Implementation Plan:**  
Logic to find if the table contains an active/focused element within a cell:  
Start with `document.activeElement`. If non-null, check if that element is a shadow root. If so, continue recursively with `shadowRoot.activeElement`. Stop when we reach a `nimble-table-cell` or `null`.

If we have a focused cell:
- If the cell has an action menu (note: in this case the focused element will be a `nimble-menu-item`), find the associated `nimble-menu-button`. If open, set `open` to `false`.
- Get the `TableColumn` instance for the column that the cell is in, and call the new API `onBeforeFocusedCellRecycled(cell: TableCell)` on it (if defined).
  - General expected implementation, for a column type with editable controls in their `cellTemplate` would be to find the editable control with `querySelector()`, and close/commit it. i.e. `blur()` for `nimble-text-field`/`nimble-text-area`/`nimble-number-field` or other input controls, `open = false` for `nimble-menu-button`/`nimble-combobox`/etc.

**Planned API:**  
New optional abstract method `onBeforeFocusedCellRecycled(cell: TableCell)` on the `TableColumn` abstract class.  
New logic in Nimble Virtualizer class, `handleVirtualizerChange()` (called when the user scrolls), to find the active/focused cell.  
`TableCell` doesn't have a direct reference to `TableColumn` so we'll need to determine the best way to get that reference (to call `onBeforeFocusedCellRecycled`). Perhaps `TableCell` also has an `onBeforeRecycled` function that raises an event that `TableRow` can handle (which does have that mapping, via `row.columnStates`).

## Alternative Implementations / Designs

N/A

## Open Issues

- (Need to finalize API details surrounding the `onBeforeFocusedCellRecycled` proposal)
- Do we need to provide additional APIs to allow for saving off cell state at the beginning of a scroll, even if no control is focused? (This would imply something we need to call for every visible cell in a column)
- Should we have a default, generic implementation of `onBeforeFocusedCellRecycled`? (It would look for known Nimble control types in the cell, and call the appropriate API on them, `blur()` or `open = false`)