import { html } from '@microsoft/fast-element';
import { Table, tableFromArrays } from 'apache-arrow';
import { WaferMap } from '..';
import {
    processUpdates,
    waitForUpdatesAsync
} from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    WaferMapColorScaleMode,
    WaferMapOrientation,
    WaferMapOriginLocation
} from '../types';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(html`<nimble-wafer-map></nimble-wafer-map>`);
}
describe('WaferMap', () => {
    let element: WaferMap;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });

    describe('update flow', () => {
        let spy: jasmine.Spy;
        beforeEach(() => {
            spy = spyOn(element, 'update');
        });

        it('will update once after originLocation changes', () => {
            element.originLocation = WaferMapOriginLocation.topRight;
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will not update after orientation changes', () => {
            element.orientation = WaferMapOrientation.right;
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(0);
        });

        it('will update once after maxCharacters change', () => {
            element.maxCharacters = 3;
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after dieLabelsHidden change', () => {
            element.dieLabelsHidden = true;
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after dieLabelsSuffix changes', () => {
            element.dieLabelsSuffix = '%';
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after colorScaleMode changes', () => {
            element.colorScaleMode = WaferMapColorScaleMode.ordinal;
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after highlightedTags change', () => {
            element.highlightedTags = ['1'];
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after dies change', () => {
            element.dies = [{ x: 1, y: 1, value: '1' }];
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after diesTable change', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after colorScale changes', () => {
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('will update once after sequential attribute changes', () => {
            element.originLocation = WaferMapOriginLocation.topRight;
            element.orientation = WaferMapOrientation.right;
            element.maxCharacters = 3;
            element.dieLabelsHidden = true;
            element.dieLabelsSuffix = '%';
            element.colorScaleMode = WaferMapColorScaleMode.ordinal;
            element.highlightedTags = ['1'];
            element.dies = [{ x: 1, y: 1, value: '1' }];
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            processUpdates();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('worker renderer draw flow', () => {
        let setupAndDrawWaferSpy: jasmine.Spy;
        beforeEach(() => {
            setupAndDrawWaferSpy = spyOn(
                element.workerRenderer,
                'setupAndDrawWafer'
            );
        });

        it('will call setupAndDrawWafer after supported diesTable change', () => {
            element.diesTable = tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            });
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeFalse();
            expect(setupAndDrawWaferSpy).toHaveBeenCalledTimes(1);
        });

        it('will not call setupAndDrawWafer after unsupported diesTable change', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeTrue();
            expect(setupAndDrawWaferSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('worker renderer flow', () => {
        let renderHoverSpy: jasmine.Spy;
        let experimentalUpdateSpy: jasmine.Spy;

        beforeEach(() => {
            renderHoverSpy = spyOn(element.workerRenderer, 'renderHover');
            experimentalUpdateSpy = spyOn(
                element,
                'experimentalUpdate'
            ).and.callThrough();
        });

        it('will use RenderingModule after dies change', () => {
            element.dies = [{ x: 1, y: 1, value: '1' }];
            processUpdates();
            expect(experimentalUpdateSpy).toHaveBeenCalledTimes(0);
        });

        it('will use WorkerRenderer after supported diesTable change', () => {
            element.diesTable = tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            });
            processUpdates();
            expect(experimentalUpdateSpy).toHaveBeenCalledTimes(1);
        });

        it('will use WorkerRenderer after unsupported diesTable change but it will fail', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(experimentalUpdateSpy).toHaveBeenCalledTimes(1);
            expect(renderHoverSpy).toHaveBeenCalledTimes(0);
        });

        it('will not call renderHover after unsupported diesTable change', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeTrue();
            expect(renderHoverSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('zoom flow', () => {
        let initialValue: string | undefined;

        beforeEach(() => {
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            element.dies = [{ x: 1, y: 1, value: '1' }];
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            processUpdates();
            initialValue = getTransform();
            expect(initialValue).toBe('translate(0,0) scale(1)');
        });

        it('will zoom in the wafer-map', () => {
            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );
            processUpdates();
            const zoomedValue = getTransform();
            expect(zoomedValue).not.toBe(initialValue);
        });

        it('will zoom out to identity', () => {
            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );

            processUpdates();
            const zoomedValue = getTransform();
            expect(zoomedValue).not.toEqual(initialValue);

            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: 2, deltaMode: -1 })
            );

            processUpdates();
            const zoomedOut = getTransform();
            expect(zoomedOut).toBe(initialValue);
        });

        it('will not zoom out when at identity', () => {
            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: 2, deltaMode: -1 })
            );
            processUpdates();
            const zoomedOut = getTransform();
            expect(zoomedOut).toBe(initialValue);
        });
    });

    function getTransform(): string | undefined {
        return element.transform.toString();
    }

    describe('hover flow', () => {
        beforeEach(async () => {
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            element.dies = [{ x: 1, y: 1, value: '1' }];
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            await waitForUpdatesAsync();
        });

        it('will translate the rectangle when moving the pointer over the wafer-map', async () => {
            const initialTransform = element.hoverTransform;
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: element.offsetLeft + 50,
                    clientY: element.offsetTop + 50
                })
            );
            await waitForUpdatesAsync();
            expect(element.hoverTransform).not.toEqual(initialTransform);
        });

        it('will resize the rectangle when zooming in the wafer-map', async () => {
            const initialHeight = element.hoverHeight;
            const initialWidth = element.hoverWidth;
            expect(initialHeight).toBe(460);
            expect(initialWidth).toBe(460);

            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );
            await waitForUpdatesAsync();

            expect(element.hoverHeight).not.toBe(initialHeight);
            expect(element.hoverWidth).not.toBe(initialWidth);
        });

        it('will translate when zooming in the wafer-map', async () => {
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: element.offsetLeft + 50,
                    clientY: element.offsetTop + 50
                })
            );
            await waitForUpdatesAsync();
            const initialTransform = element.hoverTransform;
            expect(initialTransform).not.toEqual('');
            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );
            await waitForUpdatesAsync();
            expect(element.hoverTransform).not.toEqual(initialTransform);
        });
    });
});
