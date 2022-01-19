# Nimble Toggle Button

## Overview

The `nimble-toggle-button` component allows a user to create a button that has two states, on and off.

### Background

`nimble-toggle-button` will be based on `nimble-button`, which is based on FAST Foundation's `button`. As with `nimble-button`, `nimble-toggle-button` will support being an icon-only button, a text-only button, or a text & icon button and will have the same appearance modes as `nimble-button`. In addition to the functionality in the `nimble-button` today, it will add toggle functionality and styling for the two different states.

The visual design spec can be found [here](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/).

---

## Design

### API

[FAST API button documentation](https://github.com/microsoft/fast/blob/6db5ed1a1fa14a1dfab17154fcf005c682fccace/packages/web-components/fast-foundation/src/button/button.spec.md)

*Component Name* `nimble-toggle-button`

*Properties/Attributes*
  - attributes existing on the `nimble-button`
    - appearance
    - contentHidden
  - additional attributes for the `nimble-toggle-button`
    - toggled - boolean attribute that specifies whether or not the button is toggled on (true) or off (false); defaults to false
  - `nimble-toggle-button` will expose `type` from the underlying button, but it will be set to a default value of `button`

*Methods -- unchanged*

*Events*
  - additional events for the `nimble-toggle-button`
    - `change: CustomEvent` - no custom data

*CSS classes and custom properties that affect the component -- unchanged*

*Slots*
  - unchanged from `nimble-button`

### Angular integration

An Angular directive will be created for the toggle button. It will duplicate the same functionality that exists in the existing button directive, and it will additionally add a `change` EventEmitter and a `toggled` getter & setter.

A ControlValueAccessor will not be written for the toggle button, as there is no plans for supporting the toggle button within a form.

### Additional requirements

_Accessibility_:
  - The `nimble-toggle-button` will manage the `aria-pressed` attribute on the internal button based on the value of `toggled`
  - Since the `nimble-toggle-button` is based on an underlying button, it can be toggled in any way that the underlying button can be pressed

## Example usage
```html
<nimble-toggle-button toggled content-hidden>
    <nimble-access-control-icon slot="start"></nimble-access-control-icon>
    Lock
</nimble-toggle-button>
```

---

## Open Issues

- None