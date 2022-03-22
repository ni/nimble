import {
    DesignSystem,
    TabPanel as FoundationTabPanel
} from '@microsoft/fast-foundation';
import { TabPanel } from '..';

describe('TabPanel', () => {
    it('should have its tag returned by tagFor(FoundationTabPanel)', () => {
        expect(DesignSystem.tagFor(FoundationTabPanel)).toBe(
            'nimble-tab-panel'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tab-panel')).toBeInstanceOf(
            TabPanel
        );
    });
});
