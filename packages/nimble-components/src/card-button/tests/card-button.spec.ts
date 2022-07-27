import { CardButton } from '..';

describe('Card Button', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-card-button')).toBeInstanceOf(
            CardButton
        );
    });
});
