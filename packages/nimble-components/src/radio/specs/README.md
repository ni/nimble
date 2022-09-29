# Nimble Radio Button

## Overview

The `nimble-radio` and `nimble-radio-group` are an implementation of a radio button as a form-connected web-component.
Facilitating single select from a group of visible choices through a toggled T/F user input.

### Background

[Nimble Issue 297: Radio](https://github.com/ni/nimble/issues/297)

[Visual Design Spec](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7)

---

## Design

### API

[FAST Radio Button API](https://github.com/microsoft/fast/blob/7934089e4b161ea5a14da817ef2439c0fb47786b/packages/web-components/fast-foundation/src/radio/radio.spec.md)

[FAST Radio Group API](https://github.com/microsoft/fast/blob/7934089e4b161ea5a14da817ef2439c0fb47786b/packages/web-components/fast-foundation/src/radio-group/radio-group.spec.md)

The state of the radio button can be changed by clicking the button or accompanied title. When the radio button has the `disabled` attribute applied, the contents of the button will appear in a greyed-out state and will be non-interactive. This component will include no alternative appearances.

The two components will expose common attributes shared by all components. In addition the 'Radio Group' component exposes an 'orientation' attribute. This will set the visual orientation of the radio group as either vertical or horizontal.

-   _Component Name:_ `nimble-radio` and `nimble-radio-group`
-   _Properties/Attributes:_ We will not expose the `readOnly` property since we don't have a design or a use case to distinguish it from `disabled`. We will document this in the Storybook page. If it is needed at a future time, it can be added then.
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ Unchanged
-   _Template:_ Unchanged

### Angular integration

We will implement an Angular `ControlValueAccessor` with `RadioControlValueAccessor` as the base class: [https://angular.io/api/forms/RadioControlValueAccessor]

### Blazor integration

A Blazor wrapper will be created for the component.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   No additional requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   We believe all styles are possible to achieve.
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   No additional requirements, their tests have good coverage and our component is not adding any custom functionality that requires additional testing
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No additional requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No additional requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   In its implementation for keyboard naviagtion, FAST uses arrow keys to navigate radio items. FAST also sets the ARIA role to `radio` for radio buttons and `radiogroup` for radio groups. No additional requirements needed as of now.
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No additional requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No additional requirements
-   _Security: Any requirements for security?_
    -   No additional requirements

---

## Open Issues
