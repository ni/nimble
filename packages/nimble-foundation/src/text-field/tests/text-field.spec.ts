import { textFieldTag } from '..';

describe('TextField', () => {
    it('should export its tag', () => {
        expect(textFieldTag).toBe('nimble-text-field');
    });
});
