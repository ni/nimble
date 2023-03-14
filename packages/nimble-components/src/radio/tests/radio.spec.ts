import { Radio, radioTag } from '..';

describe('Radio', () => {
    it('should export its tag', () => {
        expect(radioTag).toBe('nimble-radio');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio')).toBeInstanceOf(Radio);
    });
});
