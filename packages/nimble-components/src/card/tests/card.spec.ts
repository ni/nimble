import { Card, cardTag } from '..';

describe('Card', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(cardTag)).toBeInstanceOf(Card);
    });
});
