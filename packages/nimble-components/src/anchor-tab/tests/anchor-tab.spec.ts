import { AnchorTab } from '..';

describe('AnchorTab', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor-tab')).toBeInstanceOf(AnchorTab);
    });
});
