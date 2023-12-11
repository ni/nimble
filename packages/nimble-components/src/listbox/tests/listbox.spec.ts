import { Listbox, listboxTag } from '..';

describe('Listbox', () => {
    it('should export its tag', () => {
        expect(listboxTag).toBe('nimble-listbox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-listbox')).toBeInstanceOf(
            Listbox
        );
    });
});
