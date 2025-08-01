import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { standardPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import {
    disabledStates,
    type DisabledState,
    errorStates,
    type ErrorState
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

const wrappingStates = [[''], [loremIpsum]] as const;
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

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        checkedStates,
        indeterminateStates,
        errorStates,
        wrappingStates
    ])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${checkboxTag} hidden>Hidden Checkbox</${checkboxTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${checkboxTag}>Checkbox</${checkboxTag}>`)
);
