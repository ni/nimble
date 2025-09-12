# Public API Contract: nimble-multiselect

## Element
- Tag: `nimble-multiselect`
- Class: `Multiselect`

## Properties
- `appearance`: `DropdownAppearance` - Visual style (underline, outline, block)
- `appearanceReadonly`: `boolean` - Read-only appearance
- `fullBleed`: `boolean` - Full width styling
- `position`: `SelectPosition` - Dropdown position (above, below)
- `filterMode`: `FilterMode` - Filtering behavior (none, standard, manual)
- `clearable`: `boolean` - Show clear button
- `disabled`: `boolean` - Disable interaction
- `requiredVisible`: `boolean` - Show required indicator
- `open`: `boolean` - Dropdown open state
- `value`: `string` - Comma-separated selected values (read-only for external use)

## Methods
- None (inherited from base)

## Events
- `input`: `Event` - Fired on selection change
- `change`: `Event` - Fired on selection change
- `filter-input`: `CustomEvent<{filterText: string}>` - Fired on filter input

## Slots
- Default: Label text
- Options: `nimble-list-option` and `nimble-list-option-group` elements

## CSS Custom Properties
- Inherits from nimble-select and FAST components
- Supports Nimble design tokens

## Accessibility
- `role`: `combobox`
- `aria-multiselectable`: `true`
- `aria-expanded`: dynamic
- `aria-controls`: listbox id
- `aria-activedescendant`: active option id
