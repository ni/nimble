import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createFixedThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { dialogTag } from '..';
import { buttonTag } from '../../button';
import {
    cssPropertyFromTokenName,
    tokenNames
} from '../../theme-provider/design-token-names';
import {
    dialogLargeHeight,
    dialogLargeWidth,
    dialogSmallMaxHeight,
    dialogSmallWidth
} from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Dialog',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = html`
    <${dialogTag}>
        <span slot="title">This is my dialog's title. It is pretty long.</span>
        <span slot="subtitle">The dialog has a subtitle here.</span>
        <div>Here is the first piece of content in the dialog</div>
        <div>
            Here is another piece of content in the dialog. It is a bit longer.
        </div>
        <${buttonTag} slot="footer">Cancel</${buttonTag}>
        <${buttonTag} slot="footer">OK</${buttonTag}>
    </${dialogTag}>
`;

const dialogSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string],
    [maxHeightLabel, maxHeightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${() => widthLabel}; ${() => heightLabel} ${() => maxHeightLabel}</p>
    <${dialogTag} style="${() => widthStyle}; ${() => heightStyle}; ${() => maxHeightStyle};">
    <span slot="title">This is my dialog's title. It is pretty long.</span>
        <span slot="subtitle">The dialog has a subtitle here.</span>
        <div>Here is the first piece of content in the dialog</div>
        <div>
            Here is another piece of content in the dialog. It is a bit longer.
        </div>
        <${buttonTag} slot="footer">Cancel</${buttonTag}>
        <${buttonTag} slot="footer">OK</${buttonTag}>
    </${dialogTag}>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

const playFunction = (): void => {
    void document.querySelector('nimble-dialog')!.show();
};

export const dialogLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

dialogLightThemeWhiteBackground.play = playFunction;

export const dialogColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);

dialogColorThemeDarkGreenBackground.play = playFunction;

export const dialogDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);

dialogDarkThemeBlackBackground.play = playFunction;

export const smallDialogSizing: StoryFn = createStory(html`
    ${createMatrix(dialogSizingTestCase, [
        [
            [
                `Width ${dialogSmallWidth.getValueFor(document.body)}`,
                `width: ${dialogSmallWidth.getValueFor(document.body)}`
            ]
        ],
        [['Height fit-content', 'height: fit-content']],
        [
            [
                `Max height ${dialogSmallMaxHeight.getValueFor(document.body)}`,
                `max-height: ${dialogSmallMaxHeight.getValueFor(document.body)}`
            ]
        ]
    ])}
`);

smallDialogSizing.play = playFunction;

export const largeDialogSizing: StoryFn = createStory(html`
    ${createMatrix(dialogSizingTestCase, [
        [
            [
                `Width ${dialogLargeWidth.getValueFor(document.body)}`,
                `width: ${dialogLargeWidth.getValueFor(document.body)}`
            ]
        ],
        [
            [
                `Height ${dialogLargeHeight.getValueFor(document.body)}`,
                `height: ${dialogLargeHeight.getValueFor(document.body)}`
            ]
        ],
        [
            [
                `Max height ${dialogLargeHeight.getValueFor(document.body)}`,
                `max-height: ${dialogLargeHeight.getValueFor(document.body)}`
            ]
        ]
    ])}
`);

largeDialogSizing.play = playFunction;
