import { MenuItem, menuItemTag } from '..';

describe('MenuItem', () => {
    it('should export its tag', () => {
        expect(menuItemTag).toBe('nimble-menu-item');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu-item')).toBeInstanceOf(
            MenuItem
        );
    });
});
