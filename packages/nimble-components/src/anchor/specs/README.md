# Nimble Anchor

## Overview

The Nimble Anchor is a component used to navigate to a web resource, similar to the HTML anchor element.

### Background

[Visual Design spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46)<br>
[Nimble work item](https://github.com/ni/nimble/issues/324)

---

## Design

### API

[FAST's API documentation](https://github.com/microsoft/fast/blob/e576aa70c22780fffba03097277e2db9a2ec1cd8/packages/web-components/fast-foundation/src/anchor/README.md)

-   _Component Name_: `nimble-anchor`
-   _Properties/Attributes_: We will have the following properties/attributes in addition to the ones provided by the FAST anchor:
    -   `appearance`:
        -   `"text"`: (Default) the "standalone" version in the design doc. Looks like plain text, but gets and underline on hover.
        -   `"inline-text"`: like `"text"`, but always shows an underline.
        -   `"outline"`: same as button design
        -   `"ghost"`: same as button design
        -   `"block"`: same as button design
    -   `appearance-variant`:
        -   `"default"`: `undefined` (as per our common attribute guidelines)
        -   `"primary"`: applies only to button-based styles and has the same effect as on buttons
        -   `"prominent"`: applies only to `"text"` and `"inline-text"` appearances. It is the "loud" version from the design doc. Colors the link text green. The name of this attribute value comes from the Breadcrumb.
    -   `content-hidden`: when set, hides the label and end slot
    -   `disabled`: when set, makes the anchor inoperable and changes the styling
-   _Methods_: Unchanged (none)
-   _Events_: Unchanged (none)
-   _CSS Classes and Custom Properties that affect the component_: Unchanged (none)
-   _Slots_: Unchanged (start and end slots)

**Anchors in other components**

In the future, we expect to support links within other controls, e.g.

-   tabs
-   menu
-   tree

Unfortunately it's not as simple as dropping `nimble-anchor`s into the existing components. Each of these has its own considerations and challenges.

-   **Tabs**

    The `nimble-tabs` control has a `tabpanel` slot to host `nimble-tab-panel`s, but that will have to be replaced with an `iframe`. It probably does not make sense for a `nimble-tabs` to contain a mix of `nimble-tab`/`nimble-tab-panel` and `nimble-anchor`. We likely would either have a separate "hyperlink tabs" component, or two distinct modes on the existing `nimble-tabs`.

    There is also a question of keyboard navigation behavior. The existing tabs control immediately switches the tab panel when you focus a different tab header. We probably want to avoid loading new pages as you arrow through the tab headers. Instead, the user would navigate to a tab header and hit space/enter to actually load that content. A downside is that we would have two different interaction patterns for tab controls that are visually the same.

    ARIA roles are another question. Do we continue to use roles for the tab pattern, like `tab`, `tablist`, and `tabpanel` (but we have no `tabpanel`s)? Or do we let our link items have the `link` role, maybe within a `list`/`group` of items? I have seen examples of both approaches on sites like GitHub and AzDO.

-   **Menu**

    Should the ARIA role for a link in a menu be `link` or `menuitem`? The examples I have found go with the latter, and this is supported by the fact that the ARIA spec for the `menu` role doesn't include `link` among the roles that child items may have.

    The FAST menu supports keyboard navigation to any child items that have the `menuitem` role. However, when I tried putting a `<a>` with role `menuitem` into a `nimble-menu`, I could navigate to the link, but I could not activate it with the enter key (or even by clicking).

    The API for a menu item contains a number of things not provided by a plain `nimble-anchor`. This hints that a separate component (i.e. `nimble-anchor-menu-item`) may be cleaner and more maintainable than trying to reuse the `nimble-anchor`.

-   **Tree**

    The tree use case is very similar to the menu use case. I have not found examples of sites with trees (i.e. `role=tree`) with links, but based on the ARIA docs, I suspect the correct role for a link in a tree is `treeitem`. For the same reasons as the menu case, I suspect it would be cleaner and more maintainable to create a separate `nimble-anchor-tree-item`.

If we are creating new components for anchors in menus and trees, then for consistency, we should probably create a separate one for the tabs use case as well. If that's the approach we take, then we are free to design the "plain" anchor (`nimble-anchor`) however we wish, without impacting our future efforts to implement the tabs, menu, or tree support.

### Angular integration

A directive will be created for the anchor component. The existing `NimbleBreadcrumbItemDirective` has all the needed bindings for attributes common to the native anchor element (e.g. `href`, `rel`, `target`, etc.). We will refactor that into a common, base class called something like `NimbleAnchorBase` that both the BreadcrumbItem directive and anchor directive can extend. The anchor directive will additionally have bindings for attributes `appearance`, `appearance-variant`, `content-hidden`, and `disabled`.

The anchor does not participate in forms, so there will be no ControlValueAccessor.

**[routerLink] and [routerLinkActive] Support**

(Note: most of the following is adapted from the Breadcrumb/BreadcrumbItem spec.)

When used in an Angular app, frequently the `[routerLink]` directive will be used on the `nimble-anchor`, instead of directly setting `href`. An example:

```html
<a
    routerLink="/customapp"
    [queryParams]="{debug: true}"
    [state]="{tracingId: 123}"
>
    Custom App Page
</a>
```

As shown above, clients using [routerLink] can also set queryParams dynamically, pass state when the router navigates, etc.
[[routerLinkActive]](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link_active.ts) can also be used to add CSS classes on a link that points to the current page/route.

Angular has two directives handling [routerLink]:

-   [RouterLink](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link.ts#L119): Selector `:not(a):not(area)[routerLink]`. Does a router navigation on left-click; handles Ctrl-Click the same way; does not compute an href (as it doesn't target `<a>` elements)
-   [RouterLinkWithHref](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link.ts#L257): Selector `a[routerLink],area[routerLink]`: Computes an href for the anchor element it targets; left-click does a router navigation; Ctrl-click and middle-mouse-button click defer to the browser (to open a new tab/window)

We want the behavior of RouterLinkWithHref, so we can subclass it and update the selector to target `nimble-anchor`.
However, if we have clients use the existing `routerLink` attribute to opt into our directive, there'll still be a RouterLink directive active doing the wrong action too. In current Angular versions there's not a good way to disable RouterLink navigation ([see the comment on this Angular commit](https://github.com/angular/angular/commit/ccb09b4558a3864fb5b2fe2214d08f1c1fe2758f)).

We will follow the same approach previously used for the BreadcrumbItem:

-   Our directive's selector will be `nimble-anchor[nimbleRouterLink]`, and the directive will define `@Input nimbleRouterLink` (which sets `routerLink`). This is a small change for clients which we will document (consistent with BreadcrumbItem), and other routerLink attributes can still be used as-is:
    ```html
    <nimble-anchor
        nimbleRouterLink="/customapp"
        [queryParams]="{debug: true}"
        [state]="{tracingId: 123}"
    >
        Custom App Page
    </nimble-anchor>
    ```
-   A second directive will be provided to disable use of the `routerLink` attribute on `nimble-anchor` elements.

Another option would be to try to reuse the two directives created for the BreadcrumbLink for these purposes (i.e. NimbleBreadcrumbItemRouterLinkWithHrefDirective and NimbleBreadcrumbItemRouterLinkDirective). There is so little in these directives, though, that it is simpler just to create duplicates for the anchor.

### Blazor integration

We will create a Blazor wrapper for the anchor. Judging by the BreadcrumbItem's wrapper, there are no special routing considerations/mechanisms for Blazor.

### Additional requirements

-   _User interaction:_ None
-   _Styling:_
    -   When it has keyboard focus, the anchor will have a double underline.
    -   CSS for button styles will be shared as much as possible
    -   CSS for hyperlink styles will be shared as much as possible with the Breadcrumb
-   _Testing:_ None
-   _Documentation:_ Should direct users to set the `inline-text` appearance when using the anchor inline with text.
-   _Tooling:_ None
-   _Accessibility:_ Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
-   _Globalization:_ None
-   _Performance:_ None
-   _Security:_ None

---

## Open Issues
