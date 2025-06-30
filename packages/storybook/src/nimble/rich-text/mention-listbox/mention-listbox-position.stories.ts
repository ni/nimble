import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontLineHeight,
    borderWidth,
    controlHeight,
    smallPadding
} from '@ni/nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '@ni/nimble-components/src/list-option';
import { richTextMentionListboxTag } from '@ni/nimble-components/src/rich-text/mention-listbox';
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
            padding: 0px;
        }
    </style>
    <div
        style="--ni-private-dropdown-delta-height: calc(
                ${numListOptions} * var(${controlHeight.cssCustomProperty}) +
                2 * (var(${smallPadding.cssCustomProperty}) + var(${borderWidth.cssCustomProperty}))
            );
            height: calc(2 * var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels + belowTooSmallByPixels}px + var(${bodyFontLineHeight.cssCustomProperty}));
            width: fit-content;
            padding-left: 8px;
            padding-right: 8px;
            border-bottom: 2px solid green;"
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

export const sufficientSpaceAboveAndBelow: StoryFn = createStory(
    component(0, 0)
);
sufficientSpaceAboveAndBelow.play = playFunction;
export const sufficientSpaceAboveButNotBelow: StoryFn = createStory(
    component(0, 40)
);
sufficientSpaceAboveButNotBelow.play = playFunction;
export const sufficientSpaceBelowButNotAbove: StoryFn = createStory(
    component(40, 0)
);
sufficientSpaceBelowButNotAbove.play = playFunction;
export const aboveAndBelowEquallyTooSmall: StoryFn = createStory(
    component(40, 40)
);
aboveAndBelowEquallyTooSmall.play = playFunction;
export const bothTooSmallButMoreSpaceBelow: StoryFn = createStory(
    component(80, 40)
);
bothTooSmallButMoreSpaceBelow.play = playFunction;
export const bothTooSmallButMoreSpaceAbove: StoryFn = createStory(
    component(40, 80)
);
bothTooSmallButMoreSpaceAbove.play = playFunction;
