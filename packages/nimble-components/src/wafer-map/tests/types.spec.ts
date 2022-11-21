import type {
    WaferMapOrientation,
    WaferMapQuadrant
} from '../types';

describe('WaferMap type', () => {
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
});
