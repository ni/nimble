import { TabsToolbar, tabsToolbarTag } from '..';

describe('TabsToolbar', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(tabsToolbarTag)).toBeInstanceOf(
            TabsToolbar
        );
    });
});
