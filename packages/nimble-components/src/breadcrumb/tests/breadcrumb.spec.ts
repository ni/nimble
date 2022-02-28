import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb
} from '@microsoft/fast-foundation';
import '..';

describe('Breadcrumb', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumb)', () => {
        expect(DesignSystem.tagFor(FoundationBreadcrumb)).toBe(
            'nimble-breadcrumb'
        );
    });
});
