import {
    DesignSystem,
    TabPanel as FoundationTabPanel
} from '@microsoft/fast-foundation';
import { TabPanel } from '..';

describe('TabPanel', () => {
    it('should export its tag', () => {
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
