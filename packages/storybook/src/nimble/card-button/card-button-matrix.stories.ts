import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { cardButtonTag } from '@ni/nimble-components/dist/esm/card-button';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { disabledStates, DisabledState } from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const selectedStates = [
    ['Selected', true],
    ['', false]
] as const;
type SelectedState = (typeof selectedStates)[number];

const metadata: Meta = {
    title: 'Tests/Card Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [selectedName, selected]: SelectedState
): ViewTemplate => html`
<style>
    .wrapper {
        margin: 32px 40px;
        display: flex;
        font: var(${bodyFont.cssCustomProperty});
        align-items: center;
    }

    .count {
        font-size: 32px;
        line-height: 40px;
        padding-right: 10px;
    }

    .label {
        text-transform: uppercase;
        font-weight: 600;
    }
</style>
<${cardButtonTag}
    ?disabled=${() => disabled}
    ?selected=${() => selected}
>
    <div class="wrapper">
        <div class="count">15</div>
        <div class="label">
            ${() => disabledName} ${() => selectedName}
        </div>
    </div>
</${cardButtonTag}>
`;

export const buttonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [disabledStates, selectedStates])
);

export const hiddenButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${cardButtonTag} hidden>Hidden Card Button</${cardButtonTag}>`
    )
);
