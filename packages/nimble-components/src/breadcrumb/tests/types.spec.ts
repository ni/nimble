import type { BreadcrumbAppearance } from '../types';

describe('Breadcrumb type', () => {
    it('BreadcrumbAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: BreadcrumbAppearance = 'hello';
        expect(appearance!).toEqual('hello');
    });
});
