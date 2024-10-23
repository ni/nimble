import { BreadcrumbItem, breadcrumbItemTag } from '..';

describe('Breadcrumb Item', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(breadcrumbItemTag)).toBeInstanceOf(
            BreadcrumbItem
        );
    });
});
