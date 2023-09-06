import { TreeItem, treeItemTag } from '..';

describe('TreeItem', () => {
    it('should export its tag', () => {
        expect(treeItemTag).toBe('nimble-tree-item');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tree-item')).toBeInstanceOf(
            TreeItem
        );
    });
});
