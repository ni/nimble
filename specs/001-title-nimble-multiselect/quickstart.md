# Quickstart: nimble-multiselect

## Installation
The component is part of the Nimble component library. Ensure Nimble is installed in your project.

```bash
npm install @ni/nimble-components
```

## Basic Usage
```html
<nimble-multiselect>
    <nimble-list-option value="1">Option 1</nimble-list-option>
    <nimble-list-option value="2">Option 2</nimble-list-option>
    <nimble-list-option value="3">Option 3</nimble-list-option>
</nimble-multiselect>
```

## With Filtering
```html
<nimble-multiselect filter-mode="standard">
    <nimble-list-option value="apple">Apple</nimble-list-option>
    <nimble-list-option value="banana">Banana</nimble-list-option>
    <nimble-list-option value="cherry">Cherry</nimble-list-option>
</nimble-multiselect>
```

## With Groups
```html
<nimble-multiselect>
    <nimble-list-option-group label="Fruits">
        <nimble-list-option value="apple">Apple</nimble-list-option>
        <nimble-list-option value="banana">Banana</nimble-list-option>
    </nimble-list-option-group>
    <nimble-list-option-group label="Vegetables">
        <nimble-list-option value="carrot">Carrot</nimble-list-option>
        <nimble-list-option value="lettuce">Lettuce</nimble-list-option>
    </nimble-list-option-group>
</nimble-multiselect>
```

## Form Integration
```html
<form>
    <nimble-multiselect name="items" required>
        <nimble-list-option value="1">Item 1</nimble-list-option>
        <nimble-list-option value="2">Item 2</nimble-list-option>
    </nimble-multiselect>
    <button type="submit">Submit</button>
</form>
```

## Events
```javascript
const multiselect = document.querySelector('nimble-multiselect');
multiselect.addEventListener('change', (event) => {
    console.log('Selected values:', event.target.value);
});
```

## Styling
The component uses Nimble design tokens. Customize via CSS custom properties if needed.

## Accessibility
- Supports keyboard navigation (arrow keys, enter, space)
- Screen reader announcements for selections
- ARIA attributes for multi-selectable state
