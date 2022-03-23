import { DesignSystem, Tab as FoundationTab } from '@microsoft/fast-foundation';
import { Tab } from '..';

describe('Tab', () => {
    it('should have its tag returned by tagFor(FoundationTab)', () => {
        expect(DesignSystem.tagFor(FoundationTab)).toBe('nimble-tab');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tab')).toBeInstanceOf(Tab);
    });
});
