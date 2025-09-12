import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tooltipTag } from '@ni/nimble-components/dist/esm/tooltip';
import { TooltipSeverity } from '@ni/nimble-components/dist/esm/tooltip/types';
import { createMatrix, sharedMatrixParameters } from '../../utilities/matrix';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
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

const cssStates = [
    ['Default_CSS', {
        background: '',
        color: '',
        borderColor: '',
        borderRadius: '',
        padding: ''
    }],
    ['Custom_CSS', {
        background: '#333',
        color: '#fff',
        borderColor: '#f00',
        borderRadius: '8px',
        padding: '12px 20px'
    }]
] as const;
type CssState = (typeof cssStates)[number];

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

const cssComponent = (
    [textName, text]: TextState,
    [severityName, severity]: SeverityState,
    [iconVisibleName, iconVisible]: IconVisibleState,
    [cssName, css]: CssState
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
        ${tooltipTag}::part(control) {
            background: ${() => css.background};
            color: ${() => css.color};
            border-color: ${() => css.borderColor};
            border-radius: ${() => css.borderRadius};
            padding: ${() => css.padding};
        }
    </style>
    <div class="container">
        <div
            class="anchorDiv"
            id="${() => `${textName}_${severityName}_${iconVisibleName}_${cssName}`}"
        >
            ${() => `${textName}`} ${() => `${severityName}`}
            ${() => `${iconVisibleName}`} ${() => `${cssName}`}
        </div>
        <${tooltipTag}
            anchor="${() => `${textName}_${severityName}_${iconVisibleName}_${cssName}`}"
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

// Place after backgroundStates destructure to avoid usage before assignment


// Place after all other story exports to avoid usage before assignment




const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground
] = backgroundStates;

export const lightTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    lightThemeWhiteBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
lightTheme.parameters = {
    chromatic: { disableSnapshot: true }
};

export const colorTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    colorThemeDarkGreenBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
colorTheme.parameters = {
    chromatic: { disableSnapshot: true }
};

export const darkTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [textStates, severityStates, iconVisibleStates]),
    darkThemeBlackBackground
);

// Temporarily disabling this test because of flakiness
// See: https://github.com/ni/nimble/issues/1106
darkTheme.parameters = {
    chromatic: { disableSnapshot: true }
};


export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${tooltipTag} hidden>Hidden Tooltip</${tooltipTag}>`)
);

// Matrix story for tooltip ::part(control) CSS customization
export const cssPartControlMatrix: StoryFn = createFixedThemeStory(
    createMatrix(cssComponent, [textStates, severityStates, iconVisibleStates, cssStates]),
    lightThemeWhiteBackground
);

cssPartControlMatrix.parameters = {
    chromatic: { disableSnapshot: true },
    docs: {
        description: {
            story: 'Matrix story for tooltip ::part(control) CSS customization. Shows combinations of content, severity, icon, and CSS properties.'
        }
    }
};
