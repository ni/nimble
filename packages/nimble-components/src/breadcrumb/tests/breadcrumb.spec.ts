import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb
} from '@microsoft/fast-foundation';
import { Breadcrumb } from '..';

describe('Breadcrumb', () => {
    it('should have its tag returned by tagFor(FoundationBreadcrumb)', () => {
        expect(DesignSystem.tagFor(FoundationBreadcrumb)).toBe(
            'nimble-breadcrumb'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-breadcrumb')).toBeInstanceOf(
            Breadcrumb
        );
    });
});
