import {
    DesignSystem,
    Tabs as FoundationTabs
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('Tabs', () => {
    it('should have its tag returned by tagFor(FoundationTabs)', () => {
        expect(html`${DesignSystem.tagFor(FoundationTabs)}`.html).toBe(
            'nimble-tabs'
        );
    });
});
