import {
    DesignSystem,
    Tabs as FoundationTabs
} from '@microsoft/fast-foundation';
import '..';

describe('Tabs', () => {
    it('should have its tag returned by tagFor(FoundationTabs)', () => {
        expect(DesignSystem.tagFor(FoundationTabs)).toBe('nimble-tabs');
    });
});
