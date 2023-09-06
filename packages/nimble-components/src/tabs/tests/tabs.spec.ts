import { Tabs, tabsTag } from '..';

describe('Tabs', () => {
    it('should export its tag', () => {
        expect(tabsTag).toBe('nimble-tabs');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tabs')).toBeInstanceOf(Tabs);
    });
});
