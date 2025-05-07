import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { buttonTag } from '../../../../nimble-components/src/button';
import {
    bodyFont,
    dialogLargeHeight,
    dialogLargeMaxHeight,
    dialogLargeWidth,
    dialogSmallHeight,
    dialogSmallMaxHeight,
    dialogSmallWidth
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { dialogTag } from '../../../../nimble-components/src/dialog';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

const sizeStates = [
    [
        'Small Dialog',
        `width: var(${dialogSmallWidth.cssCustomProperty}); height: var(${dialogSmallHeight.cssCustomProperty}); max-height: var(${dialogSmallMaxHeight.cssCustomProperty});`
    ],
    [
        'Large Dialog',
        `width: var(${dialogLargeWidth.cssCustomProperty}); height: var(${dialogLargeHeight.cssCustomProperty}); max-height: var(${dialogLargeMaxHeight.cssCustomProperty});`
    ]
] as const;
type SizeState = (typeof sizeStates)[number];

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

const dialogSizingTestCase = ([
    sizeName,
    size
]: SizeState): ViewTemplate => html`
    <p class="spacer">${() => sizeName}</p>
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
    void document.querySelector(dialogTag)!.show();
};

export const lightTheme: StoryFn = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

lightTheme.play = playFunction;

export const colorTheme: StoryFn = createFixedThemeStory(
    component,
    colorThemeDarkGreenBackground
);

colorTheme.play = playFunction;

export const darkTheme: StoryFn = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);

darkTheme.play = playFunction;

export const smallSize: StoryFn = createFixedThemeStory(
    dialogSizingTestCase(sizeStates[0]),
    lightThemeWhiteBackground
);

smallSize.play = playFunction;

export const largeSize: StoryFn = createFixedThemeStory(
    dialogSizingTestCase(sizeStates[1]),
    lightThemeWhiteBackground
);

largeSize.play = playFunction;
