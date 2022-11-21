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

We are not implementing navigation tabs as part of this effort. That might be implemented in the future by populating a `nimble-tabs` control with `nimble-anchor`s. It may require a new appearance mode.

### Angular integration

A directive will be created for the anchor component. It will extend the `NimbleBreadcrumbItemDirective` since it has all the same bindings for attributes common to the native anchor element (e.g. `href`, `rel`, `target`, etc.). It will additionally have bindings for attributes `appearance`, `appearance-variant`, `content-hidden`, and `disabled`.

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
-   _Documentation:_ Should direct users to set the `underline` attribute when using the anchor inline with text.
-   _Tooling:_ None
-   _Accessibility:_ Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
-   _Globalization:_ None
-   _Performance:_ None
-   _Security:_ None

---

## Open Issues
