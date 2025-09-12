# Data Model: nimble-multiselect

## Component Properties
- `appearance`: DropdownAppearance (underline, outline, etc.)
- `appearanceReadonly`: boolean
- `fullBleed`: boolean
- `position`: SelectPosition (above, below)
- `filterMode`: FilterMode (none, standard, manual)
- `clearable`: boolean
- `disabled`: boolean
- `requiredVisible`: boolean
- `multiple`: boolean (inherited, always true)
- `open`: boolean
- `value`: string (comma-separated values for form submission)

## Internal State
- `selectedOptions`: ListboxOption[] (currently selected options)
- `filteredOptions`: ListboxOption[] (options after filtering)
- `filter`: string (current filter text)
- `displayValue`: string (computed summary for display)
- `position`: SelectPosition (computed dropdown position)
- `availableViewportHeight`: number

## Option Model
- Each option: nimble-list-option with value, text, disabled, hidden, selected
- Groups: nimble-list-option-group containing options

## Events
- `input`: Fired on selection change
- `change`: Fired on selection change
- `filter-input`: Fired on filter text change

## Form Integration
- Proxy select element with multiple=true
- Values synced to proxy for form submission
