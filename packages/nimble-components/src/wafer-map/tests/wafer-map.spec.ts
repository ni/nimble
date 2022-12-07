import { WaferMap } from '..';

describe('WaferMap', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });
});
