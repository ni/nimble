import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Breadcrumb', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumb)', () => {
        expect(html`${DesignSystem.tagFor(FoundationBreadcrumb)}`.html).toBe(
            'nimble-breadcrumb'
        );
    });
});
