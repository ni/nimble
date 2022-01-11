import { DesignSystem, Tab as FoundationTab } from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Tab', () => {
    it('should have its tag returned by tagFor(FoundationTab)', () => {
        expect(html`${DesignSystem.tagFor(FoundationTab)}`.html).toBe(
            'nimble-tab'
        );
    });
});
