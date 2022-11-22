import { WaferMap } from '..';

describe('WaferMap', () => {
    it('can construct an element instance', () => {
        // debugger;
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });
});
