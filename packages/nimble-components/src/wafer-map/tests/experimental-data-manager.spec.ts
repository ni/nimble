import { html } from '@microsoft/fast-element';

import { fixture, Fixture } from '../../utilities/tests/fixture';
import { processUpdates } from '../../testing/async-helpers';
import type { DataManager } from '../modules/experimental/data-manager';
import type { WaferMap } from '..';
import {
    Margin,
    WaferMapColorScaleMode,
    WaferMapOriginLocation,
    WaferRequiredTypeMap
} from '../types';
import {
    getColorScale,
    getWaferMapDiesTable
} from './utilities';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(html`<nimble-wafer-map></nimble-wafer-map>`);
}

describe('Wafermap Experimental Data Manager', () => {
    let dataManagerModule: DataManager<WaferRequiredTypeMap>;
    const dieLabelsSuffix = '%';
    const canvasWidth = 200;
    const canvasHeight = 100;
    const expectedMargin: Margin = {
        top: 4,
        right: 54,
        bottom: 4,
        left: 54
    };

    let element: WaferMap;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.diesTable = getWaferMapDiesTable();
        element.colorScale = getColorScale();
        element.originLocation = WaferMapOriginLocation.bottomLeft;
        element.dieLabelsSuffix = dieLabelsSuffix;
        element.dieLabelsHidden = false;
        element.maxCharacters = 3;
        element.colorScaleMode = WaferMapColorScaleMode.ordinal;
        element.canvasWidth = canvasWidth;
        element.canvasHeight = canvasHeight;

        processUpdates();

        dataManagerModule = element.experimentalDataManager;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('computes the correct containerDimensions', () => {
        expect(dataManagerModule.containerDimensions).toEqual({
            width: 92,
            height: 92
        });
    });

    it('computes the correct dieDimensions', () => {
        const computedDimensions = {
            width: Math.ceil(dataManagerModule.dieDimensions.width),
            height: Math.ceil(dataManagerModule.dieDimensions.height)
        };
        expect(computedDimensions).toEqual({
            width: 19,
            height: 16
        });
    });

    it('should have expected margin', () => {
        expect(dataManagerModule.margin).toEqual(expectedMargin);
    });

    it('should have increasing horizontal range', () => {
        expect(dataManagerModule.horizontalScale.range()).toEqual([0, 92]);
    });

    it('should have decreasing vertical range', () => {
        // because the canvas has top-left origin location we need to flip the vertical scale
        expect(dataManagerModule.verticalScale.range()).toEqual([92, 0]);
    });

    it('should not have labelsFontSize larger than the die height', () => {
        expect(dataManagerModule.labelsFontSize).toBeLessThanOrEqual(
            dataManagerModule.dieDimensions.height
        );
    });

    it('should not have labelsFontSize larger than the die width', () => {
        expect(dataManagerModule.labelsFontSize).toBeLessThanOrEqual(
            dataManagerModule.dieDimensions.width
        );
    });
});
