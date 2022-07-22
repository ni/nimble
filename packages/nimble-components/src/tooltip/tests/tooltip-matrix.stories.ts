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

const textStates = [
    ['Short Text', 'Hello'],
    ['Long Text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.']
] as const;
type TextState = typeof textStates[number];

const valueStates = [
    ['Default', ''],
    ['Fail', 'fail'],
    ['Information', 'information']
] as const;
type ValueState = typeof valueStates[number];

const iconStates = [
    ['No Icon', ''],
    ['Icon Visible', 'icon-visible']
] as const;
type IconState = typeof iconStates[number];

const component = (
    [textName, text]: TextState,
    [valueName, value]: ValueState,
    [iconName, icon]: IconState
): ViewTemplate => html`
    <style>
        div {
            display: inline-block;
        }

        .container {
            padding: 200px;
            width: 100px;
            height: 50px;
        }

        .anchorDiv {
            border: 1px solid var(${borderColor.cssCustomProperty});
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }

        .tooltip {
            justify-content: left;
        }
    </style>

    <div class="container">
        <div class="anchorDiv" id="${() => `${textName}`} ${() => `${valueName}`} ${() => `${iconName}`}">
            ${() => `${textName}`} ${() => `${valueName}`} ${() => `${iconName}`}
        </div>

        <nimble-tooltip
            anchor="${() => `${textName}`} ${() => `${valueName}`} ${() => `${iconName}`}"
            visible
            position="bottom"
            auto-update-mode="auto"
            class="${() => `${value} ${icon}`}"
        >
            ${() => `${text}`}
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
        textStates,
        valueStates,
        iconStates
    ]),
    lightThemeWhiteBackground
);

export const tooltipColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        textStates,
        valueStates,
        iconStates
    ]),
    colorThemeDarkGreenBackground
);

export const tooltipDarkThemeBlackBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        textStates,
        valueStates,
        iconStates
    ]),
    darkThemeBlackBackground
);

export const hiddenTooltip: Story = createStory(
    hiddenWrapper(html`<nimble-tooltip hidden>Hidden Tooltip</nimble-tooltip>`)
);
