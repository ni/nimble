# High Level Design: Support for Custom Icons

## Problem Statement

The current nimble icon system has the `Icon` class handling both general icon functionality and SVG-specific functionality. This limits extensibility for other icon types, like PNG.

This design introduces a separation between base icon functionality and SVG-specific icon implementations and can be extended to support custom icon types. It also introduces a new component in Ok to render icons dynamically.

## Links To Relevant Work Items and Reference Material

- [GitHub PR #2814: SVGIcon prototype](https://github.com/ni/nimble/pull/2814)

## Implementation / Design

### Class Hierarchy Changes

```
Icon (base class with severity, etc.)
├── SvgIcon (extends Icon, handles SVG data) - Class for Nimble Icons
└── DynamicIcon (extends Icon, dynamically register custom icons)
```

### API Changes

   - Rename `registerIcon()` to `registerSvgIcon()`
   - Update type signature to accept `typeof SvgIcon` instead of generic type

### New Component: Ok Dynamic Icon
A component that enables dynamic registration and usage of custom icons from URLs (data URLs, external URLs, etc.) following the same patterns as standard nimble icons.

#### API
- **registerDynamicIcon(name: string, src: string)**: Registers a new dynamic icon
- **getDynamicIconTag(name: string)**: Returns the custom element tag name for a registered icon
- **Generated Custom Elements**: Each registered icon creates its own custom element (e.g., `<ok-dynamic-icon-rumham>`)

#### Usage Example
```javascript
// Registration
registerDynamicIcon('rumham', 'data:image/png;base64,...');

// Usage in HTML
const tag = getDynamicIconTag('rumham'); // Returns 'ok-dynamic-icon-rumham'
// <ok-dynamic-icon-rumham></ok-dynamic-icon-rumham>
```

#### Blazor Integration
Provide a Blazor wrapper component that handles JavaScript interop for icon registration and returns the appropriate custom element tag for use in Blazor applications.

**Usage in Blazor:**
```html
<OkDynamicIcon Name="rumham" Source="data:image/svg+xml;base64,..." />
```

The component automatically registers the icon and renders the corresponding custom element (e.g., `<ok-dynamic-icon-rumham></ok-dynamic-icon-rumham>`) using the OkDynamicIcon.register method accessed through OkBlazor.module.js.

## Alternative Implementations / Designs

1. **Create a new table column mapping in Ok**: Would require significant duplication of nimble table column components, and introduce a circular dependency.

## Open Issues

N/A