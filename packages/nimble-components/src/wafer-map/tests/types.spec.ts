import { WaferMapColorBy, WaferMapDataType, WaferMapOrientation, WaferMapQuadrant } from '../types';

describe('WaferMapColorBy', () => {
    it('set hard-bin value', () => {
        const waferMapColorBy: WaferMapColorBy = WaferMapColorBy.hardBin;
        expect(waferMapColorBy).toEqual('hard-bin');
    });

    it('set soft-bin value', () => {
        const waferMapColorBy: WaferMapColorBy = WaferMapColorBy.softBin;
        expect(waferMapColorBy).toEqual('soft-bin');
    });

    it('set bin-type value', () => {
        const waferMapColorBy: WaferMapColorBy = WaferMapColorBy.binType;
        expect(waferMapColorBy).toEqual('bin-type');
    });

    it('set float-value value', () => {
        const waferMapColorBy: WaferMapColorBy = WaferMapColorBy.floatValue;
        expect(waferMapColorBy).toEqual('float-value');
    });
});

describe('WaferMapQuadrant', () => {
    it('set bottom-left value', () => {
        const waferMapQuadrant: WaferMapQuadrant = WaferMapQuadrant.bottomLeft;
        expect(waferMapQuadrant).toEqual('bottom-left');
    });

    it('set bottom-right value', () => {
        const waferMapQuadrant: WaferMapQuadrant = WaferMapQuadrant.bottomRight;
        expect(waferMapQuadrant).toEqual('bottom-right');
    });

    it('set top-left value', () => {
        const waferMapQuadrant: WaferMapQuadrant = WaferMapQuadrant.topLeft;
        expect(waferMapQuadrant).toEqual('top-left');
    });

    it('set top-right value', () => {
        const waferMapQuadrant: WaferMapQuadrant = WaferMapQuadrant.topRight;
        expect(waferMapQuadrant).toEqual('top-right');
    });
});

describe('WaferMapOrientation', () => {
    it('set top value', () => {
        const waferMapOrientation: WaferMapOrientation = WaferMapOrientation.top;
        expect(waferMapOrientation).toEqual('top');
    });

    it('set bottom value', () => {
        const waferMapOrientation: WaferMapOrientation = WaferMapOrientation.bottom;
        expect(waferMapOrientation).toEqual('bottom');
    });

    it('set left value', () => {
        const waferMapOrientation: WaferMapOrientation = WaferMapOrientation.left;
        expect(waferMapOrientation).toEqual('left');
    });

    it('set right value', () => {
        const waferMapOrientation: WaferMapOrientation = WaferMapOrientation.right;
        expect(waferMapOrientation).toEqual('right');
    });
});

describe('WaferMapDataType', () => {
    it('set categorical value', () => {
        const waferMapDataType: WaferMapDataType = WaferMapDataType.categorical;
        expect(waferMapDataType).toEqual('categorical');
    });

    it('set accumulative value', () => {
        const waferMapDataType: WaferMapDataType = WaferMapDataType.accumulative;
        expect(waferMapDataType).toEqual('accumulative');
    });
});
