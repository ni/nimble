import { MenuItem, menuItemTag } from '..';

describe('MenuItem', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(menuItemTag)).toBeInstanceOf(MenuItem);
    });
});
