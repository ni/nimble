import {
    DesignSystem,
    TabPanel as FoundationTabPanel
} from '@microsoft/fast-foundation';
import '..';

describe('TabPanel', () => {
    it('should have its tag returned by tagFor(FoundationTabPanel)', () => {
        expect(DesignSystem.tagFor(FoundationTabPanel)).toBe(
            'nimble-tab-panel'
        );
    });
});
