# Nimble Anchored Region

## Overview

The `nimble-anchored-region` is a nimble component that implements FAST Foundation's anchored region.

From [FAST](https://github.com/microsoft/fast/tree/5a3761ad4183d51ddb229952d3bd4daed87ff7fc/packages/web-components/fast-foundation/src/anchored-region):

An anchored region is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another "anchor" element. Additionally, the anchored region can react to the available space between the anchor and a parent ["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most available space, or even resize itself based on that space.

### Background

The anchored region is a dependency of some other components because the FAST templates for those components dynamically create an anchored region using `tagFor(AnchoredRegion)`. Therefore, we need a nimble component that will be returned from that function. It is not expected that the nimble-anchored-region to be used directly by clients, and, therefore, wrappers will not be created for it in Angular or Blazor.

FAST components that rely on the anchored region:

-   Tooltip
-   Menu items that contain nested menus
-   Picker
-   Possibly the Select in the future ([see discussion on this issue](https://github.com/microsoft/fast/issues/4791))

## Design

### API

[FAST achored region API](https://github.com/microsoft/fast/blob/5a3761ad4183d51ddb229952d3bd4daed87ff7fc/packages/web-components/fast-foundation/src/anchored-region/anchored-region.spec.md)

-   _Component Name:_ `nimble-anchored-region`
-   _Properties/Attributes:_ Unchanged
-   _Methods:_ Unchanged (none)
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ None
-   _Slots:_ Unchanged

### Angular integration

As the anchored region is only needed internally by other components, no Angular support will be added for it.

### Blazor integration

As the anchored region is only needed internally by other components, no Blazor support will be added for it.

### Additional requirements

_None_

---

## Open Issues
