import {
    DesignSystem,
    Menu as FoundationMenu
} from '@microsoft/fast-foundation';
import '..';

describe('Menu', () => {
    it('should have its tag returned by tagFor(FoundationMenu)', () => {
        expect(DesignSystem.tagFor(FoundationMenu)).toBe(
            'nimble-menu'
        );
    });
});
