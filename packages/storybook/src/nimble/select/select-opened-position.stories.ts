import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import {
    borderWidth,
    controlHeight,
    smallPadding
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { selectTag } from '../../../../nimble-components/src/select';
import { createStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests/Select',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const numListOptions = 3;

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
                + 2 * (var(${smallPadding.cssCustomProperty}) + var(${borderWidth.cssCustomProperty}))
                + var(${smallPadding.cssCustomProperty}));
            height: calc(2 * var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels + belowTooSmallByPixels}px + var(${controlHeight.cssCustomProperty}));
            border-left: 2px solid green;"
    >
        <${selectTag}
            open
            filter-mode="standard"
            style="margin-top: calc(var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels}px);"
        >
            ${repeat(() => [...Array(numListOptions).keys()], html<number>`
                <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
            `)}
        </${selectTag}>
    </div>
`;

export const selectDefaultOpenSufficientRoomAboveAndBelow: StoryFn = createStory(component(0, 0));
export const selectDefaultOpenSufficientRoomAboveButNotBelow: StoryFn = createStory(component(0, 1));
export const selectDefaultOpenSufficientRoomBelowButNotAbove: StoryFn = createStory(component(1, 0));
export const selectDefaultOpenEquallyInsufficientRoomAboveAndBelow: StoryFn = createStory(component(1, 1));
export const selectDefaultOpenMoreInsufficientAboveThanBelow: StoryFn = createStory(component(2, 1));
export const selectDefaultOpenMoreInsufficientBelowThanAbove: StoryFn = createStory(component(1, 2));
