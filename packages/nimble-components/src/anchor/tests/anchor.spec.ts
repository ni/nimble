import {
    DesignSystem,
    Anchor as FoundationAnchor
} from '@microsoft/fast-foundation';
import { Anchor } from '..';

describe('Anchor', () => {
    it('should have its tag returned by tagFor(FoundationAnchor)', () => {
        expect(DesignSystem.tagFor(FoundationAnchor)).toBe('nimble-anchor');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor')).toBeInstanceOf(Anchor);
    });
});
