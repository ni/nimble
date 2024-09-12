# Required Input Controls

## Problem Statement

Input controls are often used in forms or property editor dialogs. Often the user is required to provide an input to the control before the form can be submitted or before the property changes can be saved.

We need to provide a standardized way for the application to let the end-user know that a control is required.

Initially, we need this for:
- `nimble-combobox`
- `nimble-number-field`
- `nimble-radio`/`nimble-radio-group`
- `nimble-select`
- `nimble-text-area`
- `nimble-text-field`

## Links To Relevant Work Items and Reference Material

- [Nimble issue](https://github.com/ni/nimble/issues/2100)
- [AzDO Feature](https://ni.visualstudio.com/DevCentral/_workitems/edit/2732543)
- [Figma design](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-47481)

## Implementation / Design

### API

Our FAST base components provide built-in forms support via the [same API](https://www.w3schools.com/tags/att_input_required.asp) exposed by the native HTML `input`:

- `required`: boolean attribute whose presence indicates that a value must be provided to submit

 For radio buttons/groups, only the button elements expose the `required` attribute. If any of the radio buttons in a group are marked required, the group is treated as required.

### Visuals

We will update our templates so that setting `required` causes a red asterisk to be displayed after the label, as per the visual design. For radio buttons/groups, the asterisk is on the group label, not individual button labels.

### Form validation

#### Vanilla HTML

We would expect this to already work, since the FAST components we derive from provide forms support. Unfortunately, this support is broken for `nimble-combobox` and `nimble-radio`.

- `nimble-combobox`: All that is needed is to forward the `required` attribute to the `input` in the template (which we have already forked from FAST). We will make this change.
- `nimble-radio`:
    - `required` on a radio button does not take other buttons in the group into account. It will result in a validation error if _that specific_ radio is unchecked.
    - Validity is only updated when the value or checked state changes, so if the radio button is initially unchecked and remains unchecked, it will remain marked valid, even though it violates the `required` constraint.

Because the `nimble-radio` support has never worked, would take significant work to fix, and FAST is no longer accepting submissions to the archive branch we use, we **will not fix radio button forms support** as part of this feature.

Forms support already works for `nimble-number-field`, `nimble-select`, `nimble-text-area`, and `nimble-text-field`.

#### Angular

The `required` attribute only plays a role in validation for template-driven forms (with reactive forms, it is only used for accessibility purposes). Nimble inputs already support setting the `required` attribute via template, but we will add it to the directive wrappers for completeness.

#### Blazor

Typically, form validation is handled via a `DataAnnotationsValidator`, and an input is treated as required if it is bound to a model property annotated with `RequiredAttribute` (i.e. `[Required]`). The Nimble component's `required` attribute is still needed to turn on the visual affordance, though, so we will add it to the Razor API.

## Alternative Implementations / Designs

None

## Open Issues

None
