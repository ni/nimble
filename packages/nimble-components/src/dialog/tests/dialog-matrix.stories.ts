import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { dialogTag } from '..';
import { buttonTag } from '../../button';
import {
    bodyFont,
    dialogLargeHeight,
    dialogLargeMaxHeight,
    dialogLargeWidth,
    dialogSmallHeight,
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

const sizeStates = [
    [
        'small',
        `width: var(${dialogSmallWidth.cssCustomProperty}); height: var(${dialogSmallHeight.cssCustomProperty}); max-height: var(${dialogSmallMaxHeight.cssCustomProperty});`
    ],
    [
        'large',
        `width: var(${dialogLargeWidth.cssCustomProperty}); height: var(${dialogLargeHeight.cssCustomProperty}); max-height: var(${dialogLargeMaxHeight.cssCustomProperty});`
    ]
] as const;
type SizeState = (typeof sizeStates)[number];

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

const dialogSizingTestCase = (size: SizeState): ViewTemplate => html`
    <p class="spacer">${() => size};</p>
    <style>
        ${dialogTag}::part(control) {
            ${() => size};
        }

        .spacer {
            font: var(${bodyFont.cssCustomProperty});
            padding-bottom: 1000px;
        }
    </style>
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

export const dialogSmallSize: StoryFn = createFixedThemeStory(
    dialogSizingTestCase(sizeStates[0]),
    lightThemeWhiteBackground
);

dialogSmallSize.play = playFunction;

export const dialogLargeSize: StoryFn = createFixedThemeStory(
    dialogSizingTestCase(sizeStates[1]),
    lightThemeWhiteBackground
);

dialogLargeSize.play = playFunction;
