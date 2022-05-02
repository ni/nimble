import {
    DesignSystem,
    AnchoredRegion as FoundationAnchoredRegion
} from '@microsoft/fast-foundation';
import { AnchoredRegion } from '..';

describe('Anchored Region', () => {
    it('should have its tag returned by tagFor(FoundationAnchoredRegion)', () => {
        expect(DesignSystem.tagFor(FoundationAnchoredRegion)).toBe('nimble-anchored-region');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchored-region')).toBeInstanceOf(
            AnchoredRegion
        );
    });
});
