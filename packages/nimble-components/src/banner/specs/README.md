# Banner

## Overview

The banner is a component used to display a persistent notification to a user.

### Background

[Design specification](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab/)

[GitHub issue](https://github.com/ni/nimble/issues/305)

### Non-goals

- Arbitrary HTML content
- A container component that would enforce design constraints on multiple banners displayed together
- Limitating length of displayed text and/or truncating text with ellipsis

### Features

- Optionally dismissable
- Optional link or button (only 1) to perform an action/navigation
- Distinct designs for banners of type Error, Warning, Info, or Neutral

### Risks and Challenges

None

### Prior Art/Examples

Refer to examples in the "Some examples of screenshots" section of the [GitHub issue](https://github.com/ni/nimble/issues/305).

---

## Design

The banner is a standalone component that spans the width of its containing element, presenting, from left to right, an icon (dependent on Error/Warning/Info type), an optional title, an optional plaintext message, an optional action button or link, and an optional close control. The banner is intended to display short messages (recommended three lines or fewer) that communicate some persistent state or condition.

### API

*The key elements of the component's public API surface:*

- *Component Name*: `nimble-banner`
- *Props/Attrs*:
  - `heading` - if set, a heading with the specified text is shown to the left of the message. OPEN QUESTION: should we instead use the existing `title` attribute?
  - `text` - the message text
  - `prevent-dismiss` - set to hide the close button (attr name taken from Nimble dialog)
  - `type` - one of `error`, `warning`, `info`, or `neutral` (default)
  - `action-text` - the text of the action link/button. If unset, no link/button is displayed.
  - `action-href` - if set, the action element will be a link with the given `href`. (Otherwise, when `action-text` is set, a button element will be displayed.)
  - `action-button-appearance` - either `outline` or `ghost` (default). When an action button is displayed, this controls the appearance variant.
- *Methods*
- *Events*
  - `close` - fired when the banner is dismissed
  - `action` - fired when the action button is activated (by mouse or keyboard). This is the intended way for clients to perform an action.
- *CSS Classes and CSS Custom Properties that affect the component*

### Anatomy

```html
<div class="icon">
  ${when(x => x.type === 'error', html`<nimble-icon-exclamation-mark></nimble-icon-exclamation-mark>`)}
  ${when(x => x.type === 'warning', html`<nimble-icon-triangle-filled></nimble-icon-triangle-filled>`)}
  ${when(x => x.type === 'info', html`<nimble-icon-info></nimble-icon-info>`)}
</div>
<div class="text">
  <span class="heading">
    ${x => x.heading}
  </span>
  ${x => x.text}
</div>
<div class="action">
  ${when(x => x.actionText && x.actionHref, html`
    <nimble-anchor href="${x => x.actionHref}">${x => x.actionText}</nimble-anchor>`
  )}
  ${when(x => x.actionText && !x.actionHref, html`
    <nimble-button appearance="${x => x.actionButtonAppearance}">${x => x.actionText}</nimble-button>`
  )}
</div>
  <div class="close">
  ${when(x => !x.preventDismiss), html`
    <nimble-button appearance="ghost" content-hidden>
      <nimble-icon-xmark slot="start"></nimble-icon-xmark>
    </nimble-button>`
  )}
  </div>
```

### Angular integration

An Angular wrapper will be created for `nimble-banner`. No `ControlValueAccessor` is needed.

`routerLink` will not be supported for the link.

### Blazor integration

Blazor integration for the `nimble-banner` will be provided.

### Visual Appearance

See XD document link at the top of this document.

The biggest issue is that we will have to completely re-style the icons, link, and buttons:
- Primary icon (error, warning, or info) color is transparent white (in all themes)
- Action button height is 24px (instead of 32px)
- Action button hover border color is white (in all themes)
- Action link color is white (in all themes)
- Close button is 16px square
- Close button icon is 8px square
- Close button hover effect is background color change (transparent white) rather than border

We are not able to directly style some of these elements, because they are in the shadow DOM of  `nimble-icon-*` and `nimble-button`. We will have to resort to overriding Nimble token values, like `--ni-nimble-icon-color` and `--ni-nimble-icon-size`.

---

## Implementation

### States

N/A

### Accessibility

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
    - the action button/link and the close button will be focusable tab stops
- *Form Input*
    - N/A
- *Use with Assistive Technology*
  - the banner will have the ARIA role of `status`. The role `alert` was considered, but it is too aggressive for the range of banner use cases.
  - the `status` role has implicit `aria-live` value of `polite`
  - if the user supplies a title, we will set `aria-label` to that value
  - the user may specify `aria-label` on the `nimble-banner`, but it is not required
- *Behavior with browser configurations like "Prefers reduced motion"*
  - N/A

### Globalization

N/A

### Security

N/A

### Performance

N/A

### Dependencies

N/A

### Test Plan

Unit tests will be created that exercise all features.

### Tooling

N/A

### Documentation

Storybook stories will be created.

---
## Open Issues