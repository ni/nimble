import {
    DesignSystem,
    TabPanel as FoundationTabPanel
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('TabPanel', () => {
    it('should have its tag returned by tagFor(FoundationTabPanel)', () => {
        expect(html`${DesignSystem.tagFor(FoundationTabPanel)}`.html).toBe(
            'nimble-tab-panel'
        );
    });
});
