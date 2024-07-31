# Built-in Labels for Select and Combobox

## Problem Statement

Most Nimble controls offer built in labels but the select and combobox controls don't, meaning clients have had to create and style labels manually.

Built-in labels will reduce the effort needed for clients to consume these controls, as well as resolving some accessibility issues (see work item links below).

## Links To Relevant Work Items and Reference Material

[Built-in label for select and combobox](https://github.com/ni/nimble/issues/2183)

Related issues:

-   [Resolve label accessibility issues](https://github.com/ni/nimble/issues/94)
-   [Fix accessibility issues in Angular Example app](https://github.com/ni/nimble/issues/280)

## Implementation / Design

Implementation details apply to both `nimble-select` and `nimble-combobox`, unless otherwise specified.

### API (Slots)

Default Slot:

-   The `nimble-list-option`s in the control are placed in this slot currently.
-   We will add support for specifying the label as text content in the same slot. For example:
    ```html
    <nimble-select>
        Select Label Text
        <nimble-list-option>A</nimble-list-option>
        <nimble-list-option>B</nimble-list-option>
    </nimble-select>
    ```
    The label content should be able to be specified as plain text content, or a `span` element (to support internationalization for Angular)

### Templates / Styling

Template updates:

-   A new `label` element will be added at the root of the control template, which will reflect the default slotted content (minus the list options which are already handled elsewhere)
-   A new container `div` will be added at the same level, to contain the control part (`div[part="control"]`)
-   Update element host `display` mode so the label is laid out correctly. (Formerly `inline-flex`, which will move to the container `div`. Prototyped as `inline-block`, but `inline-flex` / `inline-grid` is probably more in line with what we want for our controls layouts going forward.)

Currently our shared dropdown styling (`patterns/dropdown/styles.ts`) applies focus/error-visible styling directly on `::host` - most of those styles will instead target the container `div`.

Other considerations:

-   The label will get disabled visually if the control is disabled.
-   If the label is not provided, vertical space should not be reserved for it.
-   Behavior if label length exceeds control width (most likely we'll grow to fit like our other controls)

### Accessibility / ARIA

`nimble-combobox`: Currently has 2 ARIA/accessibility issues:

-   Elements must only use supported ARIA attributes: `nimble-combobox` `nimble-toggle-button`: ARIA attribute is not allowed: `aria-expanded="false"`
    -   Can be resolved via `aria-hidden="true"` on the dropdown toggle button, as it's not keyboard-focusable.
-   ARIA commands must have an accessible name: `nimble-combobox` `nimble-toggle-button` `div[role="button"]`
    -   Will be resolved by adding the `label` element

`nimble-select`: Currently has 1 ARIA/accessibility issue:

-   ARIA input fields must have an accessible name: `nimble-select`
    -   The `label` element is not sufficient to resolve this, because it's in the shadow tree, whereas the ARIA role is on the `nimble-select` itself (unlike the combobox).
    -   Will be resolved by adding the `aria-label` attribute to `nimble-select`, which will be set to the same label text shown in the `label` element. (`nimble-list-option-group` [does something similar](https://github.com/ni/nimble/blob/4948838ca895a04d7ebe16f595176b2050863f15/packages/nimble-components/src/list-option-group/template.ts#L14))

### Impact to nimble-rich-text-mention-listbox

`nimble-rich-text-mention-listbox` will not support this feature, meaning it will not contain a `label` element in its template. The current plan is to not address any ARIA label issues on it either, but we should note the gap in [Align rich-text mention listbox implementation behavior](https://github.com/ni/nimble/issues/1926).  
However, since we have shared dropdown styling, its template may need minor updates (e.g. to add the same parent/container `div` as select/combobox are getting), but we'll ensure it has the same visual appearance as before.

## Alternative Implementations / Designs

**Label API:** We have several different paradigms for specifying label text in Nimble, in addition to the default slot:

-   A `label` slot, with the expectation clients will add a `label` element in it (`nimble-radio-group`, tracked as [tech debt](https://github.com/ni/nimble/issues/2306))
-   A `label` attribute (`nimble-option-group`, though text content in the default slot is also supported. Note: This aligns with the [optgroup API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup).)

The default slot approach was chosen for this feature as it's the most common in Nimble, and the simplest to use.

## Open Issues

None
