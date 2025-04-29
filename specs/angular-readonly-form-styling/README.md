# Angular read-only form styling

## Problem Statement

There is a desire to render Angular forms with read-only controls rather than disabled controls when the control in the Angular form is marked as disabled. This is because there are use cases where the configuration represented by nimble controls is not editable but is still relevant and should be easily readable. The only way to mark something in an Angular form as "not editable" is to mark it as disabled because there is no concept of "read only" in an Angular form. There is quite a bit of logic built into Angular forms and Angular's control value accessors around what it means to render a component bound to a disabled form control.

With some changes to nimble's controls, applications could much more easily create forms with read-only controls rather than disabled controls.

An example can be seen below of a page that currently has disabled controls and the ideal UI.

Current UI with disabled controls:

![disabled form](disabled-form.png)

Improved UI with read-only controls:
![readonly form](readonly-form.png)

Note that in the improved UI screenshot, there are likely still additional improvements that should be made. These improvements include, but are not limited to, updating the `nimble-switch` and `nimble-checkbox` instances to no longer be disabled. However, a decision has not yet been made regarding how these components should be represented when read-only.

## Links To Relevant Work Items and Reference Material

[SLE control pattern docs](https://stratus-storybook.ni.dev/?path=/docs/patterns-control-text--docs)

## Implementation / Design

To enable this new design, the following changes need to be made within the nimble repo, each of which is discussed in more detail below:

- Introduce `readonly-disabled-appearance` configuration on the `nimble-text-field`, `nimble-number-field`, `nimble-text-area`, `nimble-select`, and `nimble-combobox`
- Introduce `frameless` appearance to the `nimble-select`, `nimble-combobox`, and `nimble-number-field`
- Introduce `full-bleed` configuration on the `nimble-select`, `nimble-combobox`, and `nimble-number-field`

### Read-only appearance when disabled

The `nimble-text-field`, `nimble-number-field`, `nimble-text-area`, `nimble-select`, and `nimble-combobox` will be updated to have a new boolean attribute named `readonly-disabled-appearance`, which will be associated with a new `readOnlyDisabledAppearance` boolean property.

When these components have this property set to `true` while being disabled, the component will remain disabled from an ARIA and focusability point of view, but it will be styled as a read-only control. This includes:

- Not dimming the control label
- Not dimming the control value
- [select] Hiding drop-down arrow
- [combobox] Hiding drop-down button

The `readOnlyDisabledAppearance` property will have no effect on a component that is not disabled.

### Frameless select, combobox, and number field

The visual design for read-only controls in forms is for them to be rendered without any borders or backgrounds. This matches the `frameless` appearance nimble has today for the `nimble-text-field`. Therefore, the select, combobox, and number field will all be updated to also support a `frameless` appearance.

### Full-bleed select, combobox, and number field

The visual design for read-only controls in forms is for them to be rendered without any left padding on the value (i.e. the value is aligned with the label). This matches the `full-bleed` configuration nimble has today for the `nimble-text-field`. Therefore, the select, combobox, and number field will all be updated to also support being `full-bleed`.

## Separation of responsibility

With the changes described above implemented in nimble, an application can do the following:

- Create an Angular form with nimble controls configured with `readOnlyDisabledAppearance`
- Update controls to use `frameless` appearance and `full-bleed` when they are read-only
    - Note: This can be done in a single-source way if a client creates an Angular directive that applies the desired attributes on nimble components based on the state of the `disabled` attribute on that component.

This allows nimble to only make unopinionated changes. Nimble will be responsible for:
- Styling the component correctly given the `readOnly`, `disabled`, `readOnlyDisabledAppearance`, `appearance`, and `fullBleed` states

## Angular updates

All new `nimble-components` attributes will be exposed in the Angular directives.

## Blazor updates

All new `nimble-components` attributes will be exposed in NimbleBlazor.

## Alternative Implementations / Designs

**Add `readonly` state to more components**

We could add a `readonly` state to more nimble components (e.g. `nimble-select` and `nimble-combobox`) so that they can be made readonly instead of disabled with read-only styling. This, however, makes the `nimble-select` diverge from the native select, which does not support being `readonly`. With this approach, we could also make changes to nimble's control value accessors to support making a disabled form control become `readonly` in the DOM rather than `disabled`.

This approach was rejected because it only solved the problem in Angular and because we didn't want the DOM to diverge from the form state.

**Make no changes in nimble**

We could make no nimble changes and instead have applications that want read-only controls use the `nimble-text-field` for everything. This would mean that every control that could possibly be disabled needs two implementations in a template:

```html
<ng-container [form]="form">
    <nimble-text-field *ngIf="form.controls.myControl.disabled"
        formControlName="myControl"
        appearance="frameless"
        full-bleed
        readonly
    >Control label</nimble-text-field>
    <nimble-text-field *ngIf="!form.controls.myControl.disabled"
        formControlName="myControl"
    >Control label</nimble-text-field>
</ng-container>
>
```

While this would be tedious in applications, it wouldn't be technically difficult for form controls that use the `nimble-text-field` for their editable state. However, for other controls, such as the `nimble-select`, where the form value can't be written directly to a text field, there would be a significant amount of additional complexity put on every instance of the control in an application. The application would have to have logic to map the form control value to a localized string when the `nimble-select` already has logic to render display values given a value.

**Create a more opinionated read-only styles**

Rather than adding `full-bleed` and `frameless` to the select, combobox, and number field, nimble could be more opinionated about what it means for these controls to be read-only. Specifically, the style for read-only selects, comboboxes, and number fields could be to not have a border, background, or left padding on the value. However, this would be inconsistent with the implementation that already exists for the `nimble-text-field`. We also don't want to change the way `readonly` is styled for the `nimble-text-field` because there are usages of it were it is read-only and should not be styled as `frameless` and `full-bleed`. Some of these examples can be seen below:

![readonly text field example 1](readonly-text-field-1.png)

![readonly text field example 2](readonly-text-field-2.png)

**Repurpose the `disabled` state**

Rather than adding a new attribute to control the readonly styling, we could restyle components such that their `disabled` state always looked like the `readonly` visual designs. However, there are likely valid reasons in application to have a control look disabled rather than readonly.

## Open Issues

- What is the plan for other controls, such as the checkbox and switch?
- Does the text area also need to be full-bleed and frameless?
