import { DataManager } from '../modules/data-manager';
import {
    Margin,
    WaferMapColorsScaleMode,
    WaferMapDie,
    WaferMapQuadrant
} from '../types';
import {
    getColorsScale,
    getHighlightedValues,
    getWaferMapDies
} from './utilities';

describe('Prerendering module', () => {
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
            WaferMapColorsScaleMode.ordinal,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters
        );
    });

    it('should have 60:70 container', () => {
        expect(dataManagerModule.containerDimensions).toEqual({
            width: 60,
            height: 70
        });
    });

    it('should have 45 radius', () => {
        expect(dataManagerModule.radius).toEqual(45);
    });

    it('should have 10:10 die', () => {
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
        expect(dataManagerModule.renderDies.length).toEqual(
            getWaferMapDies().length
        );
    });

    it('should have label with suffix for each die', () => {
        const diesIterator = getWaferMapDies()[Symbol.iterator]();
        for (const renderDie of dataManagerModule.renderDies) {
            expect(renderDie.text).toEqual(
                (diesIterator.next().value as WaferMapDie).value
                    + dieLabelsSuffix
            );
        }
    });

    it('should have the fill style from the color scale colors', () => {
        const colors = getColorsScale().colors;
        for (const renderDie of dataManagerModule.renderDies) {
            expect(colors).toContain(renderDie.fillStyle);
        }
    });

    it('should have all dies with no opacity from the highlighted list', () => {
        const highlightedValues = getHighlightedValues().map(
            value => value + dieLabelsSuffix
        );
        for (const renderDie of dataManagerModule.renderDies) {
            if (renderDie.opacity === 0) {
                expect(highlightedValues).toContain(renderDie.text);
            } else {
                expect(highlightedValues).not.toContain(renderDie.text);
            }
        }
    });

    it('should have all dies inside the canvas with margins', () => {
        for (const renderDie of dataManagerModule.renderDies) {
            expect(renderDie.x).toBeGreaterThanOrEqual(0);
            expect(renderDie.y).toBeGreaterThanOrEqual(0);
            expect(renderDie.x).toBeLessThanOrEqual(
                canvasDimensions.width
                    - dataManagerModule.dieDimensions.width
                    - defaultMargin.left
            );
            expect(renderDie.y).toBeLessThanOrEqual(
                canvasDimensions.height
                    - dataManagerModule.dieDimensions.height
                    - defaultMargin.bottom
            );
        }
    });
});
