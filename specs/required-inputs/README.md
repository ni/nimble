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

Any other controls that could possibly be considered inputs are out of scope.

## Links To Relevant Work Items and Reference Material

- [Nimble issue](https://github.com/ni/nimble/issues/2100)
- [AzDO Feature](https://ni.visualstudio.com/DevCentral/_workitems/edit/2732543)
- [Figma design](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-47481)

## Implementation / Design

### API

Our FAST base components provide built-in forms support via the [same API](https://www.w3schools.com/tags/att_input_required.asp) exposed by the native HTML `input`:

- `required`: boolean attribute whose presence indicates that a value must be provided to submit

For radio buttons/groups, only the button elements expose the `required` attribute. If any of the radio buttons in a group are marked required, the group is treated as required. It does not matter if the button with `required` is disabled, hidden, etc. It is effectively as if the attribute is on the group of buttons, rather than a specific one. This matches the behavior of the native `input` with `type="radio"`. 

### Visuals

We will update our templates so that setting `required` causes a red asterisk to be displayed after the label, as per the visual design. For radio buttons/groups, the asterisk is on the group label, not individual button labels. We have already forked some of the templates from FAST, but we will now need to fork the ones for `nimble-number-field`, `nimble-radio-group`, and `nimble-text-field`. 

This will be implemented using a styled span containing the text "*". The span must be outside of the `label` element so that it is not included in the accessible name. We will wrap the two in a `div` so that we can force a horizontal layout (`flex-direction: row`). This structure will also ensure that whatever the wrapping/ellipsizing behavior of the label is, the asterisk will always appear at the far right:

```html
<div class="annotated-label">
    <label part="label" class="label">
        <slot></slot>
    </label>
    ${when(x => x.required, html`
        <span class="required-indicator">*</span>
    `)}
</div>
```

Note that for text-field, text-area, and number-field, we will also remove the visual if the control has the `readonly` attribute set, since [validation is not enforced on a readonly input](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly#attribute_interactions). This doesn't apply to select, combobox, or radio buttons, because they do not support `readonly`.

Styles will be shared.

### Form validation

#### Vanilla HTML

When the user attempts to submit a form and a `required` input is missing a value, a browser-specific indicator reports the validation error:

![Missing value indicator](missing-value.png)

We would expect this to already work, since the FAST components we derive from provide forms support. Unfortunately, this support is broken or incomplete for multiple components:

- `nimble-combobox`: 
    - In Chrome/Edge, a missing required value properly blocks form submission and updates the control's `validity` flags, but the visual indicator of the validation error is not shown, and instead an error is printed to the console: "An invalid form control with name='' is not focusable." Presumably, something is trying to focus the host element, though it delegates focus to the shadow DOM. The error comes from a call to [`form.requestSubmit()` in the FAST button code](https://github.com/microsoft/fast/blob/913c27e7e8503de1f7cd50bdbc9388134f52ef5d/packages/web-components/fast-foundation/src/button/button.ts#L221), which we cannot debug into. Things work properly in Firefox.
    - Accessibility: the control is not marked/announced as required. Forwarding `required` to the `input` in the template (which we have already forked) solves this.
- `nimble-text-area`:
    - Has same Chrome/Edge issue as `nimble-combobox`.
- `nimble-select`:
    - Validation incorrectly reports a missing value until a value change has occurred. I.e. the initial value is not seen. This happens because we try to mirror the initial value to the proxy native `select` element (within [a call to `super.slottedOptionsChanged()`](https://github.com/ni/nimble/blob/ddad57c4c97da9504f8146ad48668f290dae5301/packages/nimble-components/src/select/index.ts#L331)) before we have [mirrored the child option elements](https://github.com/ni/nimble/blob/ddad57c4c97da9504f8146ad48668f290dae5301/packages/nimble-components/src/select/index.ts#L346). The native `select` will reject/ignore setting `value` if it doesn't correspond to the value of one of its child options (of which it has none, at that point). Right after mirroring the child options, there is a call to `updateValue()`, but because the value has already been updated earlier, it [short-circuits](https://github.com/ni/nimble/blob/ddad57c4c97da9504f8146ad48668f290dae5301/packages/nimble-components/src/select/index.ts#L268), skipping the code path that would have updated the proxy. I suspect we can find a reasonable fix for this.
    - Accessibility: the control is not marked/announced as required. The accessible control (i.e. the one defining the `role`) is the `nimble-select` itself. Since this is not a native input, the accessibility tree doesn't see/understand the `required` attribute on it. We need to additionally set `aria-required` on it (bound to `required`).
- `nimble-radio`:
    - `required` on a radio button [does not take other buttons in the group into account](https://github.com/microsoft/fast/issues/6866). It will result in a validation error if _that specific_ radio is unchecked.
    - Validity is only updated when the value or checked state changes, so if the radio button is initially unchecked and remains unchecked, it will remain marked valid, even though it violates the `required` constraint.

Forms support is complete and functional for `nimble-number-field` and `nimble-text-field`.

Because the `nimble-radio` support has never worked, would take significant work to fix, and FAST is no longer accepting submissions to the archive branch we use, we **will not fix radio button forms support** as part of this feature.

We will file a Chromium bug for the issue affecting the `nimble-combobox` and `nimble-text-area` but **will not try to work around it.**

#### Angular

The `required` attribute only plays a role in validation for template-driven forms (with reactive forms, it is only used for accessibility purposes). Nimble inputs already support setting the `required` attribute via template, but we will add it to the directive wrappers for completeness.

#### Blazor

Typically, form validation is handled via a `DataAnnotationsValidator`, and an input is treated as required if it is bound to a model property annotated with `RequiredAttribute` (i.e. `[Required]`). The Nimble component's `required` attribute is still needed to turn on the visual affordance, though, so we will add it to the Razor API.

## Documentation

We will add documentation for the `required` attribute. No additional guidance is necessary.

## Testing

Visual matrix test cases will be added for the affected components.

## Alternative Implementations / Designs

None

## Open Issues

None
