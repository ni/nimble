# Nimble Table: Handling Cell State when Scrolling

## Problem Statement

Since the Nimble Table uses virtualization, if the table contains more rows than can be shown in the current table viewport, we will re-use the DOM elements / controls within the table cells as the user scrolls through the table. This is handled by the TanStack virtualizer determining what row indexes are visible at the current scroll position, and then we re-bind the table cell views to the new cell state (including the row data). We need to ensure that cell state isn't incorrectly preserved/ applied to the cells once they represent different row values.

Some of the cell state that would incorrectly apply to new rows (once the user scrolls) is:

-   Selected text (which can span multiple rows), for both editable and non-editable cells
-   Text cursor position (for editable controls in table cells)
-   Pending input (for editable controls in table cells)
-   Open popups (action menu or select/combobox cells whose popup is open)

## Links To Relevant Work Items and Reference Material

[#997: Table virtualization: Clear/Commit (and potentially save/restore) row/cell state when scrolling](https://github.com/ni/nimble/issues/997)

## Implementation / Design

When the user scrolls the table, we will:

-   If a table cell contains an active/focused control, we will notify the column plugin that the cell is being blurred/recycled via a new API. The general expectation is that editable controls will commit any pending updates, then blur the focused the control.
-   If a cell action menu is open (in which case a menu item is focused), we'll close the associated menu via the menu button.

We will not:

-   Detect and deselect selected table text on scroll. This means that if table text is selected and the user scrolls, text will still be selected (potentially different text). We don't consider that to be a primary table interaction, and it shouldn't harm functionality (it's easy to resolve for the user by clicking off to deselect text). It's also the same behavior as the current `sl-grid`/`smart-table` used in SystemLink Enterprise.
    -   See the "Alternative Implementations" section for additional information on this decision.
-   Try and re-apply any state to the re-bound rows/cells after the scroll. That means that we won't re-focus the previously focused control in a cell / re-open an action menu, after a scroll operation.

**Prototype:**  
See [the prototype branch](https://github.com/ni/nimble/compare/main...table-cell-state-custom-elements-1) and the [prototype table Storybook](https://60e89457a987cf003efc0a5b-azrrwyldta.chromatic.com/?path=/story/table--table&args=data:LargeDataSet) to illustrate the concepts discussed in the following sections.  
As we don't yet support editable column types, the prototype Storybook updates the Last Name column to show text which can be focused by clicking on it. After clicking a Last Name cell value, you'll see the text get a green border as its focused styling. Once you scroll the table vertically, the green border goes away, and you'll see a `console.log` indicating that the new cell blur API was used.

### Blur Focused Controls in Cells

In this case, `document.activeElement` will be the Nimble `Table`, and `table.shadowRoot.activeElement` will be a Nimble `TableRow`. We can recursively look at the active element's `shadowRoot.activeElement`, starting from the TableRow, and stop when we reach a `BaseCellElement` (the custom element in table cells implemented by column plugin authors) or `null` (see [prototype](https://github.com/ni/nimble/compare/main...table-cell-state-custom-elements-1#diff-e2bfd4eda0a3c89f54b4e09624e6cfd5a68ea2f14c0e79f717eacce38ec5982bR124)).

If we found a focused `BaseCellElement`, then we will call the new API `onBeforeBlur()` on it.  
(Prototype: [BaseCellElement API](https://github.com/ni/nimble/compare/%40ni/nimble-components_v18.6.1...table-cell-state-custom-elements-1#diff-e307bbd379116ba5f5690332122a16b1fe392878b3899cbe487f98672766dcedR25), [calling onBeforeBlur() from virtualizer code](https://github.com/ni/nimble/compare/%40ni/nimble-components_v18.6.1...table-cell-state-custom-elements-1#diff-e2bfd4eda0a3c89f54b4e09624e6cfd5a68ea2f14c0e79f717eacce38ec5982bR130))  
Column plugins, in their derived versions of `BaseCellElement`, should generally override `onBeforeBlur()` if they have a focusable control - they can commit changes, and then blur the focusable control.
([Prototype:](https://github.com/ni/nimble/compare/%40ni/nimble-components_v18.6.1...table-cell-state-custom-elements-1#diff-d1db6a67f7353782eeb2c4769380687c9c1e70261dd7fb43960efe293cf04d97R22) A simplified column implementation that shows focusable text, and blurs it in the `onBeforeBlur` method.)

### Close Focused Action Menus

The table will handle this internally (in the `Virtualizer` class, via `handleVirtualizerChange()`), without affecting the TableColumn public API.

We want to close the action menu via the associated `MenuButton`, which allows the rest of the table logic dealing with action menus to get called normally.
In this case, `table.shadowRoot.activeElement` will be null (since the action menus are slotted in), but `document.activeElement` will be a Nimble `MenuItem`. (We can also doublecheck that `table.contains(document.activeElement)` before proceeding.)  
We have a few options:

-   We can use `table.openActionMenuRecordId` to find the row with an open action menu (via `querySelector` as one option). `tableRow.currentActionMenuColumn` gives us the `TableColumn` with an open menu but no direct way to get to the associated cell (we may need to look at all cells in the row, and find the one with `cell.menuOpen` being `true).
-   From the MenuItem, we can walk up the `parentElement` hierarchy to get to the Nimble `Menu`. Then we can walk up the `assignedSlot` hierarchy until we get to the TableCell action menu slot (in which case `slot.parentElement` is a Nimble `TableCell`).

Once we have a `TableCell`, we can get the `MenuButton` for the cell, and call `open = false` on it.

(See [prototype implementation](https://github.com/ni/nimble/compare/%40ni/nimble-components_v18.6.1...table-cell-state-custom-elements-1#diff-e2bfd4eda0a3c89f54b4e09624e6cfd5a68ea2f14c0e79f717eacce38ec5982bR132))

## Alternative Implementations / Designs

### Clearing Text Selection

**Background Info:**  
The DOM API for text selection is [`window.getSelection()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection), but unfortunately the text selection APIs are incomplete / inconsistent across browsers, once you're using them on DOM elements that use Shadow DOM ([StackOverflow reference](https://stackoverflow.com/a/70523247)). In the future there may be a `getComposedRange()` API added that works better with Shadow DOM, however it's not yet finalized and is not yet in any browsers ([webcomponents#79](https://github.com/WICG/webcomponents/issues/79), [getComposedRange() draft proposal](https://w3c.github.io/selection-api/#dom-selection-getcomposedrange), [feedback thread for proposal](https://github.com/w3c/selection-api/issues/161)).  
Note: The specific problem is detecting whether the active text selection is (wholly or partially) within the table. Clearing the text selection, once we decide we want to, is always straightforward (`window.getSelection()?.removeAllRanges()`, `window.getSelection().removeRange(range)`).

There's several potential approaches to detecting if the table contains selected text, but none of them work in all cases / across all browsers. Given a [`Range` instance](https://developer.mozilla.org/en-US/docs/Web/API/Range) (`window.getSelection().getRangeAt(n)`):

-   Check if `range.startContainer`/`range.endContainer` is the `nimble-table` (or a descendant)
    -   Chrome: This will be `nimble-table` if the text selection includes text before or after the table, plus some text in the table. If the selection is only in the table, these properties will misleadingly give us an ancestor of the table (like `nimble-theme-provider`).
    -   Firefox: If text is selected in the table, this is a `#text` node within the Shadow DOM of a cell. It's possible to look for the `nimble-table` as an ancestor via "`node.getRootNode()` + check if `ShadowRoot` + if so, continue/repeat from `shadowRoot.host`".
    -   Safari: These are generally incorrect values, such as the ancestor `nimble-theme-provider`, or sometimes `startContainer` = `endContainer` = (a `#text` node from a single cell). Additionally when a text selection starts in the table and ends with text after+outside the table, `startContainer` = `endContainer` = (a `#text` node from outside the table), in which case these properties don't tell us anything about the text selection in the table.
-   Check if `range.getBoundingClientRect()` intersects with `table.viewport.getBoundingClientRect()`
    -   Chrome/Safari: If the text selection is within the table only, the rect is `0x0` (unusable). If the text selection is partially in table and partially not, the rect will only include the part of the selection not in the table (assuming that part isn't in shadow DOM) (also unusable).
    -   Firefox: Rect looks to be correct for all of the selection variants (within the table, and crossing the table's bounds)
-   Compare start/end points against a `Range` with the table fully selected (`tableRange = new Range(); tableRange.selectNode(table)`) via `range.compareBoundaryPoints(Range.START_TO_START, tableRange)` and `range.compareBoundaryPoints(Range.END_TO_END, tableRange)`
    -   Chrome/Safari: Works when the text selection is fully within the table
    -   Chrome: Works when the text selection is partially in the table, partially outside the table
    -   Safari: Doesn't work when the text selection is partially in the table, partially outside the table. In that case, the `compareBoundaryPoints` results match what we'd get if the text selection was only before / only after the table (unusable).
    -   Firefox: Errors out with a `WrongDocumentError` (i.e. one range is in a shadow root, and the other isn't / is in a different shadow root)
-   (Chrome only) Look at `table.shadowRoot.getSelection()`. If non-null and `rangeCount > 0` we have selected text somewhere in the table. Simplest approach, but this API is non-standard / not in the other browsers / may be removed at any time in the future.

**Note / Behavior limitation in Firefox**: You can only select a single cell's text. Once you cross into another cell/column the selection gets cleared. The selection also resets if you start text selection from outside the table, then move your cursor within the table viewport (to the rows/cells) to try to select more text there. There doesn't seem to be anything for us to do about this, it's probably related to the table's use of Shadow DOM.

**Possible Implementation Plan: Detecting Table Text Selection**

To check if the table contains selected text:  
Get `window.getSelection()`. If null or `rangeCount === 0`, no text is selected. Otherwise, for each `Range`:

-   Check if `startContainer`/`endContainer` is the `nimble-table`
-   Else, do the `compareBoundaryPoints` check (in a `try/catch`)
-   Else, check if `startContainer`/`endContainer` has the `nimble-table` as an ancestor

If any of those `Range` checks succeed, remove that `Range` from the selection.  
_Limitations:_

-   If text is selected in the table but outside rows (e.g. column header text), it will also be cleared when the user scrolls. (There's not a good way to differentiate the text location that works in each browser.)
-   (Safari only) If text selection is partially in the table and partially before/ after it, there isn't any way for us to detect that case. So Safari will still have text incorrectly selected after the scroll in that case.

_API:_  
This logic will be in the Nimble Virtualizer class, called from `handleVirtualizerChange()` (called when the user scrolls). It will apply to all Nimble tables / all column types, without an opt-out option.

**Conclusion**: Since the code required to detect table selection is problematic (`try/catch`) and complex, doesn't work fully in Safari, and is potentially fragile, we currently don't plan to try and detect table text selection.

### Disabling Table Text Selection

We could add CSS to our table text cells (`user-select: none`) to prevent text selection. This would also eliminate the concern about text selection remaining after a scroll.

We decided against this because there's valid use cases for copying text out of a table cell, and the selection+scrolling issue doesn't seem like a sufficient reason to disable selection entirely.

## Open Issues

-   Decide between API Option 1 and Option 2 for blur-ing focused cell controls.
-   Should we have a default, generic implementation of `onBeforeFocusedCellRecycled`? (It would look for known Nimble control types in the cell, and call the appropriate API on them, `blur()` or `open = false`)
    -   Current we **do not** plan to have a default implementation. We think it's better for the column implementations to handle this, as they're the ones declaring the editable/blur-able controls in their templates.
    -   Action menus will be handled by the table, not column implementations.
