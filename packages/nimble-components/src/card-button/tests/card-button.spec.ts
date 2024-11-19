import { CardButton, cardButtonTag } from '..';

describe('Card Button', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(cardButtonTag)).toBeInstanceOf(
            CardButton
        );
    });
});
