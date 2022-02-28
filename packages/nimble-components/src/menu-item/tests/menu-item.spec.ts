import {
    DesignSystem,
    MenuItem as FoundationMenuItem
} from '@microsoft/fast-foundation';
import '..';

describe('MenuItem', () => {
    it('should have its tag returned by tagFor(FoundationMenuItem)', () => {
        expect(DesignSystem.tagFor(FoundationMenuItem)).toBe(
            'nimble-menu-item'
        );
    });
});
