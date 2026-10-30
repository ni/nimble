import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { richTextMentionListboxTag } from '@ni/nimble-components/dist/esm/rich-text/mention-listbox';
import { hiddenWrapper } from '../../../utilities/hidden';
import { loremIpsum } from '../../../utilities/lorem-ipsum';
import { sharedMatrixParameters } from '../../../utilities/matrix';
import { backgroundStates } from '../../../utilities/states';
import { createFixedThemeStory, createStory } from '../../../utilities/storybook';

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground
] = backgroundStates;

const metadata: Meta = {
    title: 'Tests/Rich Text Mention Listbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const playFunction = (): void => {
    const editorNodeList = document.querySelectorAll(richTextMentionListboxTag);
    const anchorList = document.querySelectorAll('.anchor');
    editorNodeList.forEach((element, index) => {
        const filter = anchorList[index]?.classList.contains('no-match')
            ? 'zzz'
            : '';
        element.show({
            anchorNode: anchorList[index] as HTMLElement,
            filter
        });
    });
};

const component = (noMatches: boolean): ViewTemplate => html`
    <span class='anchor ${noMatches ? 'no-match' : ''}' style="margin-left: 4px;"></span>
    <${richTextMentionListboxTag} style="height: 200px">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="6">${loremIpsum}</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5">Option 5</${listOptionTag}>
    </${richTextMentionListboxTag}>
`;

export const lightTheme: StoryFn = createFixedThemeStory(
    component(false),
    lightThemeWhiteBackground
);
lightTheme.play = playFunction;

export const lightThemeNoMatches: StoryFn = createFixedThemeStory(
    component(true),
    lightThemeWhiteBackground
);
lightThemeNoMatches.play = playFunction;

export const colorTheme: StoryFn = createFixedThemeStory(
    component(false),
    colorThemeDarkGreenBackground
);
colorTheme.play = playFunction;

export const colorThemeNoMatches: StoryFn = createFixedThemeStory(
    component(true),
    colorThemeDarkGreenBackground
);
colorThemeNoMatches.play = playFunction;

export const darkTheme: StoryFn = createFixedThemeStory(
    component(false),
    darkThemeBlackBackground
);
darkTheme.play = playFunction;

export const darkThemeNoMatches: StoryFn = createFixedThemeStory(
    component(true),
    darkThemeBlackBackground
);
darkThemeNoMatches.play = playFunction;

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${richTextMentionListboxTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${richTextMentionListboxTag}>`
    )
);
