# Filterable Select

## Problem Statement

Our clients have a need of a filterable dropdown component that does not allow arbitrary text as a value, but only values available in the dropdown. The filtering will have the following behaviors (in the initial feature set):

- The filter text will match _any_ text within the `textContent` of each `ListOption` in a case insensitive way. Specifically, the filter text will match wholly against the target (e.g. filter text of "ad" will match "Add", but not "abcd").
- Each time the dropdown is opened the filter text is cleared.
- While the dropdown is opened all keystrokes except `<ArrowUp>`. `<ArrowDown>`, `<Enter>`, `<Home>` and `<End>` will apply to the filter.
- Pressing `<Esc>` will close the dropdown and revert the value to what it was prior to opening dropdown.

## Links To Relevant Work Items and Reference Material

- [#1273: Filterable NimbleSelect](https://github.com/ni/nimble/issues/1273)
- [Filterable Select IxD](./IxD.md#filter)

## Implementation / Design

### API

#### Select

We will provide a means for clients to enable this feature with some new attributes:

```ts
export class Select() {
    ...
    @attr({ attribute: 'filter-mode' })
    public filterMode = FilterMode.none;

    /**
     * Displays a message at the bottom of the dropdown to indicate more options
     * are currently being loaded.
     */
    @attr({ attribute: 'loading-visible', mode: 'boolean' })
    public loadingVisible = false;
    ...
}

// Provide enum for filterMode to allow for future modes
export const FilterMode  = {
    none: undefined;
    standard: 'standard';
    manual: 'manual';
} as const;
```

- The `standard` filterMode will result in case-insensitive, diacritic-insensitive filtering.
- The `manual` filterMode will display a search input, but it won't automatically filter the options as the user types. Instead, clients can use the `filter-input` event described in the ['Dynamic Options'](#dynamic-options) section below to implement their own filtering logic.
- The `none` filter mode results in no search input being shown in the dropdown.
- `filterMode` will default to `none` so as not to affect existing clients.

_Note: The `filterMode` isn't meant to mirror the `Combobox` `autocomplete` API, as they do serve slightly different purposes: The `autocomplete` for the `Combobox` ultimately helps set the actual value of the `Combobox` as the user types, and isn't necessarily performing any filtering (e.g. the `inline` mode). One possible concern, however, is that we are presenting an API that will allow different types of filter behaviors (i.e. case sensitive) that the `Combobox` does not support. Additionally, I am proposing diacritic insensitive filtering, which the `Combobox` also does not currently support, but I feel this is quite likely a better default experience._

#### Dynamic options

The `filterMode: manual` option expects clients to dynamically supply `list-option`s to the `Select` component in response to user search text, by subscribing to the `filter-input` event.

```ts
interface SelectFilterInputEventDetail {
    filterText: string;
}
```

Then, when handling the `filter-input` event, clients should perform the desired filtering using the provided filter text. Additionally, they should set the `loading` attribute to `true` while the options are being loaded into the DOM, and then set it back to `false` when the loading process is complete. The `filter-input` event is emitted any time the user types a character in the filter input and also when the dropdown is closed (in which case the `filterText` in the details will always be an empty string).

_IMPORTANT_: When using the `manual` filter mode, clients are responsible for the following:

- Either adding/removing options to/from the DOM that do or do not match the filter and/or marking existing options as `hidden` when they don't match.
- The currently selected option is included in the set of options placed in the DOM regardless of match against filter (and be marked as `hidden` if it doesn't match the filter)
- If a placeholder option exists for the select, it should never be filtered out.

_Notes_:

- When the `loading-visible` attribute is set, we will display localizable text at the bottom of the dropdown (defaulting to "Loading"), along with the spinner icon.
- The `Select` will not peform any debouncing as the user types into the filter input. It is expected that clients can perform any debouncing that is needed easily at the app level.
- The `filter-input` event will be emitted for all filter modes (except `none`)

##### Groups

When using the `filterMode: manual` option along with [groups](./option-groups-hld.md), clients will also need to determine the appropriate matching behavior against the `ListOptionGroup` elements. Our guidance will be that filter text should be able to be matched against _any_ text in the group label, and when that matches, _all_ options within that group should be visible. Conversely, the select will automatically hide groups with no items in them. This means clients only need to conditionally remove items, not groups (though it's fine if they manually remove empty groups too).

#### LabelProviderCore

We will be showing text that will require localization as part of this feature. It seems reasonable to add these APIs to the existing `LabelProviderCore` class as opposed to creating a new provider:

```ts
export class LabelProviderCore
    ...
    @attr({ attribute: 'select-filter-search' })
    public selectFilterSearch: string | undefined;

    @attr({ attribute: 'select-filter-no-results' })
    public selectFilterNoResults: string | undefined;

    @attr({ attribute: 'loading' })
    public loading: string | undefined;
```

The English strings used for these labels will be:

- selectFilterSearch: "Search"
- selectFilterNoResults: "No items found"
- loading: "Loading"

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

#### Grouping/Metadata

See [Option Groups/Filtering](./option-groups-hld.md#filtering)

### Future considerations

We may want to improve/alter the discoverability of the fact that more options are available to be loaded when using the `manual` filtering option. Currently, before a user begins typing there is nothing to suggest that there could be other options that are available to select.

#### Combobox alignment

It's reasonable to think that a client may want to have the same UX and Nimble-provided APIs as the `Select` for dynamic options.

#### Complex content

There is a desire to allow the [`ListOption` to contain complex content](https://github.com/ni/nimble/issues/1135). This could include content that also supplies some metadata that _could_ be used for filtering purposes. The current proposed API is meant to inform _how_ the filter text is applied to a target, not _what_ the target is, so I suspect if we ever need to provide a means to the client to change what the target for the filter is, then that would be a different API.

#### More filter modes

It may be desireable to have other filter modes in the future, such as case sensitive, or even regular expressions. By making the new API an enum, we can easily add new modes as needed.

## Alternative Implementations / Designs

None

## Open Issues
