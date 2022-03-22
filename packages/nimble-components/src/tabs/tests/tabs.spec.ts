import {
    DesignSystem,
    Tabs as FoundationTabs
} from '@microsoft/fast-foundation';
import { Tabs } from '..';

describe('Tabs', () => {
    it('should have its tag returned by tagFor(FoundationTabs)', () => {
        expect(DesignSystem.tagFor(FoundationTabs)).toBe('nimble-tabs');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tabs')).toBeInstanceOf(Tabs);
    });
});
