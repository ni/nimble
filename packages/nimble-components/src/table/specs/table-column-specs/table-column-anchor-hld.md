# Anchor Table Column HLD

## Problem Statement

We need to support links in table cells. We will do this by creating a new column type.

## Links To Relevant Work Items and Reference Material

[GitHub issue: Table allows configuration of hyperlink column type (#1012)](https://github.com/ni/nimble/issues/1012)

## Implementation / Design

This is a fairly straightforward execution of our custom column type pattern. The anchor column will use two fields from the data records: one for the link's visible text (the "label") and one for the url (the "href"). The column configuration will contain the rest of the native anchor parameters: `hreflang`, `ping`, `referrerpolicy`, `rel`, `target`, `type`, and `download`. The assumption is that these should be the same for each link of a given column (if used at all). An alternative would be to have a `*FieldName` property for each of the native anchor parameters, but that seems unlikely to be useful.

If a table record is missing a href value a text span will be rendered rather than a link.

The column will also take an optional `placeholder` value to use when a record does not define a label.

-   _Element name_: `nimble-table-column-anchor`
-   _Attributes/properties_:
    -   `labelFieldName`
    -   `hrefFieldName`
    -   `placeholder`
    -   `hreflang`
    -   `ping`
    -   `referrerpolicy`
    -   `rel`
    -   `target`
    -   `type`
    -   `download`

### Cell Template

We will conditionally render either a `nimble-anchor` or a `span` of text. If no label is provided, but we have a URL, we'll render a link with the URL itself as the label.

```html
When cellRecord.href present
<nimble-anchor
    href="${x => x.cellRecord.href}"
    hreflang="${x => x.columnConfig.hreflang}"
    ping="${x => x.columnConfig.ping}"
    referrerpolicy="${x => x.columnConfig.referrerpolicy}"
    rel="${x => x.columnConfig.rel}"
    target="${x => x.columnConfig.target}"
    type="${x => x.columnConfig.type}"
    download="${x => x.columnConfig.download}"
    underline-hidden
    @mouseover="${(x, c) => setTitleWhenOverflow(...)}"
    @mouseout="${(x, c) => removeTitle(...)}"
>
    ${cellState.cellRecord.label ?? cellState.cellRecord.href}
</nimble-anchor>
When cellRecord.href is missing
<span
    class="when cellRecord.label present, empty, otherwise 'placeholder'"
    @mouseover="${(x, c) => setTitleWhenOverflow(...)}"
    @mouseout="${(_x, c) => removeTitle(...)}"
>
    ${cellState.cellRecord.label ?? cellState.columnConfig.placeholder}
</span>
```

As seen in the template, we use `mouseover` and `mouseout` handlers to conditionally set, then remove, the `title` attribute to provide a tooltip when text is trucated. This is the same pattern used by the text column type. Note that we set the `underline-hidden` attribute so that the text only gets an underline upon hover.

One alternative would be to use a native anchor (`<a>`) instead of a `nimble-anchor`, for possible performance gains. I tested scrolling through a table with 10k rows and multiple columns, including five anchor columns. Scrolling performance was not noticably different than without the anchor columns. Consequently, it doesn't seem worth trying to optimize by using native anchors.

### Sorting & Grouping

The column will be sorted and grouped by the label value. It would be unexpected and unhelpful to sort or group by some invisible value, i.e. the url. An alternative would be to sort/group based on a combination of the label and url, but that is not clearly any more useful than sorting/grouping by just the label. It is arguably more confusing, based on the visibility argument.

When grouped, the header item should not be a link.

### Sizing

The column should support the same sizing modes as the text column, which is fractional widths plus minimum pixel widths.

### Keyboard Interactions

Arrowing to a anchor table cell should focus the link (if it is actually a link and not just a text span). Pressing `Enter` on a focused link will trigger navigation.

### Accessibility Roles

In the accessibility tree, the cells of an anchor column are instances of [`nimble-table-cell`](https://github.com/ni/nimble/blob/f663c38741e731bef91aa58e8fb2d1cec653b679/packages/nimble-components/src/table/components/cell/template.ts#L6) which has a `role` of [`cell`](https://w3c.github.io/aria/#cell). The cell then has a child `nimble-anchor`, which has a `role` of [`link`](https://w3c.github.io/aria/#link).

### Angular RouterLink Support

The real challenge of this column type is integrating with the Angular router. The `RouterLink`/`RouterLinkWithHref` directives are used to intercept clicks on anchors and replace the default navigation action with a call to `Router.navigateByUrl()`. As we have done in the past for other anchor components, we will have our own directive deriving from `RouterLinkWithHref`. Our directive will apply based on the presence of the `nimbleRouterLink` attribute. As we have done in the past, we will also have a directive that throws an error if `routerLink` is used instead. Normally, you would specify the `nimbleRouterLink` and related attributes (e.g. `queryParams`, `replaceUrl`, etc.) directly on the anchor element, but that's not possible for anchors in generated table cells. Our options are to put the directive on `nimble-table` or `nimble-table-column-anchor`. Because we would like to allow different anchor columns to be configured differently, and because it is a more intuitive API, we want to put our directive on the column element:

```html
<nimble-table>
    <nimble-table-column-anchor nimbleRouterLink replaceUrl ...>
        Link Column 1
    </nimble-table-column-anchor>
    ...
</nimble-table>
```

Note that this implies that these configuration parameters must be the same for each link in the column:

-   `target`
-   `queryParams`
-   `queryParamsHandling`
-   `fragment`
-   `state`
-   `relativeTo`
-   `preserveFragment`
-   `skipLocationChange`
-   `replaceUrl`

Normally with RouterLink directives, you assign the url to `routerLink`/`nimbleRouterLink`, but in this case, the url is coming from the table data. `nimbleRouterLink` just has to be present for the directive to be applied.

There is a problem with putting the directive on `nimble-table-column-anchor`, though. `RouterLinkWithHref` works by intercepting a click event that is bubbled up from a decendant link, but the `nimble-table-column-anchor` is not an ancestor of the anchor/table cell. The solution is to introduce a second directive that is on `nimble-table`, which _is_ an ancestor of the anchor/table cell. This directive will be responsible for intercepting click events from anchor elements, then "forwarding" the event to the right column directive.

The first part of this task is to detect which click events have come from a `nimble-anchor`. We can't just look at the event's `target`, because that is changed to the host control upon crossing a shadow DOM boundary. We can, however, look at the `composedPath()` of the event, which will include every element that was along the bubble-up path. If we find a `nimble-anchor` among them (by using `instanceof`), we know we should handle the event.

To handle the event, we must find the associated anchor column directive. We have the `nimble-anchor` that the event came from, and by calling `anchor.getRootNode().host`, we can get the `nimble-table-cell`. Currently, there is no way to get from a given table cell to its associated column. One way to solve this is to include a unique ID for the column in the cell state, i.e. `cell.cellState.columnUniqueId`.

```ts
export interface TableCellState<...> {
    cellRecord: TCellRecord;
    columnConfig: TColumnConfig;
    columnUniqueId: string | undefined;
}
```

This value we use for this unique ID could be the `columnId`, but that is `undefined` unless a client sets it. We would need to start auto-generating unique `columnId` values if the client hasn't provided one, or else document that users must provide column ids when wishing to integrate with the Angular router. Another issue with using `columnId` is that the client may change it programmatically, invalidating the value stored in the cell state. To ensure consistency, we would have to have a `columnIdChanged()` handler that caused `refreshRows()` to be called on the table.

A better option would be to use the existing `internalUniqueId` that each column defines. These IDs are used for a couple purposes already where a unique, internal ID is needed.

`columnUniqueId` is at the top level rather than part of the `columnConfig`, because it applies for all column types, and it is not for configuration.
Adding `columnUniqueId` to the cell state would be a change to `nimble-components` just to support `nimble-angular`, but it seems generic enough to be a reasonable API change.

Now that we have the column's `internalUniqueId` for a given anchor click, we need to get the column directive. It's possible that in the future, there will be other column types that contain `nimble-anchors`. For that reason, we'll have a base class for our directive that any anchor-containing column directive can extend.

```ts
abstract class NimbleTableColumnContainsAnchorDirective extends RouterLinkWithHref { ... }

@Directive({ selector: 'nimble-table-column-anchor[nimbleRouterLink]' })
export class NimbleTableColumnAnchorRouterLinkWithHrefDirective extends NimbleTableColumnContainsAnchorDirective { ... }
```

We can get all potential directives as content children:

```ts
@ContentChildren(NimbleTableColumnContainsAnchorDirective) public anchorColumnDirectives: QueryList<NimbleTableColumnContainsAnchorDirective>;
```

Each directive has a reference to its associated element, so we can get to the column element. From there, we have access to the `internalUniqueId`, so we can find the match.

Finally, we need to call `RouterLinkWithHref.onClick()` to do the router navigation. However, we'll first need to set up the `routerLink` property with the url:

```ts
public doRouterNavigation(href: string): boolean {
    this.routerLink = href;
    return super.onClick(...);
}
```

Note that `RouterLink`/`RouterLinkWithHref` [only handles left-clicks, when no other keys are held down](https://github.com/angular/angular/blob/9bd9a11f4e21e5a7cc9da18f150f6dd520e7cd1e/packages/router/src/directives/router_link.ts#L302). We will check the event state in our table directive, only calling `NimbleTableColumnContainsAnchorDirective.doRouterNavigation()` if it is a plain left-click. Otherwise, we let the default anchor action occur.

### Blazor integration

A Blazor wrapper will be created for the component. There is no special routing support needed for Blazor.

## Alternative Implementations / Designs

Alternatives were described inline with proposed approaches.

## Open Issues
