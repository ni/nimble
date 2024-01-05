# Filterable Select

## Problem Statement

Our clients have a need of a filterable dropdown component that does not allow arbitrary text as a value, but only values available in the dropdown. The filtering will have the following behaviors:

-   The filter text will match _any_ text within the `textContent` of each `ListOption`
-   Each time the dropdown is opened the filter text is cleared
-   While the dropdown is opened all keystrokes except `<ArrowUp>` and `<ArrowDown>` will apply to the filter.
-   Pressing `<Esc>` will close the dropdown and revert the value to what it was prior to opening dropdown.

## Links To Relevant Work Items and Reference Material

-   [#1273: Filterable NimbleSelect](https://github.com/ni/nimble/issues/1273)
-   [Filterable Select IxD](./IxD.md#filter)

## Implementation / Design

### API

#### Select

We will provide a means for clients to enable this feature with a new attribute:

```ts
export class Select() {
    ...
    @attr({ attribute: 'enable-filter', mode: 'boolean' })
    public enableFilter = false;
    ...
}
```

#### LabelProviderCore

We will be showing text that will require localization as part of this feature. It seems reasonable to add these APIs to the existing `LabelProviderCore` class as opposed to creating a new provider:

```ts
export class LabelProviderCore
    ...
    @attr({ attribute: 'select-filter-search' })
    public selectFilterSearch: string | undefined;

    @attr({ attribute: 'select-filter-no-results' })
    public selectFilterNoResults: string | undefined;
```

### Implementation details

As the filtering behavior is reminiscent of the `Combobox`, we will use the `fast-foundation` implementation for its `Combobox` as a guide for the changes needed for our `Select`. So, one interesting facet of this is that we must now provide an override for the `options` property, which now resembles [FAST's `Combobox` implementation](https://github.com/microsoft/fast/blob/8023f7ee8458ac147dee4dadb9b72ce45a142a1f/packages/web-components/fast-foundation/src/combobox/combobox.ts#L170):

```ts
public override get options(): ListboxOption[] {
    Observable.track(this, 'options');
    return this.filteredOptions?.length ? this.filteredOptions : this._options;
}

public override set options(value: ListboxOption[]) {
    this._options = value;
    Observable.notify(this, 'options');
}
```

#### Filter Template

Since the input for the filter is devoid of interaction semantics we find in the `NimbleTextField` (notably no green underline that appears on hover/focus), we will instead use a minimally styled native `input` element.

### Future considerations

One feature that we intend to add to the `Select` is the ability to specify "groups" of options, where each group will have non-selectable header text followed by the options under that group. Ultimately, this feature will have to work nicely with filtering, but I don't believe there are aspects of this that would interfere with the current proposed API in this HLD of a single boolean attribute to enable filtering.

## Alternative Implementations / Designs

None

## Open Issues

-   When there are no matches to the filter I am proposing that we display localizable text below/above the filter text area, the English version of which would be "No items found".
