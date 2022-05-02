import type { Meta, Story } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    applicationBackgroundColor
} from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/AnchoredRegion',
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
type HorizontalPositionState = typeof horizontalPositionStates[number];

const verticalPositionStates = [
    ['Top', 'top'],
    ['Bottom', 'bottom'],
    ['Center', 'center']
] as const;
type VerticalPositionState = typeof verticalPositionStates[number];

const component = (
    [horizontalPositionName, horizontalPosition]: HorizontalPositionState,
    [verticalPositionName, verticalPosition]: VerticalPositionState
): ViewTemplate => html`<style>
        .container {
            display: inline-flex;
            margin: 100px;
            height: 200px;
            width: 200px;
        }

        .anchor {
            top: 100px;
            left: 300px;
            width: 150px;
            height: 150px;
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            border: 2px solid var(${borderHoverColor.cssCustomProperty});
            background: var(${applicationBackgroundColor.cssCustomProperty});
        }

        .anchoredRegion {
            width: 75px;
            height: 75px;
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            border: 2px solid var(${borderHoverColor.cssCustomProperty});
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
        <nimble-anchored-region
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
        </nimble-anchored-region>
        <div></div>
    </div>`;

export const anchoredRegionThemeMatrix: Story = createStory(
    createMatrix(component, [horizontalPositionStates, verticalPositionStates])
);

export const hiddenAnchoredRegion: Story = createStory(
    hiddenWrapper(
        html`<nimble-anchored-region hidden>Hidden Anchored Region</nimble-anchored-regionx>`
    )
);
