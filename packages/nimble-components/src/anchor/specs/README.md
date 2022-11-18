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
-   _Properties/Attributes_: We will have the following properties/attributes in addition to the ones provided by the FAST anchor:
    - `appearance`:
        - `"text"`: (Default) the "standalone" version in the design doc. Looks like plain text, but gets and underline on hover.
        - `"inline-text"`: like `"text"`, but always shows an underline.
        - `"outline"`: same as button design
        - `"ghost"`: same as button design
        - `"block"`: same as button design
    - `appearance-variant`:
        - `"default"`: `undefined` (as per our common attribute guidelines)
        - `"primary"`: applies only to button-based styles and has the same effect as on buttons
        - `"prominent"`: applies only to `"text"` and `"inline-text"` appearances. It is the "loud" version from the design doc. Colors the link text green. The name of this attribute value comes from the Breadcrumb.
    - `contentHidden`: when set, hides the label and end slot
    - `disabled`: when set, makes the anchor inoperable and changes the styling
-   _Methods_: Unchanged (none)
-   _Events_: Unchanged (none)
-   _CSS Classes and Custom Properties that affect the component_: Unchanged (none)
-   _Slots_: Unchanged (start and end slots)

We are not implementing navigation tabs as part of this effort. That might be implemented in the future by populating a `nimble-tabs` control with `nimble-anchor`s. It may require a new appearance mode.

### Angular integration

A directive will be created for the anchor component. The anchor does not participate in forms, so there will be no ControlValueAccessor.

### Blazor integration

We will create a Blazor wrapper for the anchor.

### Additional requirements

-   _User interaction:_ None
-   _Styling:_
    - When it has keyboard focus, the anchor will have a double underline.
    - CSS for button styles will be shared as much as possible
    - CSS for hyperlink styles will be shared as much as possible with the Breadcrumb
-   _Testing:_ None
-   _Documentation:_ Should direct users to set the `underline` attribute when using the anchor inline with text.
-   _Tooling:_ None
-   _Accessibility:_ Need to `applyMixins` on the Nimble anchor type, from the `DelegatesARIALink` class.
-   _Globalization:_ None
-   _Performance:_ None
-   _Security:_ None

---

## Open Issues
