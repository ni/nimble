# Filterable Select

## Problem Statement

Our clients have a need of a filterable dropdown component that does not allow arbitrary text as a value, but only values available in the dropdown. The filtering will have the following behaviors:

-   The filter text will match _any_ text within the `textContent` of each `ListOption` in a case insensitive way.
-   Each time the dropdown is opened the filter text is cleared.
-   While the dropdown is opened all keystrokes except `<ArrowUp>`. `<ArrowDown>`, `<Home>` and `<End>` will apply to the filter.
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
    @attr({ attribute: 'filter-mode' })
    public filterMode = FilterMode.none;
    ...
}

// Provide enum for filterMode to allow for future modes
export const FilterMode  = {
    none: 'none';
    caseInsensitive: 'caseInsensitive';
} as const;
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

The English strings used for these labels will be:

-   selectFilterSearch: "Search"
-   selectFilterNoResults: "No items found"

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

#### Accessibility

The accessibility tree will report that the search `input` element should have its own `focus` styling, however this should not be necessary, as the existence of the popup should provide the necessary focus hint to the user. Hiding the `input` from the accessibility tree using `aria-hidden` is strongly discouraged, and setting its `role` to `presentation` is not allowed.

### Future considerations

#### Grouping

One feature that we intend to add to the `Select` is the ability to specify "groups" of options, where each group will have non-selectable header text followed by the options under that group. Ultimately, this feature will have to work nicely with filtering, but I don't believe there are aspects of this that would interfere with the current proposed API in this HLD of a single attribute to enable filtering.

#### More filter modes

It may be desireable to have other filter modes in the future, such as case sensitive, or even regular expressions. By making the new API an enum, we can easily add new modes as needed.

## Alternative Implementations / Designs

None

## Open Issues
