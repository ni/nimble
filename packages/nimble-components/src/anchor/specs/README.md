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
-   _Properties/Attributes_: We will have two new properties/attributes: `underline` and `emphasis`. When present, the `underline` attribute will cause an underline to always be visible (as opposed to only on hover). Setting `emphasis` on the anchor will cause it to be shown in an accent color (as opposed to the text color). Furthermore, there will be a `disabled` property/attribute to make the anchor inoperable.
-   _Methods_: Unchanged (none)
-   _Events_: Unchanged (none)
-   _CSS Classes and Custom Properties that affect the component_: Unchanged (none)
-   _Slots_: We will not expose the start or end slot, because there isn't currently any need to.

### Angular integration

A directive will be created for the anchor component. The anchor does not participate in forms, so there will be no ControlValueAccessor.

### Blazor integration

We will create a Blazor wrapper for the anchor.

### Additional requirements

-   _User interaction:_ None
-   _Styling:_ When it has keyboard focus, the anchor will have a double underline.
-   _Testing:_ None
-   _Documentation:_ Should direct users to set the `underline` attribute when using the anchor inline with text.
-   _Tooling:_ None
-   _Accessibility:_ Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
-   _Globalization:_ None
-   _Performance:_ None
-   _Security:_ None

---

## Open Issues
