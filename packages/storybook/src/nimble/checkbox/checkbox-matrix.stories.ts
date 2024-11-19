import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { standardPadding } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { checkboxTag } from '../../../../nimble-components/src/checkbox';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState
} from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

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

const wrappingStates = [
    [''],
    [loremIpsum]
] as const;
type WrappingState = (typeof wrappingStates)[number];

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
    [indeterminateName, indeterminate]: IndeterminateState,
    [errorName, errorVisible, errorText]: ErrorState,
    [extraText]: WrappingState
): ViewTemplate => html`<${checkboxTag}
    ?checked="${() => checked}"
    ?disabled="${() => disabled}"
    ?error-visible="${() => errorVisible}"
    error-text="${() => errorText}"
    :indeterminate="${() => indeterminate}"
    style="width: 350px; margin: var(${standardPadding.cssCustomProperty});"
>
    ${checkedName} ${indeterminateName} ${disabledName} ${errorName} ${extraText}
</${checkboxTag}>`;

export const checkboxThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        checkedStates,
        indeterminateStates,
        errorStates,
        wrappingStates
    ])
);

export const hiddenCheckbox: StoryFn = createStory(
    hiddenWrapper(html`<${checkboxTag} hidden>Hidden Checkbox</${checkboxTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${checkboxTag}>Checkbox</${checkboxTag}>`)
);
