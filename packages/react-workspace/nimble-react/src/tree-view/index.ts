import { TreeView } from '@ni/nimble-components/dist/esm/tree-view';
import { wrap } from '../utilities/react-wrapper';

export const NimbleTreeView = wrap(TreeView, {
    events: {
        onExpandedChange: 'expanded-change',
        onSelectedChange: 'selected-change',
    }
});
