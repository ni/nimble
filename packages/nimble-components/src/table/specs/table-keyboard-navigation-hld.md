# Table Keyboard Navigation HLD

## Problem Statement

It is desirable for the table to support navigating and interacting with its contents with the keyboard alone. ARIA provides guidance on how to best accomplish this.

## Links To Relevant Work Items and Reference Material

-   [Previous HLD and discussions on pull request](https://github.com/ni/nimble/pull/1506)
-   [ARIA Treegrid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#keyboardinteraction)
-   [ARIA Focus/Edit/Navigation guidance for cells](https://www.w3.org/WAI/ARIA/apg/patterns/grid/#gridNav_focus)
-   [ARIA treegrid example](https://codepen.io/atmgrifter00/pen/oNJLMQr)
-   Outdated:
    -   [Prototype branch](https://github.com/ni/nimble/tree/table-keyboard-interactions-treegrid) ([Storybook](https://60e89457a987cf003efc0a5b-vtowbhsqmj.chromatic.com/?path=/story/incubating-table--table&args=selectionMode:multiple))
    -   [IxD Keyboard interactions](https://xd.adobe.com/view/fa09e396-dbb9-40b8-547f-1cf9eab35a0b-8c38/)

## Implementation / Design

We have decided to use the ARIA `treegrid` role/ pattern for our table component (as opposed to the `grid` role).

### ARIA Treegrid guidance

Some noteworthy aspects of the treegrid pattern are:

1. All cells are focusable, even those that have no interactive elements. The left and right arrow keys, while in navigation modes, move focus from cell to cell. In the case where a cell has a single interactive element, the element can be given the focus instead of the containing cell.

> ARIA: "One reason it is important for all cells to be able to receive or contain keyboard focus is that screen readers will typically be in their application reading mode, rather than their document reading mode, when users are interacting with the grid. While in application mode, a screen reader user hears only focusable elements and content that labels focusable elements. So, screen reader users may unknowingly overlook elements contained in a treegrid that are either not focusable or not used to label a column or row."

2. The `Tab` key moves focus between the focusable elements in a row (not the cells). When focus has reached the end (or beginning of the row), a continued `Tab` (or `Shift-Tab`) will move focus outside of the table.
3. When a cell has multiple interactive elements, or editable content, the user needs a way to leave navigation mode to interact with the cell (`Enter` and `F2` are suggested), and a way to return to navigation mode (`Esc`, also `Enter` for editable content).  
   (Note: The `treegrid` and `grid` guidance are identical here.)

If the above guidelines are adhered to, technologies like screen readers should be able to handle navigating through the table in an expected fashion.

There's also guidance about whether cells themselves, or the elements inside the cells, should be focused:

> ARIA: "For assistive technology users, the quality of experience when navigating a grid heavily depends on both what a cell contains and on where keyboard focus is set. For example, if a cell contains a button and a grid navigation key places focus on the cell instead of the button, screen readers announce the button label but do not tell users a button is present.  
> There are two optimal cell design and focus behavior combinations:
>
> -   A cell contains one widget whose operation does not require arrow keys and grid navigation keys set focus on that widget. Examples of such widgets include link, button, menubutton, toggle button, radio button (not radio group), switch, and checkbox.
> -   A cell contains text or a single graphic and grid navigation keys set focus on the cell."

### Specifics for nimble-table

#### Focusing the table, `Tab`/`Shift-Tab` behavior

`Tab` or `Shift-Tab`, from neighboring elements on the page (according to tab order), will focus the table:

-   If the table header contains any interactive/focusable elements, the 1st will be focused. Examples: 'Select all rows' checkbox, 'Collapse all groups' button
-   Otherwise, the 1st table row will be focused
-   (If no header elements are focusable, and the table has no rows, the table cannot be focused)

As noted above, `Tab` / `Shift-Tab` key moves focus between the focusable elements in a row or the header (not the cells). When focus has reached the end (or beginning) of the row/header, a continued `Tab` (or `Shift-Tab`) will move focus outside of the table.

Optionally, if a particular table row has been focused, then tab focus leaves the table and later returns, we may return focus to that row (rather than it restarting at the first row/ header).  
**Open question**: Do we want to adopt this behavior?

#### Navigating rows/cells

Once focused, by default the table is in 'navigation mode', allowing the user to focus table rows and cells via the arrow keys.

When a row is focused:

-   If the row can be expanded and is collapsed, pressing `ArrowRight` will expand the row
-   If the row is expanded and can be collapsed, pressing `ArrowLeft` will collapse the row
-   If the row cannot be expanded (or is already expanded), pressing `ArrowRight` will move focus to the first cell
-   If the row cannot be collapsed (or is already collapsed), pressing `ArrowLeft` does nothing

When a cell is focused:

-   If the focus is on the first cell, pressing `ArrowLeft` will focus the entire row
-   If the focus is on any cell other than the first cell, pressing `ArrowLeft` will move focus one cell to the left
-   If the focus is on any cell other than the last, pressing `ArrowRight` will move focus to the next cell to the right
-   If the focus is on the last cell, pressing `ArrowRight` does nothing
-   Note: If a focused cell has multiple interactive elements for its contents, those elements will _not_ receive focus from pressing `ArrowLeft` or `ArrowRight`, and instead focus will be shifted to the appropriate neighboring cell (or do nothing if focus is at the extents of the row).

Special case of focusing a cell:

-   If a cell does not have an action menu, and only contains a single interactive/focusable element of the following types: button (and variants), switch, checkbox, or anchor/link: that child element will be focused _instead_ of the cell.

To interact with a cell's interactive contents, starting from the state of a cell being focused:

-   If the cell has an interactive element (including the action menu button):
    -   Pressing `Enter` will focus the 1st/ primary interactive element, _and_ trigger its functionality (e.g. button press, link navigation)
    -   Pressing `F2` will focus the 1st/ primary interactive element, but not trigger its functionality
    -   At this point, the table is no longer in 'navigation mode' (will not handle arrow key presses). `Tab`/`Shift-Tab` will also be handled by the active element by default, but may bubble up and be handled by the table (resulting in a focus change) if the content does not process `Tab`/`Shift-Tab` presses. To return to 'navigation mode', and focus the cell again:
        -   `Esc` is pressed: If the user had edited content (e.g. textbox), it may be reverted.
        -   `Enter` is pressed: If the user was editing content or interacting with a control, those changes will be committed.
-   For all cells with action menu buttons:
    -   `Ctrl-Enter` will trigger the action menu button and open the action menu. Note: If the action menu button is the only interactive element in the cell, `Enter` will do the same thing.
-   Pressing `Tab` will focus the 1st/ primary interactive element in the cell. Subsequent `Tab` presses will focus subsequent interactive elements in the cell, including the action menu button. `Shift-Tab` will focus the previous interactive element. Note: `Tab` will not cycle within the cell (it will go to the next focusable elements in the row, or focus will leave the table, as outlined in the "`Tab`/`Shift-Tab` behavior" section above).

If a cell is focused and `ArrowDown` or `ArrowUp` is pressed, when there is an available row in the navigation direction, focus will move to the cell in the current focused column of the new row.

`Ctrl-Alt modifiers`: It appears to be a common convention for screen readers to leverage `Ctrl-Alt Arrows` to move the screen reader focus to each of the cells in a row. As such, it may be desirable for our implementation to explicitly not handle keyboard interactions that involve both modifier keys, and instead respond to any resulting focus change, and update any internal state as needed based on the newly focused element. This is what the ARIA `treegrid` example does. It's not clear whether this behavior will require special handling by us or not, but we should test this scenario.

#### Row Selection

If the table has `selection-mode` of `single` or `multiple`:

-   If a row is focused, pressing `Space` will select/unselect that row
-   If a row's selection checkbox is focused, pressing `Space` will toggle the checkbox, selecting/unselecting that row
-   **(Open question)** If a single cell is focused, should pressing `Space` select/unselect that row?

Since a row's selection checkbox is currently `role=gridcell`, it will be able to be navigated to with `LeftArrow`/`RightArrow`.

#### Grouping

Since the entire group header row is a button, the explicit expand/collapse button in that row is not keyboard focusable.

If a group header row is focused, pressing `Space` or `Enter` will expand or collapse that group.

### ARIA roles

Assigning appropriate ARIA roles to the various elements inside the table is critical for technologies like screen readers to work as intended. We believe the following ARIA designations will provide the expected behaviors:

-   `role="rows"` : Provided to both the `TableRow` element and the element hosting all of the column header content
-   `role="columnheader"` : Provided to each `TableHeader` element as well as the container for the components responsible for various row actions like selection and collapse-all.
-   `role="gridcell"` : Provided to each `TableCell` element. This is the recommended role for cells in a `treegrid`. This would also be applied to the container element at the front of each row that would host the row selection checkbox.

Note: For each `gridcell` in a row, there should be a corresponding `columnheader`.

## Alternative Implementations / Designs

### Option: Diverge from ARIA treegrid guidelines

It is important to note that the IxD document was originally created to align more with the ARIA `grid` pattern, and _not_ the `treegrid`. It's possible that if we had created the IxD document with the `treegrid` in mind originally that different decisions would have been made.

If you consult the IxD document you will see that the design diverges from the above ARIA guidance for `treegrid` in the following ways:

1. When a row is focused, pressing the left and right arrow keys will only move focus between the interactive elements in the row, regardless of whether there are multiple interactive elements in a given cell.

    Pros:

    - Easiest way to move between elements in the table that can be interacted with.
    - Can't accidentally leave focus area of row, which could make it cumbersome to get back to the row you were currently focused on.
    - Avoids need to press `Enter` first to enter into the cell that has multiple interactive elements.

    Cons:

    - ARIA suggests using the `Tab` key for this type of navigation, so it _does_ cover how to move between focusable elements within a row (including when there are two elements within the same cell). The main drawback to ARIA's guidance is that if you accidentally tab out of the row, and thus the table, tabbing back into the table doesn't necessarily guarantee you go to the row you just left (it might take you to the first row).
    - Possible confusion raised from how things like screen readers navigate the table, and how the table manages navigation.
    - Implementation cost. If it is important to make the table work well with screen readers, and part of that involves when the screen reader has moved focus to a `gridcell` that has multiple interactive elements, we would need to reconcile what a user has to do to actually interact with either of those elements. This isn't necessarily free.
    - While it's unclear if this would ever be a request, we would be prevented from allowing users to copy cell data strictly through the use of a keyboard (would require mouse highlighting).

2. Pressing `Tab` either moves the focus _into_ or _out of_ the table. _Note: This was aligned with the ARIA `grid` pattern._

    Pros:

    - Gives users a fast means of tabbing past the table as part of a larger set of tabbable components.

    Cons:

    - Possible confusion for users when a row has focus, with obvious focusable/tabbable elements, and `Tab` does not take them to those elements.
    - One could say that only adding the interactive elements in a row to the set of tabbable elements on a page isn't that much of an overhead from a navigation perspective, so trying to reduce it below that is an unnecessary goal.

3. The row selection checkbox is not part of the navigable set of elements on a row.

    Pros:

    - Avoids an interactive redundancy in that selecting a row is expected to be done by focusing the row and pressing `<Space>`.
    - Provides consistency with the `GroupRow` where we don't allow a user to move focus to the checkbox, though this is only a pro on its own if ARIA properly informed the user that the GroupRow could be operated as if it was the checkbox.

    Cons:

    - Breaks ARIA guidance that all interactive elements be focusable.
    - Behavior that doesn't match mouse interactions may cause confusion or frustration that interrupts users' goals/workflows.

4. Expand/collapse of rows uses `Alt-ArrowUp/ArrowDown` (instead of simply `ArrowLeft` and `ArrowRight`)

    Cons:

    - Reliance on modifier keys when there are available workflows/keys that do not require them (i.e. strictly using `ArrowLeft` and `ArrowRight` keys with no modifiers)
    - Mistypes (attmpted to use `Alt` modifier but didn't) shifts focus unexpectedly.

## Open Issues

-   Row selection: Should pressing `Space` when a single cell is focused, result in selecting that row?
-   When focus leaves the table and later returns, should we return focus to the previously focused row, or restart focus on the top row/ header?
-   Are we satisfied with the keyboard interactions dealing with the cell action menus? Specifically, they can be `Tab`'d to, but arrow keys will not stop at them specifically (since they're part of a cell, not their own cell). So it may require multiple key presses to focus and activate them (or the direct `Ctrl-Enter` key combo if the cell is focused).
