# Banner

## Overview

The banner is a component used to display a persistent notification to a user.

### Background

[Design specification](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab/)

[GitHub issue](https://github.com/ni/nimble/issues/305)

### Non-goals

-   Arbitrary HTML content
-   A container component that would enforce design constraints on multiple banners displayed together
-   Limiting length of displayed text and/or truncating text with ellipsis

### Features

-   Optionally dismissable
-   Optional link or button (only 1) to perform an action/navigation
-   Distinct designs for banners of severity Error, Warning, Info, or Default

### Risks and Challenges

None

### Prior Art/Examples

Refer to examples in the "Some examples of screenshots" section of the [GitHub issue](https://github.com/ni/nimble/issues/305).

---

## Design

The banner is a standalone component that spans the width of its containing element, presenting, from left to right, an icon (dependent on Error/Warning/Info type), an optional title, an optional plaintext message, an optional action button or link, and an optional close control. The banner is intended to display short messages (recommended three lines or fewer) that communicate some persistent state or condition.

In this initial implementation, we will not limit the height of the banner. It will grow to fit the text that it is given.

When the user presses the dismiss button, we will hide the banner (`display:none`) and fire a `toggle` event.

### API

_The key elements of the component's public API surface:_

-   _Component Name_: `nimble-banner`
-   _Props/Attrs_:
    -   `open` - whether the banner is visible or not
    -   `prevent-dismiss` - set to hide the dismiss button (attr name taken from Nimble dialog)
    -   `severity` - one of `error`, `warning`, `info`, or undefined (default)
    -   `title-hidden` - set to hide the title text, which should always be provided for a11y reasons
    -   `dismiss-button-label` - a localized label to give the dismiss button (for a11y purposes)
-   _Methods_
-   _Events_
    -   `toggle` - fired when the banner is closed or opened. Event has `newState` and `oldState`.
-   _Slots_
    -   `title` - for the title/header text
    -   (default) - for the primary message text
    -   `action` - for the action button/link
-   _CSS Classes and CSS Custom Properties that affect the component_

We only formally support spans of text in the `title` and default slots, but we will not explicitly prevent other HTML from being slotted there. The `action` slot only supports a single `nimble-button` or `nimble-anchor`, but again, we will not do anything to enforce this.

### Examples

```html
<nimble-banner severity="info" dismiss-button-label="Close">
    <span slot="title">License Expiring</span>
    Your license will expire at the end of the month. To renew, go to
    ni.com/renew.
    <nimble-anchor slot="action" href="...">Renew my license</nimble-anchor>
</nimble-banner>
```

```html
<nimble-banner severity="error" dismiss-button-label="Close">
    <span slot="title">Authentication Failed</span>
    Could not authenticate. Please re-enter your credentials from Settings.
    <nimble-button slot="action">Open Settings</nimble-button>
</nimble-banner>
```

```html
<nimble-banner title-hidden prevent-dismiss>
    <span slot="title">Demo mode message</span>
    You are operating in demo mode. Some features will not be available.
</nimble-banner>
```

### Anatomy

<!-- prettier-ignore -->
```html
<div class="icon">
    ${when(x => x.severity === 'error', html`
        <nimble-icon-exclamation-mark></nimble-icon-exclamation-mark>`)}
    ${when(x => x.severity === 'warning', html`
        <nimble-icon-triangle-filled></nimble-icon-triangle-filled>`)}
    ${when(x => x.severity === 'info', html`
        <nimble-icon-info></nimble-icon-info>`)}
</div>
<div class="text">
    ${when(x => !x.titleHidden, html`
        <slot name="title"></slot>`)}
    <slot></slot>
</div>
<div class="end">
    <slot name="action"></slot>
    <div class="close">
        ${when(x => !x.preventDismiss), html`
            <nimble-button appearance="ghost" content-hidden>
                <nimble-icon-xmark slot="start"></nimble-icon-xmark>
                ${x => x.dismissButtonLabel}
            </nimble-button>` )}
    </div>
</div>
```

### Angular integration

An Angular wrapper will be created for `nimble-banner`. No `ControlValueAccessor` is needed.

### Blazor integration

Blazor integration for the `nimble-banner` will be provided.

### Visual Appearance

See XD document link at the top of this document.

The biggest issue is that we will have to completely re-style the icons, link, and buttons:

-   Primary icon (error, warning, or info) color is transparent white (in all themes)
-   Action button height is 24px (instead of 32px)
-   Action button hover border color is white (in all themes)
-   Action link color is white (in all themes)
-   Close button is 16px square
-   Close button icon is 8px square
-   Close button hover effect is background color change (transparent white) rather than border

We are not able to directly style some of these elements, because they are in the shadow DOM of `nimble-icon-*` and `nimble-button`. We will have to resort to overriding Nimble token values, like `--ni-nimble-icon-color` and `--ni-nimble-icon-size`.

---

## Implementation

### States

N/A

### Accessibility

_Consider the accessibility of the component, including:_

-   _Keyboard Navigation and Focus_
    -   the action button/link and the dismiss button will be focusable tab stops
-   _Form Input_
    -   N/A
-   _Use with Assistive Technology_
    -   the banner will have the ARIA role of `status`. The role `alert` was considered, but it is too aggressive for the range of banner use cases.
    -   the `status` role has implicit `aria-live` value of `polite`
    -   if the user supplies a title, we will set `aria-label` to that value
    -   the user may specify `aria-label` on the `nimble-banner`, but it is not required
-   _Behavior with browser configurations like "Prefers reduced motion"_
    -   N/A

### Globalization

N/A

### Security

N/A

### Performance

N/A

### Dependencies

N/A

### Test Plan

Unit tests and visual comparison tests will be created that exercise all features.

### Tooling

N/A

### Documentation

Storybook stories will be created.

---

## Open Issues
