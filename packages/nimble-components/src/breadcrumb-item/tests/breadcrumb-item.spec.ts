import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem
} from '@microsoft/fast-foundation';
import { BreadcrumbItem } from '..';

describe('Breadcrumb Item', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumbItem)', () => {
        expect(DesignSystem.tagFor(FoundationBreadcrumbItem)).toBe(
            'nimble-breadcrumb-item'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-breadcrumb-item')).toBeInstanceOf(BreadcrumbItem);
    });
});
