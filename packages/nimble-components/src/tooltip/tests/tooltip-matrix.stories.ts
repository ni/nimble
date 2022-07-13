import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { backgroundStates } from '../../utilities/tests/states';
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

const valueStates = [
    ['shortText', 'Hello'],
    [
        'longText',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
    ]
] as const;
type ValueState = typeof valueStates[number];

const component = ([valueName, valueValue]: ValueState): ViewTemplate => html`
    <style>
        .container {
            display: inline-flex;
            padding: 120px;
            justify-content: center;
            text-align: center;
        }

        .anchorDiv {
            border: 1px solid var(${borderColor.cssCustomProperty});
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }

        .tooltip {
            justify-content: center;
        }
    </style>

    <div class="container">
        <div class="anchorDiv" id="${() => `${valueName}`}">${valueName}</div>

        <nimble-tooltip
            anchor="${() => `${valueName}`}"
            visible
            position="bottom"
            auto-update-mode="auto"
        >
            ${() => valueValue}
        </nimble-tooltip>
    </div>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground
] = backgroundStates;

export const tooltipLightThemeWhiteBackground: Story = createFixedThemeStory(
    createMatrix(component, [valueStates]),
    lightThemeWhiteBackground
);

export const tooltipColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    createMatrix(component, [valueStates]),
    colorThemeDarkGreenBackground
);

export const tooltipDarkThemeBlackBackground: Story = createFixedThemeStory(
    createMatrix(component, [valueStates]),
    darkThemeBlackBackground
);
