# Nimble Toggle Button Group

## Overview

The `nimble-toggle-button-group` is a component used to group related `nimble-toggle-button` options
in the UI. Grouping a set of buttons allows us to apply group logic to the buttons and provide a
selected value to clients, similar to a radio group. A toggle button group component is distinct
from a radio group in that it allows deselection by the user after a selection has been made.

### Background

[GitHub Issue #298: toggle-button-group Component](https://github.com/ni/nimble/issues/298)

An IxD and Visual Design spec for the toggle button group component have not been provided. For the
initial version of the component, we will not apply any additional styling to the toggle buttons
within the toggle button group. The component will remain "Incubating" until we get agreement on the
interaction and visual design.

The new Routines UX in SystemLink Enterprise calls for selecting an **Event** an an **Automated
action** from a group of toggle buttons. See
[Figma: NorthStar Vision for SLE Routines](https://www.figma.com/file/VQ7WIi3qqRG3r19VXqVvem/Stratus-Routines?type=design&node-id=1%3A74129&mode=design&t=KfPTwy4IhHbt42LR-1).
We are designing the toggle button group component to fit that use case.

While we don't have an IxD spec document, we do have UX guidance for behavior and layout from our
interaction designer in Figma
[here](https://www.figma.com/file/VQ7WIi3qqRG3r19VXqVvem/Stratus-Routines?type=design&node-id=407%3A14045&mode=design&t=vgC1XGNqNYobFXhN-1)
and
[here](https://www.figma.com/file/VQ7WIi3qqRG3r19VXqVvem/Stratus-Routines?type=design&node-id=328%3A21336&mode=design&t=5MYFRia8HRBt86hL-1).

The goal of the toggle button group in the Routines UI is to solve one of the core UX problems for
the workflow:

> How do we allow the user to quickly learn that:
>
> 1.  Not all events and actions can be paired
> 2.  Easily find an alternative if their first-instinct is not available (ie, if I can’t display
>     a banner, maybe a notification could also work)
> 3.  Recover and “re-set” if the first selection proves to not be pair-able with any interesting
>     options

Using the Figma mock-up of the UI, "casual testing with users showed that users found the "unselect"
option by un-toggling the selected button."

### Non-goals

-   We do not currently plan to provide any built-in layout options for the component. Different
    layout behavior can be achieved with CSS `flex` properties set by the clients (vertical vs
    horizontal arrangement, fit-to-content vs stretch, line wrapping behavior and grid layout). In
    the future, it might make sense to provide built-in layout options for the most common layout
    choices, but with only one use case we don't want to guess at the most desirable options.
-   We do not plan to support multiselect. Similar components in other control libraries commonly
    support multi-selection, but that capability can be added at a future time when we have a use
    case for it.
-   We do not plan to support requiring a selection. This would be possible to add in the future.
    This could likely be added on the client side as well (see React MUI under
    [Prior Art/Examples](#prior-artexamples)), but for now our guidance should be to use a radio
    group in situations where a selection is required.

### Features

The requirements for the Routines UI are as follows:

-   Exclusive selection, i.e. only one button can be checked at a time.
-   Deselection, i.e. no selection is required and the user can clear the selection by clicking the
    checked button.
    -   This is where the toggle button group is distinct from a radio group with toggle-button-styled
        children. A radio group by definition does not allow you to deselect an option and leave the
        component with no selected value once any option has been selected.
-   Ability to set a default/initial value
-   Ability to clear the value programmatically (based on other UI selections)
-   Allowing for disabled buttons in the group. Clients can be responsible for unchecking the button
    before disabling it, but the toggle button group should treat all enabled buttons as valid
    options.

### Risks and Challenges

For Angular support, we may be required to implement a custom `ControlValueAccessor`. There are very
few existing examples in Nimble of custom ControlValueAccessors. See
[Angular integration](#angular-integration) for more details.

### Prior Art/Examples

Many control libraries have some form of a toggle button group. The API and behavior across these
controls is not standardized, however. Many of them behave like a radio group (not allowing
deselection). Some notable examples:

-   React MUI [ToggleButtonGroup](https://mui.com/material-ui/react-toggle-button/)
    -   Single select and multiselect.
    -   Allows deselection by default. Enforcing a value set requires handling on the client side.
-   Angular Material [Button Toggle](https://material.angular.io/components/button-toggle/overview)
    -   Single select and multiselect
    -   Single select behaves like a radio group, with no deselection allowed.
-   (Internal) PlatformFramework [ChoiceToggleButtonGroup](https://dev.azure.com/ni/DevCentral/_git/ASW?path=%2FSource%2FDiagramSdk%2FPlatformFramework%2FControls%2FShell%2FChoiceToggleButtonGroup.cs&version=GBmain&_a=contents)
    -   Single select and multiselect
    -   Single select behaves like a radio group, with no deselection allowed.

---

## Design

The `nimble-toggle-button-group` will manage the checked states of the child toggle buttons. The
`nimble-toggle-button-group` will only interact with `nimble-toggle-button` children. The client
will set a `value` on each `nimble-toggle-button` child, and the `value` of the
`nimble-toggle-button-group` will reflect the `value` of whichever `nimble-toggle-button` is
checked.

When one child toggle button is checked, the `nimble-toggle-button-group` will uncheck the other
children. When it is disabled, it will disable its children.

Here's an example of the basic component usage:

```html
<nimble-toggle-button-group>
    <nimble-toggle-button value="button-1">Button 1</nimble-toggle-button>
    <nimble-toggle-button value="button-2">Button 2</nimble-toggle-button>
    <nimble-toggle-button value="button-3">Button 3</nimble-toggle-button>
</nimble-toggle-button-group>
```

### API

-   _Component Name_
    -   `nimble-toggle-button-group`
-   _Props/Attrs_
    -   `disabled`
        -   Disables the toggle button group and all children.
    -   `value`
        -   The `value` of the checked toggle button.
        -   If no toggle button is checked, can return null.
-   _Methods_
    -   none
-   _Events_
    -   `change`
        -   Notifies clients of a change to the `value`.
-   _CSS Classes and CSS Custom Properties that affect the component_
    -   none
-   _How native CSS Properties (height, width, etc.) affect the component_
    -   Open question: I'm 100% not sure what's expected for this question.
    -   See [Visual Appearance](#visual-appearance) for a discussion of the layout of buttons in a
        toggle button group.

### Anatomy

The component does not require anything in its template beyond a single `slot` to hold the child
toggle buttons.

-   _Slot Names_
    -   `(default)`
        -   The toggle buttons to display in the toggle button group.
-   _Host Classes_
    -   none
-   _Slotted Content/Slotted Classes_
    -   none
-   _CSS Parts_
    -   none

### Angular integration

We will create an Angular `nimble-toggle-button-group` directive. The component will require a
`ControlValueAccessor` directive for form integration. Depending on the implementation, we may need
a custom implementation of `ControlValueAccessor`, because there is not an existing Angular
`ControlValueAccessor` with the behavior we require.

There are two options for form integration, and the choice will affect how the logic of the
component is implemented.

1.  Form integration at the level of the `nimble-toggle-button-group` itself

    -   In this approach, the client would bind to the value of the `nimble-toggle-button-group`.
    -   This is similar to the React MUI and Angular Material implementations for their button group
        components.
    -   We would create a `ControlValueAccessor` directive with a selector to target
        `nimble-toggle-button-group`.
        -   We may be able to extend the `DefaultValueAccessor` for our directive, since the `value`
            is a string.

    ```html
    <nimble-toggle-button-group [(ngModel)]="selectedButton">
        <nimble-toggle-button value="button-1">Button 1</nimble-toggle-button>
        <nimble-toggle-button value="button-2">Button 2</nimble-toggle-button>
        <nimble-toggle-button value="button-3">Button 3</nimble-toggle-button>
    </nimble-toggle-button-group>
    ```

2.  Form integration targeted at toggle buttons with a `value` property

    -   In this approach, the client would bind to the value of each of the child toggle buttons.
    -   From a client perspective, this would be more consistent with the pattern used by
        `radio-group`, where the group itself does not provide the value for forms.
    -   We could create a `ControlValueAccessor` directive targeted at `nimble-toggle-button`
        components with a `value` property (`nimble-toggle-button[formControlName][value]`)
    -   This would require a custom implementation of `ControlValueAccessor`. The existing Angular
        `ControlValueAccessor` implementations do not provide the behavior we require. The
        `RadioControlValueAccessor` is the closest, but it does not handle deselection from the UI.

    <!-- prettier-ignore -->
    ```html
    <nimble-toggle-button-group>
        <nimble-toggle-button value="button-1" [(ngModel)]="selectedButton">Button 1</nimble-toggle-button>
        <nimble-toggle-button value="button-2" [(ngModel)]="selectedButton">Button 2</nimble-toggle-button>
        <nimble-toggle-button value="button-3" [(ngModel)]="selectedButton">Button 3</nimble-toggle-button>
    </nimble-toggle-button-group>
    ```

Option 1 is the simpler approach. If we are particularly concerned about similarity/familiarity with
the radio group pattern for clients, then Option 2 would be preferred.

### Blazor integration

We will create a Blazor wrapper for the new component, if time allows, following the same patterns
as used for existing Nimble components.

### Visual Appearance

We do not intend to apply any custom visual appearance to the toggle buttons themselves within the
toggle button group for the first iteration of this component. All of the existing toggle button
visual states will be honored (see [States](#states)).

We have guidance from interaction design on the desired layout of the buttons, which consists of a
grid with a gap between the buttons and dynamic sizing/wrapping of the buttons. See the Figma
documentation
[here](https://www.figma.com/file/VQ7WIi3qqRG3r19VXqVvem/Stratus-Routines?type=design&node-id=328%3A21336&mode=design&t=5MYFRia8HRBt86hL-1).

This can be achieved with the following style:

```css
:host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 4px;
}
```

The exact `minmax` width and `gap` are placeholders that can be filled in from the Figma design.

Functionally, our use case in a `nimble-drawer` slide-out does not require dynamic resizing, because
the width of the drawer in a slide-out is not dynamic/resizable. Still, we could provide this as the
default or as an example in the storybook.

We do not currently plan to provide any built-in layout options for the component. Different layout
behavior can be achieved with CSS `flex` properties set by the clients (vertical vs horizontal
arrangement, fit-to-content vs stretch, line wrapping behavior and grid layout). In the future, it
might make sense to provide built-in layout options for the most common layout choices, but with
only one use case we don't want to guess at the most desirable options.

---

## Implementation

Open question: How much implementation detail is expected?

### States

Open question: The intention of this section is not clear to me. It seems to have been interpreted
differently in the handful of existing specs that filled it out (most are N/A or empty). Does it
refer to visual states or are we looking for implementation details?

The toggle button group will not have its own visual states. The `nimble-toggle-button` already has
well-established visual states, which will be honored and not interfered with by the toggle button
group (checked, unchecked, disabled, hover, etc.).

### Accessibility

The component itself will not be focusable. Instead, keyboard focus will go to the first button in
the group when you tab to the component.

The component will support using the `Enter` and `Space` keys to change the button selection for
each of the child buttons. Enter and Space are already supported by the `nimble-toggle-button`, but
the toggle button group will need logic to enforce `multiple` and `requires-selection` and to send
the `selection-changed` event when the keyboard interactions are used.

The toggle button group will have an ARIA role of `group`, similar to the React MUI and Angular
Material implementations of their button group controls.

When the toggle button group is disabled, it will set `aria-disabled` on all child buttons. If a
single toggle button is disabled within the group, tabbing will skip that button.

### Mobile

The client may choose `flex` attributes to component the sizing and wrapping behavior of the button
group, and should consider mobile behavior when choosing that behavior. The component itself does
not have any mobile consideration.

### Globalization

There are no globalization considerations.

### Security

There are no security considerations.

### Performance

There are no performance considerations.

### Dependencies

None.

### Test Plan

The test plan involves writing unit tests to verify the core functionality of the component. All
tests for this component will follow the standards set by the Nimble repository, which include unit
tests to assess component logic and Chromatic tests to cover all visual states of the component.

### Tooling

No tooling considerations.

### Documentation

We will create a Storybook page for documenting the component. No additional documentation is
required.

---

## Open Issues

1. The style of form integration is an open issue. See [Angular integration](#angular-integration).
2. The implementation section likely needs more detail. I can add detail as we get closer to the
   final design.
