# Nimble Dialog

## Overview

The Nimble dialog component provides clients with a way to open a focused panel on top of their app or another dialog. It should support use cases like prompting users for confirmation or input, or just displaying a message.

### Background

See request in [GitHub issue #378](https://github.com/ni/nimble/issues/378).

Also tracked by [AzDO User Story 2042565](https://ni.visualstudio.com/DevCentral/_workitems/edit/2042565).

[Visual design spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006/specs/)

### Non-goals

-   We are not creating a component that will provide "snackbar" functionality, as that has distinct enough requirements that it should be a separate component and/or service. It could be built on top of the (non-modal) native `dialog` element, but there isn't much to be gained by building it on top of nimble-dialog (based on the proposals in this spec).
-   We are not defining a dialog service that would provide a fully programmatic way to create and display simple dialogs. The proposed API allows clients to define their own service. We plan to update the existing `systemlink-lib-angular` confirm-dialog service to use `nimble-dialog`. Any other questions e.g. potentially creating a service in Nimble itself or for Blazor or vanilla js are left for a separate discussion.

### Features

-   Modal dialogs that properly capture focus and restore focus upon closing
-   Consistent styling (position, font, colors, border, shadow)
-   Proper accessibility

### Risks and Challenges

-   The latest version of TypeScript does not have the `dialog` element's full API, which will leads to dev-time errors in the editor (however everything is fine at run-time): https://github.com/microsoft/TypeScript/issues/48267. The TypeScript-DOM-lib-generator source has been updated to have the missing members, so this may be easily fixed through a dependency update and release from the TypeScript repo.

### Prior Art/Examples

[Material Dialog](https://material.angular.io/components/dialog/overview)

[FAST Foundation Dialog](https://github.com/microsoft/fast/tree/1e4a383fada3a4895623e6b54088f9f2a07c7a78/packages/web-components/fast-foundation/src/dialog) -- does little other than managing focus and interaction based on the `modal` state

[HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

Most of the dialogs currently in SLE look like this:

![Confirmation prompt](confirm-remove-system.png)

Another example has both a title and description:

![Cancel uploads prompt](cancel-uploads.png)

An example from SLS's assets page called out by TJ as something that might need to be supported:

![Calibration policy prompt](calibration-policy.png)

Some [early designs](https://xd.adobe.com/view/00ff3aa4-594f-48eb-6e29-84104374952f-76ce/screen/1085a774-78a1-44a4-8975-2f98286a78e5) from Brandon:

![Dialog designs](early-design.png)

---

## Design

### API

-   _Component Name_
    -   `nimble-dialog`
-   _Props/Attrs_
    -   `open` - read-only attribute that is set while the dialog is open. The native dialog supports setting this attribute, but it opens the dialog non-modally, uncentered, and without focus management. For that reason our API only supports `show()` as the way to open a dialog.
    -   `prevent-dismiss` - prevent dismissal by pressing ESC (this attribute also exists on the Nimble drawer)
    -   `header-hidden` - Collapse the header of the dialog, which includes the title and subtitle. This places the content of the dialog at the top of the dialog.
    -   `footer-hidden` - Collapse the footer of the dialog.
-   _Methods_
    -   `show()` - opens the dialog and returns a `Promise` that is resolved when the dialog is closed. The value of the resolved `Promise` indicates why/how the dialog was closed. When the dialog is closed by the user pressing ESC, a `USER_DISMISSED` Symbol is returned as the reason.
    -   `close(reason)` - closes the dialog (returning focus to the control that had it before opening), optionally specifying the reason/method (a value of any type).
-   _Events_
    -   (none)
-   _CSS Classes and CSS Custom Properties that affect the component_
    -   (none)

Leslie informed us that modal dialogs should not be dismissable by clicking outside. This is something the drawer currently supports but apparently should be treated as a bug to fix.

Multiple dialogs may be opened at the same time. The latest dialog opened will always be on top, forming a stack of open dialogs. Only the top dialog is interactive. The dialog uses the [top layer context](https://developer.chrome.com/blog/top-layer-devtools/#what-are-the-top-layer-and-top-layer-elements), which is above all other elements using the z-index to control stacking position.

We will not make any special effort to provide forms support (i.e. form `type="dialog"`). Specifically, we will not provide access to the `returnValue` attribute of the native `dialog` that is set upon form submission. Angular and Blazor frameworks have their own way of handling forms.

### Anatomy

The visual design spec has a few different layouts for the dialog. Not all layouts will be supported in the initial styling pass of the dialog. See below for details on what parts will and will not be supported in the intial styling pass:

-   Title
    -   Included in initial styling pass: Yes
    -   Rationale: The title is a fundamental part of the dialog. Adding the title will also resolve an accessibility issue with the dialog's aria-label.
    -   Additional details: The content provided for the title and sub-title will be used as the label of the dialog for accessibility purposes.
-   Subtitle
    -   Included in initial styling pass: Yes
    -   Rationale: The styling of the subtitle is straight-forward and there are no open questions associated with it.
    -   Additional details: The content provided for the title and sub-title will be used as the label of the dialog for accessibility purposes.
-   Warning message
    -   Included in initial styling pass: No
    -   Rationale: There isn't a pressing need for this part of the dialog yet, and there are a number of questions that need to be resolved prior to adding the messages:
        -   Should the messages be arbitrary content provided by the user, or should we have an API around providing message(s) with a specified severity, icon, color, etc?
        -   What, if any, is the overlap between these messages and a future `<nimble-banner>` component?
        -   Do we allow multiple messages at the same time? If so, is there a maximum height the messages can consume within the dialog?
-   Close button
    -   Included in initial styling pass: No
    -   Rationale: There isn't a pressing need for this component yet, and there are a number of questions that need to be resolved prior to adding the button:
        -   Should the API allow a client to slot any arbitrary buttons, including a close button, or should we only support one single button that closes the dialog?
        -   What control do we need to give over the close button? Do we need a way for the user to explicitly disable it?
        -   Should there be any connection between the `prevent-dismiss` attribute on the dialog and the visibility or disabled state of the close button?
-   Content
    -   Included in initial styling pass: Yes
    -   Rationale: This is critical for using a dialog
    -   Additional details:
        -   The content is a `flex` layout container that allows a client to easily place multiple items within the dialog.
        -   Content will have a `flex-direction` of `column` so that content stacks vertically.
        -   A `gap` will be provided so that that mutliple content elements have appropriate spacing between them.
-   Footer buttons
    -   Included in initial styling pass: Yes
    -   Rationale: These buttons are required for interacting with the dialog.
    -   Additional details:
        -   The footer is a `flex` layout container that allows a client to easily place buttons at the bottom of the dialog.
        -   If no content is slotted in the footer, the horizontal separator between the footer and content will be removed. The height of the footer will also be adjusted to align with the visual design spec.
        -   If content is slotted in the footer, it will automatically be placed with the correct vertical spacing between the horizontal line and the bottom of the dialog and with the correct horizontal spacing around content items.
        -   There will not be explicit slots within the dialog for the various alignments of buttons in the footer.
        -   Buttons will automatically be placed on the right of the footer, but this can be changed by the client since the footer has a `flex` layout. For example, to move the first button to be left-aligned, that button can be styled with `margin-right: auto`.
        -   The client will control the order of the buttons within the footer.
        -   There will be no connection between the `prevent-dismiss` attribute on the dialog and the state of the buttons because the dialog will not make any assumptions about the action associated with any button slotted in the footer.
        -   There will be no automatic applying of an `appearance` to any of the buttons. It is the client's responsibility to specify the appropriate `appearance` for all buttons slotted in the footer.

Shadow DOM:

```html
<dialog aria-labelledby="title">
    <header>
        <span id="title">
            <slot name="title"></slot>
            <slot name="subtitle"></slot>
        </span>
    </header>
    <section>
        <slot></slot>
    </section>
    <footer>
        <slot name="footer"></slot>
    </footer>
</dialog>
```

-   _Slot Names_
    -   `title` - Displayed at the top of the dialog and styled using an appropriate nimble font. The title will be used to label the dialog. The title will not wrap if it is too long; instead, overflow will be hidden with ellipsis.
    -   `subtitle` - Displayed at the top of the dialog under the title and styled using an appropriate nimble font.
    -   `(default)` - The primary content of the dialog. If multiple elements are provided for this slot, they will be stacked vertically with padding between them.
    -   `footer` - Displayed at the bottom of the dialog for buttons that perform an action within the dialog.
-   _Host Classes_
    -   (none)
-   _Slotted Content/Slotted Classes_
    -   (none)
-   _CSS Parts_
    -   (none)

### Form-based dialogs

Native dialogs have form support via setting `method="dialog"` on the `form` element. This allows form elements to close the dialog and pass their values back to the caller via the `returnValue` property on the dialog. We won't expose a `returnValue` property or otherwise support forms in our implementation.

### Angular integration

An Angular wrapper will be provided, following the same patterns as used for existing Nimble components. The dialog does not need a value accessor for form integration support.

### Blazor integration

Blazor support will be provided, following the same patterns as used for existing Nimble components.

### Visual Appearance

The dialog's width will not be configurable by clients. This decision can be revisited when there is a use-case for different sized dialogs.

The dialog will grow vertically based on the content within the dialog. Once it reaches a maximum height, which will not be configurable, the default slot will scroll while the placement of the `title`, `subtitle`, and `footer` slots will all remain fixed.

We will apply styling to give dialogs a consistent border, shadow, background. We will also set font/font color, but slotted content will often override aspects of the font, and the native dialog's user agent stylesheet may override the color with a non-theme-conforming value (this is the case in Chrome). To ensure proper theme-conforming styling, it is up to clients to properly style their content with theme-aware tokens (e.g. for font/font color, etc).

Dialogs will always be opened in the center of the screen. Scrolling the page while a dialog is open will not move the dialog, i.e. it will stay visible in the same, fixed location rather than scrolling with the page. This is the default behavior of the native `dialog`.

Dialogs will not be movable or sizeable.

The page behind an open dialog will be slightly dimmed to indicate that it cannot be interacted with.

We will not support any animation of the dialog when opening/closing.

---

## Implementation

We will utilize the html `<dialog>` element. This element provides support on par with the FAST component, including `show()` and `showModal()` functions, a stylable `::backdrop` pseudo-element (for modal), and `close` and `cancel` events.

As of March 2022, the `dialog` element has support in all the browsers we care about. A polyfill is available for users on older versions of those browsers, but we won't need to include it, because our primary client, SystemLink, only supports the latest + 6 months of browser versions. By the time we ship anything using the Nimble dialog, it should have been 6 months since all major browsers have supported the `dialog` element.

### ALTERNATIVE: FAST

The FAST dialog provides very little that the html dialog doesn't. It does have the ability to _not_ trap focus, but we are not interested in that. It is implemented via a `div` rather than `dialog`, presumably because the `dialog` did not have support in all browsers at the time it was developed. We prefer to use the more standard option.

### States

Hidden/visible

-   The dialog begins hidden and becomes visible when the `show()` function is called.
-   When `close()` is called, the dialog is hidden.

### Accessibility

By using the native `dialog` element, we get good a11y behavior without having to explicitly do anything. Until recently, it was recommended to use other dialog implementations (e.g. [a11y-dialog](https://github.com/KittyGiraudel/a11y-dialog)), but with wider browser support for the native `dialog` element, it has become a viable option.

-   When modal, the dialog will restrict focus to the elements on the dialog.
-   Upon closing a modal dialog, focus will return to the element that had focus before the dialog was opened.
-   ESC key closes the dialog
-   The native dialog defaults to the a11y role `dialog`
-   The native dialog automatically sets `modal: true` when opened using `showModal`

The role `dialog` with `modal: true` will automatically be applied to the `dialog` element, so the `nimble-dialog` will not have any custom logic or configuration to modify this behavior. The `nimble-dialog`'s template will automatically label the `dialog` element by setting `aria-labelledby` to the ID of the element containing the `title` and `subtitle` slots. As a result, if a client provides a title and/or subtitle, their dialog will automatically be labelled. This should be done even if the client is setting `header-hidden = true` to ensure that the dialog is accesible.

The `nimble-dialog` will not configure `aria-describedby` on the `dialog` element because according to [the WAI-ARIA guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/), it is advisable to omit applying `aria-describedby` when the content would be difficult to understand when announced as a single unbroken string. Therefore, the `nimble-dialog` will not make assumptions about the content of the dialog.

The WAI-ARIA guidelines also state that a dialog should always have at least one focusable element, which typically is satisfied by a Close/OK/Cancel button.

### Globalization

There will be no globalization considerations.

### Security

No issues anticipated

### Performance

No issues anticipated

### Dependencies

None

### Test Plan

Because we will not be based on a FAST component, we will create a full range of tests to exercise supported behaviors.

### Tooling

N/A

### Documentation

We will have standard documentation i.e. Storybook.

---

## Dialog Service

Currently there is [`SlConfirmDialogService`](https://ni.visualstudio.com/DevCentral/_git/Skyline?path=/Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/src/sl-confirm-dialog) in `systemlink-lib-angular` which uses the `MatDialog` service to create a configurable confirmation dialog. Trevor developed [an example](https://stackblitz.com/edit/angular-ivy-lmsgz8) of a service that could replace `MatDialog` and be leveraged by `SlConfirmDialogService`. This service creates a dialog element, attaches a `DomPortalOutlet` to it, then creates a `ComponentPortal` to project a given custom component into the dialog via the `DomPortalOutlet`. This pattern should work with `SlConfirmDialogService` since there already exists a `SlConfirmDialogComponent` to be hosted in the displayed dialog.

One question is how this service would find the right place in the DOM tree to attach the created `nimble-dialog` element. We need it to be a descendant of a `nimble-theme-provider` element. We can document that clients should mark the `nimble-theme-provider` that should be parent of created dialogs with the class `dialog-host`. We will first query using the selector `nimble-theme-provider.dialog-host` and use that element if we find it. Failing that, we can fallback on a naive approach where we can simply query the document root element for the first `nimble-theme-provider` and append the dialog as a child.

There is also the `SlNotificationService`, but this currently operates using `MatSnackBar`. This initial implementation of the Nimble dialog is not designed to provide snackbar-like behavior, so it will not be able to be leveraged by `SlNotificationService`.

---

## Loading Spinner Component

There have been requests for Nimble to provide a [loading spinner component](https://github.com/ni/nimble/issues/346), which has some aspects in common with a modal dialog. For example, it prevents interaction with a portion of the UI, and displays some custom content (i.e. the animated spinner and an optional message) in the center of the target area. A question might be whether the nimble-dialog ought to have a spinner mode/appearance, or if a separate spinner component should be built on top of nimble-dialog.

I suggest that it is not intuitive that a loading spinner is a mode/appearance of a nimble-dialog, and that a separate nimble-spinner component is more discoverable and less likely to pollute the nimble-dialog's API with spinner-specific configuration (e.g. spinner size).

It is probably as easy, or easier, to build a nimble-spinner on top of the native `dialog` than to build it on top of nimble-dialog. The latter has a more limited API and provides styling that probably isn't wanted, e.g. border, shadow, and background.

Still, the decision of how we implement a spinner is not final and would best be addressed in a separate spec/HLD. We will not be doing anything to preclude that possibility in the future.

---

## Nimble Drawer Component

The nimble-drawer component shares some similarities with a dialog. We might consider updating the drawer's implementation to use a nimble-dialog. The benefits (automatic focus behavior, a11y support) would come primarily from the underlying `dialog` element, so it might be a better idea to build on top of that instead. We have [an issue](https://github.com/ni/nimble/issues/592) regarding exactly that. One potential hurdle would be to support the drawer's slide-in/out animation.

---

## Open Issues
