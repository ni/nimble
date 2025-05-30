import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { WaferMapOriginLocation } from '../types';
import { getWaferMapDiesTable } from './utilities';
import { waferMapTag, type WaferMap } from '..';
import { processUpdates } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<WaferMap>> {
    return await fixture<WaferMap>(html`<${waferMapTag}></${waferMapTag}>`);
}

// OffscreenCanvas not supported in Playwright's Windows/Linux Webkit build: https://github.com/ni/nimble/issues/2169
describe('HoverHandler #SkipWebkit', () => {
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

    const testCases = [
        {
            name: WaferMapOriginLocation.bottomLeft,
            expectedDie: { index: 5, x: 3, y: 5 }
        },
        {
            name: WaferMapOriginLocation.topLeft,
            expectedDie: { index: 4, x: 3, y: 4 }
        },
        {
            name: WaferMapOriginLocation.bottomRight,
            expectedDie: { index: 10, x: 4, y: 5 }
        },
        {
            name: WaferMapOriginLocation.topRight,
            expectedDie: { index: 9, x: 4, y: 4 }
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `will return the expected index when mouse moved in range from ${name}`,
            () => {
                element.originLocation = value.name;
                element.dispatchEvent(
                    new MouseEvent('mousemove', {
                        clientX: 30,
                        clientY: 30
                    })
                );
                processUpdates();
                expect(element.hoverDie).toEqual(value.expectedDie);
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
                element.originLocation = value.name;
                element.dispatchEvent(
                    new MouseEvent('mousemove', {
                        clientX: 101,
                        clientY: 101
                    })
                );
                processUpdates();
                expect(element.hoverDie).toEqual(value.expectedDie);
            }
        );
    });
});
