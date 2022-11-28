# Nimble Anchor

## Overview

The Nimble Anchor is a component used to navigate to a web resource, similar to the HTML anchor element.

### Background

[Visual Design spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46)<br>
[Nimble work item](https://github.com/ni/nimble/issues/324)

---

## Design

**Anchors in other components**

Initially we will create two flavors of anchor: a standard anchor, and a button-like anchor. In the future, we expect to support anchors within other controls, e.g.

-   tabs
-   menu
-   tree

Unfortunately it's not as simple as dropping `nimble-anchor`s into the existing components. Each of these has its own considerations and challenges.

-   **Tabs**

    The `nimble-tabs` component currently is structured with children having a 1-to-1 relationship between `nimble-tab` children and `nimble-tab-panel` children:

    ```html
    <nimble-tabs>
        <nimble-tab>Tab One</nimble-tab>
        <nimble-tab>Tab Two</nimble-tab>
        <nimble-tab-panel>Tab content one</nimble-tab-panel>
        <nimble-tab-panel>Tab content two</nimble-tab-panel>
    </nimble-tabs>
    ```

    A link-based tabs control would not have `nimble-tab-panel`s. Also, the tab component would have a very different API than `nimble-tab` and so should be a new, separate component.

    ```html
    <nimble-tabs>
        <nimble-anchor-tab href="...">Tab One</nimble-anchor-tab>
        <nimble-anchor-tab href="...">Tab Two</nimble-anchor-tab>
    </nimble-tabs>
    ```

    The FAST tabs component (from which `nimble-tabs` is derived) contains logic for keyboard navigation through tabs and for connecting tabs to their associated tab panels. We won't need the logic for connecting tabs to tab panels, and keyboard navigation will work slightly different as well. The existing tabs control immediately switches the tab panel when you focus a different tab. We want to avoid navigating as you arrow through the tabs. Instead, the user would arrow over to a tab and hit space/enter to actually navigate to that URL.

    We do not want to support tab controls that contain a mix of `nimble-tab`s/`nimble-tab-panel`s and `nimble-anchor-tab`s. Doing so would add significant complexity to the implementation of our tabs component, and it would result in unpredictable keyboard navigation behavior. I.e. arrowing to a different tab may cause the displayed content to change, or it might do nothing.

    For those reasons we would probably have a new, separate `nimble-anchor-tabs` container component.

    ```html
    <nimble-anchor-tabs>
        <nimble-anchor-tab href="...">Tab One</nimble-anchor-tab>
        <nimble-anchor-tab href="...">Tab Two</nimble-anchor-tab>
    </nimble-anchor-tabs>
    ```

    ARIA roles are another question. Would we follow the tab pattern which uses the roles `tab`, `tablist`, and `tabpanel`? It seems like we cannot because we do not have anything corresponding to `tabpanel`, and the [spec](https://w3c.github.io/aria/#tablist) does not indicate that the role is optional. Interestingly, the tabs at the top of [AzDO's pull request list](https://ni.visualstudio.com/DevCentral/_git/Skyline/pullrequests) _do_ use the `tab` role for the `<a>` element without having any `tabpanel` roles, as far as I can tell. Another approach I've seen (e.g. right under the repo name of a [GitHub repo](https://github.com/ni/nimble)) is to give the tabs the `link` role, within a `list`/`group` of items. This approach seems semantically appropriate without violating any rules of the ARIA spec.

    Another thought might be to merge both approaches, having a `tablist` containing elements that are both `tab` and `link`. While the `role` attribute may be a list of multiple space-separated values, [only one value from the list is honored](https://stackoverflow.com/questions/27019753/can-i-use-multiple-aria-roles-on-a-parent-element).

-   **Menu**

    Should the ARIA role for a link in a menu be `link` or `menuitem`? The examples I have found go with the latter, and this is supported by the fact that the ARIA [spec](https://w3c.github.io/aria/#menu) for the `menu` role limits the roles of child items to `menuitem`, `menuitemcheckbox`, `menuitemradio`, or `group`s thereof. We can't give it both `link` and `menuitem` roles for the reason I gave in the preceeding section.

    The FAST menu only supports keyboard navigation to child items that have the `menuitem` role. This is another datapoint suggesting we can't give links the `link` role when in a menu.

    Aside from the difference in ARIA roles, a link in a menu would also need a menu-specific API (e.g. `expanded` and `checked` attributes) not provided by a plain `nimble-anchor`. These differences suggest that a separate component would be more practical than trying to reuse the `nimble-anchor`.

    ```html
    <nimble-menu>
        <nimble-anchor-menu-item href="...">Item One</nimble-anchor-menu-item>
        <nimble-anchor-menu-item href="...">Item Two</nimble-anchor-menu-item>
    </nimble-menu>
    ```

-   **Tree**

    The tree use case is very similar to the menu use case. I have not found examples of sites with trees (i.e. `role=tree`) with links, but based on the ARIA docs, I suspect the correct role for a link in a tree is `treeitem`. For the same reasons as the menu case, I suspect it would be cleaner and more maintainable to create a separate `nimble-anchor-tree-item`.

If we are creating new components for anchors in tabs, menus, and trees, then for consistency, should we create a separate one for button-like links as well? Buttons and links are similar ARIA roles ([the](https://w3c.github.io/aria/#button) [spec](https://w3c.github.io/aria/#link) even links them to each other). We could model a button-link as just an appearance mode of the link. However, they are semantically distinct, and there are no obvious benefits to combining the two, except having one fewer component. Arguments for having a separate anchor button component include:

-   consistent with existing button variations:
    ```html
    <nimble-button>
        <nimble-menu-button>
            <nimble-toggle-button>
                <nimble-anchor-button></nimble-anchor-button></nimble-toggle-button></nimble-menu-button
    ></nimble-button>
    ```
-   easily switching between standard anchor and button-like appearance (API-wise) is not a significant benefit
-   allows us to have separate Angular directives, which gives us more freedom in case we need it

For these reasons we will create a second anchor button component as part of this effort.

### API

[FAST's API documentation](https://github.com/microsoft/fast/blob/e576aa70c22780fffba03097277e2db9a2ec1cd8/packages/web-components/fast-foundation/src/anchor/README.md)

-   _Component Name_: `nimble-anchor`
-   _Properties/Attributes_: We will have the following properties/attributes in addition to the ones provided by the FAST anchor:
    -   `inline`: specifies that the anchor will be used inline within a text block (as opposed to a standalone element in the UI). The anchor will always have an underline and will be formatted to align with surrounding text.
    -   `prominent`: the "loud" version from the design doc. Colors the link text green. The name of this attribute comes from the Breadcrumb's `appearance` attribute value.
    -   `disabled`: when set, makes the anchor inoperable and changes the styling
-   _Methods_: Unchanged (none)
-   _Events_: Unchanged (none)
-   _CSS Classes and Custom Properties that affect the component_: Unchanged (none)
-   _Slots_: We will not expose the start and end slots provided by the FAST anchor.

The button-like anchor will also derive from the FAST anchor so that we use the same template and role.

-   _Component Name_: `nimble-anchor-button`
-   _Properties/Attributes_: We will have the following properties/attributes in addition to the ones provided by the FAST anchor:
    -   `appearance`:
        -   `"outline"`: same as button design
        -   `"ghost"`: same as button design
        -   `"block"`: same as button design
    -   `appearance-variant`:
        -   `"default"`: `undefined` (as per our common attribute guidelines)
        -   `"primary"`: applies only to button-based styles and has the same effect as on buttons
    -   `content-hidden`: when set, hides the label and end slot
    -   `disabled`: when set, makes the anchor inoperable and changes the styling
-   _Methods_: Unchanged (none)
-   _Events_: Unchanged (none)
-   _CSS Classes and Custom Properties that affect the component_: Unchanged (none)
-   _Slots_: We _will_ expose/document the start and end slots for the button-like anchor. For consistency with the button API, we will recommend the same method of slotting icons into these slots.

### Angular integration

A directive will be created for the anchor component. The existing `NimbleBreadcrumbItemDirective` has all the needed bindings for attributes common to the native anchor element (e.g. `href`, `rel`, `target`, etc.). We will refactor that into a common, base class called something like `NimbleAnchorBase` that both the BreadcrumbItem directive and anchor directive can extend. The anchor directive will additionally have bindings for attributes `inline`, `prominent`, and `disabled`.

A separate directive will be created for the button-like anchor. It will also extend the common base class mentioned above. The anchor directive will additionally have bindings for attributes `appearance`, `appearance-variant`, `content-hidden`, and `disabled`.

Neither the anchor or button-like anchor participate in forms, so there will be no ControlValueAccessor.

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

We will create Blazor wrappers for the anchor and button-like anchor. Judging by the BreadcrumbItem's wrapper, there are no special routing considerations/mechanisms for Blazor.

### Additional requirements

-   _User interaction:_ None
-   _Styling:_
    -   When it has keyboard focus, the anchor will have a double underline.
    -   CSS for button styles will be shared as much as possible
    -   CSS for hyperlink styles will be shared as much as possible with the Breadcrumb
-   _Testing:_ None
-   _Documentation:_ Should direct users to set `inline` when using the anchor inline with text.
-   _Tooling:_ None
-   _Accessibility:_ Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
-   _Globalization:_ None
-   _Performance:_ None
-   _Security:_ None

---

## Open Issues
