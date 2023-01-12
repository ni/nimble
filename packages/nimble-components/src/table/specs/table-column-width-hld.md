# Table Column Widths

## Problem Statement

We need to provide users the means for changing the widths of individual columns as needed. This should be able to be accomplished both through interactive means as well as via a programmatic API.

## Links To Relevant Work Items and Reference Material

- [#873 Programmatically resize column width](https://github.com/ni/nimble/issues/873)
- [#846 Interactively resize column width](https://github.com/ni/nimble/issues/846) 


## Implementation / Design

TanStack offers the ability to maintain column sizing state as well as APIs to manage interactive sizing ([`getResizeHandler`](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)). By plugging into `getResizeHandler` TanStack can provide all necessary column size state either as the column is being sized (allowing immediate sizing while dragging), or at the end of an interactive operation (columns update size on mouse up for example).

TanStack expects size values to be provided as [pixel values](https://tanstack.com/table/v8/docs/api/features/column-sizing#size).

## Alternative Implementations / Designs

*Describe any design alternatives and discuss why they were rejected.*

## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*
