import { html } from '@ni/fast-element';

import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { processUpdates } from '../../testing/async-helpers';
import type { DataManager } from '../modules/data-manager';
import { waferMapTag, type WaferMap } from '..';
import { WaferMapColorScaleMode, WaferMapOriginLocation } from '../types';
import {
    getColorScale,
    getHighlightedTags,
    getWaferMapDies
} from './utilities';
import type { Dimensions, Margin } from '../workers/types';

async function setup(): Promise<Fixture<WaferMap>> {
    return await fixture<WaferMap>(html`<${waferMapTag}></${waferMapTag}>`);
}

describe('Wafermap Data Manager', () => {
    let dataManagerModule: DataManager;
    const dieLabelsSuffix = '%';
    const canvasWidth = 200;
    const canvasHeight = 100;
    const canvasDimensions: Dimensions = {
        width: canvasWidth,
        height: canvasHeight
    };
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
        element.dies = getWaferMapDies();
        element.colorScale = getColorScale();
        element.originLocation = WaferMapOriginLocation.bottomLeft;
        element.dieLabelsSuffix = dieLabelsSuffix;
        element.dieLabelsHidden = false;
        element.maxCharacters = 3;
        element.colorScaleMode = WaferMapColorScaleMode.ordinal;
        element.highlightedTags = getHighlightedTags();
        element.canvasWidth = canvasWidth;
        element.canvasHeight = canvasHeight;

        processUpdates();

        dataManagerModule = element.dataManager;
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

    it('computes the correct radius', () => {
        expect(dataManagerModule.radius).toEqual(46);
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

    it('should have as many dies as provided', () => {
        expect(dataManagerModule.diesRenderInfo.length).toEqual(
            getWaferMapDies().length
        );
    });

    it('should have label with suffix for each die', () => {
        for (const dieInfo of dataManagerModule.diesRenderInfo) {
            expect(dieInfo.text).toContain(dieLabelsSuffix);
        }
    });

    it('should have all dies with full opacity from the highlighted list', () => {
        const highlightedTags = getHighlightedTags();
        const dies = getWaferMapDies().filter(die => die.tags?.some(dieTag => highlightedTags.some(
            highlightedTag => dieTag === highlightedTag
        )));
        const diesWithFullOpacity = dataManagerModule.diesRenderInfo.filter(x => x.fillStyle.endsWith(',1)'));
        expect(dies.length).toEqual(diesWithFullOpacity.length);
    });

    it('should not have any dies with partial opacity from the highlighted list', () => {
        const highlightedTags = getHighlightedTags();
        const dies = getWaferMapDies().filter(
            die => !die.tags?.some(dieTag => highlightedTags.some(
                highlightedTag => dieTag === highlightedTag
            ))
        );
        const diesWithPartialOpacity = dataManagerModule.diesRenderInfo.filter(
            x => !x.fillStyle.endsWith(',1)')
        );
        expect(dies.length).toEqual(diesWithPartialOpacity.length);
    });

    it('should have all dies inside the canvas with margins', () => {
        for (const dieRenderInfo of dataManagerModule.diesRenderInfo) {
            expect(dieRenderInfo.x).toBeGreaterThanOrEqual(0);
            expect(dieRenderInfo.y).toBeGreaterThanOrEqual(0);
            expect(dieRenderInfo.x).toBeLessThanOrEqual(
                canvasDimensions.width
                    - dataManagerModule.dieDimensions.width
                    - expectedMargin.left
            );
            expect(dieRenderInfo.y).toBeLessThanOrEqual(
                canvasDimensions.height
                    - dataManagerModule.dieDimensions.height
                    - expectedMargin.bottom
            );
        }
    });
});
