import { RadioGroup, radioGroupTag } from '..';

describe('Radio Group', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(radioGroupTag)).toBeInstanceOf(
            RadioGroup
        );
    });
});
