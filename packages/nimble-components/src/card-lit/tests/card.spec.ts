import { Card, cardTag } from '..';

describe('Card', () => {
    it('should export its tag', () => {
        expect(cardTag).toBe('nimble-card');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-card')).toBeInstanceOf(Card);
    });
});
