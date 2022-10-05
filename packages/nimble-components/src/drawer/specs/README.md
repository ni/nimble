# Nimble Drawer

## Overview

The `nimble-drawer` is a specialized modal dialog designed to slide in from either side of the page. It is typically used for configuration panes.

### Background

There is an existing drawer within nimble that is based on the FAST dialog. A number of bugs have been reported with the current drawer, and the best way to address them is to re-write the drawer with a custom template and to not inherit from the FAST dialog.

As part of the re-write, the drawer's API and recommended usage will be scoped specifically for use as a modal pane.

Relevant bugs:

-   [Change drawer to use dialog element](https://github.com/ni/nimble/issues/592)
-   [Drawer should not dismiss when clicking outside](https://github.com/ni/nimble/issues/636)
-   [nimble-drawer with modal=false: Always consumes Escape key on webpage if drawer is open](https://github.com/ni/nimble/issues/234)
-   [Drawer unexpected modal attribute boolean behavior](https://github.com/ni/nimble/issues/190)
-   [Nimble Drawer should trap focus when opened modal](https://github.com/ni/nimble/issues/186)
-   [Slide-outs have inconsistent dismiss behavior when clicking outside](https://dev.azure.com/ni/DevCentral/_queries/edit/2015838/)
-   [Pressing ESC when two slide-outs are open closes the wrong one](https://dev.azure.com/ni/DevCentral/_queries/edit/2051165/)
-   [sl-slide-out User able to perform background operations when slide-out menu is opened](https://ni.visualstudio.com/DevCentral/_workitems/edit/2104596)

[Design spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/)

[HTML Dialog docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

### Non-goals

-   The drawer will not support a non-modal mode.
-   The drawer will not have a first-class way to be pinned, like the SLE navigation pane.
-   The drawer will not support closing when the user clicks off of it.

### Features

-   The drawer can be displayed on the left or right of the page based on its configuration.
-   The page beneath the drawer cannot be interacted with or focused in any way.
-   The drawer will automatically focus an element within the drawer when it is opened.
-   The drawer can be configured to prevent dismissing through non-programatic means (i.e. it does not dismiss when the user presses `Esc`).
-   The drawer will animate into and out of the page.

### Risks and Challenges

_None identified_

### Prior Art/Examples

Today the `nimble-drawer` is used within SLE for the navgiation pane, which has a pinned & non-pinned modes. It is also used today for a number of configuration slide-outs within SLE.

The `nimble-drawer` will no longer be used for the navigation pane. A separate component will be created within systemlink-lib-angular for the navigation pane because it does not follow the same UX rules as we need for all other drawers in the product.

---

## Design

The `nimble-drawer` provides a control for place arbitrary content that should be shown in a slide-out over the rest of a page's content. It provides the infrastructure for animating the content's entry and exit from the page, and it is also responsible for enforcing that the rest of the page is not interactable.

### API

-   _Component Name_
    -   `nimble-drawer`
-   _Props/Attrs_
    -   `open`
        -   A read-only boolean property that represents whether or not the drawer is open.
    -   `location`
        -   A string attribute to configure which side of the page the drawer is on.
        -   The attribute will be backed by an enum named `DrawerLocation` with values `left` and `right`.
        -   The default value is `left`.
    -   `preventDismiss`
        -   A boolean attribute to configure whether or not the drawer is dismissible via the `Esc` key, or any other dismiss action that is supported in the future.
        -   The default value is `false`.
-   _Methods_
    -   `show()`
        -   A method that opens the drawer and returns a `Promise` that is resolved when the drawer is closed.
        -   The value of the resolved `Promise` indicates why/how the drawer was closed. When the drawer is closed by the user pressing `Esc`, a `UserDismissed` Symbol is returned as the reason.
    -   `close(reason)`
        -   A method that closes the drawer and returns focus to the control that had it before the drawer was opened.
        -   The reason for closing the drawer can optionally be passed to the method.
-   _Events_
    -   _none_
-   _CSS Classes and CSS Custom Properties that affect the component_
    -   _none_

### Anatomy

The drawer's template will consist of a `<dialog>` containing the default `<slot>`. Additional elements will likely be required to facilitate animation.

-   _Slot Names_
    -   `(default)`
        -   The content to display within the drawer
-   _Host Classes_
    -   _(none)_
-   _Slotted Content/Slotted Classes_
    -   The existing styling for slotted `<header>`, `<section>`, and `<footer>` elements will be kept.
-   _CSS Parts_
    -   _(none)_

### Angular integration

An Angular wrapper will be provided, following the same patterns as used for existing Nimble components. The drawer does not need a value accessor for form integration support.

### Blazor integration

Blazor support will be provided, following the same patterns as used for existing Nimble components.

### Visual Appearance

Styling will be applied to give drawers a consistent border, shadow, and background. We will also set font/font color, but slotted content is expected to provide its own styled and theme-aware content.

---

## Implementation

The drawer will leverage the native `<dialog>` element. This provides the desired auto-focus behavior, the modal behavior, and a backdrop.

Alternatively, we could continue to use the FAST dialog to back the drawer, but this has a number of issues associated with it (as illustrated by the list of bugs at the top of this document).

### States

Hidden/visible

-   The drawer begins hidden and becomes visible when the `show()` function is called.
-   When `close()` is called, the drawer is hidden.

### Accessibility

-   There will be no integration with native `forms`.
-   Focus behavior will be inherited from the native `<dialog>` element including:
    -   auto-focusing an element within the drawer
    -   diabling the ability to focus elements outside of the drawer
-   By default, the `Esc` key will close the drawer, but this behavior can be controlled through the `preventDismiss` attribute.
-   The `<dialog>` in the shadow root will automatically have `aria-modal="true"` configured on it when `showModal` is called to open it.
-   The client should set an `aria-label` on the `nimble-drawer`, which will be reflected onto the `<dialog>` element within the shadow root.

### Globalization

There are no globalization considerations.

### Security

There are no security considerations.

### Performance

There are no performance considerations.

### Dependencies

_none_

### Test Plan

-   Storybook & matrix tests will be created for visual testing
-   Unit tests will be created to test the entirety of the API since we are not inheriting from an existing FAST component. This will include:
    -   Calling `close()` immediately starts closing the drawer, even if the opening animation is not complete
    -   Calling `close()` while the close animation is in progress throws an exception
    -   When `close()` is called, `open` still returns `true` until the animation is complete
    -   The `Promise` returned from `show()` does not resolve until the closing animation is complete

### Tooling

_none_

### Documentation

The existing storybook page will be updated.

---

## Open Issues

_none_
