import { BreadcrumbItem, breadcrumbItemTag } from '..';

describe('Breadcrumb Item', () => {
    it('should export its tag', () => {
        expect(breadcrumbItemTag).toBe('nimble-breadcrumb-item');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-breadcrumb-item')).toBeInstanceOf(
            BreadcrumbItem
        );
    });
});
