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
-   Distinct designs for banners of type Error, Warning, Info, or Neutral

### Risks and Challenges

None

### Prior Art/Examples

Refer to examples in the "Some examples of screenshots" section of the [GitHub issue](https://github.com/ni/nimble/issues/305).

---

## Design

The banner is a standalone component that spans the width of its containing element, presenting, from left to right, an icon (dependent on Error/Warning/Info type), an optional title, an optional plaintext message, an optional action button or link, and an optional close control. The banner is intended to display short messages (recommended three lines or fewer) that communicate some persistent state or condition.

In this initial implementation, we will not limit the height of the banner. It will grow to fit the text that it is given.

When the user presses the close button, we will hide the banner (`display:none`) and fire a `close` event.

### API

_The key elements of the component's public API surface:_

-   _Component Name_: `nimble-banner`
-   _Props/Attrs_:
    -   `open` - whether the banner is visible or not
    -   `prevent-dismiss` - set to hide the close button (attr name taken from Nimble dialog)
    -   `severity` - one of `error`, `warning`, `info`, or undefined (default)
    -   `close-button-title` - a localized title to give the close button (for a11y purposes)
-   _Methods_
-   _Events_
    -   `toggle` - fired when the banner is closed or opened. Event has `newState` and `oldState`.
    -   `action` - fired when the action button is activated (by mouse or keyboard). This is the intended way for clients to perform an action.
-   _Slots_
    -   `title` - for the title/header text
    -   (default) - for the primary message text
    -   `action` - for the action button/link
-   _CSS Classes and CSS Custom Properties that affect the component_

We only formally support spans of text in the `title` and default slots, but we will not explicitly prevent other HTML from being slotted there. The `action` slot only expects `nimble-button` or `nimble-anchor`, and we will use the CSS `::slotted()` pseudo-element to remove all but those two element types. We will not explicitly prevent multiple elements from being slotted in the `action` slot, though we formally only support one.

### Anatomy

```html
<div class="icon">
    ${when(x => x.severity === 'error', html`<nimble-icon-exclamation-mark
    ></nimble-icon-exclamation-mark>`)} ${when(x => x.severity === 'warning',
    html`<nimble-icon-triangle-filled></nimble-icon-triangle-filled>`)} ${when(x
    => x.severity === 'info', html`<nimble-icon-info></nimble-icon-info>`)}
</div>
<div class="text">
    <slot name="title"></slot>
    <slot></slot>
</div>
<div class="end">
    <slot name="action"></slot>
    <div class="close">
        ${when(x => !x.preventDismiss), html`
        <nimble-button appearance="ghost" content-hidden>
            <nimble-icon-xmark slot="start"></nimble-icon-xmark> </nimble-button
        >` )}
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
    -   the action button/link and the close button will be focusable tab stops
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
