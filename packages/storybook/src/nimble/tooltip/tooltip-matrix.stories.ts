import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderColor
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { tooltipTag } from '../../../../nimble-components/src/tooltip';
import { TooltipSeverity } from '../../../../nimble-components/src/tooltip/types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    createFixedThemeStory,
    createStory
} from '../../utilities/storybook';
import { backgroundStates } from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const iconVisibleStates = [
    ['No_Icon', false],
    ['Icon_Visible', true]
] as const;
type IconVisibleState = (typeof iconVisibleStates)[number];

const severityStates = [
    ['Default', TooltipSeverity.default],
    ['Error', TooltipSeverity.error],
    ['Information', TooltipSeverity.information]
] as const;
type SeverityState = (typeof severityStates)[number];

const textStates = [
    ['Short_Text', 'Hello'],
    ['Long_Text', loremIpsum]
] as const;
type TextState = (typeof textStates)[number];

const metadata: Meta = {
    title: 'Tests/Tooltip',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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
            padding: 10px 200px 150px 200px;
            width: 100px;
            height: 50px;
        }

        .anchorDiv {
            border: 1px solid var(${borderColor.cssCustomProperty});
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            width: 80px;
            height: 60px;
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

        <${tooltipTag}
            anchor="${() => `${textName}_${severityName}_${iconVisibleName}`}"
            visible
            position="bottom"
            auto-update-mode="auto"
            severity="${() => severity}"
            ?icon-visible="${() => iconVisible}"
        >
            ${() => `${text}`}
        </${tooltipTag}>
    </div>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground
] = backgroundStates;

export const tooltipLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    lightThemeWhiteBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
tooltipLightThemeWhiteBackground.parameters = {
    chromatic: { disableSnapshot: true }
};

export const tooltipColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        textStates,
        severityStates,
        iconVisibleStates
    ]),
    colorThemeDarkGreenBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
tooltipColorThemeDarkGreenBackground.parameters = {
    chromatic: { disableSnapshot: true }
};

export const tooltipDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    darkThemeBlackBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
tooltipDarkThemeBlackBackground.parameters = {
    chromatic: { disableSnapshot: true }
};

export const hiddenTooltip: StoryFn = createStory(
    hiddenWrapper(html`<${tooltipTag} hidden>Hidden Tooltip</${tooltipTag}>`)
);
