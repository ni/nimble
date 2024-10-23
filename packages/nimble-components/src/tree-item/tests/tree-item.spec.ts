import { TreeItem, treeItemTag } from '..';

describe('TreeItem', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(treeItemTag)).toBeInstanceOf(TreeItem);
    });
});
