# Nimble Toggle Button

## Overview

The `nimble-toggle-button` component allows a user to create a button that has two states, on and off.

### Background

`nimble-toggle-button` will be based on FAST Foundation's `switch`.

While the toggle button will be based functionally on the switch, a custom template will be provided so that it will visually appear like a button. As with `nimble-button`, `nimble-toggle-button` will support being an icon-only button, a text-only button, or a text & icon button. It will also have the same appearance modes as `nimble-button`.

The visual design spec can be found [here](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/).

---

## Design

### API

[FAST API switch documentation](https://github.com/microsoft/fast/blob/2cbba7d9ed4900ef2c69d0a9721cc98d742a583d/packages/web-components/fast-foundation/src/switch/switch.spec.md)

_Component Name_ `nimble-toggle-button`

_Properties/Attributes_

Properties & attributes of the FAST switch and additionally:

-   appearance - will support same appearance modes as `nimble-button`
-   contentHidden - to support icon only toggle buttons in a consistent manner as `nimble-button`

_Methods -- unchanged_

_Events -- unchanged_

_CSS classes and custom properties that affect the component -- unchanged_

_Slots_

-   start - the expected slot for the icon
-   _default_ - the expected slot for text content

Unlike the FAST switch, the `nimble-toggle-button` will not support the following slots because [toggle buttons should not change their message based on whether or not they are checked](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed):

-   unchecked-message
-   checked-message

_Template_

In order to have the toggle button visually appear like a button, a custom HTML template will be provided for it. The HTML of the template will be very similar to the FAST switch with the contents similar to the FAST button so that the toggle button and button can share CSS.

```html
<template
    role="button"
    aria-pressed="${(x: ToggleButton) => x.checked}"
    aria-disabled="${(x: ToggleButton) => x.disabled}"
    aria-readonly="${(x: ToggleButton) => x.readOnly}"
    tabindex="${(x: ToggleButton) => (x.disabled ? null : 0)}"
    @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
    @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    class="${(x: ToggleButton) => (x.checked ? 'checked' : '')}"
>
    <div class="control" part="control">
        <span part="start" class="start">
            <slot name="start"></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
    </div>
</template>
```

### Angular integration

An Angular directive will be created for the toggle button. Additionally Angular's CheckboxValueAccessor directive will be extended for the toggle button for form integration.

### Additional requirements

_Accessibility_

-   As with the `nimble-button`, the `nimble-toggle-button` will manage the internal ARIA labels to ensure that an icon-only button is accessible
-   The `nimble-toggle-button` can be pressed (and therefore toggled) in the same manners as a button: clicking, 'Enter' key, or 'Space' key
-   In the HTML template, the `role` will be specified as `button` and `aria-pressed` will be set to match the value of the `checked` attribute

_Testing_

Because the FAST switch's template will not be used directly, tests related to logic in the template will be added within `nimble-components` for the toggle button. For example, tests that assert that the button has the correct role, aria-pressed value, and tab index will be added within nimble. These tests can be based largely on the [FAST switch's tests](https://github.com/microsoft/fast/blob/2cbba7d9ed4900ef2c69d0a9721cc98d742a583d/packages/web-components/fast-foundation/src/switch/switch.spec.ts).

## Example usage

```html
<nimble-toggle-button checked content-hidden>
    <nimble-icon-access-control slot="start"></nimble-icon-access-control>
    Lock
</nimble-toggle-button>
```

---

## Open Issues

-   None
