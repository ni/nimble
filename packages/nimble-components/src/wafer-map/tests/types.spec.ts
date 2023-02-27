import type { WaferMapOrientation, WaferMapQuadrant } from '../types';

describe('Wafermap Types', () => {
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

    it('WaferMapColorScaleMode fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: WaferMapColorScaleMode = 'hello';
        expect(value).toEqual('hello');
    });

    it('HoverDieOpacity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: HoverDieOpacity = 'hello';
        expect(value).toEqual('hello');
    });
});
