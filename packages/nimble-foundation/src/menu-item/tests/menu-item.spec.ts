import { menuItemTag } from '..';

describe('MenuItem', () => {
    it('should export its tag', () => {
        expect(menuItemTag).toBe('nimble-menu-item');
    });
});
