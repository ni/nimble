import type {
    WaferMapColorBy,
    WaferMapDataType,
    WaferMapOrientation,
    WaferMapQuadrant
} from '../types';

describe('WaferMap type', () => {
    it('WaferMapColorBy fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: WaferMapColorBy = 'hello';
        expect(value).toEqual('hello');
    });

    it('WaferMapQuadrant fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: WaferMapQuadrant = 'hello';
        expect(value).toEqual('hello');
    });

    it('WaferMapOrientation fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: WaferMapOrientation = 'hello';
        expect(value).toEqual('hello');
    });

    it('WaferMapDataType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: WaferMapDataType = 'hello';
        expect(value).toEqual('hello');
    });
});
