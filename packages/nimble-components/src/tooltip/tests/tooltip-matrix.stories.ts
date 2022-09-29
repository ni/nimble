import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
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
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { TooltipSeverity } from '../types';

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
    ['Short_Text', 'Hello'],
    ['Long_Text', loremIpsum]
] as const;
type TextState = typeof textStates[number];

const severityStates: [string, string | undefined][] = Object.entries(
    TooltipSeverity
).map(([key, value]) => [pascalCase(key), value]);
type SeverityState = typeof severityStates[number];

const iconVisibleStates = [
    ['No_Icon', false],
    ['Icon_Visible', true]
] as const;
type IconVisibleState = typeof iconVisibleStates[number];

const component = (
    [textName, text]: TextState,
    [severityName, severity]: SeverityState,
    [iconVisibleName, iconVisible]: IconVisibleState
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
    </style>

    <div class="container">
        <div
            class="anchorDiv"
            id="${() => `${textName}_${severityName}_${iconVisibleName}`}"
        >
            ${() => `${textName}`} ${() => `${severityName}`}
            ${() => `${iconVisibleName}`}
        </div>

        <nimble-tooltip
            anchor="${() => `${textName}_${severityName}_${iconVisibleName}`}"
            visible
            position="bottom"
            auto-update-mode="auto"
            severity="${() => severity}"
            ?icon-visible="${() => iconVisible}"
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
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    lightThemeWhiteBackground
);

export const tooltipColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    createMatrix(component, [
        textStates,
        severityStates,
        iconVisibleStates
    ]),
    colorThemeDarkGreenBackground
);

export const tooltipDarkThemeBlackBackground: Story = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    darkThemeBlackBackground
);

export const hiddenTooltip: Story = createStory(
    hiddenWrapper(html`<nimble-tooltip hidden>Hidden Tooltip</nimble-tooltip>`)
);
