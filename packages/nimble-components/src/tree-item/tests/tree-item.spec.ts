import {
    DesignSystem,
    TreeItem as FoundationTreeItem
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('TreeItem', () => {
    it('should have its tag returned by tagFor(FoundationTreeItem)', () => {
        expect(html`${DesignSystem.tagFor(FoundationTreeItem)}`.html).toBe(
            'nimble-tree-item'
        );
    });
});
