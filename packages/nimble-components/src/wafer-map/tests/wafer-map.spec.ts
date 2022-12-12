import { DOM, html } from '@microsoft/fast-element';
import { WaferMap } from '..';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    WaferMapColorScaleMode,
    WaferMapOrientation,
    WaferMapQuadrant
} from '../types';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(html`<nimble-wafer-map></nimble-wafer-map>`);
}
describe('WaferMap', () => {
    let element: WaferMap;
    let spy: jasmine.Spy;

    beforeEach(async () => {
        ({ element } = await setup());
        DOM.processUpdates();
        spy = spyOn(element, 'render');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });

    it('will render once after quadrant changes', () => {
        element.quadrant = WaferMapQuadrant.topRight;
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after orientation changes', () => {
        element.orientation = WaferMapOrientation.right;
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after maxCharacters change', () => {
        element.maxCharacters = 3;
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after dieLabelsHidden change', () => {
        element.dieLabelsHidden = true;
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after dieLabelsSuffix changes', () => {
        element.dieLabelsSuffix = '%';
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after colorScaleMode changes', () => {
        element.colorScaleMode = WaferMapColorScaleMode.ordinal;
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after highlightedValues change', () => {
        element.highlightedValues = ['1'];
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after dies change', () => {
        element.dies = [{ x: 1, y: 1, value: '1' }];
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after colorScale changes', () => {
        element.colorScale = { colors: ['red'], values: ['1'] };
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('will render once after sequential attribute changes', () => {
        element.quadrant = WaferMapQuadrant.topRight;
        element.orientation = WaferMapOrientation.right;
        element.maxCharacters = 3;
        element.dieLabelsHidden = true;
        element.dieLabelsSuffix = '%';
        element.colorScaleMode = WaferMapColorScaleMode.ordinal;
        element.highlightedValues = ['1'];
        element.dies = [{ x: 1, y: 1, value: '1' }];
        element.colorScale = { colors: ['red'], values: ['1'] };
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
