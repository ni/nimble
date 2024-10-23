import { Radio, radioTag } from '..';

describe('Radio', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(radioTag)).toBeInstanceOf(Radio);
    });
});
