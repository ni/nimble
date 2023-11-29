import { checkboxTag } from '..';

describe('Checkbox', () => {
    it('should export its tag', () => {
        expect(checkboxTag).toBe('nimble-checkbox');
    });
});
