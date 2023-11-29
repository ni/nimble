import { buttonTag } from '..';

describe('Button', () => {
    it('should export its tag', () => {
        expect(buttonTag).toBe('nimble-button');
    });
});
