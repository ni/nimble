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
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let spy: jasmine.Spy;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.canvasSideLength = 500;
        DOM.processUpdates();
        spy = spyOn(element, 'render');
    });

    afterEach(async () => {
        await disconnect();
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
        element.dies = [
            {
                x: 1,
                y: 1,
                value: '1',
                tooltip: 'Placeholder tooltip value for Die x: 1 y: 1'
            }
        ];
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
        element.dies = [
            {
                x: 1,
                y: 1,
                value: '1',
                tooltip: 'Placeholder tooltip value for Die x: 1 y: 1'
            }
        ];
        element.colorScale = { colors: ['red'], values: ['1'] };
        DOM.processUpdates();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('ZoomHandler', () => {
        let initialValue: string | undefined;

        beforeEach(() => {
            initialValue = getTransform();
            expect(initialValue).not.toBeDefined();
        });

        it('will zoom in the wafer-map', () => {
            element.canvas.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );

            const zoomedValue = getTransform();
            expect(zoomedValue).not.toBe(initialValue);
        });

        it('will zoom out to identity', () => {
            element.canvas.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );

            const zoomedValue = getTransform();
            expect(zoomedValue).not.toEqual('translate(0,0) scale(1)');

            element.canvas.dispatchEvent(
                new WheelEvent('wheel', { deltaY: 2, deltaMode: -1 })
            );

            const zoomedOut = getTransform();
            expect(zoomedOut).toBe('translate(0,0) scale(1)');
        });

        it('will not zoom out when at identity', () => {
            element.canvas.dispatchEvent(
                new WheelEvent('wheel', { deltaY: 2, deltaMode: -1 })
            );

            const zoomedOut = getTransform();
            expect(zoomedOut).toBe('translate(0,0) scale(1)');
        });
    });

    function getTransform(): string | undefined {
        return element.zoomContainer.getAttribute('transform')?.toString();
    }
});
