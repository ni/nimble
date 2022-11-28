import { AnchorButton } from '..';

describe('AnchorButton', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor-button')).toBeInstanceOf(
            AnchorButton
        );
    });
});
