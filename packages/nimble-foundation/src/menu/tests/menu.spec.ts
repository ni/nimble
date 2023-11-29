import { menuTag } from '..';

describe('Menu', () => {
    it('should export its tag', () => {
        expect(menuTag).toBe('nimble-menu');
    });
});
