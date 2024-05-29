import { CardLit, cardLitTag } from '..';

describe('CardLit', () => {
    it('should export its tag', () => {
        expect(cardLitTag).toBe('nimble-card-lit');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-card-lit')).toBeInstanceOf(CardLit);
    });
});
