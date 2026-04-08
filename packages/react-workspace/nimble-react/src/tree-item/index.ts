import { TreeItem, treeItemTag } from '@ni/nimble-components/dist/esm/tree-item';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { treeItemTag };
export { type TreeItem };
export const NimbleTreeItem = wrap(TreeItem, {
    events: {
        onExpandedChange: 'expanded-change' as EventName<TreeItemExpandedChangeEvent>,
        onSelectedChange: 'selected-change' as EventName<TreeItemSelectedChangeEvent>,
    }
});
export interface TreeItemExpandedChangeEvent extends CustomEvent {
    target: TreeItem;
}
export interface TreeItemSelectedChangeEvent extends CustomEvent {
    target: TreeItem;
}
