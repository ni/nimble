# Table Column Widths

## Problem Statement

We need to provide users the means for changing the widths of individual columns as needed. This should be able to be accomplished both through interactive means as well as via a programmatic API.

## Links To Relevant Work Items and Reference Material

- [#873 Programmatically resize column width](https://github.com/ni/nimble/issues/873)
- [#846 Interactively resize column width](https://github.com/ni/nimble/issues/846)
- [Table README](./README.md)
- [Table Design Doc](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/)


## Implementation / Design

### Expected Behavior

The behavior that has been prescribed for column sizing is as follows:

- Columns should be able to be configured to either maintain a fixed width, or grow proportionally with the table such as when the window resizes causing the table width to increase. Tables can consist of columns that are configured as a mixture of the two modes.
- If a user drags a divider between two columns to the right, then the column on the left will grow larger, and the column on the right will grow smaller by the same pixel amount. Sub-behaviors to this are:
    - If a shrinking column has reached its minimum pixel size or is not resizable, then the next column in the direction of the sizing action will be affected up to the final column in a given direction.
    - A sizing action to the left will ultimately stop having an effect when the left-most column reaches its minimum size.
    - A sizing action to the right that would ultimately result in the final right column reaching its minimum size (all columns still within current table width) would then begin to push columns out of the table width resulting in a horizontal scrollbar.
- Columns can be configured to not allow a user to interactively size them
    - The implicit behavior present based on the behaviors described above, is that in a sizing action that cascades to a column configured to not be resized is that the column won't be resized towards a minimum size, and the cascade will effectively "skip" this column.

### Out of Scope

There are some column sizing behaviors that we will ultimately expect to support, but the APIs presented here are not meant to address:
- Auto-resizing: We will not describe how we intend to support the use-case of having a column auto-size to its contents
- Different interactive sizing modes: While the APIs described in this HLD do not inherently prescribe to a particular interactive sizing behavior, it's worth saying that in order to support multiple sizing modes, there will likely be additional APIs required that this HLD does not address.
- Mechanisms related to accessibility-centric interactive column sizing (if there are such mechanisms). One possible example is allowing a user to size a column by way of the keyboard, instead of using a mouse. Ultimately, such a scenario is not in conflict with the API presented here, nor the mouse-based approach we know we will require, and can thus be handled separately, if ever.

### API

To accomodate the various sizing modes of a column, in addition to the other necessary behaviors, we can add the following properties to `TableColumn`:

```
abstract class TableColumn {
    /*
     * @internal
     */
    // when set 'currentFractionalWidth' will be ignored
    @observable
    public currentPixelWidth: number | null = null;

    /*
     * @internal
     */
    @observable
    public currentFractionalWidth = 1;

    /*
     * @internal
     */
    @observable
    public currentMinWidth = 88; // the minimum size in pixels according to the design doc

    /*
     * @internal
     */
    @observable
    public currentDisableResize = false;

    ...
}
```
Note that these properties are not attributes, and thus are not set by clients on the components via markup. Instead, these properties are meant to be configured by the concrete column implementations (typically initialization), as well as the Table as part of interactive column sizing.

#### `currentFractionalWidth` vs `currentPixelWidth` behavior

- The values supplied to the `currentFractionalWidth` property have the same meaning as the values supplied with the [`fr` unit](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#the_fr_unit) for the CSS `grid-template-columns` property.
- The values supplied to the `currentPixelWidth` property are meant to be pixel-based values.
- The table will use `currentPixelWidth` over `currentFractionalWidth` when both are set.

#### `currentMinWidth` behavior

Open Question: Is there a minimum width considered too small? If a plugin is allowed to provide a mimimum width smaller than the default, how should the various components within the header behave? If a plugin attempts to set a minimum width to an unsupported value, what is the appropriate response (i.e. should we simply update the `TableValidity` state?)?

#### **Mixin Example**

We can help facilitate proper implementation for concrete column types by providing mixins that define expected attribute APIs.

The following pattern is modeled after Typescript's documented [Constrained mixin pattern](https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins), combining patterns in place in FAST's [`FormAssociated` mixin](https://github.com/microsoft/fast/blob/f8dde59eee21a1152263447d22a76593ee5ed9e5/packages/web-components/fast-foundation/src/form-associated/form-associated.ts#L206).
```
export function fractionalWidthColumn<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    abstract class FractionalWidthColumn extends base {
        public fractionalWidth = 1;

        public disableResize = false;

        public minWidth?: number;

        public fractionalWidthChanged(): void {
            this.currentFractionalWidth = this.fractionalWidth;
        }

        public disableResizeChanged(): void {
            this.currentDisableResize = this.disableResize;
        }

        public minWidthChanged(): void {
            if (this.minWidth !== undefined) {
                this.currentMinWidth = this.minWidth;
            }
        }
    }

    (attr({ attribute: 'fractional-width', converter: nullableNumberConverter }))(FractionalWidthColumn.prototype, "fractionalWidth");
    (attr({ attribute: 'disable-resize', mode: 'boolean' }))(FractionalWidthColumn.prototype, 'disableResize');
    (attr({ attribute: 'min-width' }))(FractionalWidthColumn.prototype, 'minWidth');
    return FractionalWidthColumn;
}
```
Consuming this mixin pattern would look like the following:
```
export class TableColumnTextBase extends TableColumn<
TableColumnTextCellRecord,
TableColumnTextColumnConfig> {
    ...
}

export class TableColumnText extends fractionalWidthColumn(TableColumnTextBase) {}
```

The mixin pattern is appropriate for columns since there will be columns that have no fundamental need for various sizing APIs, and thus not add the mixin. Additionally, the mixin is preferred over interfaces, in that the implementation of the public APIs _must_ update the `TableColumn` properties, which an interface can't enforce.

#### **PixelWidth Column Example**

At the moment there is no recognized use case for a pixel-width column that would allow a user to resize it. As such, there are no plans to provide a specific pixel-width mixin for columns. Instead, a concrete column desiring a pixel-width behavior (with no resize) could simply do something like the following in its constructor:

```
export class MyPixelWidthColumn : TableColumn<...> {
    public constructor() {
        super();
        this.currentPixelWidth = 100;
        this.disableResize = true;
    }
}
```

### Implementation considerations

[Prototype branch](https://github.com/ni/nimble/tree/column-width-prototype) ([Storybook](https://60e89457a987cf003efc0a5b-qheevxtkdu.chromatic.com/?path=/story/table--table))

#### **Using "`display: grid`"**:

The `currentFractionalWidth` and `currentPixelWidth` properties of `TableColumn` align well with using the CSS "`display: grid;`" mode
and setting `grid-template-columns` to the appropriate combination of values on the container div of the cell elements for either a data row, or the container for the header cells.

Example:

Suppose a table had 3 columns with the following configuration: `currentFractionalWidth = 1`, `currentPixelWidth = 100`, and `currentFractionalWidth = 2`. This would result in "`grid-templateColumns: 1fr 100px 2fr;`".

#### **Managing interactive resize**

In order to facilitate proper resizing of columns that are leveraging  `currentFractionalWidth` over `currentPixelWidth` (by way of a column mixin), it can be useful to set the `currentPixelWidth` to the appropriate calculated value (requiring knowledge of the current row width) on mouse down, and then updating `currentPixelWidth` according to the mouse delta during the mouse move, and then resetting the columns that should be using `currentFractionalWidth` to the appropriate new calculated value (based on the final `currentPixelWidth` value along with the current row width).

Because we will allow a horizontal scrollbar once the right-most column reaches its minimum size, there is an implicit need for us to also size the container for the rows and header to the actual pixel sizes the columns resolve to (i.e. the container width becomes larger than the actual table width). Additionally, on a table resize, the row size should be updated by the same delta, to maintain the behavior of columns using `currentFractionalWidth` to be proportionlly sized as expected.

#### **Interactive visual states**

Consult the [design document](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/) for details on the column divider appearance states, as well as the cursor appearance while hovering over a divider. Note that we shouldn't alter the appearance of the mouse cursor if hovering over a divider between two non-resizable columns.

#### **Mobile considerations**

We should consider how table re-sizing will work when on a mobile platform (touch-based sizing). Tables/DataGrids like the one Tabulator offers don't offer a separate experience, but still manage to have a fairly friendly experience with sizing the column through a touch-based drag.

#### **Future interactive sizing behaviors**

Currently, we only have a need for an interactive resize to behave as outlined in the 'Expected Behaviors' section, but it is recognized that another behavior we will ultimately want to support is a "push" resize mode, where as a user drags a divider to the right, all columns are simply pushed to the right, maintaining their current pixel size. 

To help facilitate this, it may be helpful to approach the initial implementation by encapsulating the column resize management within a separate class from the `Table` and have it implement a common interface that would allow a separate implementation to provide differing behavior.

## Alternative Implementations / Designs

TanStack offers the ability to maintain column sizing state as well as APIs to manage interactive sizing ([`getResizeHandler`](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)). By plugging into `getResizeHandler` TanStack can provide all necessary column size state either as the column is being sized (allowing immediate sizing while dragging), or at the end of an interactive operation (columns update size on mouse up for example).

TanStack expects size values to be provided as [pixel values](https://tanstack.com/table/v8/docs/api/features/column-sizing#size). As such, we wouldn't be able to leverage TanStack's APIs in a way to achieve our initial desired behavior. However, it's possible that it would be beneficial to attempt to upstream changes to TanStack that would allow us to leverage it, but I would suggest that we revisit this possibility at a later time.


## Open Issues

- Should we show a divider between two columns that are not resizable on hover over one of those columns?
