import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontLineHeight,
    borderWidth,
    controlHeight,
    smallPadding
} from '../../../../../nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '../../../../../nimble-components/src/list-option';
import { richTextMentionListboxTag } from '../../../../../nimble-components/src/rich-text/mention-listbox';
import { sharedMatrixParameters } from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';

const metadata: Meta = {
    title: 'Tests/Rich Text Mention Listbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const numListOptions = 3;

const playFunction = (): void => {
    const anchor = document.querySelector('.anchor');
    const listbox = document.querySelector(richTextMentionListboxTag)!;
    listbox.show({
        anchorNode: anchor as HTMLElement,
        filter: ''
    });
};

// prettier-ignore
const component = (
    aboveTooSmallByPixels: number,
    belowTooSmallByPixels: number
): ViewTemplate => html`
    <style>
        body.sb-show-main.sb-main-padded {
            padding-top: 0px;
            padding-bottom: 0px;
        }
    </style>
    <div
        style="--ni-private-dropdown-delta-height: calc(${numListOptions} * var(${controlHeight.cssCustomProperty}) 
                + 2 * (var(${smallPadding.cssCustomProperty}) + var(${borderWidth.cssCustomProperty})));
            height: calc(2 * var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels + belowTooSmallByPixels}px + var(${bodyFontLineHeight.cssCustomProperty}));
            border-left: 2px solid green;"
    >
        <div
            class='anchor'
            style="
                display: inline-block;
                margin-top: calc(var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels}px);
                font: var(${bodyFont.cssCustomProperty});
            "
        >@</div>
        <${richTextMentionListboxTag}
            stylez="height: var(--ni-private-dropdown-delta-height);"
        >
            ${repeat(() => [...Array(numListOptions).keys()], html<number>`
                <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
            `)}
        </${richTextMentionListboxTag}>
    </div>
`;

export const richTextMentionListboxSufficientRoomAboveAndBelow: StoryFn = createStory(component(0, 0));
richTextMentionListboxSufficientRoomAboveAndBelow.play = playFunction;
export const richTextMentionListboxSufficientRoomAboveButNotBelow: StoryFn = createStory(component(0, 1));
richTextMentionListboxSufficientRoomAboveButNotBelow.play = playFunction;
export const richTextMentionListboxSufficientRoomBelowButNotAbove: StoryFn = createStory(component(1, 0));
richTextMentionListboxSufficientRoomBelowButNotAbove.play = playFunction;
export const richTextMentionListboxEquallyInsufficientRoomAboveAndBelow: StoryFn = createStory(component(1, 1));
richTextMentionListboxEquallyInsufficientRoomAboveAndBelow.play = playFunction;
export const richTextMentionListboxMoreInsufficientAboveThanBelow: StoryFn = createStory(component(2, 1));
richTextMentionListboxMoreInsufficientAboveThanBelow.play = playFunction;
export const richTextMentionListboxMoreInsufficientBelowThanAbove: StoryFn = createStory(component(1, 2));
richTextMentionListboxMoreInsufficientBelowThanAbove.play = playFunction;
