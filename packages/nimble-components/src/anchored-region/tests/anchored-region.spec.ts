import { AnchoredRegion, anchoredRegionTag } from '..';

describe('Anchored Region', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(anchoredRegionTag)).toBeInstanceOf(
            AnchoredRegion
        );
    });
});
