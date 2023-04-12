# Anchor Table Column HLD

## Problem Statement

We need to support links in table cells. We will do this by creating a new column type.

## Links To Relevant Work Items and Reference Material

[GitHub issue: Table allows configuration of hyperlink column type (#1012)](https://github.com/ni/nimble/issues/1012)

## Implementation / Design

This is a fairly straightforward execution of our custom column type pattern. The anchor column will use two fields from the data records: one for the link's visible text (the "label") and one for the url (the "href"). The column configuration will contain the rest of the native anchor parameters: `hreflang`, `ping`, `referrerpolicy`, `rel`, `target`, `type`, and `download`. The assumption is that these should be the same for each link of a given column (if used at all). An alternative would be to have a `*FieldName` property for each of the native anchor parameters, but that seems unlikely to be useful.

If a table record is missing a href value a text span will be rendered rather than a link.

The column will also take an optional `placeholder` value to use when a record does not define a label or an href.

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

### Clearing state

Because the anchor in the cell can have focus, we must override `focusedRecycleCallback()` in our cell view and have it call `blur()` on our anchor. If we don't, the focus can pass to other cells as you scroll.

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

There is a problem with putting the directive on `nimble-table-column-anchor`, though. `RouterLinkWithHref` works by intercepting a click event that is bubbled up from a decendant link, but the `nimble-table-column-anchor` is not an ancestor of the anchor/table cell. We will make use of the table's support (being implemented alongside this column type) for delegating events from the cell views to the columns. We will specify that the anchor column type delegates the `click` event. The column directive will add an event listener to the `nimble-anchor-column`, listening for the `delegated-event` event. This event will give us access to the original `click` event as well as the cell view from which it originated. The cell view will expose the `Anchor` element, from which we can access the `href` value.

Once we have the `href` and the event parameters,if we are handling a plain left-click (`RouterLinkWithHref` [only handles plain left-clicks](https://github.com/angular/angular/blob/9bd9a11f4e21e5a7cc9da18f150f6dd520e7cd1e/packages/router/src/directives/router_link.ts#L302)), we're almost ready to call `RouterLinkWithHref.onClick()` to do the router navigation. We just first need to set up the `routerLink` property with the url:

```ts
public doRouterNavigation(href: string): boolean {
    this.routerLink = href;
    return super.onClick(...);
}
```

### Blazor integration

A Blazor wrapper will be created for the component. There is no special routing support needed for Blazor.

## Alternative Implementations / Designs

Alternatives were described inline with proposed approaches.

## Open Issues
