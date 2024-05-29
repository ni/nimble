import { CardLit, cardTag } from '..';

describe('CardLit', () => {
    it('should export its tag', () => {
        expect(cardTag).toBe('nimble-card-lit');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-card-lit')).toBeInstanceOf(CardLit);
    });
});
