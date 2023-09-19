# Table Keyboard Navigation HLD

## Problem Statement

It is desirable for the table to support navigating and interacting with its contents with the keyboard alone. ARIA provides guidance on how to best accomplish this.

## Links To Relevant Work Items and Reference Material

-   [IxD Keyboard interactions](https://xd.adobe.com/view/fa09e396-dbb9-40b8-547f-1cf9eab35a0b-8c38/)
-   [ARIA Treegrid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#keyboardinteraction)
-   [ARIA Focus/Edit/Navigation guidance for cells](https://www.w3.org/WAI/ARIA/apg/patterns/grid/#gridNav_focus)
-   [Prototype branch](https://github.com/ni/nimble/tree/table-keyboard-interactions-treegrid) ([Storybook](https://60e89457a987cf003efc0a5b-vtowbhsqmj.chromatic.com/?path=/story/incubating-table--table&args=selectionMode:multiple))
-   [ARIA treegrid example](https://codepen.io/atmgrifter00/pen/oNJLMQr)

## Implementation / Design

ARIA provides a few explicit sets of guidelines for components with the role of `treegrid` that are important to reconcile against some of our possible implementation decisions:

1. All cells are focusable. Even those that have no interactive elements. The left and right arrow keys, while in navigation modes, move focus from cell to cell. In the case where a cell has a single interactive element, the element can be given the focus instead of the containing cell.

ARIA provides the following quote related to this guideline:

_"One reason it is important for all cells to be able to receive or contain keyboard focus is that screen readers will typically be in their application reading mode, rather than their document reading mode, when users are interacting with the grid. While in application mode, a screen reader user hears only focusable elements and content that labels focusable elements. So, screen reader users may unknowingly overlook elements contained in a treegrid that are either not focusable or not used to label a column or row."_

2. The `Tab` key moves focus between the focusable elements in a row (not the cells). When focus has reached the end (or beginning of the row), a continued `Tab` (or `Shift-Tab`) will move focus outside of the table.
3. When a cell has multiple interactive elements, a user _must_ press `Enter` to move the focus to the first interactive element in the cell. At this point the table is no longer in navigation mode, and a user would now press `Tab` to move to other interactive elements within the same cell. _Disclaimer_: this guidance applies to any `grid` or `treegrid` pattern.

If the above guidelines are adhered to, technologies like screen readers should be able to handle navigating through the table in an expected fashion.

### Option 1: Diverge from ARIA guidelines

It is important to note that the IxD document was originally created to align more with the ARIA `grid` pattern, and _not_ the `treegrid`, and some of the interactions described therein _do_ align with the `grid` pattern, but no longer would if we adopt the `treegrid`, which is the current recommendation. It's possible that if we had created the IxD document with the `treegrid` in mind originally that different decisions would have been made.

If you consult the IxD document you will see that the design diverges from the above ARIA guidance for `treegrid` in the follwing ways:

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

#

2. Pressing `Tab` either moves the focus _into_ or _out of_ the table. _Note: This was aligned with the ARIA `grid` pattern, but is not for the `treegrid`._

    Pros:

    - Gives users a fast means of tabbing past the table as part of a larger set of tabbable components.

    Cons:

    - Possible confusion for users when a row has focus, with obvious focusable/tabbable elements, and `Tab` does not take them to those elements.
    - One could say that only adding the interactive elements in a row to the set of tabbable elements on a page isn't that much of an overhead from a navigation perspective, so trying to reduce it below that is an unnecessary goal.

#

3. The row selection checkbox is not part of the navigable set of elements on a row.

    Pros:

    - Avoids an interactive redundancy in that selecting a row is expected to be done by focusing the row and pressing `<Space>`.
    - Provides consistency with the `GroupRow` where we don't allow a user to move focus to the checkbox, though this is only a pro on its own if ARIA properly informed the user that the GroupRow could be operated as if it was the checkbox.

    Cons:

    - Breaks ARIA guidance that all interactive elements be focusable.
    - Behavior that doesn't match mouse interactions may cause confusion or frustration that interrupts users' goals/workflows.

#

4. Expand/collapse of rows uses `Alt-ArrowUp/ArrowDown` (instead of simply `ArrowLeft` and `ArrowRight`)

    Pros:

    - ?

    Cons:

    - Reliance on modifier keys when there are available workflows/keys that do not require them (i.e. strictly using `ArrowLeft` and `ArrowRight` keys with no modifiers)
    - Mistypes (attmpted to use `Alt` modifier but didn't) shifts focus unexpectedly.

### Option 2: Stick to ARIA guidelines

The following enumerated set provide the counter IxD to what is described above that would adhere to ARIA guidelines.

1. When a row is focused, pressing `ArrowLeft` or `ArrowRight` can do one of the following:

    - If the row can be expanded and is collapsed, pressing `ArrowRight` will expand the row
    - If the row can be expanded and is expanded, pressing `ArrowRight` will move focus to the first cell (this focus state is dependent on what the cell content is)
    - If the focus is on any cell other than the last, pressing `ArrowRight` will move focus to the next cell to the right
    - If the focus is on the last cell, pressing `ArrowRight` does nothing
    - If the focus is on the first cell, pressing `ArrowLeft` will focus the row
    - If the focus is on any cell other than the first cell, pressing `ArrowLeft` will move focus one cell to the left
    - If the row is focused and expanded, pressing `ArrowLeft` will collapse the row
    - If the row is focused and collapsed, pressingt `ArrowLeft` does nothing
    - If a focused cell has multiple interactive elements for its contents, those elements will _not_ receive focus from pressing `ArrowLeft` or `ArrowRight`, and instead focus will be shifted to the appropriate neighboring cell (or do nothing if focus is at the extends of the row).
    - Moving focus to one of multiple interactive elements in a cell requires either pressing `Tab` or pressing `Enter` on the cell if it is focused.

    Pros:

    - No reliance on modifier keys to navigate between the cell content and to expand/collapse rows.
    - Provides expected screen reader behaviors for announcing content cell-by-cell.

    Cons:

    - ?

#

2. Pressing `Tab` will focus first row, followed by all interactive elements in the row. Once at the last cell of the row, pressing `Tab` again moves focus to the next element beyond the `Table`.

    Pros:

    - Allows for quick navigation through the row's contents
    - Provides a less laborious means of focusing one of multiple interactive elements in a single cell.

    Cons:

    - The user no longer has a means of tabbing "quickly" past the table. They must tab through the interactive elements of a single row first. This seems like a marginal con, as a row typically wouldn't have enough interactive content for this to be too cumbersome.

#

3. The row selection checkbox is part of the focusable content for keyboard navigation

    Pros:

    - In general users expect focusable content to be reachable through a keyboard interaction such as pressing `Tab` or an arrow key (and is considered a violation of ARIA otherwise).

    Cons:

    - Could be considered a redundancy if the user is expected to press `Space` in order to select either a data row or a group row. This would presume that redundancies are bad, but this is often not true.

### Implementation concerns

Regardless of which if the above routes are taken, there are concerns that can be handled in a common fashion.

#### Navigation mode

As the user navigates the table with the keyboard (particularly through the use of the arrow keys), the table will have to intercept certain keys to prevent them from being processed by components that could have keyboard focus (such as the menu button we use for the action menu in cells). While in "navigation mode" arrow keys should not perform an action on any focused content, and instead simply perform a navigation action such as moving focus within a row, or shifting focus to a different row (or cell in a different row).

To do this, we can implement a manager class to intercept and handle the various necessary keys to navigate ([prototype example](https://github.com/ni/nimble/blob/table-keyboard-interactions-treegrid/packages/nimble-components/src/table/models/table-navigation-manager.ts)).

ARIA's [treegrid example](https://codepen.io/atmgrifter00/pen/oNJLMQr) provides some insight into how we could go about processing the key events.

Summary of keyboard keys as they relate to navigation:

-   `Enter` :
    -   If focus is on a cell 1) grid navigation will be disabled, and 2) the default action for the cell (if it contains a single interactive element) will occur (e.g. a button will be pressed, or focus will be given to an input).
    -   If navigation was already disabled, pressing `Enter` will commit any edits, and then restore grid navigation
-   `F2` :
    -   If focus is on a cell this behave the same as `Enter` except it will not actually cause an operate action like a button click.
-   `Escape` :
    -   Restores navigation mode
-   `Arrows` :
    -   While grid navigation is active, arrow keys will navigate to other cell and row content (horizontal navigation depends on option selected from above). If a cell is focused and `Down Arrow` or `Up Arrow` is pressed (where there is an available row in the navigation direction), focus will move to the cell in the current focused column of the new row.
    -   While grid navigation is _not_ active, arrow keys will be handled by the focused content
-   `Tab/Shift-Tab` :
    -   Depends on the strategy we decided to employ regarding ARIA adherence. Either this will move between the focusable elements within a row (including ones in the same cell), or will navigate past the table.

Option to consider:

-   `Ctl-Alt modifiers` :
    -   It appears to be a common convention for screen readers to leverage `Ctl-Alt Arrows` to move the screen reader focus to each of the cells in a row. As such, it may be desirable for our implementation to explicitly not handle keyboard interactions that involve both modifier keys, and instead respond to any resulting focus change, and update any internal state as needed based on the newly focused element. This is what the ARIA `treegrid` example does.

#### Focusable elements

Implementing either of the two options outlined will still require the table to discover the interactive elements that are present in each row. FAST had similar concerns for its `toolbar` component, which [they solved](https://github.com/microsoft/fast/blob/6091f89a6a0b8bf3baa4cd4ed2aae1078ba9865b/packages/web-components/fast-foundation/src/toolbar/toolbar.ts#L258C6-L258C6) with the help of the third-party [`tabbable` package](https://github.com/focus-trap/tabbable/tree/master), and its `isFocusable` function export.

It seems very likely they we should take a similar approach in order to discover any interactive nimble components that we need to be able to focus during navigation.

#### ARIA roles

Assigning appropriate ARIA roles to the various elements inside the table is critical for technologies like screen readers to work as intended. I believe the following ARIA designations will provide the expected behaviors:

-   `role="rows"` : Provided to both the `TableRow` element and the element hosting all of the column header content
-   `role="columnheader"` : Provided to each `TableHeader` element as well as the container for the selection checkbox -`role="rowheader"` : This seems like a reasonable role to give the element that contains the selection checkbox. Ultimately, an element like the selection checkbox (or its containing element) should not have a `gridcell` role, as technolgies like screen readers will announce those contents with their associated column (specified by the `columnheader` role), which the selection checkbox will not have.
-   `role="gridcell"` : Provided to each `TableCell` element. This is the recommended role for cells in a `treegrid`.

## Alternative Implementations / Designs

_Describe any design alternatives and discuss why they were rejected._

## Open Issues

_Describe any open issues with the design that you need feedback on before proceeding._
_It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source._
