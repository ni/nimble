import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { bodyFont } from '../../theme-provider/design-tokens';
import { cardButtonTag } from '..';

const metadata: Meta = {
    title: 'Tests/Card Button',
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20/specs/'
        }
    }
};

export default metadata;

const selectedStates = [
    ['Selected', true],
    ['', false]
] as const;
type SelectedState = (typeof selectedStates)[number];

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
