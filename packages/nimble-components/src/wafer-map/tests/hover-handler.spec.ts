import { zoomIdentity } from 'd3-zoom';
import { tableFromArrays } from 'apache-arrow';
import { html } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
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

    const testCases = [
        {
            name: WaferMapOriginLocation.bottomLeft,
            expectedDie: { index: 1, x: 2, y: 2 }
        },
        {
            name: WaferMapOriginLocation.topLeft,
            expectedDie: { index: 1, x: 2, y: 2 }
        },
        {
            name: WaferMapOriginLocation.bottomRight,
            expectedDie: { index: 1, x: 2, y: 2 }
        },
        {
            name: WaferMapOriginLocation.topRight,
            expectedDie: { index: 1, x: 2, y: 2 }
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `will return the expected index when mouse moved in range from ${name}`,
            () => {
                waferMock.originLocation = value.name;
                hoverHandler = new HoverHandler(waferMock);
                element.addEventListener('mousemove', event => hoverHandler.onMouseMove(event));
                element.dispatchEvent(
                    new MouseEvent('mousemove', {
                        clientX: 4,
                        clientY: 4
                    })
                );
                processUpdates();
                expect(waferMock.hoverDie).toEqual(value.expectedDie);
            }
        );
    });

    const undefinedTestCases = [
        { name: WaferMapOriginLocation.bottomLeft, expectedDie: undefined },
        { name: WaferMapOriginLocation.topLeft, expectedDie: undefined },
        { name: WaferMapOriginLocation.bottomRight, expectedDie: undefined },
        { name: WaferMapOriginLocation.topRight, expectedDie: undefined }
    ] as const;
    parameterizeSpec(undefinedTestCases, (spec, name, value) => {
        spec(
            `will return undefined when mouse moved out of range from ${name}`,
            () => {
                waferMock.originLocation = value.name;
                hoverHandler = new HoverHandler(waferMock);
                element.addEventListener('mousemove', event => hoverHandler.onMouseMove(event));
                element.dispatchEvent(
                    new MouseEvent('mousemove', {
                        clientX: 15,
                        clientY: 15
                    })
                );
                processUpdates();
                expect(waferMock.hoverDie).toEqual(value.expectedDie);
            }
        );
    });
});
