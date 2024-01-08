# Filterable Select

## Problem Statement

Our clients have a need of a filterable dropdown component that does not allow arbitrary text as a value, but only values available in the dropdown. The filtering will have the following behaviors (in the initial feature set):

-   The filter text will match _any_ text within the `textContent` of each `ListOption` in a case insensitive way. Specifically, the filter text will match wholly against the target (e.g. filter text of "ad" will match "Add", but not "abcd").
-   Each time the dropdown is opened the filter text is cleared.
-   While the dropdown is opened all keystrokes except `<ArrowUp>`. `<ArrowDown>`, `<Enter>`, `<Home>` and `<End>` will apply to the filter.
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
    standard: 'standard';
} as const;
```

-   The `standard` filterMode will result in case-insensitive, diacritic-insensitive filtering.
-   `filterMode` will default to `none` so as not to affect existing clients.

_Note: The `filterMode` isn't meant to mirror the `Combobox` `autocomplete` API, as they do serve slightly different purposes: The `autocomplete` for the `Combobox` ultimately helps set the actual value of the `Combobox` as the user types, and isn't necessarily performing any filtering (e.g. the `inline` mode). One possible concern, however, is that we are presenting an API that will allow different types of filter behaviors (i.e. case sensitive) that the `Combobox` does not support. Additionally, I am proposing diacritic insensitive filtering, which the `Combobox` also does not currently support, but I feel this is quite likely a better default experience._

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

As the `Select` will closely mirror the `Combobox`

#### Filter Template

Since the input for the filter is devoid of interaction semantics we find in the `NimbleTextField` (notably no green underline that appears on hover/focus), we will instead use a minimally styled native `input` element.

#### Accessibility

The accessibility tree will report that the search `input` element should have its own `focus` styling, however this should not be necessary, as the existence of the popup should provide the necessary focus hint to the user. Hiding the `input` from the accessibility tree using `aria-hidden` is strongly discouraged, and setting its `role` to `presentation` is not allowed.

### Future considerations

#### Grouping/Metadata

One feature that we intend to add to the `Select` is the ability to specify "groups" of options, where each group will have non-selectable header text followed by the options under that group. Ultimately, this feature will have to work nicely with filtering, but I don't believe there are aspects of this that would interfere with the current proposed API in this HLD of a single attribute that specifies how the filter text is applied to a target.

There is also a desire to allow the [`ListOption` to contain complex content](https://github.com/ni/nimble/issues/1135). This could include content that also supplies some metadata that _could_ be used for filtering purposes. The current proposed API is meant to infrom _how_ the filter text is applied to a target, not _what_ the target is, so I suspect if we ever need to provide a means to the client to change what the target for the filter is, then that would be a different API.

#### More filter modes

It may be desireable to have other filter modes in the future, such as case sensitive, or even regular expressions. By making the new API an enum, we can easily add new modes as needed.

#### Dynamic fetching of options

We know that there is a use-case with the `Combobox` to dynamically fetch options from a server that match the pattern provided in the input field, and so it isn't a stretch that a client might want the same capability in the `Select`. However, this is currently accomplished through turning off the `Combobox` `autocomplete` mode, and essentially having the client provide a custom behavior.

The `Select` presents its own challenges for providing a similar ability:

-   Should the `Combobox` and `Select` provide mirrored APIs for this? Currently, this doesn't seem possible in Angular as the `Combobox` relies on users accessing its `value` property from the `nativeElement` to use for the filter, in combination with listening to native `input` events. The `Select` would either need to work differently, or the `Combobox` would have to be updated.
-   Would this feature be enabled through another mode on the `filterMode` enum (i.e. a `dynamic` or `custom` mode), or is it orthogonal to the `filterMode` API?
-   Are there challenges in having the filter work against local options in addition to retrieving new ones?

## Alternative Implementations / Designs

None

## Open Issues
