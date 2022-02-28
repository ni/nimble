import {
    DesignSystem,
    TreeItem as FoundationTreeItem
} from '@microsoft/fast-foundation';
import '..';

describe('TreeItem', () => {
    it('should have its tag returned by tagFor(FoundationTreeItem)', () => {
        expect(DesignSystem.tagFor(FoundationTreeItem)).toBe(
            'nimble-tree-item'
        );
    });
});
