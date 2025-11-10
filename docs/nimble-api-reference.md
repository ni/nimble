# Nimble Components API Reference for AI Code Generation

This document provides a comprehensive reference for the Nimble Design System components to assist AI code generation tools like GitHub Copilot. Copy this file to your project repository to help AI assistants generate better code using Nimble.

## Package Information

- **Package Name**: `@ni/nimble-components`
- **Type**: Web Components (Custom Elements)
- **Framework Support**: Framework-agnostic (works with Angular, React, Vue, Blazor, vanilla JS, etc.)

## Setup

### Installation
```bash
npm install @ni/nimble-components
```

### Import All Components
```typescript
import '@ni/nimble-components/dist/esm/all-components';
```

### Import Specific Components
```typescript
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/text-field';
// etc.
```

### Required Theme Provider
Always wrap your application in a theme provider:
```html
<nimble-theme-provider theme="light">
    <!-- Your application content -->
</nimble-theme-provider>
```

---

## Component Reference

### Theme Provider

#### nimble-theme-provider
Provides theming for all Nimble components. Required at app root.

**Tag**: `<nimble-theme-provider>`

**Attributes**:
- `theme`: `"light"` | `"dark"` | `"color"` - Theme variant
- `lang`: string - Language code (e.g., "en", "de", "ja")

**Usage**:
```html
<nimble-theme-provider theme="light">
    <!-- App content -->
</nimble-theme-provider>
```

---

### Buttons

#### nimble-button
Standard button component.

**Tag**: `<nimble-button>`

**Attributes**:
- `appearance`: `"outline"` (default) | `"ghost"` | `"block"` - Visual style
- `appearance-variant`: `"default"` | `"primary"` | `"accent"` - Color variant
- `disabled`: boolean - Disables the button
- `content-hidden`: boolean - Hides text content (for icon-only buttons)

**Slots**:
- `default`: Button text content
- `start`: Leading icon
- `end`: Trailing icon

**Events**:
- `click`: Standard click event

**Usage**:
```html
<!-- Basic button -->
<nimble-button>Click Me</nimble-button>

<!-- Primary button -->
<nimble-button appearance="outline" appearance-variant="primary">Save</nimble-button>

<!-- Button with icon -->
<nimble-button>
    <nimble-icon-check slot="start"></nimble-icon-check>
    Confirm
</nimble-button>

<!-- Icon-only button -->
<nimble-button content-hidden aria-label="Delete">
    <nimble-icon-trash slot="start"></nimble-icon-trash>
</nimble-button>
```

#### nimble-anchor-button
Button that navigates to a URL (styled as a button).

**Tag**: `<nimble-anchor-button>`

**Attributes**:
- `appearance`, `appearance-variant`, `disabled`, `content-hidden`: Same as nimble-button
- `href`: string (required) - URL to navigate to
- `hreflang`: string - Language of the linked resource
- `ping`: string - Space-separated URLs to ping
- `referrerpolicy`: string - Referrer policy for the link
- `rel`: string - Relationship to the linked resource
- `target`: `"_self"` | `"_blank"` | `"_parent"` | `"_top"` - Where to open link
- `type`: string - MIME type of linked resource
- `download`: string - Filename for download

**Slots**: Same as nimble-button

**Usage**:
```html
<nimble-anchor-button href="/settings" appearance-variant="primary">
    Go to Settings
</nimble-anchor-button>

<nimble-anchor-button href="https://example.com" target="_blank">
    External Link
</nimble-anchor-button>
```

#### nimble-menu-button
Button that opens a dropdown menu.

**Tag**: `<nimble-menu-button>`

**Attributes**:
- `appearance`, `appearance-variant`, `disabled`, `content-hidden`: Same as nimble-button
- `open`: boolean (readonly) - Whether menu is currently open
- `position`: `"above"` | `"below"` | `"auto"` - Menu position

**Slots**:
- `default`: Button text
- `start`, `end`: Button icons
- `menu`: Menu items (nimble-menu-item elements)

**Usage**:
```html
<nimble-menu-button>
    Actions
    <nimble-menu slot="menu">
        <nimble-menu-item>Edit</nimble-menu-item>
        <nimble-menu-item>Delete</nimble-menu-item>
    </nimble-menu>
</nimble-menu-button>
```

#### nimble-toggle-button
Toggle button (pressed/unpressed state).

**Tag**: `<nimble-toggle-button>`

**Attributes**:
- `checked`: boolean - Whether button is pressed
- `disabled`: boolean
- `content-hidden`: boolean
- `appearance`: `"outline"` | `"solid"` - Visual style

**Slots**: Same as nimble-button

**Events**:
- `change`: Fired when checked state changes

**Usage**:
```html
<nimble-toggle-button id="bold-toggle">
    <nimble-icon-text-bold slot="start"></nimble-icon-text-bold>
    Bold
</nimble-toggle-button>
```

---

### Form Controls

#### nimble-text-field
Single-line text input.

**Tag**: `<nimble-text-field>`

**Attributes**:
- `appearance`: `"underline"` (default) | `"outline"` | `"block"` - Visual style
- `value`: string - Current value
- `placeholder`: string - Placeholder text
- `disabled`: boolean
- `readonly`: boolean
- `required`: boolean
- `error-text`: string - Error message to display
- `error-visible`: boolean - Show error state
- `full-bleed`: boolean - Remove horizontal padding
- `appearance-readonly`: boolean - Show read-only appearance while staying editable
- `type`: `"text"` | `"email"` | `"password"` | `"tel"` | `"url"` - Input type
- `maxlength`: number - Maximum length
- `minlength`: number - Minimum length
- `pattern`: string - Validation pattern
- `autocomplete`: string - Autocomplete mode

**Events**:
- `input`: Fired on value change
- `change`: Fired when value is committed

**Usage**:
```html
<nimble-text-field placeholder="Enter your name"></nimble-text-field>

<nimble-text-field
    value="john@example.com"
    type="email"
    required
    error-text="Please enter a valid email"
    error-visible
></nimble-text-field>
```

#### nimble-text-area
Multi-line text input.

**Tag**: `<nimble-text-area>`

**Attributes**:
- `appearance`: `"underline"` | `"outline"` | `"block"`
- `value`, `placeholder`, `disabled`, `readonly`, `required`, `error-text`, `error-visible`: Same as text-field
- `resize`: `"none"` | `"vertical"` | `"horizontal"` | `"both"` - Resize behavior
- `rows`: number - Number of visible rows
- `cols`: number - Number of visible columns
- `maxlength`: number - Maximum length

**Events**: Same as text-field

**Usage**:
```html
<nimble-text-area 
    placeholder="Enter description"
    rows="5"
    resize="vertical"
></nimble-text-area>
```

#### nimble-number-field
Numeric input with increment/decrement buttons.

**Tag**: `<nimble-number-field>`

**Attributes**:
- `appearance`: `"underline"` | `"outline"` | `"block"`
- `value`: number - Current value
- `min`: number - Minimum value
- `max`: number - Maximum value
- `step`: number - Increment/decrement step
- `placeholder`, `disabled`, `readonly`, `required`, `error-text`, `error-visible`: Same as text-field
- `hide-step`: boolean - Hide increment/decrement buttons

**Events**: Same as text-field

**Usage**:
```html
<nimble-number-field 
    value="10"
    min="0"
    max="100"
    step="5"
></nimble-number-field>
```

#### nimble-checkbox
Checkbox control.

**Tag**: `<nimble-checkbox>`

**Attributes**:
- `checked`: boolean - Whether checked
- `indeterminate`: boolean - Indeterminate state
- `disabled`: boolean
- `error-text`: string
- `error-visible`: boolean

**Slots**:
- `default`: Label text

**Events**:
- `change`: Fired when checked state changes

**Usage**:
```html
<nimble-checkbox checked>
    I agree to the terms
</nimble-checkbox>
```

#### nimble-switch
Toggle switch control.

**Tag**: `<nimble-switch>`

**Attributes**:
- `checked`: boolean
- `disabled`: boolean

**Slots**:
- `default`: Label text
- `checked-message`: Message shown when checked
- `unchecked-message`: Message shown when unchecked

**Events**:
- `change`: Fired when checked state changes

**Usage**:
```html
<nimble-switch checked>
    <span slot="checked-message">On</span>
    <span slot="unchecked-message">Off</span>
    Enable notifications
</nimble-switch>
```

#### nimble-radio-group
Group of radio buttons.

**Tag**: `<nimble-radio-group>`

**Attributes**:
- `value`: string - Value of selected radio
- `name`: string - Form name
- `orientation`: `"horizontal"` | `"vertical"` - Layout direction
- `disabled`: boolean

**Slots**:
- `label`: Group label
- `default`: nimble-radio elements

**Events**:
- `change`: Fired when selection changes

**Usage**:
```html
<nimble-radio-group value="option1" orientation="vertical">
    <label slot="label">Choose one:</label>
    <nimble-radio value="option1">Option 1</nimble-radio>
    <nimble-radio value="option2">Option 2</nimble-radio>
    <nimble-radio value="option3">Option 3</nimble-radio>
</nimble-radio-group>
```

#### nimble-radio
Radio button (must be child of nimble-radio-group).

**Tag**: `<nimble-radio>`

**Attributes**:
- `value`: string - Value when selected
- `disabled`: boolean

**Slots**:
- `default`: Label text

#### nimble-select
Dropdown select control.

**Tag**: `<nimble-select>`

**Attributes**:
- `value`: string - Selected value
- `disabled`: boolean
- `position`: `"above"` | `"below"` - Dropdown position
- `filter-mode`: `"none"` | `"standard"` - Enable filtering
- `error-text`: string
- `error-visible`: boolean

**Slots**:
- `default`: nimble-list-option elements

**Events**:
- `change`: Fired when selection changes

**Usage**:
```html
<nimble-select>
    <nimble-list-option value="1">Option 1</nimble-list-option>
    <nimble-list-option value="2">Option 2</nimble-list-option>
    <nimble-list-option value="3" disabled>Option 3</nimble-list-option>
</nimble-select>
```

#### nimble-combobox
Searchable dropdown with autocomplete.

**Tag**: `<nimble-combobox>`

**Attributes**:
- `value`: string - Selected value
- `disabled`: boolean
- `position`: `"above"` | `"below"`
- `autocomplete`: `"none"` | `"inline"` | `"list"` | `"both"` - Autocomplete mode
- `error-text`: string
- `error-visible`: boolean

**Slots**:
- `default`: nimble-list-option elements

**Events**:
- `change`: Fired when selection changes

**Usage**:
```html
<nimble-combobox autocomplete="list">
    <nimble-list-option value="apple">Apple</nimble-list-option>
    <nimble-list-option value="banana">Banana</nimble-list-option>
    <nimble-list-option value="cherry">Cherry</nimble-list-option>
</nimble-combobox>
```

#### nimble-list-option
Option for select/combobox (not standalone).

**Tag**: `<nimble-list-option>`

**Attributes**:
- `value`: string - Option value
- `disabled`: boolean
- `selected`: boolean (readonly)
- `hidden`: boolean

**Slots**:
- `default`: Display text

---

### Navigation

#### nimble-breadcrumb
Breadcrumb navigation component.

**Tag**: `<nimble-breadcrumb>`

**Slots**:
- `default`: nimble-breadcrumb-item elements

**Usage**:
```html
<nimble-breadcrumb>
    <nimble-breadcrumb-item href="/">Home</nimble-breadcrumb-item>
    <nimble-breadcrumb-item href="/products">Products</nimble-breadcrumb-item>
    <nimble-breadcrumb-item>Details</nimble-breadcrumb-item>
</nimble-breadcrumb>
```

#### nimble-breadcrumb-item
Breadcrumb item (must be child of nimble-breadcrumb).

**Tag**: `<nimble-breadcrumb-item>`

**Attributes**:
- `href`: string - Navigation URL (omit for current page)

**Slots**:
- `default`: Item text

#### nimble-tabs
Tab navigation component.

**Tag**: `<nimble-tabs>`

**Attributes**:
- `activeid`: string - ID of active tab

**Slots**:
- `default`: nimble-tab and nimble-tab-panel elements

**Events**:
- `change`: Fired when active tab changes

**Usage**:
```html
<nimble-tabs activeid="tab1">
    <nimble-tab id="tab1">Tab 1</nimble-tab>
    <nimble-tab id="tab2">Tab 2</nimble-tab>
    <nimble-tab-panel>Content 1</nimble-tab-panel>
    <nimble-tab-panel>Content 2</nimble-tab-panel>
</nimble-tabs>
```

#### nimble-anchor-tabs
Tab navigation with URL routing.

**Tag**: `<nimble-anchor-tabs>`

**Slots**:
- `default`: nimble-anchor-tab and nimble-tab-panel elements

**Usage**:
```html
<nimble-anchor-tabs>
    <nimble-anchor-tab href="/overview">Overview</nimble-anchor-tab>
    <nimble-anchor-tab href="/details">Details</nimble-anchor-tab>
    <nimble-tab-panel>Overview content</nimble-tab-panel>
    <nimble-tab-panel>Details content</nimble-tab-panel>
</nimble-anchor-tabs>
```

#### nimble-tree-view
Hierarchical tree view component.

**Tag**: `<nimble-tree-view>`

**Attributes**:
- `selection-mode`: `"none"` | `"single"` | `"multi"` - Selection behavior

**Slots**:
- `default`: nimble-tree-item elements

**Usage**:
```html
<nimble-tree-view selection-mode="single">
    <nimble-tree-item>
        Item 1
        <nimble-tree-item>Child 1.1</nimble-tree-item>
        <nimble-tree-item>Child 1.2</nimble-tree-item>
    </nimble-tree-item>
    <nimble-tree-item>Item 2</nimble-tree-item>
</nimble-tree-view>
```

#### nimble-menu
Context menu component.

**Tag**: `<nimble-menu>`

**Slots**:
- `default`: nimble-menu-item elements

**Usage**:
```html
<nimble-menu>
    <nimble-menu-item>Cut</nimble-menu-item>
    <nimble-menu-item>Copy</nimble-menu-item>
    <nimble-menu-item>Paste</nimble-menu-item>
</nimble-menu>
```

#### nimble-menu-item
Menu item (can contain nested menus).

**Tag**: `<nimble-menu-item>`

**Attributes**:
- `disabled`: boolean

**Slots**:
- `default`: Menu item text
- `start`: Leading icon
- `end`: Trailing icon
- `submenu`: Nested nimble-menu for submenu

**Usage**:
```html
<nimble-menu-item>
    <nimble-icon-edit slot="start"></nimble-icon-edit>
    Edit
</nimble-menu-item>
```

---

### Feedback & Overlays

#### nimble-banner
Alert/notification banner.

**Tag**: `<nimble-banner>`

**Attributes**:
- `severity`: `"default"` | `"error"` | `"warning"` | `"information"` - Visual severity
- `open`: boolean - Whether banner is visible
- `title-hidden`: boolean - Hide title
- `prevent-dismiss`: boolean - Prevent user dismissal

**Slots**:
- `title`: Banner title
- `default`: Banner message
- `actions`: Action buttons

**Events**:
- `close`: Fired when banner is dismissed

**Usage**:
```html
<nimble-banner severity="information" open>
    <span slot="title">Information</span>
    This is an informational message.
    <nimble-button slot="actions" appearance="ghost">Learn More</nimble-button>
</nimble-banner>
```

#### nimble-dialog
Modal dialog component.

**Tag**: `<nimble-dialog>`

**Attributes**:
- `header-hidden`: boolean - Hide dialog header
- `footer-hidden`: boolean - Hide dialog footer

**Slots**:
- `title`: Dialog title
- `default`: Dialog content
- `footer`: Dialog footer (typically buttons)

**Methods**:
- `show()`: Promise<void> - Opens the dialog
- `close(reason?: string)`: void - Closes the dialog

**Events**:
- `close`: Fired when dialog is closed (event.detail contains reason)

**Usage**:
```html
<nimble-dialog id="myDialog">
    <span slot="title">Confirm Action</span>
    Are you sure you want to continue?
    <div slot="footer">
        <nimble-button appearance="ghost" id="cancelBtn">Cancel</nimble-button>
        <nimble-button appearance-variant="primary" id="confirmBtn">Confirm</nimble-button>
    </div>
</nimble-dialog>

<script>
    document.getElementById('openBtn').addEventListener('click', () => {
        document.getElementById('myDialog').show();
    });
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('myDialog').close('cancel');
    });
</script>
```

#### nimble-drawer
Side panel/drawer component.

**Tag**: `<nimble-drawer>`

**Attributes**:
- `location`: `"left"` | `"right"` - Which side drawer appears on

**Slots**:
- `title`: Drawer title
- `default`: Drawer content
- `footer`: Drawer footer

**Methods**:
- `show()`: Promise<void> - Opens the drawer
- `close(reason?: string)`: void - Closes the drawer

**Events**:
- `close`: Fired when drawer is closed

**Usage**:
```html
<nimble-drawer location="right" id="myDrawer">
    <span slot="title">Settings</span>
    <div>Drawer content here</div>
</nimble-drawer>
```

#### nimble-spinner
Loading indicator.

**Tag**: `<nimble-spinner>`

**Attributes**:
- `appearance`: `"default"` | `"accent"` - Visual style

**Usage**:
```html
<nimble-spinner></nimble-spinner>
```

#### nimble-tooltip
Tooltip component.

**Tag**: `<nimble-tooltip>`

**Attributes**:
- `anchor`: string (required) - ID of element to attach to
- `severity`: `"default"` | `"error"` | `"warning"` | `"information"` - Visual style
- `icon-visible`: boolean - Show severity icon
- `position`: Various positions like `"top"`, `"bottom"`, `"left"`, `"right"`, etc.

**Slots**:
- `default`: Tooltip content

**Usage**:
```html
<nimble-button id="help-btn">Help</nimble-button>
<nimble-tooltip anchor="help-btn" position="top">
    Click for assistance
</nimble-tooltip>
```

---

### Data Display

#### nimble-table
Advanced data table with sorting, filtering, and selection.

**Tag**: `<nimble-table>`

**Attributes**:
- `id-field-name`: string (required) - Property name for unique row IDs
- `selection-mode`: `"none"` | `"single"` | `"multi"` - Row selection mode

**Slots**:
- `default`: Table column components

**Methods**:
- `setData(data: any[])`: void - Sets table data
- `getSelectedRecordIds()`: string[] - Gets selected row IDs

**Events**:
- `selection-change`: Fired when selection changes

**Usage**:
```html
<nimble-table id="myTable" id-field-name="id" selection-mode="multi">
    <nimble-table-column-text field-name="firstName" column-id="first">First Name</nimble-table-column-text>
    <nimble-table-column-text field-name="lastName" column-id="last">Last Name</nimble-table-column-text>
    <nimble-table-column-number-text field-name="age" column-id="age">Age</nimble-table-column-number-text>
</nimble-table>

<script>
    const table = document.getElementById('myTable');
    table.setData([
        { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
        { id: '2', firstName: 'Jane', lastName: 'Smith', age: 25 }
    ]);
</script>
```

#### Table Columns

All table columns share these common attributes:
- `column-id`: string (required) - Unique column identifier
- `column-hidden`: boolean - Hide column
- `sortable`: boolean - Enable sorting (not available on all column types)
- `groupable`: boolean - Enable grouping (not available on all column types)
- `fractional-width`: number - Relative width (default 1)
- `min-pixel-width`: number - Minimum width in pixels

**nimble-table-column-text**: Display text

**Attributes**:
- `field-name`: string (required) - Property to display
- `placeholder`: string - Text when value is missing

**nimble-table-column-number-text**: Display formatted numbers

**Attributes**:
- `field-name`: string (required)
- `format`: `"default"` | `"decimal"` - Number format
- `placeholder`: string
- Additional formatting attributes: `decimal-digits`, `decimal-maximum-digits`

**nimble-table-column-date-text**: Display formatted dates

**Attributes**:
- `field-name`: string (required)
- `format`: `"default"` | `"custom"` - Date format
- `placeholder`: string
- Custom format attributes when format="custom": `day-format`, `month-format`, `year-format`, etc.

**nimble-table-column-anchor**: Display links

**Attributes**:
- `label-field-name`: string - Property for link text
- `href-field-name`: string - Property for URL
- `placeholder`: string

**nimble-table-column-icon**: Display icons

**Attributes**:
- `field-name`: string (required) - Property containing icon severity or state
- Additional mapping children required

**nimble-table-column-enum-text**: Display mapped enum values

**Attributes**:
- `field-name`: string (required)
- Children: `nimble-mapping-*` elements for value mapping

**nimble-table-column-menu-button**: Action menu per row

**Attributes**:
- `menu-slot`: string - Slot name for menu template
- `fractional-width`, `min-pixel-width`: Same as other columns

**Usage**:
```html
<nimble-table-column-menu-button menu-slot="actions">
    Actions
</nimble-table-column-menu-button>
<!-- In row data, provide slot="actions" menu content -->
```

#### nimble-card
Content card container.

**Tag**: `<nimble-card>`

**Slots**:
- `default`: Card content

**Usage**:
```html
<nimble-card>
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
</nimble-card>
```

#### nimble-card-button
Clickable card that can be selected.

**Tag**: `<nimble-card-button>`

**Attributes**:
- `selected`: boolean - Whether card is selected
- `disabled`: boolean

**Slots**:
- `default`: Card content

**Events**:
- `click`: Standard click event

**Usage**:
```html
<nimble-card-button selected>
    <h3>Option A</h3>
    <p>Description of option A</p>
</nimble-card-button>
```

---

### Layout

#### nimble-toolbar
Toolbar container for buttons and controls.

**Tag**: `<nimble-toolbar>`

**Slots**:
- `default`: Toolbar content (buttons, etc.)

**Usage**:
```html
<nimble-toolbar>
    <nimble-button>New</nimble-button>
    <nimble-button>Save</nimble-button>
    <nimble-button>Delete</nimble-button>
</nimble-toolbar>
```

#### nimble-label-provider
Provides localized strings for Nimble components.

**Tag**: `<nimble-label-provider>`

**Attributes**: Many attributes for different localized strings (see documentation)

**Slots**:
- `default`: Content to provide labels for

**Usage**:
```html
<nimble-label-provider>
    <!-- Your components that need localization -->
</nimble-label-provider>
```

---

### Icons

Nimble includes many icons. Import the specific icon you need:

```typescript
import '@ni/nimble-components/dist/esm/icons/check';
import '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import '@ni/nimble-components/dist/esm/icons/settings';
```

Use in HTML:
```html
<nimble-icon-check></nimble-icon-check>
<nimble-icon-arrow-expander-down></nimble-icon-arrow-expander-down>
<nimble-icon-settings></nimble-icon-settings>
```

All icons support the `severity` attribute:
- `severity`: `"default"` | `"error"` | `"warning"` | `"information"` | `"success"`

Common icons include:
- `nimble-icon-check` - Checkmark
- `nimble-icon-xmark` - X/close
- `nimble-icon-arrow-expander-down` - Down arrow
- `nimble-icon-arrow-expander-up` - Up arrow
- `nimble-icon-settings` - Settings gear
- `nimble-icon-search` - Magnifying glass
- `nimble-icon-trash` - Trash can
- `nimble-icon-edit` - Pencil/edit
- `nimble-icon-add` - Plus sign
- And many more...

---

## Framework-Specific Notes

### Angular (@ni/nimble-angular)

Import modules for each component:
```typescript
import { NimbleButtonModule, NimbleTextFieldModule } from '@ni/nimble-angular';
```

Use `[(ngModel)]` for two-way binding on form controls:
```html
<nimble-text-field [(ngModel)]="value"></nimble-text-field>
```

### Blazor (NimbleBlazor)

Use Pascal case for component names and attributes:
```razor
<NimbleButton Appearance="ButtonAppearance.Outline">Click Me</NimbleButton>
<NimbleTextField @bind-Value="value" Placeholder="Enter text" />
```

### React (@ni/nimble-react)

Import React components:
```typescript
import { NimbleButton, NimbleTextField } from '@ni/nimble-react';
```

---

## Best Practices

1. **Always wrap your app in a theme provider**
2. **Set id-field-name on tables** to ensure proper row identification
3. **Use error-text and error-visible** for form validation feedback
4. **Prefer anchor-button over button + click handler** for navigation
5. **Use content-hidden for icon-only buttons** and provide aria-label
6. **Import only needed components** for better bundle size

## Additional Resources

- Storybook Documentation: https://ni.github.io/nimble/storybook
- GitHub Repository: https://github.com/ni/nimble
- Component Status: https://ni.github.io/nimble/storybook/?path=/docs/component-status--docs
