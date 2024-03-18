import { zoomIdentity } from 'd3-zoom';
import { tableFromArrays } from 'apache-arrow';
import { html } from '@microsoft/fast-element';
import { HoverHandler } from '../modules/experimental/hover-handler';
import { HoverDie, WaferMapOriginLocation } from '../types';
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
                colIndex: Int32Array.from([1, 2, 3]),
                rowIndex: Int32Array.from([1, 2, 3]),
                value: Float64Array.from([1, 2, 3])
            }),
            zoomIdentity,
            WaferMapOriginLocation.bottomLeft,
            undefined,
            getDataManagerMockForHover(
                { left: 0, right: 0, top: 0, bottom: 0 },
                getScaleQuantile([1, 11], [1, 2, 3, 4]),
                getScaleQuantile([1, 11], [1, 2, 3, 4])
            ) as DataManager
        ) as WaferMap;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('will return the expected index when mouse moved in range', () => {
        const parameters: [WaferMapOriginLocation, HoverDie][] = [
            [
                WaferMapOriginLocation.bottomLeft,
                {
                    index: 1,
                    x: 2,
                    y: 2
                }
            ],
            [
                WaferMapOriginLocation.topLeft,
                {
                    index: 1,
                    x: 2,
                    y: 2
                }
            ],
            [
                WaferMapOriginLocation.bottomRight,
                {
                    index: 1,
                    x: 2,
                    y: 2
                }
            ],
            [
                WaferMapOriginLocation.topRight,
                {
                    index: 1,
                    x: 2,
                    y: 2
                }
            ]
        ];
        parameters.forEach(value => {
            waferMock.originLocation = value[0];
            hoverHandler = new HoverHandler(waferMock);
            element.addEventListener('mousemove', event => hoverHandler.mousemove(event));
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 4,
                    clientY: 4
                })
            );
            processUpdates();
            expect(waferMock.hoverDie).toEqual(value[1]);
        });
    });

    it('will return undefined when mouse moved out of range', () => {
        const parameters: [WaferMapOriginLocation, HoverDie | undefined][] = [
            [WaferMapOriginLocation.bottomLeft, undefined],
            [WaferMapOriginLocation.topLeft, undefined],
            [WaferMapOriginLocation.bottomRight, undefined],
            [WaferMapOriginLocation.topRight, undefined]
        ];
        parameters.forEach(value => {
            waferMock.originLocation = value[0];
            hoverHandler = new HoverHandler(waferMock);
            element.addEventListener('mousemove', event => hoverHandler.mousemove(event));
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 15,
                    clientY: 15
                })
            );
            processUpdates();
            expect(waferMock.hoverDie).toEqual(value[1]);
        });
    });
});
