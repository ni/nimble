# Table Selection Mode for Action Menus HLD

## Problem Statement

Currently, the Nimble table component automatically changes row selection when users open action menus on rows. This behavior creates usability issues in scenarios where users want to access row-specific actions without changing which rows are currently selected.

This design proposes adding a configurable `action-menus-preserve-selection` attribute to the table component that allows clients to control whether opening action menus automatically selects rows. This is the design for #2708.

## Links To Relevant Work Items and Reference Material

[Configurable table selection mode for action menus](https://github.com/ni/nimble/issues/2708)

## Implementation / Design

### API Changes

#### New Table Attribute

**`action-menus-preserve-selection`** (boolean):

- **Default**: `false` (preserves existing behavior)
- **When `false`**: Opening action menus changes selection to include the clicked record
- **When `true`**: Opening action menus preserves existing selection state

```html
<!-- Default behavior -->
<nimble-table selection-mode="multiple"></nimble-table>

<!-- Preserve selection when opening action menus -->
<nimble-table selection-mode="multiple" action-menus-preserve-selection>
</nimble-table>
```

#### Event Data

**New `operatingRecordId` field** added to `TableActionMenuToggleEventDetail`:

```typescript
interface TableActionMenuToggleEventDetail {
    recordIds: string[]; // Current selection state
    operatingRecordId: string; // NEW: Record that triggered the action menu
    newState: boolean; // Menu open/close state
    // ... other existing fields
}
```

This ensures applications always know both the current selection and which specific record triggered the action menu.

### Code Changes

#### Selection Manager Updates

- **SelectionManagerBase**: Add `actionMenusPreserveSelection` parameter and update method
- **InteractiveSelectionManager**: Manage the flag and propagate to concrete managers
- **MultiSelectionManager**: Conditionally select unselected rows in `handleActionMenuOpening()`
- **SingleSelectionManager**: Use flag to determine if action menu opening should change selection

#### Table Component

- Add boolean `action-menus-preserve-selection` attribute to table component
- Pass attribute value to selection manager during initialization and updates

#### Framework Integration

- Update Angular and Blazor wrappers to expose the new attribute and field following existing patterns.  

## Alternative Implementations / Designs

These alternatives were pulled from the original issue.

### Alternative 1: Add configurable option to each table column for selection behavior from action menus

**Approach**: Configure selection behavior at the column level rather than table level

- Each column with an action menu could have its own `action-menus-preserve-selection` setting
- Allow mixed behavior across columns in the same table

**Pros**:

- More granular control than table-wide setting
- Could conceptually separate "main" columns (coupled to selection) from "operational" columns (independent of selection)

**Cons**:

- Creates potential inconsistencies between columns within tables and between tables in UIs
- May confuse users when different action menus operate on different contexts (selection vs specific row)
- Adds complexity to API and mental model

**Rejection Reason**: Table-level configuration provides sufficient control while maintaining consistency. Column-level configuration would create confusion about what context action menus operate in.

### Alternative 2: Modify the existing menu button column for this use-case

**Approach**: Enhance the existing menu-button column to not change selection

- Update menu-button column to never affect table selection
- Use this column type for non-intrusive action menus

**Pros**:

- Isolated change with narrow scope
- Existing column type could be enhanced

**Cons**:

- Current use cases desire fixed-width icon columns, which would require new menu-button column behavior
- Would likely need icon mapping capabilities, essentially requiring a new column type anyway
- Doesn't address action menus on existing column types

**Rejection Reason**: Doesn't solve the core problem of action menus on existing columns and would require significant new column development.

### Alternative 3: Create new column type based on menu-button column

**Approach**: Clone menu-button column as new column type that doesn't change selection

- Duplicate menu-button functionality with non-intrusive selection behavior
- Use as specialized column for this use case

**Pros**:

- Could be tailored specifically to the use case
- Good for rapid prototyping and isolated testing

**Cons**:

- Creates duplicate/workaround functionality instead of addressing core issue
- Tables using this column unlikely to also use standard action menus
- Requires exposing hover state to cells to duplicate action menu behavior
- Behaves as separate fixed-width column with dividers instead of operating on existing columns

**Rejection Reason**: Creates workaround rather than solving the fundamental issue. Duplicates existing functionality unnecessarily.

### Alternative 4: Change behavior altogether in one go (breaking change)

**Approach**: Globally change action menu behavior to never affect selection

- Remove selection-changing behavior from all action menus
- Rely on applications to provide toolbar actions for bulk operations

**Pros**:

- Eliminates need to manage multiple selection behaviors
- Simplifies mental model - action menus always operate on single records

**Cons**:

- Breaking change affecting all existing applications
- Some applications may rely on action menu selection behavior for bulk actions and lack toolbar alternatives
- No migration path for applications that need the existing behavior

**Rejection Reason**: Breaking change with no migration path. Would require all applications to implement alternative bulk action patterns.

## Open Issues

- None
