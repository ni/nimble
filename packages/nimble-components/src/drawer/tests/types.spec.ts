import { DrawerLocation, DrawerState } from '../types';
import { DrawerWidthOptions, ExampleContentType } from './types';

describe('Drawer type', () => {
    it('DrawerLocation fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const location: DrawerLocation = 'hello';
        expect(location).toEqual('hello');
    });

    it('DrawerLocation fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        DrawerLocation.left = 'hello';
        expect(DrawerLocation.left).toEqual('hello');
    });

    it('DrawerState fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const t: DrawerState = 'hello';
        expect(t).toEqual('hello');
    });

    it('DrawerState fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        DrawerState.closed = 'hello';
        expect(DrawerState.closed).toEqual('hello');
    });

    it('DrawerWidthOptions fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const t: DrawerWidthOptions = 'hello';
        expect(t).toEqual('hello');
    });

    it('DrawerWidthOptions fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        DrawerWidthOptions.fitContent = 'hello';
        expect(DrawerWidthOptions.fitContent).toEqual('hello');
    });

    it('ExampleContentType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const t: ExampleContentType = 'hello';
        expect(t).toEqual('hello');
    });

    it('ExampleContentType fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        ExampleContentType.headerContentFooter = 'hello';
        expect(ExampleContentType.headerContentFooter).toEqual('hello');
    });
});
