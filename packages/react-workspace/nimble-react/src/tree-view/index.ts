import { TreeView } from '@ni/nimble-components/dist/esm/tree-view';
import { wrap } from '../utilities/react-wrapper';
import type { TreeItemExpandedChangeEvent, TreeItemSelectedChangeEvent } from '../tree-item';

export const NimbleTreeView = wrap(TreeView, {
    events: {
        onExpandedChange: 'expanded-change',
        onSelectedChange: 'selected-change',
    }
});

/**
 * Bubbling event emitted by a tree item child when expanded or collapsed.
 * Easier to listen for the event on parent tree view than on each tree item child.
 */
export type TreeViewExpandedChangeEvent = TreeItemExpandedChangeEvent;

/**
 * Bubbling event emitted by a tree item child when selected or deselected.
 * Easier to listen for the event on parent tree view than on each tree item child.
 */
export type TreeViewSelectedChangeEvent = TreeItemSelectedChangeEvent;
