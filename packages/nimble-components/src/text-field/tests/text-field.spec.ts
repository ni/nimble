import { TextField, textFieldTag } from '..';

describe('TextField', () => {
    it('should export its tag', () => {
        expect(textFieldTag).toBe(
            'nimble-text-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-field')).toBeInstanceOf(
            TextField
        );
    });
});
