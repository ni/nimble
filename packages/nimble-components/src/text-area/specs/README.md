# Nimble Text Area

## Overview

A text area is a multi-line text input control.

### Background

[Visual Design](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/)

---

## Design

### Scroll Bar

The design document includes a custom scroll bar design (looks similar to Mac scroll bars). Brandon wanted us to execute that design, or as close to it as we could. However, this is not as simple as styling other parts of the FAST controls, and FAST already provides reasonable, OS-like scroll bar styling. Therefore we will stick with that for the time being.

### API

[FAST's API](https://github.com/microsoft/fast/blob/ec5ceaefe295bf410b7e3db34867ac600f4a0d0e/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)

_Component Name_ - `nimble-text-area`

_Properties/Attributes_ - Unchanged, except for following:

-   `appearance` - enum
    -   outline (default)
    -   block
-   `list` - though this is part of the FAST `text-area` API, it does not make sense or appear to work. According to the [`datalist` spec](https://html.spec.whatwg.org/multipage/form-elements.html#the-datalist-element), `datalist`s are only supported for `input` elements.
-   `minlength`/`required` - while this affects the `:invalid` state of the control, we do not (yet?) do any styling for an invalid text area.

_Events_ - Unchanged

_CSS Classes and Custom Properties that affect the component_ - Unchanged

_Slots_ - Unchanged

### Angular integration

An Angular directive will be created for the text area. A ControlValueAccessor will also be created based on DefaultValueAccessor.

### Additional requirements

None anticipated.

---

## Open Issues

None.
