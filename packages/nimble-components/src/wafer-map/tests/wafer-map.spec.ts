import { html } from '@microsoft/fast-element';
import { Table, tableFromArrays } from 'apache-arrow';
import { WaferMap } from '..';
import { processUpdates } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    WaferMapColorScaleMode,
    WaferMapOrientation,
    WaferMapOriginLocation
} from '../types';
import { RenderingModule } from '../modules/rendering';
import { WorkerRenderer } from '../modules/experimental/worker-renderer';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(html`<nimble-wafer-map></nimble-wafer-map>`);
}
describe('WaferMap', () => {
    let element: WaferMap;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    describe('update flow', () => {
        let spy: jasmine.Spy;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            spy = spyOn(element, 'update');
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
                WaferMap
            );
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
        let drawWaferSpy: jasmine.Spy;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            drawWaferSpy = spyOn(element.workerRenderer, 'drawWafer');
        });

        afterEach(async () => {
            await disconnect();
        });

        it('will call drawWafer after supported diesTable change', () => {
            element.diesTable = tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            });
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeFalse();
            expect(drawWaferSpy).toHaveBeenCalledTimes(1);
        });

        it('will not call drawWafer after unsupported diesTable change', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeTrue();
            expect(drawWaferSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('worker renderer flow', () => {
        let renderHoverSpy: jasmine.Spy;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            renderHoverSpy = spyOn(element.workerRenderer, 'renderHover');
        });

        afterEach(async () => {
            await disconnect();
        });

        it('will use RenderingModule after dies change', () => {
            element.dies = [{ x: 1, y: 1, value: '1' }];
            processUpdates();
            expect(element.renderer instanceof RenderingModule).toBeTrue();
        });

        it('will use WorkerRenderer after supported diesTable change', () => {
            element.diesTable = tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            });
            processUpdates();
            expect(element.renderer instanceof WorkerRenderer).toBeTrue();
        });

        it('will use RenderingModule after unsupported diesTable change', () => {
            element.diesTable = new Table();
            processUpdates();
            expect(element.renderer instanceof RenderingModule).toBeTrue();
        });

        it('will call renderHover after supported diesTable change', () => {
            element.diesTable = tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            });
            processUpdates();
            expect(element.validity.invalidDiesTableSchema).toBeFalse();
            expect(renderHoverSpy).toHaveBeenCalledTimes(1);
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

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            element.dies = [{ x: 1, y: 1, value: '1' }];
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            processUpdates();
            initialValue = getTransform();
            expect(initialValue).toBe('translate(0,0) scale(1)');
        });

        afterEach(async () => {
            await disconnect();
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
            ({ element, connect, disconnect } = await setup());
            await connect();
            element.canvasWidth = 500;
            element.canvasHeight = 500;
            element.dies = [{ x: 1, y: 1, value: '1' }];
            element.colorScale = { colors: ['red', 'red'], values: ['1', '1'] };
            processUpdates();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('will translate the rectangle when moving the pointer over the wafer-map', () => {
            const initialTransform = element.hoverTransform;
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: element.offsetLeft + 50,
                    clientY: element.offsetTop + 50
                })
            );
            processUpdates();
            expect(element.hoverTransform).not.toEqual(initialTransform);
        });

        it('will resize the rectangle when zooming in the wafer-map', () => {
            const initialHeight = element.hoverHeight;
            const initialWidth = element.hoverWidth;
            expect(initialHeight).toBe(460);
            expect(initialWidth).toBe(460);

            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );
            processUpdates();

            expect(element.hoverHeight).not.toBe(initialHeight);
            expect(element.hoverWidth).not.toBe(initialWidth);
        });

        it('will translate when zooming in the wafer-map', () => {
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: element.offsetLeft + 50,
                    clientY: element.offsetTop + 50
                })
            );
            processUpdates();
            const initialTransform = element.hoverTransform;
            expect(initialTransform).not.toEqual('');
            element.dispatchEvent(
                new WheelEvent('wheel', { deltaY: -2, deltaMode: -1 })
            );
            processUpdates();
            expect(element.hoverTransform).not.toEqual(initialTransform);
        });
    });
});
