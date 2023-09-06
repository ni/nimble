import { ListOption, listOptionTag } from '..';

describe('ListboxOption', () => {
    it('should export its tag', () => {
        expect(listOptionTag).toBe('nimble-list-option');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-list-option')).toBeInstanceOf(
            ListOption
        );
    });
});
