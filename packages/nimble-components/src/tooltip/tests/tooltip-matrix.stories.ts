import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Tooltip',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/'
        }
    }
};

export default metadata;

const horiontalViewportLockStates = [
    ['horiontalViewportLock Checked', true],
    ['horiontalViewportLock Unchecked', false]
] as const;
type HoriontalViewportLockState = typeof horiontalViewportLockStates[number];

const verticalViewportLockStates = [
    ['verticalViewportLock Checked', true],
    ['verticalViewportLock Unchecked', false]
] as const;
type VerticalViewportLockState = typeof verticalViewportLockStates[number];

// WIP need to figure out anchoring- They all have the same ids and anchors- only first button tooltip works

const component = (
    [horiontalViewportLockName, horiontalViewportLock]: HoriontalViewportLockState,
    [verticalViewportLockName, verticalViewportLock]: VerticalViewportLockState,
): ViewTemplate => html`
<nimble-button
id="anchor">${horiontalViewportLockName} ${verticalViewportLockName}
</nimble-button>

<nimble-tooltip
    anchor='anchor'
    visible
    ?horiontalViewportLock="${() => horiontalViewportLock}"
    ?verticalViewportLock="${() => verticalViewportLock}"
>
    text
</nimble-tooltip>`;

export const tooltipThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        horiontalViewportLockStates,
        verticalViewportLockStates
    ])
);

export const hiddenTooltip: Story = createStory(
    hiddenWrapper(
        html`<nimble-tooltip hidden>Hidden Tooltip</nimble-tooltip>`
    )
);
