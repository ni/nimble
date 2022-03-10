# Nimble Toolbar

## Overview

The `nimble-toolbar` will provide a layout mechanism for combining other components into a toolbar. It will include support for navigating between components using the keyboard.

### Background

[FAST toolbar example](https://explore.fast.design/components/fast-toolbar)

There is no official visual spec for a nimble toolbar yet, but the design can be adapted from the [Systems Management grid visual spec](https://xd.adobe.com/view/63af23a9-b25f-484c-9fb6-ba387ddf3b54-36fc/screen/d526239a-35fd-4ec2-82c2-2fe13474bca0/).

## Design

### API

[FAST component spec](https://github.com/microsoft/fast/blob/9ff8dce1424ff2a4bac1bba51cf4f32d86438823/packages/web-components/fast-foundation/src/toolbar/toolbar.spec.md)

-   Component Name: `nimble-toolbar`
-   Properties/Attributes:
    -   orientation - supported in FAST, but will not be supported in nimble; only the default value of `horizontal` will be supported
-   Methods: _Unchanged from FAST_
-   Events: _Unchanged from FAST_
-   CSS Classes and Custom Properties that affect the component: _Unchanged from FAST_
-   Slots:
    -   Styling of slots:
        -   'label' - there is no planned use of the 'label' slot; it will be hidden
        -   'start' - left aligned with standard padding between components
        -   _default_ - centered between 'start' and 'end' with standard padding between components; it is unlikely this will be used in any/many designs
        -   'end' - right aligned with standard padding between components

### Angular integration

An angular directive will be created for the toolbar. It will be very lightweight since the toolbar does not provide any functionality other than providing appropriate layout of slotted content.

### Additional requirements

-   None

## Open Issues

-   There is currently a bug with the FAST toolbar related to keyboard navigation and disabled buttons. An [issue](https://github.com/microsoft/fast/issues/5723) has been created to FAST, and we can attempt to upstream a fix for this if necessary.
