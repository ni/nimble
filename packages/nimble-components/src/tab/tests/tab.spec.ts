import { DesignSystem, Tab as FoundationTab } from '@microsoft/fast-foundation';
import '..';

describe('Tab', () => {
    it('should have its tag returned by tagFor(FoundationTab)', () => {
        expect(DesignSystem.tagFor(FoundationTab)).toBe('nimble-tab');
    });
});
