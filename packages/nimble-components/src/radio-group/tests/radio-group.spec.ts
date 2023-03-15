import { RadioGroup, radioGroupTag } from '..';

describe('Radio Group', () => {
    it('should export its tag', () => {
        expect(radioGroupTag).toBe('nimble-radio-group');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio-group')).toBeInstanceOf(
            RadioGroup
        );
    });
});
