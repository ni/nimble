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


- *Component Name*: `nimble-anchor`
- *Properties/Attributes*: We will have two new properties/attributes: `underline` and `emphasis`. When present, the `underline` attribute will cause an underline to always be visible (as opposed to only on hover). Setting `emphasis` on the anchor will cause it to be shown in an accent color (as opposed to the text color). Furthermore, there will be a `disabled` property/attribute to make the anchor inoperable.
- *Methods*: Unchanged (none)
- *Events*: Unchanged (none)
- *CSS Classes and Custom Properties that affect the component*: Unchanged (none)
- *Slots*: We will not expose the start or end slot, because there isn't currently any need to.

### Angular integration

A directive will be created for the anchor component. The anchor does not participate in forms, so there will be no ControlValueAccessor.

### Blazor integration

We will create a Blazor wrapper for the anchor.

### Additional requirements

- *User interaction:* None
- *Styling:* When it has keyboard focus, the anchor will have a double underline.
- *Testing:* None
- *Documentation:* Should direct users to set the `underline` attribute when using the anchor inline with text.
- *Tooling:* None
- *Accessibility:* Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
- *Globalization:* None
- *Performance:* None
- *Security:* None

---

## Open Issues
