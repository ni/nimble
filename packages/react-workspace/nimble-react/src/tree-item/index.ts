import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { wrap } from '../utilities/react-wrapper';

export const NimbleTreeItem = wrap(TreeItem, {
    events: {
        onExpandedChange: 'expanded-change',
        onSelectedChange: 'selected-change',
    }
});

export interface TreeItemExpandedChangeEvent extends CustomEvent {
    target: TreeItem;
}

export interface TreeItemSelectedChangeEvent extends CustomEvent {
    target: TreeItem;
}
