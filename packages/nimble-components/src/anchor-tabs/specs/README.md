# Anchor Tabs

## Overview

Anchor tabs are a sequence of tabs that navigate to URLs when activated.

### Background

[Visual Design spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs/) (same visual design as non-anchor tabs)

[GitHub issue](https://github.com/ni/nimble/issues/479)

### Non-goals

- Mixing regular tabs and anchor tabs together
- Vertical tabs orientation

### Features

- Functions like an anchor (i.e. navigates) upon activation
- Supports keyboard navigation within group of tabs without automatically activating each focused tab
- Disable individual tabs

### Risks and Challenges

None

### Prior Art/Examples

In SLE:

![SLE](sle-systems.png)

In GitHub:

![GitHub](github.png)

---

## Design

Anchor tabs have the same appearance as a standard tabs control, i.e. a sequence of operable regions with labels, each of which corresponds to some target content to display. In the case of anchor tabs, they do not switch between pre-configured tab panels, but rather navigate to some URL. The tabs can be configured to load the URL in a specific target, like an `iframe`.

The design consists of an "Anchor tabs" container component which contains one or more "Anchor tab" components. This mirrors the existing design of the `nimble-tabs` and `nimble-tab` components, however there is no analog for the `nimble-tab-panel` component. Instead, the content loaded from the configured URL(s) loads into the containing page, an `iframe`, a new window, etc.

We cannot extend FAST's tabs control because it has baked into it the idea that tabs activate tab panels. Instead we will create new components from scratch, but we can likely borrow logic from FAST e.g. for handling keyboard navigation.

### API

#### Anchor Tabs

- *Component Name* - `nimble-anchor-tabs`
- *Props/Attrs*
    -   `activeid` - id of active tab. Defaults to the first tab.
- *Methods* - None
- *Events*
    - `change` - fired when the active tab changes
- *CSS Classes and CSS Custom Properties that affect the component* - None
- *Slots*
    -   `start` - content placed to the left of tab list
    -   `anchortab` - slot for anchor tab elements
    -   `end` - content placed to the right of tab list

#### Anchor Tab

- *Component Name* - `nimble-anchor-tab`
- *Props/Attrs*
    -   `download` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `href` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).
    -   `hreflang` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `ping` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `referrerpolicy` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `rel` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `target` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `type` - see [HTML anchor doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes)
    -   `disabled` - disables the tab (this matches the API of the existing `nimble-tab`)
- *Methods* - None
- *Events* - None
- *CSS Classes and CSS Custom Properties that affect the component* - None
- *Slots*
    - *default*

### Anatomy

#### Anchor Tabs

```html
<template>
    <slot name="start"></slot>
    <nav class="tablist">
        <ul>
            <slot name="anchortab"></slot>
        </ul>
    </nav>
    <slot name="end"></slot>
</template>
```

#### Anchor Tab

```html
<template slot="anchortab">
    <li>
        <a>
            <slot></slot>
        </a>
    </li>
</template>
```

### Angular integration

There will be Angular directives for both `nimble-anchor-tabs` and `nimble-anchor-tab`. The latter will derive from `NimbleAnchorBaseDirective` which has the standard HTML anchor attributes.

Tabs do not participate in forms, so there is no ControlValueAccessor.

**[routerLink] and [routerLinkActive] Support**

We will follow the same approach previously used for the BreadcrumbItem, Anchor, and AnchorButton:

-   We will create a directive that extends `RouterLinkWithHref`, and its selector will be `nimble-anchor-tab[nimbleRouterLink]`. The directive will define `@Input nimbleRouterLink` (which sets `routerLink`). This is a small change for clients which we will document (consistent with BreadcrumbItem, Anchor, and AnchorButton), and other routerLink attributes can still be used as-is:
    ```html
    <nimble-anchor-tab
        nimbleRouterLink="/customapp"
        [queryParams]="{debug: true}"
        [state]="{tracingId: 123}"
    >
        Custom App Page
    </nimble-anchor-tab>
    ```
-   A separate directive will be created to disable use of the `routerLink` attribute on `nimble-anchor-tab` elements.

### Blazor integration

Blazor wrappers will be created for both `nimble-anchor-tabs` and `nimble-anchor-tab`. There are no special routing considerations/mechanisms for Blazor.

### Visual Appearance

[XD Design](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/)

The design for navigation tabs will be the same as for standard tabs. The standard Nimble tabs do not (yet) have specific support for icons or alert indicators, so we will (initially) not implement those for navigation tabs either.

In addition to indicating which tab is active, navigation tabs must also separately indicate which tab has keyboard focus. I.e. you can arrow through tabs without activating those tabs, and there must be a visual indication of which tab has keyboard focus. We will indicate the focused tab with a double underline similar to what the existing tab control shows when keyboard focused, but it will be two thin lines when focusing a non-selected tab. When focusing the selected tab, the two thin underlines will overlap the thicker underline indicating selection, so we end up with a visual that is consistent with our existing tab control.

---

## Implementation

As long as there is at least one non-disabled tab in the tabs group, we will have an active tab. Upon connecting `nimble-navigation-tabs` to the DOM, we will activate (i.e. navigate to) the tab specified as initially active. If no tab was specified as initially active, we will default to the first non-disabled tab.

Each `nimble-navigation-tab` must have an id so that `nimble-navigation-tabs`'s `activeid` has a valid value. If the user does not specify an id for a tab, we will generate one using FAST's `uniqueId()` utility function.

If the active tab becomes disabled, it will remain active. We will not automatically activate a different tab.

When the tabs group gains or loses focus we must set or remove the `focused` class from one of the child tabs. To do this, we will add `onfocus` and `onblur` event handlers to the tabs group.


### States

#### Keyboard focused state
When tabbing to the `nimble-navigation-tabs`, it gets keyboard focus. To indicate this, the active tab (which is already underlined) gets a second, thinner underline.

### Accessibility

- *Keyboard Navigation and Focus*
    -   The tabs control will have a visual indication of which tab is active (green underline).
    -   Once focused, the tabs control will show a visual indication of which tab has focus, starting with the active tab.
    -   Arrowing left or right will change the focused tab. Arrowing left on the first tab will wrap around to the last, and vice versa.
    -   `Home` will move focus to the first (non-disabled) tab.
    -   `End` will move focus to the last (non-disabled) tab.
    -   The `Enter` or `Space` key will activate the focused tab, moving the active indicator and loading the tab's associated URL.
- *Form Input*
    - N/A
- *Use with Assistive Technology*
    - We cannot use the `tablist`, `tab`, and `tabpanel` roles because we have no `tabpanel`s. Instead we use a `nav` container element (which has role `navigation`) and `link` roles on each of our tabs. An element with role `navigation` should have a label that describes the navigation group. The user will have to provide this, so we will propagate the `aria-label` attribute value to the `nav` element in the shadow DOM.

### Globalization

N/A

### Security

N/A

### Performance

N/A

### Dependencies

None

### Test Plan

Unit tests will be created that exercise the API.

### Tooling

N/A

### Documentation

We will create a new Storybook entry for navigation tabs that documents the API.

---
## Open Issues