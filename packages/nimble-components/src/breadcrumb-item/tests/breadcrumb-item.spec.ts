import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem
} from '@microsoft/fast-foundation';
import '..';

describe('Breadcrumb Item', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumbItem)', () => {
        expect(DesignSystem.tagFor(FoundationBreadcrumbItem)).toBe(
            'nimble-breadcrumb-item'
        );
    });
});
