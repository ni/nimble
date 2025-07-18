import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    applicationBackgroundColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { createMatrix, sharedMatrixParameters } from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const horizontalPositionStates = [
    ['Start', 'start'],
    ['End', 'end'],
    ['Left', 'left'],
    ['Right', 'right'],
    ['Center', 'center']
] as const;
type HorizontalPositionState = (typeof horizontalPositionStates)[number];

const verticalPositionStates = [
    ['Top', 'top'],
    ['Bottom', 'bottom'],
    ['Center', 'center']
] as const;
type VerticalPositionState = (typeof verticalPositionStates)[number];

const metadata: Meta = {
    title: 'Tests/Anchored Region',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [horizontalPositionName, horizontalPosition]: HorizontalPositionState,
    [verticalPositionName, verticalPosition]: VerticalPositionState
): ViewTemplate => html`<style>
        .container {
            display: inline-flex;
            margin: 55px;
            height: 75px;
            width: 75px;
        }

        .anchor {
            top: 25px;
            left: 25px;
            width: 75px;
            height: 75px;
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            border: 1px solid var(${borderHoverColor.cssCustomProperty});
            background: var(${applicationBackgroundColor.cssCustomProperty});
        }

        .anchoredRegion {
            width: 50px;
            height: 50px;
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            border: 1px solid var(${borderHoverColor.cssCustomProperty});
            background: var(${applicationBackgroundColor.cssCustomProperty});
        }
    </style>
    <div class="container">
        <div
            id="${() => `${verticalPosition}_${horizontalPosition}`}"
            class="anchor"
        >
            Anchor element
        </div>
        <${anchoredRegionTag}
            anchor="${() => `${verticalPosition}_${horizontalPosition}`}"
            fixed-placement="true"
            auto-update-mode="auto"
            vertical-default-position="${() => verticalPosition}"
            vertical-positioning-mode="locktodefault"
            horizontal-default-position="${() => horizontalPosition}"
            horizontal-positioning-mode="locktodefault"
        >
            <div class="anchoredRegion">
                ${horizontalPositionName} ${verticalPositionName}
            </div>
        </${anchoredRegionTag}>
        <div></div>
    </div>`;

export const themeMatrix: StoryFn = createStory(
    createMatrix(component, [horizontalPositionStates, verticalPositionStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${anchoredRegionTag} hidden>Hidden Anchored Region</${anchoredRegionTag}>`
    )
);
