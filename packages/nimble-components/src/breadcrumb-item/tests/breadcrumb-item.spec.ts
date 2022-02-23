import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Breadcrumb Item', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumbItem)', () => {
        expect(
            html`${DesignSystem.tagFor(FoundationBreadcrumbItem)}`.html
        ).toBe('nimble-breadcrumb-item');
    });
});
