# Select and Combobox option groups

## Problem Statement

It is not uncommon to want to categorize the options that are present in the dropdown for a `Select`/`Combobox` component. By supporting categories, users are then able to provide options that have the same display value, but under separate categories, helping avoid confusion.

## Links To Relevant Work Items and Reference Material

-   [Interaction Design](./IxD.md#groups)
-   [Sectioned Combobox (issue 791)](https://github.com/ni/nimble/issues/791)
-   [Prototype branch Storybook](https://60e89457a987cf003efc0a5b-cvmxlqwglb.chromatic.com/?path=/docs/components-select--docs) ([code](https://github.com/ni/nimble/tree/groupable-select))

## Implementation / Design

The HTML native `select` supports option groups with the native `optgroup` element. Configuring the `select` to use the `optgroup` takes the following form:

```html
<select name="cars">
    <optgroup label="Swedish Cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
    </optgroup>
    <optgroup label="German Cars">
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
    </optgroup>
</select>
```

The Nimble `Select` (and `Combobox`) will follow the same approach, and provide a new custom element, `nimble-list-option-group`, that mirrors the `optgroup` behavior/API:

```html
<nimble-select name="cars">
    <nimble-list-option-group label="Swedish Cars">
        <nimble-list-option value="volvo">Volvo</option>
        <nimble-list-option value="saab">Saab</option>
    </nimble-list-option-group>
    <nimble-list-option-group label="German Cars">
        <nimble-list-option value="mercedes">Mercedes</option>
        <nimble-list-option value="audi">Audi</option>
    </nimble-list-option-group>
</nimble-select>
```

### API

The `ListOptionGroup` class API should be fairly lightweight:

```ts
public class ListOptionGroup {
    @attr
    public label?: string;
}
```

_Question: Should we support slotting icons (other content?) into the group display?_

### Filtering

As mentioned in the IxD, when a user has filtering enabled, typing into the filter input will match both individual options (as normal), as well as _all_ options that are under a group that matches the filter text.

_Question: Should matching against a group be configurable?_

#### Combobox Guidance

It should be noted that when using groups with a `Combobox`, it is advised that each option still be unique (for both its display and value). This is predicated on the [decision](https://github.com/ni/nimble/issues/1168#issuecomment-1568733159) that the `Combobox` will change it's behavior for platforms like Angular, where the model value will _always_ be the text that is in the display. This will make it impossible to disambiguate between options that have the same display value under separate groups.

## Alternative Implementations / Designs

Originally, there was a desire to display the group name for the selected option outside of the dropdown of the component. However, there is not precedent for this for other design systems that support groups, nor the native `select`. If a client desires to display the group for the selected option that will be managed on the client side, including _where_ the display would be.

## Open Issues

As called out above:

1. Should the `ListOptionGroup` component support slotting content such as icons into named slots?
    - My thought is that initiailly we don't need to support this until it is asked for. So far, we have seen no requests for this.
2. Should matching against a group name for filtering be configurable?
    - I'm waffling on the importance of this. Because of the very loose matching we provide for the `Select` filtering (and likely the `Combobox` eventually), it will be easy to match against several groups, particularly when very few characters have been entered, resulting in a bunch of options in the dropdown that don't match the filter itself, requiring more characters to be typed than usual to filter it down to a reasonable set. It is unclear how laborious this will make it for the user.
