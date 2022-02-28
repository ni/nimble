import {
    DesignSystem,
    Button as FoundationButton
} from '@microsoft/fast-foundation';
import '..';

describe('Button', () => {
    it('should have its tag returned by tagFor(FoundationButton)', () => {
        expect(DesignSystem.tagFor(FoundationButton)).toBe('nimble-button');
    });
});
