import { WaferMap } from '..';

describe('WaferMap', () => {
    fit('can construct an element instance', () => {
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });
});
