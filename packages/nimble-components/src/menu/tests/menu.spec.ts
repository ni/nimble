import { Menu, menuTag } from '..';

describe('Menu', () => {
    it('should export its tag', () => {
        expect(menuTag).toBe('nimble-menu');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu')).toBeInstanceOf(Menu);
    });
});
