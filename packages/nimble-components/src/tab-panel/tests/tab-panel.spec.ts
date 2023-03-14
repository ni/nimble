import { TabPanel, tabPanelTag } from '..';

describe('TabPanel', () => {
    it('should export its tag', () => {
        expect(tabPanelTag).toBe(
            'nimble-tab-panel'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tab-panel')).toBeInstanceOf(
            TabPanel
        );
    });
});
