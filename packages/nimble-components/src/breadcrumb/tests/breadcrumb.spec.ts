import { Breadcrumb, breadcrumbTag } from '..';

describe('Breadcrumb', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(breadcrumbTag)).toBeInstanceOf(
            Breadcrumb
        );
    });
});
