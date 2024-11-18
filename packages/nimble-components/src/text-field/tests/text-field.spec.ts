import { TextField, textFieldTag } from '..';

describe('TextField', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(textFieldTag)).toBeInstanceOf(TextField);
    });
});
