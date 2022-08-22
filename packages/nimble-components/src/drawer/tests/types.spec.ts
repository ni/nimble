import type { DrawerLocation } from '../types';
import type { DrawerWidthOptions, ExampleContentType } from './types';

describe('Drawer type', () => {
    it('DrawerLocation fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const location: DrawerLocation = 'hello';
        expect(location).toEqual('hello');
    });

    it('DrawerWidthOptions fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const t: DrawerWidthOptions = 'hello';
        expect(t).toEqual('hello');
    });

    it('ExampleContentType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const t: ExampleContentType = 'hello';
        expect(t).toEqual('hello');
    });
});
