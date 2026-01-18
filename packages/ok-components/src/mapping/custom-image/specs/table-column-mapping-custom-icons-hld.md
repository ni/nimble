# Custom Image Mapping [Template]

## Overview

Custom image support for table column mapping, enabling the use of user-provided images in addition to Nimble's built-in icon set.

### Background

- Currently, the `nimble-table-column-mapping` component only supports Nimble icons through the `nimble-mapping-icon` element
- Users need to add custom images in some applications that are leveraging the nimble table

### Containing Library

This component will be part of Ok component library.

### Non-goals

- Image validation
  
### Features

- Support for locally hosted images
- Integration with existing table column mapping

### Risks and Challenges

- If cross origin images are required, there will be additional security challenges to address. 

### Prior Art/Examples

- Existing `nimble-mapping-icon` component for Nimble icons
- Standard HTML `<img>` element patterns

---

## Design

### API

**Component Name:** `ok-mapping-custom-image`

**Props/Attrs:**
- `key`: string | number | boolean - Mapping key value
- `src`: string - URL for custom image
- `severity`: IconSeverity - Controls color theming (default, error, warning, success, information)
- `text`: string - Tooltip and display text
- `text-hidden`: boolean - Controls text visibility

**Supporting Infrastructure**

- Add **`MappingCustomImageConfig`** following existing `MappingIconConfig` pattern
- Custom ViewTemplates for rendering images with proper styling and accessibility
- Extend existing `TableColumnMappingCellView` and `TableColumnMappingGroupHeaderView` to handle new mapping type

### Anatomy


### Native form integration

N/A - This component is for display purposes within table cells.

### Angular integration

- Directive for attribute binding following existing mapping patterns
- Integration with existing table column mapping directives

### Blazor integration (TBD if necessary)

- Razor component following existing mapping patterns
- Integration with existing table column mapping components

### Visual Appearance

- Custom images will have a class applied that ensures proper sizing, spacing, and alignment within table cells

---

## Implementation

### States

- Default state with custom image display
- Error states for missing or invalid image sources

### Accessibility

- Tooltip support for additional context
- Role and labeling support

### Mobile

- Mirror behavior for existing table column icon mapping.

### Globalization

- No additional considerations.

### Security

- Images will be hosted locally. No image validation is provided by this component.

### Performance

- Images will not be pre-fetched for the initial implementation.

### Dependencies

- No additional dependencies required.

### Test Plan

- Unit tests for basic functionality and attribute binding
- Integration tests with table column mapping

### Tooling

- Integration with existing Storybook documentation

### Documentation

- Usage examples in Storybook

---
## Open Issues

- 
