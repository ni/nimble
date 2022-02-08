# Nimble Text Area

## Overview

A text area is a multi-line text input control.

### Background

[Visual Design](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/)

---

## Design

### API

[FAST's API](https://github.com/microsoft/fast/blob/ec5ceaefe295bf410b7e3db34867ac600f4a0d0e/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)

_Component Name_ - `nimble-text-area`

_Properties/Attributes_ - Unchanged, except for following:

-   `appearance` - enum
    -   outline (default)
    -   block

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
