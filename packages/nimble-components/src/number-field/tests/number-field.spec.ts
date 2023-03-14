import { NumberField, numberFieldTag } from '..';

describe('NumberField', () => {
    it('should export its tag', () => {
        expect(numberFieldTag).toBe(
            'nimble-number-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-number-field')).toBeInstanceOf(
            NumberField
        );
    });
});
