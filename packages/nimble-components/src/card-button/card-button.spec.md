# nimble-card-button

## Overview

The `nimble-card-button` is a button that is designed to contain arbitrary content that is specified by a client application. The `nimble-card-button` is intended to be larger and more prominent on a page than the standard `nimble-button`.

The `nimble-card-button` will have minimal styling associate with it, as the majority of the styling will be the responsibility of the client. The styling that the `nimble-card-button` is responsible for will be the hover, focus, mouse-down, selected, and disabled states of the button.

### Background

[Nimble Issue](https://github.com/ni/nimble/issues/643)

[UX Design for use within SystemLink](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20) - note: the content of the button along with its placement within a page is expected to vary greatly. The linked UX spec is specific to one usage within SystemLink, but it shows the states of the button.

## Design

### API

[FAST button API](https://github.com/microsoft/fast/blob/0f63894082e89bbd7502e507d92932561322899e/packages/web-components/fast-foundation/src/button/button.spec.md)

-   Component Name - `nimble-card-button`
-   Properties/Attributes - An additional `selected` boolean attribute that has styling associated with it will be added. This is required by the summary panel in SystemLink. For accessiblity the value of [aria-current](https://www.w3.org/TR/wai-aria-1.1/#aria-current) will be configured based on the value of `selected`. An attribute is favored over a css class so that changes to the value can easily be observered in order to update the value of `aria-current`.
-   Methods - _unchanged_
-   Events - _unchanged_
-   CSS Classes and Custom Properties that affect the component - _unchanged_
-   Slots - The `start` and `end` slots of the FAST button will not be used because it is the responsibility of client apps to style their content. Therfore, the `start` and `end` slots will be styled as hidden.

### Angular integration

An Angular directive will be created for the new component. A ControlValueAccessor is not required.

### Blazor integration

A Blazor wrapper will be created for the new component.

### Additional requirements

-   Styling: A `selected` attribute will added to the API and will be used for styling.
-   Testing: Unit tests will be added to ensure the value of `selected` and `aria-current` stay synchronized with each other.
-   _Documentation: No additional requirements_
-   _Tooling: No additional requirements_
-   Accessibility: [aria-current](https://www.w3.org/TR/wai-aria-1.1/#aria-current) will be used to make the `selected` state accessible.
-   _Globalization: No additional requirements_
-   _Performance: No additional requirements_
-   _Security: No additional requirements_

## Alternative Solutions

### Use existing `nimble-button`

Rather than creating an additional component within nimble, an appearance mode could be added to the existing `nimble-button`. Creating a new component is the preferred approach because:

1. The button appearance modes apply to the `nimble-button`, `nimble-toggle-button`, and the `nimble-menu-button`. It would be difficult to add the new appearance mode to the `nimble-button` without it affecting the `nimble-toggle-button` and `nimble-menu-button`.
1. The API for the `nimble-button` contains a number of configurations that do not apply to the new component. For example, there is no concept of being `primary` or having `content-hidden` on the new component. Having multiple attributes that only apply in certain configurations makes the components more difficult to understand, test, and document. Additionally, the new button needs a `selected` attribute that would not apply to any of the existing appearances of the `nimble-button`.
1. Similar to the API differences in the statement above, the `nimble-button` is documented to use `start` and `end` slots while the new appearance of a button does not. While we could document that the new appearance mode hides the `start` and `end` slots, but significant differences to the API/behavior/styling make the component more complex to understand, test, and document.
1. There is a minimal amount of styling that could be shared between the existing appearances of the `nimble-button` and the new appearance. As a result, most of the button styling will have to be overwritten in the `appearanceBehavior` for a new appearance.

### Give the button toggle-button behavior

Because the new component has the concept of being selected, an option could be to give it toggle-button behavior. This doesn't make sense because the behavior doesn't align with a toggle-button. As a result, apps will have to add extra logic to get it to behave correctly.

1. In some cases, there is no concept of selection. Therefore, a version that behaves like a toggle button and a version that behaves like a traditional button would be required (which would be a significantly larger amount of work).
1. Even when an app has the notion of a button being selected, such as the SystemLink summary panel, the button should not become unselected by clicking on it again.

---

## Open Issues

_None_
