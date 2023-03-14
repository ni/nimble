import { AnchoredRegion, anchoredRegionTag } from '..';

describe('Anchored Region', () => {
    it('should export its tag', () => {
        expect(anchoredRegionTag).toBe('nimble-anchored-region');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchored-region')).toBeInstanceOf(
            AnchoredRegion
        );
    });
});
