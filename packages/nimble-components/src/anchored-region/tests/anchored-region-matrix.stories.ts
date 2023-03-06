import type { Meta, Story } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    applicationBackgroundColor
} from '../../theme-provider/design-tokens';
import { anchoredRegionTag } from '..';

const metadata: Meta = {
    title: 'Tests/Anchored Region',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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

export const anchoredRegionThemeMatrix: Story = createStory(
    createMatrix(component, [horizontalPositionStates, verticalPositionStates])
);

export const hiddenAnchoredRegion: Story = createStory(
    hiddenWrapper(
        html`<${anchoredRegionTag} hidden>Hidden Anchored Region</${anchoredRegionTag}>`
    )
);
