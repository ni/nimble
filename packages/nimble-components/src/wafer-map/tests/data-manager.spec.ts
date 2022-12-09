import { DataManager } from '../modules/data-manager';
import { Margin, WaferMapColorScaleMode, WaferMapQuadrant } from '../types';
import {
    getColorsScale,
    getHighlightedValues,
    getWaferMapDies
} from './utilities';

describe('Data manager', () => {
    let dataManagerModule: DataManager;
    const axisLocation: WaferMapQuadrant = WaferMapQuadrant.topLeft;
    const canvasDimensions = { width: 100, height: 110 };
    const dieLabelsSuffix = '%';
    const dieLabelsHidden = false;
    const maxCharacters = 3;
    const defaultMargin: Margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    beforeEach(() => {
        dataManagerModule = new DataManager(
            getWaferMapDies(),
            axisLocation,
            canvasDimensions,
            getColorsScale(),
            getHighlightedValues(),
            WaferMapColorScaleMode.ordinal,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters
        );
    });

    it('computes the correct containerDimensions', () => {
        expect(dataManagerModule.containerDimensions).toEqual({
            width: 60,
            height: 70
        });
    });

    it('computes the correct radius', () => {
        expect(dataManagerModule.radius).toEqual(45);
    });

    it('computes the correct dieDimensions', () => {
        expect(dataManagerModule.dieDimensions).toEqual({
            width: 10,
            height: 10
        });
    });

    it('should have default margin', () => {
        expect(dataManagerModule.margin).toEqual(defaultMargin);
    });

    it('should have increasing horizontal range', () => {
        expect(dataManagerModule.horizontalScale.range()).toEqual([0, 60]);
    });

    it('should have increasing vertical range', () => {
        expect(dataManagerModule.verticalScale.range()).toEqual([0, 70]);
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
        const waferMapDies = getWaferMapDies();
        const expectedValues = waferMapDies.map(x => {
            return { text: `${x.value}${dieLabelsSuffix}` };
        });
        for (let i = 0; i < waferMapDies.length; i += 1) {
            expect(dataManagerModule.diesRenderInfo[i]!.text).toEqual(
                expectedValues[i]!.text
            );
        }
    });

    it('should have the fill style from the color scale colors', () => {
        const colors = getColorsScale().colors;
        for (const dieRenderInfo of dataManagerModule.diesRenderInfo) {
            expect(colors).toContain(dieRenderInfo.fillStyle);
        }
    });

    it('should have all dies with no opacity from the highlighted list', () => {
        const highlightedValues = getHighlightedValues().map(
            value => value + dieLabelsSuffix
        );
        const diesWithoutOpacity = dataManagerModule.diesRenderInfo.filter(
            x => x.opacity === 0
        );
        for (const dieRenderInfo of diesWithoutOpacity) {
            expect(highlightedValues).toContain(dieRenderInfo.text);
        }
    });

    it('should not have any dies with opacity from the highlighted list', () => {
        const highlightedValues = getHighlightedValues().map(
            value => value + dieLabelsSuffix
        );
        const diesWithOpacity = dataManagerModule.diesRenderInfo.filter(
            x => x.opacity !== 0
        );
        for (const dieRenderInfo of diesWithOpacity) {
            expect(highlightedValues).not.toContain(dieRenderInfo.text);
        }
    });

    it('should have all dies inside the canvas with margins', () => {
        for (const dieRenderInfo of dataManagerModule.diesRenderInfo) {
            expect(dieRenderInfo.x).toBeGreaterThanOrEqual(0);
            expect(dieRenderInfo.y).toBeGreaterThanOrEqual(0);
            expect(dieRenderInfo.x).toBeLessThanOrEqual(
                canvasDimensions.width
                    - dataManagerModule.dieDimensions.width
                    - defaultMargin.left
            );
            expect(dieRenderInfo.y).toBeLessThanOrEqual(
                canvasDimensions.height
                    - dataManagerModule.dieDimensions.height
                    - defaultMargin.bottom
            );
        }
    });
});
