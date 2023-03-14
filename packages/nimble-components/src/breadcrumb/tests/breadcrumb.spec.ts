import { Breadcrumb, breadcrumbTag } from '..';

describe('Breadcrumb', () => {
    it('should export its tag', () => {
        expect(breadcrumbTag).toBe(
            'nimble-breadcrumb'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-breadcrumb')).toBeInstanceOf(
            Breadcrumb
        );
    });
});
