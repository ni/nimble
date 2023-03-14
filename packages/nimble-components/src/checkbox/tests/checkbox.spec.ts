import { Checkbox, checkboxTag } from '..';

describe('Checkbox', () => {
    it('should export its tag', () => {
        expect(checkboxTag).toBe('nimble-checkbox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-checkbox')).toBeInstanceOf(
            Checkbox
        );
    });
});
