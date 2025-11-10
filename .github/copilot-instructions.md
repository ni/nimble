# Nimble Design System - Copilot Instructions

## About Nimble

Nimble is NI's design system providing styled UI components for web applications. It supports three frameworks:
- **@ni/nimble-components** - Web Components (framework-agnostic, using Custom Elements)
- **@ni/nimble-angular** - Angular bindings
- **NimbleBlazor** - Blazor bindings

## Installation

### Web Components (Vanilla JS/TS)
```bash
npm install @ni/nimble-components
```

### Angular
```bash
npm install @ni/nimble-angular
```

### Blazor
```bash
dotnet add package NimbleBlazor
```

## General Usage Guidelines

### Web Components

1. **Import the all-components module** for convenience:
```typescript
import '@ni/nimble-components/dist/esm/all-components';
```

Or import specific components:
```typescript
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/text-field';
```

2. **Use in HTML**:
```html
<nimble-button appearance="outline">Click Me</nimble-button>
<nimble-text-field placeholder="Enter text"></nimble-text-field>
```

3. **Theme Provider**: Wrap your app in a theme provider:
```html
<nimble-theme-provider theme="light">
    <!-- Your app content -->
</nimble-theme-provider>
```

### Angular

1. **Import the NimbleModule** in your Angular module:
```typescript
import { NimbleButtonModule, NimbleTextFieldModule } from '@ni/nimble-angular';

@NgModule({
    imports: [
        NimbleButtonModule,
        NimbleTextFieldModule
    ]
})
```

2. **Use in templates**:
```html
<nimble-button appearance="outline">Click Me</nimble-button>
<nimble-text-field [(ngModel)]="value" placeholder="Enter text"></nimble-text-field>
```

3. **Theme Provider**: Wrap your app in a theme provider in app.component.html:
```html
<nimble-theme-provider theme="light">
    <router-outlet></router-outlet>
</nimble-theme-provider>
```

### Blazor

1. **Add to _Imports.razor**:
```razor
@using NimbleBlazor
```

2. **Use components**:
```razor
<NimbleButton Appearance="ButtonAppearance.Outline">Click Me</NimbleButton>
<NimbleTextField @bind-Value="value" Placeholder="Enter text" />
```

3. **Theme Provider**: Wrap your app in ThemeProvider in MainLayout.razor or App.razor:
```razor
<NimbleThemeProvider Theme="Theme.Light">
    @Body
</NimbleThemeProvider>
```

## Common Components and Their Key Attributes

### Buttons
- **nimble-button**: Standard button
  - `appearance`: `outline` (default), `ghost`, `block`
  - `appearance-variant`: `default`, `primary`, `accent`
  - `disabled`: boolean
  - `content-hidden`: boolean (icon-only mode)

- **nimble-anchor-button**: Button that navigates to a URL
  - Same attributes as button, plus:
  - `href`: URL to navigate to
  - `hreflang`: Language of linked document
  - `ping`: Space-separated URLs to ping
  - `referrerpolicy`: Referrer policy
  - `rel`: Relationship to linked document
  - `target`: Where to open the linked document
  - `type`: MIME type
  - `download`: File name for download

- **nimble-menu-button**: Button that opens a menu
  - Same appearance attributes as button
  - Children: `nimble-menu-item` elements
  - `position`: `above`, `below`, `auto`

- **nimble-toggle-button**: Toggle button
  - `checked`: boolean
  - `appearance`: `outline`, `solid`

### Form Controls

- **nimble-text-field**: Single-line text input
  - `appearance`: `underline` (default), `outline`, `block`
  - `placeholder`: Placeholder text
  - `value`: Current value
  - `disabled`: boolean
  - `readonly`: boolean
  - `error-text`: Error message to display
  - `error-visible`: boolean - shows error state
  - `required`: boolean
  - `full-bleed`: boolean - removes padding
  - Standard HTML attributes: `type`, `maxlength`, `minlength`, `pattern`, `autocomplete`

- **nimble-text-area**: Multi-line text input
  - `appearance`: `underline`, `outline`, `block`
  - `placeholder`: Placeholder text
  - `value`: Current value
  - `resize`: `none`, `vertical`, `horizontal`, `both`
  - `disabled`, `readonly`, `error-text`, `error-visible`, `required`: same as text-field
  - Standard HTML attributes: `rows`, `cols`, `maxlength`

- **nimble-number-field**: Numeric input
  - `appearance`: `underline`, `outline`, `block`
  - `value`: Number value
  - `min`, `max`, `step`: Number constraints
  - `placeholder`, `disabled`, `readonly`, `error-text`, `error-visible`, `required`: same as text-field
  - `hide-step`: boolean - hides increment/decrement buttons

- **nimble-checkbox**: Checkbox control
  - `checked`: boolean
  - `indeterminate`: boolean
  - `disabled`: boolean
  - `error-text`, `error-visible`: same as form controls

- **nimble-switch**: Toggle switch
  - `checked`: boolean
  - `disabled`: boolean

- **nimble-radio-group**: Group of radio buttons
  - `orientation`: `horizontal`, `vertical`
  - `disabled`: boolean
  - `value`: Selected value
  - Children: `nimble-radio` elements

- **nimble-radio**: Radio button
  - `value`: Value when selected
  - `disabled`: boolean

- **nimble-select**: Dropdown select
  - `position`: `above`, `below`
  - `disabled`: boolean
  - `error-text`, `error-visible`: same as form controls
  - Children: `nimble-list-option` elements

- **nimble-combobox**: Searchable dropdown
  - `autocomplete`: `none`, `inline`, `list`, `both`
  - `position`: `above`, `below`
  - `disabled`: boolean
  - `error-text`, `error-visible`: same as form controls
  - Children: `nimble-list-option` elements

### Navigation

- **nimble-breadcrumb**: Breadcrumb navigation
  - Children: `nimble-breadcrumb-item` elements
  - Each item can have `href` for navigation

- **nimble-tabs**: Tab navigation
  - `activeid`: ID of active tab
  - Children: `nimble-tab` and `nimble-tab-panel` elements

- **nimble-anchor-tabs**: Tab navigation with URL routing
  - Children: `nimble-anchor-tab` and `nimble-tab-panel` elements
  - Each tab has `href` attribute

- **nimble-tree-view**: Hierarchical tree view
  - `selection-mode`: `none`, `single`, `multi`
  - Children: `nimble-tree-item` elements (can be nested)

- **nimble-menu**: Context menu
  - Children: `nimble-menu-item` elements
  - Can be nested for submenus

### Feedback

- **nimble-banner**: Alert/notification banner
  - `severity`: `default`, `error`, `warning`, `information`
  - `open`: boolean - controls visibility
  - `title-hidden`: boolean
  - `prevent-dismiss`: boolean
  - Slots: `title`, `default` (message), `actions` (buttons)

- **nimble-dialog**: Modal dialog
  - `header-hidden`: boolean
  - `footer-hidden`: boolean
  - Methods: `show()`, `close()` - call via JavaScript
  - Slots: `title`, `default` (content), `footer`

- **nimble-drawer**: Side drawer/panel
  - `location`: `left`, `right`
  - Methods: `show()`, `close()`
  - Slots: `title`, `default` (content), `footer`

- **nimble-spinner**: Loading indicator
  - `appearance`: `default`, `accent`

- **nimble-tooltip**: Tooltip
  - `anchor`: ID of element to anchor to
  - `severity`: `default`, `error`, `warning`, `information`
  - `icon-visible`: boolean
  - `position`: Position relative to anchor
  - Slots: `default` (tooltip content)

### Data Display

- **nimble-table**: Data table with advanced features
  - `id-field-name`: Property name to use as unique ID
  - `selection-mode`: `none`, `single`, `multi`
  - Children: Table column components (see below)
  - Methods: `setData()`, `getSelectedRecordIds()`
  
  Table columns (all are children of nimble-table):
  - **nimble-table-column-text**: Text column
    - `field-name`: Property to display
    - `column-id`: Unique ID
    - `sortable`: boolean
    - `groupable`: boolean
  - **nimble-table-column-number-text**: Formatted numbers
  - **nimble-table-column-date-text**: Formatted dates
  - **nimble-table-column-anchor**: Links
  - **nimble-table-column-icon**: Icons
  - **nimble-table-column-enum-text**: Enum values with mapping
  - **nimble-table-column-menu-button**: Action menu per row

- **nimble-card**: Content card
  - Slots: `default` (content)

- **nimble-card-button**: Clickable card
  - `selected`: boolean
  - `disabled`: boolean

### Layout

- **nimble-toolbar**: Toolbar container
  - Children: Button components and other toolbar items

- **nimble-label-provider**: Localization provider
  - Provides localized strings for Nimble components
  - Wrap app or specific components

## Icons

Nimble includes many built-in icons. Import and use them:

```typescript
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
```

```html
<nimble-icon-check></nimble-icon-check>
```

## Best Practices

1. **Always use a theme provider** at the root of your app
2. **For forms**, use `error-text` and `error-visible` for validation feedback
3. **For navigation**, prefer `nimble-anchor-button` over `nimble-button` with click handlers
4. **For data tables**, always set `id-field-name` to a unique identifier property
5. **Import only what you need** for better tree-shaking in web components
6. **Use TypeScript** for better autocomplete and type safety

## Documentation Links

- Storybook (Component Documentation): https://ni.github.io/nimble/storybook
- Component Status: https://ni.github.io/nimble/storybook/?path=/docs/component-status--docs
- GitHub Repository: https://github.com/ni/nimble
