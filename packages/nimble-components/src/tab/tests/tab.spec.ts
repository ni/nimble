import { Tab, tabTag } from '..';

describe('Tab', () => {
    it('should export its tag', () => {
        expect(tabTag).toBe('nimble-tab');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tab')).toBeInstanceOf(Tab);
    });
});
