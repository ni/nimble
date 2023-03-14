import {
    DesignSystem,
    TreeItem as FoundationTreeItem
} from '@microsoft/fast-foundation';
import { TreeItem } from '..';

describe('TreeItem', () => {
    it('should export its tag', () => {
        expect(DesignSystem.tagFor(FoundationTreeItem)).toBe(
            'nimble-tree-item'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tree-item')).toBeInstanceOf(
            TreeItem
        );
    });
});
