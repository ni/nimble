import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { checkboxTag } from '../../../../nimble-components/src/checkbox';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { disabledStates, DisabledState } from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = (typeof checkedStates)[number];

const indeterminateStates = [
    ['Indeterminate', true],
    ['', false]
] as const;
type IndeterminateState = (typeof indeterminateStates)[number];

const metadata: Meta = {
    title: 'Tests/Checkbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
    [checkedName, checked]: CheckedState,
    [indeterminateName, indeterminate]: IndeterminateState
): ViewTemplate => html`<${checkboxTag}
    ?checked="${() => checked}"
    ?disabled="${() => disabled}"
    :indeterminate="${() => indeterminate}"
>
    ${checkedName} ${indeterminateName} ${disabledName}
</${checkboxTag}>`;

export const checkboxThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        checkedStates,
        indeterminateStates
    ])
);

export const hiddenCheckbox: StoryFn = createStory(
    hiddenWrapper(html`<${checkboxTag} hidden>Hidden Checkbox</${checkboxTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${checkboxTag}>Checkbox</${checkboxTag}>`)
);
