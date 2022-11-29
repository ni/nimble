import { html } from '@microsoft/fast-element';
import { WaferMap } from '..';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { WaferMapColorsScaleMode, WaferMapQuadrant } from '../types';
import { getColorsScale, getHighlightedValues, getWaferMapDies } from './utilities';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(
        html`<nimble-wafer-map></nimble-wafer-map>`
    );
}

describe('WaferMap', () => {
    let element: WaferMap;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });
    fit('can construct an element instance', () => {
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });

    fit('can send data to inputs', async () => {
        element.dies = getWaferMapDies();
        element.colorScale = getColorsScale();
        element.quadrant = WaferMapQuadrant.topLeft;
        element.highlightedValues = getHighlightedValues();
        element.colorsScaleMode = WaferMapColorsScaleMode.linear;
        element.dieLabelsHidden = false;
        element.dieLabelsSuffix = '';
        element.maxCharacters = 4;
        await connect();
    });
});
