import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import {
    borderWidth,
    controlHeight,
    smallPadding
} from '@ni/nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '@ni/nimble-components/src/list-option';
import { comboboxTag } from '@ni/nimble-components/src/combobox';
import { createStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests/Combobox',
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
            padding: 0px;
        }
    </style>
    <div
        style="--ni-private-dropdown-delta-height: calc(
                ${numListOptions} * var(${controlHeight.cssCustomProperty}) +
                2 * (var(${smallPadding.cssCustomProperty}) + var(${borderWidth.cssCustomProperty})) +
                var(${smallPadding.cssCustomProperty})
            );
            height: calc(2 * var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels + belowTooSmallByPixels}px + var(${controlHeight.cssCustomProperty}));
            width: fit-content;
            padding-left: 8px;
            padding-right: 8px;
            border-bottom: 2px solid green;"
    >
        <${comboboxTag}
            open
            style="margin-top: calc(var(--ni-private-dropdown-delta-height) - ${aboveTooSmallByPixels}px);"
        >
            ${repeat(() => [...Array(numListOptions).keys()], html<number>`
                <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
            `)}
        </${comboboxTag}>
    </div>
`;

export const openDefault$SufficientSpaceAboveAndBelow: StoryFn = createStory(
    component(0, 0)
);
export const openDefault$SufficientSpaceAboveButNotBelow: StoryFn = createStory(
    component(0, 40)
);
export const openDefault$SufficientSpaceBelowButNotAbove: StoryFn = createStory(
    component(40, 0)
);
export const openDefault$AboveAndBelowEquallyTooSmall: StoryFn = createStory(
    component(40, 40)
);
export const openDefault$BothTooSmallButMoreSpaceBelow: StoryFn = createStory(
    component(80, 40)
);
export const openDefault$BothTooSmallButMoreSpaceAbove: StoryFn = createStory(
    component(40, 80)
);
