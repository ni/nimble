import { TabPanel, tabPanelTag } from '..';

describe('TabPanel', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(tabPanelTag)).toBeInstanceOf(TabPanel);
    });
});
