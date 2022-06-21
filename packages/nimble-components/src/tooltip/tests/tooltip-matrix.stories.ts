import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createFixedThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { backgroundStates } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import {
    bodyFont,
    bodyFontColor,
    borderColor
} from '../../theme-provider/design-tokens';

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

const horizontalViewportLockStates = [
    ['horizontalViewportLock Checked', true],
    ['horizontalViewportLock Unchecked', false]
] as const;
type HorizontalViewportLockState = typeof horizontalViewportLockStates[number];

const verticalViewportLockStates = [
    ['verticalViewportLock Checked', true],
    ['verticalViewportLock Unchecked', false]
] as const;
type VerticalViewportLockState = typeof verticalViewportLockStates[number];

const component = (
    [
        horizontalViewportLockName,
        horizontalViewportLock
    ]: HorizontalViewportLockState,
    [verticalViewportLockName, verticalViewportLock]: VerticalViewportLockState
): ViewTemplate => html`
    <style>
        .container {
            width: 250px;
            height: 40px;
            padding: 20px;
        }

        .anchorDiv {
            border: 1px solid var(${borderColor.cssCustomProperty});
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }
    </style>

    <div class="container">
        <div
            class="anchorDiv"
            id="${() => `${horizontalViewportLockName}_${verticalViewportLockName}`}"
        >
            ${horizontalViewportLockName} ${verticalViewportLockName}
        </div>

        <nimble-tooltip
            anchor="${() => `${horizontalViewportLockName}_${verticalViewportLockName}`}"
            visible
            position="bottom"
            ?horizontalViewportLock="${() => horizontalViewportLock}"
            ?verticalViewportLock="${() => verticalViewportLock}"
            auto-update-mode="auto"
        >
            Tooltip
        </nimble-tooltip>
    </div>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground
] = backgroundStates;

export const tooltipLightThemeWhiteBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        horizontalViewportLockStates,
        verticalViewportLockStates
    ]),
    lightThemeWhiteBackground
);

export const tooltipColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        horizontalViewportLockStates,
        verticalViewportLockStates
    ]),
    colorThemeDarkGreenBackground
);

export const tooltipDarkThemeBlackBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        horizontalViewportLockStates,
        verticalViewportLockStates
    ]),
    darkThemeBlackBackground
);

export const hiddenTooltip: Story = createStory(
    hiddenWrapper(html`<nimble-tooltip hidden>Hidden Tooltip</nimble-tooltip>`)
);
