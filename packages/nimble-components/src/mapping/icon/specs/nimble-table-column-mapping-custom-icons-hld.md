# Custom Icon Support for Table Column Mapping HLD

## Problem Statement

Currently, the `nimble-table-column-mapping` component only supports Nimble icons through the `nimble-mapping-icon` element. Users need to add custom SVG and PNG icons in some applications that are leveraging the nimble table.

This design proposes adding two new mapping elements (`nimble-mapping-svg-icon` and `nimble-mapping-png-icon`) to enable custom icon support.

## Implementation / Design

### New Mapping Elements

Create two new mapping elements following the existing pattern:

#### `nimble-mapping-svg-icon`
- **Attributes:**
  - `key`: string | number | boolean (same as existing mappings)
  - `svg-content`: string - Raw SVG markup to render
  - `severity`: IconSeverity - Controls color theming
  - `text`: string - Tooltip and accessibility text
  - `text-hidden`: boolean - Controls text visibility

#### `nimble-mapping-png-icon`
- **Attributes:**
  - `key`: string | number | boolean (same as existing mappings) 
  - `src`: string - URL or data URL to PNG/image
  - `alt`: string - Alt text for accessibility
  - `text`: string - Tooltip and display text
  - `text-hidden`: boolean - Controls text visibility

### Supporting Infrastructure

- Add **`MappingSvgIconConfig`** and **`MappingPngIconConfig`** following existing `MappingIconConfig` pattern
- Custom ViewTemplates for rendering SVG content and images with proper styling and accessibility
- CSS classes to match nimble design tokens and severity theming
- Extend existing `TableColumnMappingCellView` and `TableColumnMappingGroupHeaderView` to handle new mapping types

### Framework Integration

Update Angular, React, and Blazor integrations to support the new mapping elements using existing patterns.

## Alternative Implementations / Designs

### Alternative 1: Extend Existing `nimble-mapping-icon`
Add `svg-content`, `image-src`, and `image-alt` attributes to the existing `nimble-mapping-icon` element.

**Rejected because:**
Creates a confusing list of attributes, and a less-than-ideal developer experience.


## Open Issues

- Do we need to add any security checks/validation for SVG content or PNG links?
