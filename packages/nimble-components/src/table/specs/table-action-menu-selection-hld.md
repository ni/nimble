# Table Selection Mode for Action Menus HLD

## Problem Statement

Currently, the Nimble table component automatically changes row selection when users open action menus on rows. This behavior creates usability issues in scenarios where users want to access row-specific actions without changing which rows are currently selected.

This design proposes adding a configurable `action-menu-changes-selection` attribute to the table component that allows clients to control whether opening action menus automatically selects rows.

## Links To Relevant Work Items and Reference Material

[Configurable table selection mode for action menus](https://github.com/ni/nimble/issues/2708)

## Implementation / Design

### Overview

This design adds a new boolean attribute `action-menu-changes-selection` to the `nimble-table` component with the following characteristics:

- **Default value**: `true` (action menus change selection - preserves existing behavior)
- **Backward compatibility**: Existing tables continue to work unchanged
- **Opt-in new behavior**: Setting to `false` enables non-intrusive action menu behavior
- **Enhanced event context**: New `operatingRecord` field provides trigger record information in both modes

### Architecture Changes

#### 1. Table Component API

```html
<!-- Default behavior (preserves existing selection-changing behavior) -->
<nimble-table 
    selection-mode="single">
</nimble-table>

<!-- Explicit default (same as above) -->
<nimble-table 
    selection-mode="single" 
    action-menu-changes-selection="true">
</nimble-table>

<!-- New non-intrusive behavior -->
<nimble-table 
    selection-mode="multiple" 
    action-menu-changes-selection="false">
</nimble-table>
```

#### 2. Component Architecture

The design follows the existing selection manager pattern in the codebase:

```
Table Component
├── InteractiveSelectionManager
    ├── actionMenuChangesSelection: boolean
    └── Selection Manager Implementations
        ├── MultiSelectionManager
        ├── SingleSelectionManager  
        └── DisabledSelectionManager
```

#### 3. Selection Manager Updates

**Base Class (`SelectionManagerBase`)**:
- Updated constructor to accept `actionMenuChangesSelection` parameter (defaults to `true` for backward compatibility)
- Stores flag as protected property accessible to concrete implementations
- Provides `updateActionMenuChangesSelection()` method for runtime updates

**Interactive Selection Manager**:
- Manages the `actionMenuChangesSelection` flag and propagates changes to concrete managers
- Handles component initialization timing issues where attribute changes occur before DOM connection

**Concrete Managers**:
- **MultiSelectionManager**: Uses flag in `handleActionMenuOpening()` to conditionally select unselected rows
- **SingleSelectionManager**: Uses flag to determine whether to treat action menu opening as row selection
- **DisabledSelectionManager**: Unchanged (always returns false for no selection changes)

#### 4. Behavior Matrix

| Selection Mode | Flag Value | Action Menu Behavior |
|----------------|------------|---------------------|
| `none` | `false`/`true` | No selection change (disabled) |
| `single` | `true` | Selects clicked row (default) |
| `single` | `false` | No selection change |
| `multiple` | `true` | Selects unselected rows (default) |
| `multiple` | `false` | No selection change |

### Record Context and Event Behavior

A key design consideration is the distinction between **selection state** (which records are currently selected in the table) and the **operating record** (the specific record on which the action menu was opened).

#### Current Behavior

**With `action-menu-changes-selection="true"` (default)**:
- Action menu opening **modifies selection state** to include the clicked record
- Event `recordIds` reflects the **updated selection state** after the action menu operation
- In single selection: `recordIds` contains the clicked record (now selected)
- In multi-selection: `recordIds` contains either the existing selection (if clicked record was already selected) or just the clicked record (if it wasn't selected)

**With `action-menu-changes-selection="false"`**:
- Action menu opening **preserves existing selection state**
- Event `recordIds` reflects the **current selection state** (unchanged by the action menu operation)
- The specific record clicked to open the action menu may or may not be in the selection
- Applications receive context about what's selected, but lose direct information about which record triggered the action menu


| Selection Mode | Flag Value | Event `recordIds` Content |
|----------------|------------|---------------------------|
| `single` | `true` | The clicked record (now selected) |
| `single` | `false` | Current selection (may be empty or different record) |
| `multiple` | `true` | Current selection after action menu logic (clicked record guaranteed included) |
| `multiple` | `false` | Current selection (unchanged, clicked record may not be included) |

#### Proposed Behavior

To address the limitation of losing trigger record context when `action-menu-changes-selection="false"`, the implementation includes an additional `operatingRecord` field in action menu events.

**Updated Event Interface**:
```typescript
interface TableActionMenuToggleEventDetail {
    recordIds: string[];        // Current selection state (existing field)
    operatingRecord: string;    // NEW: Record that triggered the action menu
    newState: boolean;          // Menu open/close state (existing field)
    // ... other existing fields
}
```

**Complete Event Data Structure**:

| Selection Mode | Flag Value | `recordIds` Content | `operatingRecord` Content |
|----------------|------------|---------------------|---------------------------|
| `single` | `true` | The clicked record (now selected) | The clicked record |
| `single` | `false` | Current selection (unchanged) | The clicked record |
| `multiple` | `true` | Current selection (includes clicked record) | The clicked record |
| `multiple` | `false` | Current selection (unchanged) | The clicked record |

#### Design Benefits

**Complete Context for Action Menu Handlers**:
- ✅ **Selection state**: Available via `event.detail.recordIds` (works with both flag settings)
- ✅ **Trigger record**: Available via `event.detail.operatingRecord` (works with both flag settings)
- ✅ **Backward compatibility**: Existing `recordIds` behavior preserved

#### Migration Impact

- **Non-breaking**: Existing code using `recordIds` continues to work unchanged
- **Additive**: New `operatingRecord` field provides additional context
- **Optional adoption**: Applications can use the new field when needed

### Web Standards Alignment

- **Web Components**: Follows standard attribute patterns with boolean mode
- **ARIA**: No impact on accessibility - action menus remain fully accessible
- **HTML Standards**: Uses kebab-case attribute naming convention

### API Compatibility

- **Non-breaking**: Default behavior maintains existing selection-changing functionality
- **Additive**: Only adds new optional attribute
- **Opt-in improvement**: Developers can enable non-intrusive behavior with `action-menu-changes-selection="false"`

## Alternative Implementations / Designs

### Alternative 1: Add configurable option to each table column for selection behavior from action menus

**Approach**: Configure selection behavior at the column level rather than table level
- Each column with an action menu could have its own `action-menu-changes-selection` setting
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

- TBD