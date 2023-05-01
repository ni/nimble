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
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { checkboxTag } from '..';

const metadata: Meta = {
    title: 'Tests/Checkbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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
