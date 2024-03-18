import { zoomIdentity } from 'd3-zoom';
import { tableFromArrays } from 'apache-arrow';
import { html } from '@microsoft/fast-element';
import { HoverHandler } from '../modules/experimental/hover-handler';
import { WaferMapOriginLocation } from '../types';
import {
    getDataManagerMockForHover,
    getScaleQuantile,
    getWaferMapMockHover
} from './utilities';
import type { WaferMap } from '..';
import type { DataManager } from '../modules/data-manager';
import { processUpdates } from '../../testing/async-helpers';
import { Fixture, fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<HTMLDivElement>> {
    return fixture<HTMLDivElement>(html`<div></div>`);
}

describe('HoverHandler', () => {
    let element: HTMLDivElement;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let hoverHandler: HoverHandler;
    let waferMock: WaferMap;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        waferMock = getWaferMapMockHover(
            tableFromArrays({
                colIndex: Int32Array.from([1]),
                rowIndex: Int32Array.from([1]),
                value: Float64Array.from([1])
            }),
            zoomIdentity,
            WaferMapOriginLocation.bottomLeft,
            undefined,
            getDataManagerMockForHover(
                { left: 0, right: 0, top: 0, bottom: 0 },
                getScaleQuantile([1, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                getScaleQuantile([1, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            ) as DataManager
        ) as WaferMap;
        hoverHandler = new HoverHandler(waferMock);
        element.addEventListener('mousemove', event => hoverHandler.mousemove(event));
    });

    afterEach(async () => {
        await disconnect();
    });

    it('will return the only index when mouse moved in range', () => {
        element.dispatchEvent(
            new MouseEvent('mousemove', {
                clientX: 1,
                clientY: 1
            })
        );
        processUpdates();
        expect(waferMock.hoverDie).toEqual({
            index: 0,
            x: 1,
            y: 1
        });
    });

    it('will return undefined when mouse moved out of range', () => {
        element.dispatchEvent(
            new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            })
        );
        processUpdates();
        expect(waferMock.hoverDie).toEqual(undefined);
    });
});
