import { Tab, tabTag } from '..';

describe('Tab', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(tabTag)).toBeInstanceOf(Tab);
    });
});
