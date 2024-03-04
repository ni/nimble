# Table Column Widths

## Problem Statement

We need to provide users the means for changing the widths of individual columns as needed. This should be able to be accomplished both through interactive means as well as via a programmatic API.

## Links To Relevant Work Items and Reference Material

-   [#873 Programmatically resize column width](https://github.com/ni/nimble/issues/873)
-   [#846 Interactively resize column width](https://github.com/ni/nimble/issues/846)
-   [Table README](./README.md)
-   [Table Design Doc](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/)

## Implementation / Design

### Expected Behavior

#### Column Sizing

-   Columns should be able to be configured to either maintain a fixed width, or grow proportionally with the table such as when the window resizes causing the table width to increase. Tables can consist of columns that are configured as a mixture of the two modes.
-   If a user drags a divider between two columns to the right, then the column on the left will grow larger, and the column on the right will grow smaller by the same pixel amount. Sub-behaviors to this are:
    -   If a shrinking column has reached its minimum pixel size or is not resizable, then the next column in the direction of the sizing action will be affected up to the final column in a given direction.
    -   A sizing action to the left will ultimately stop having an effect when the left-most column reaches its minimum size.
    -   A sizing action to the right that would ultimately result in the final right column reaching its minimum size would begin to push columns out of the table viewport width resulting in a horizontal scrollbar on the table.
    -   Within a single mouse interaction (i.e. drag-sizing without releasing mouse), if a cascade results in a column not adjacent to the divider being sized, then moving the mouse back in the opposite direction will "revert" the size made to the non-adjacent column.
        ![Column resizing](spec-images/tableColumnResize.gif)

#### Table Sizing

-   If a horizontal scrollbar is present, the act of growing the table will first take away the available scrollbar area, and once completely removed will begin to grow the columns proportionally.
-   Once horizontal scrollable space has been created via column sizing, shrinking the table, while a horizontal scrollbar is present, will not update the sizes of the columns, as the current scrollable area will be maintained.
    ![Table resizing](spec-images/tableResize.gif)

[Working branch](https://github.com/ni/nimble/tree/table-column-sizing-cascade-and-grow).

### Out of Scope

There are some column sizing behaviors that we will ultimately expect to support, but the APIs presented here are not meant to address:

-   Auto-resizing: We will not describe how we intend to support the use-case of having a column auto-size to its contents
-   Different interactive sizing modes: While the APIs described in this HLD do not inherently prescribe to a particular interactive sizing behavior, it's worth saying that in order to support multiple sizing modes, there will likely be additional APIs required that this HLD does not address.
    -   This includes the ability to prevent interactive resizing.
-   Ability to remove any horizontal scrollable space that has been created via column sizing (future work).
-   Mechanisms related to accessibility-centric interactive column sizing. One possible example is allowing a user to size a column by way of the keyboard, instead of using a mouse. Ultimately, such a scenario is not in conflict with the API presented here, nor the mouse-based approach we know we will require, and can thus be handled separately, if ever.

### API

`ColumnInternals`:

```ts
ColumnInternals<TColumnConfig> {
    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the pixelWidth after programmatic or interactive updates.
     */
    @observable
    public currentPixelWidth?: number;

    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the fractionalWidth after programmatic or interactive updates.
     */
    @observable
    public currentFractionalWidth = defaultFractionalWidth;

    /**
     * Used by column plugins to set a specific pixel width. Sets currentPixelWidth when changed.
     */
    @observable
    public pixelWidth?: number;

    /**
     * Used by column plugins to size a column proportionally to the available
     * width of a row. Sets currentFractionalWidth when changed.
     */
    @observable
    public fractionalWidth = defaultFractionalWidth;

    /**
     * The minimum size in pixels according to the design doc
     */
    @observable
    public minPixelWidth = defaultMinPixelWidth;

    /**
     * Whether or not this column can be interactively resized.
     */
    @observable
    public resizingDisabled = false;

    ...
}
```

Note that these properties are not attributes, and thus are not set by clients on the components via markup. Instead, these properties are meant to be configured by the concrete column implementations (typically initialization), as well as the Table as part of interactive column sizing.

#### `current<>` versus normal properties

The properties with the `current` prefix are those that the `Table` will use to update as needed based off of user interaction, and thus are not expected to be used by a plugin/mixin author. The other `ColumnInternals` properties are those expected to be set as needed by plugin/mixin authors in response to a change to their own exposed attributes.

#### `currentFractionalWidth` vs `currentPixelWidth` behavior

-   The values supplied to the `currentFractionalWidth` property have the same meaning as the values supplied with the [`fr` unit](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#the_fr_unit) for the CSS `grid-template-columns` property.
-   The values supplied to the `currentPixelWidth` property are meant to be pixel-based values.
-   The table will use `currentPixelWidth` over `currentFractionalWidth` when both are set.

#### Mixin Example

We can help facilitate proper implementation for concrete column types by providing mixins that define expected attribute APIs.

The following pattern is modeled after Typescript's documented [Constrained mixin pattern](https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins), combining patterns in place in FAST's [`FormAssociated` mixin](https://github.com/microsoft/fast/blob/f8dde59eee21a1152263447d22a76593ee5ed9e5/packages/web-components/fast-foundation/src/form-associated/form-associated.ts#L206).

```ts
export function mixinFractionalWidthColumnAPI<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    abstract class FractionalWidthColumn extends base {
        public fractionalWidth = 1: number | null;

        public minPixelWidth = null: number | null;

        public fractionalWidthChanged(): void {
            this.columnInternals.fractionalWidth = this.fractionalWidth;
        }

        public minPixelWidthChanged(): void {
            if (this.minPixelWidth !== null) {
                this.columnInternals.minPixelWidth = this.minPixelWidth;
            }
        }
    }

    (attr({ attribute: 'fractional-width', converter: nullableNumberConverter }))(FractionalWidthColumn.prototype, "fractionalWidth");
    (attr({ attribute: 'min-pixel-width', converter: nullableNumberConverter }))(FractionalWidthColumn.prototype, 'minPixelWidth');
    return FractionalWidthColumn;
}
```

Consuming this mixin pattern would look like the following:

```ts
export class TableColumnTextBase extends TableColumn<
TableColumnTextCellRecord,
TableColumnTextColumnConfig> {
    ...
}

export class TableColumnText extends mixinFractionalWidthColumnAPI(TableColumnTextBase) {}
```

The mixin pattern is appropriate for columns since there will be columns that have no fundamental need for various sizing APIs, and thus not add the mixin. Additionally, the mixin is preferred over interfaces, in that the implementation of the public APIs _must_ update the `TableColumn` properties, which an interface can't enforce.

#### PixelWidth Column Example

At the moment there is no recognized use case for a pixel-width column that would allow a user to resize it. As such, there are no plans to provide a specific pixel-width mixin for columns. Instead, a concrete column desiring a pixel-width behavior (with no resize) could simply do something like the following in its constructor:

```ts
export class MyPixelWidthColumn : TableColumn<...> {
    public constructor() {
        super();
        this.columnInternals.resizingDisabled = true;
        this.columnInternals.pixelWidth = 100;
        // Set the minPixelWidth of the column equal to the specified fixed pixel width so that
        // the column won't be coerced to a larger size based on the default minimum width.
        this.columnInternals.minPixelWidth = 100;
    }
}
```

#### Hiding Header Indicators On Narrow Columns

In some cases a column may not have space in its header for the sorting indicator or grouping indicator. For example, the icon column will be fixed width with enough space to render only a single icon. Therefore, there will not be space for a sorting indicator or grouping indicator next to the column's header icon.

In this case, the sorting indicator and grouping indicator will be hidden in the column header. This scenario will be determined by comparing the column's `minPixelWidth` with `defaultMinPixelWidth`. If the `minPixelWidth` of the column is less than `defaultMinPixelWidth`, then the sorting and grouping indicator will automatically be hidden in the header.

### Implementation considerations

[Prototype branch](https://github.com/ni/nimble/tree/column-width-prototype) ([Storybook](https://60e89457a987cf003efc0a5b-qheevxtkdu.chromatic.com/?path=/story/table--table))

#### Using grid layout

The `currentFractionalWidth` and `currentPixelWidth` properties of `ColumnInternals` align well with using the CSS "`display: grid;`" mode
and setting `grid-template-columns` to the appropriate combination of values on the container div of the cell elements for either a data row, or the container for the header cells.

Example:

Suppose a table had 3 columns with the following configuration: `currentFractionalWidth = 1`, `currentPixelWidth = 100`, and `currentFractionalWidth = 2`. This would result in "`grid-templateColumns: 1fr 100px 2fr;`".

#### **Managing interactive resize**

In order to facilitate proper resizing of columns that are leveraging `currentFractionalWidth` over `currentPixelWidth` (by way of a column mixin), it can be useful to set the `currentPixelWidth` to the appropriate calculated value (requiring knowledge of the current row width) on mouse down, and then updating `currentPixelWidth` according to the mouse delta during the mouse move, and then resetting the columns that should be using `currentFractionalWidth` to the appropriate new calculated value (based on the final `currentPixelWidth` value along with the current row width).

Because we will allow a horizontal scrollbar once the right-most column reaches its minimum size, there is an implicit need for us to also size the container for the rows and header to the actual pixel sizes the columns resolve to (i.e. the container width becomes larger than the actual table width). Additionally, on a table resize, the row size should be updated by the same delta, to maintain the behavior of columns using `currentFractionalWidth` to be proportionlly sized as expected.

#### **Interactive visual states**

Consult the [design document](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/) for details on the column divider appearance states, as well as the cursor appearance while hovering over a divider.

If a divider can never be dragged because only non-resizable columns exist to that column's left or right, the divider will be hidden. It is possible, however, for a column that is not resizable to have visible dividers if the column divider can be moved in a way such that other columns are resized.

#### **Mobile considerations**

We should consider how table re-sizing will work when on a mobile platform (touch-based sizing). Tables/DataGrids like the one Tabulator offers don't offer a separate experience, but still manage to have a fairly friendly experience with sizing the column through a touch-based drag.

#### **Future interactive sizing behaviors**

Currently, we only have a need for an interactive resize to behave as outlined in the 'Expected Behaviors' section, but it is recognized that another behavior we might want to support is a "push" resize mode, where as a user drags a divider to the right, all columns are simply pushed to the right, maintaining their current pixel size.

To help facilitate this, it may be helpful to approach the initial implementation by encapsulating the column resize management within a separate class from the `Table` and have it implement a common interface that would allow a separate implementation to provide differing behavior.

## Alternative Implementations / Designs

TanStack offers the ability to maintain column sizing state as well as APIs to manage interactive sizing ([`getResizeHandler`](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)). By plugging into `getResizeHandler` TanStack can provide all necessary column size state either as the column is being sized (allowing immediate sizing while dragging), or at the end of an interactive operation (columns update size on mouse up for example).

TanStack expects size values to be provided as [pixel values](https://tanstack.com/table/v8/docs/api/features/column-sizing#size). As such, we wouldn't be able to leverage TanStack's APIs in a way to achieve our initial desired behavior. However, it's possible that it would be beneficial to attempt to upstream changes to TanStack that would allow us to leverage it, but I would suggest that we revisit this possibility at a later time.

## Open Issues

1. How do we allow a user to remove any added viewport width (i.e. a column has been grown such that a horizontal scrollbar is visible)? Options considered include:
    - Offer a column dropdown menu option for removing all excess width. This would be done in a proportional way across all columns. All columns would provide this menu option. This would probably demand menu categories to separate table-wide actions vs column-specific actions.
    - AND/OR offer an interactive element on the right side of the right-most column. This element could allow a user to either click-drag (for incremental adjustment) AND double-click (for removal of all excess width), OR just a single-click (no incremental adjust, just remove all excess). We would not support growing the viewport area, only shrinking.
        - What would this element look like? How should it behave as the viewport size changes (i.e. should it always be present on the right-side of the visible area, or should it stick to the right-side of the right column, allowing it to be scrolled out of view)?
