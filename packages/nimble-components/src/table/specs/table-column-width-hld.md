# Table Column Widths

## Problem Statement

We need to provide users the means for changing the widths of individual columns as needed. This should be able to be accomplished both through interactive means as well as via a programmatic API.

## Links To Relevant Work Items and Reference Material

- [#873 Programmatically resize column width](https://github.com/ni/nimble/issues/873)
- [#846 Interactively resize column width](https://github.com/ni/nimble/issues/846) 


## Implementation / Design

### Expected Behavior

The behavior that has been prescribed for column sizing is as follows:

- Columns should be able to be configured to either maintain a fixed width, or grow proportionally with the table such as when the window resizes causing the table width to increase. Tables can consist of columns that are configured as a mixture of the two modes.
- If a user drags a divider between two columns to the right, then the column on the left will grow larger, and the column on the right will grow smaller by the same pixel amount. Sub-behaviors to this are:
    - If a shrinking column has reached its minimum pixel size, then the next column in the direction of the sizing action will be affected up to the final column in a given direction.
    - A sizing action to the left will ultimately stop having an effect when the left-most column reaches its minimum size.
    - A sizing action to the right that would ultimately result in the final right column reaching its minimum size (all columns still within current table width) would then begin to push columns out of the table width resulting in a horizontal scrollbar.
- Columns can be configured to not allow a user to interactively size them
    - The implicit behavior present based on the behaviors described above, is that in a sizing action that cascades to a column configured to not be resized is that the column won't be resized towards a minimum size, and the cascade will effectively "skip" this column.

### API

To accomodate the various sizing modes of a column, in addition to the other necessary behaviors, we can add the following attributes to `TableColumn`:

```
class TableColumn {
    @attr({ attribute: 'fixed-width', converter: nullableNumberConverter })
    public fixedWidth: number | null = null;

    @attr({ attribute: 'fractional-width', converter: nullableNumberConverter })
    public fractionalWidth = 1;

    @attr({ attribute: 'min-size' })
    public minWidth?: number;

    @attr({ attribute: 'can-resize' })
    @attr
    public canResize = true;

    ...
}
```
_Note: We do not need to provide a `maxWidth` as it seems like an unnecessarily limiting API._

As defined above, columns can be set to have both a `fixedWidth` and a `fractionalWidth`. In such a scenario, we will always use the `fixedWidth` setting. However, columns will default to a `fractionalWidth` of 1 which will result in all columns taking up equal space in the table, and filling up the width of the table, regardless of the table's width.

The `nullableNumberConverter` you see in the decorators for the attributes simply allows us to safely treat the values as a `number`.

The `minWidth` attribute is pixel-based.

#### FractionalWidth vs FixedWidth behavior

The values supplied to the `fractionalWidth` attribute have the same meaning as the values supplied with the [`fr` unit](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#the_fr_unit) for the CSS `grid-template-columns` property.

The values supplied to the `fixedWidth` attribute are meant to be pixel-based values.

### Implementation considerations

[Prototype branch](https://github.com/ni/nimble/tree/column-width-prototype) ([Storybook](https://60e89457a987cf003efc0a5b-yjfkqsmcaq.chromatic.com/?path=/story/table--table))

#### Using "`display: grid`":

As the proposed API aligns well with the CSS "`display: grid;`" behavior, it makes sense to transition the layout of the cells of the `Table` to use this. Ultimately, this will require us to change the CSS `grid-template-columns` property dynamically (for whatever component was laying out cells, for instance the `TableRow`) in order to respond to any changes to the `fixedWidth` or `fractionalWidth` attributes on any column. This suggests providing observable properties (marked `internal`) that represent the ultimate string to provide to the `grid-template-columns` property.

As things are currently implemented, in order to provide the same layout for the header cells, we would have to provide a similar observable property on the `Table` itself and have its `rowHeader` element in the template bind its style to. This is undesirable, as the `Table` is a component we expect users to leverage its API extensively, and providing internal APIs on it should be avoided. Instead, it may make sense to provide a `TableHeaderRow` component, which can provide this API instead and be responsible for the header layout, in the same way the `TableRow` is for the cell layout.

_Note: The prototype branch shows one way how the above is done for the `TableRow`_

#### 

## Alternative Implementations / Designs

TanStack offers the ability to maintain column sizing state as well as APIs to manage interactive sizing ([`getResizeHandler`](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)). By plugging into `getResizeHandler` TanStack can provide all necessary column size state either as the column is being sized (allowing immediate sizing while dragging), or at the end of an interactive operation (columns update size on mouse up for example).

TanStack expects size values to be provided as [pixel values](https://tanstack.com/table/v8/docs/api/features/column-sizing#size).


## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*
