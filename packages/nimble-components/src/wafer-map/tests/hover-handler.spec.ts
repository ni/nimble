import { html } from '@microsoft/fast-element';
import { HoverDie, WaferMapOriginLocation } from '../types';
import { getWaferMapDiesTable } from './utilities';
import type { WaferMap } from '..';
import { processUpdates } from '../../testing/async-helpers';
import { Fixture, fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(html`<nimble-wafer-map></nimble-wafer-map>`);
}

describe('HoverHandler', () => {
    let element: WaferMap;
    let connect: () => Promise<void>;
    const canvasWidth = 100;
    const canvasHeight = 100;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.diesTable = getWaferMapDiesTable();
        element.originLocation = WaferMapOriginLocation.bottomLeft;
        element.canvasWidth = canvasWidth;
        element.canvasHeight = canvasHeight;

        processUpdates();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('will return the expected index when mouse moved in range', () => {
        const parameters: [WaferMapOriginLocation, HoverDie][] = [
            [
                WaferMapOriginLocation.bottomLeft,
                {
                    index: 5,
                    x: 3,
                    y: 5
                }
            ],
            [
                WaferMapOriginLocation.topLeft,
                {
                    index: 4,
                    x: 3,
                    y: 4
                }
            ],
            [
                WaferMapOriginLocation.bottomRight,
                {
                    index: 8,
                    x: 4,
                    y: 3
                }
            ],
            [
                WaferMapOriginLocation.topRight,
                {
                    index: 14,
                    x: 5,
                    y: 4
                }
            ]
        ];
        parameters.forEach(value => {
            element.originLocation = value[0];
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 30,
                    clientY: 30
                })
            );
            processUpdates();
            expect(element.hoverDie).toEqual(value[1]);
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
            element.originLocation = value[0];
            element.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 101,
                    clientY: 101
                })
            );
            processUpdates();
            expect(element.hoverDie).toEqual(value[1]);
        });
    });
});
