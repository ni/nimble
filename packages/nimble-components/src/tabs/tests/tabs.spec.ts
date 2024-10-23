import { Tabs, tabsTag } from '..';

describe('Tabs', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(tabsTag)).toBeInstanceOf(Tabs);
    });
});
