import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsfromStates
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    disabledStateIsEnabled,
} from '../../utilities/tests/states';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { toggleButtonTag } from '..';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';

const metadata: Meta = {
    title: 'Tests/Toggle Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

/* array of iconVisible, labelVisible, endIconVisible */
const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
type PartVisibilityState = (typeof partVisibilityStates)[number];
const partVisibilityStatesOnlyLabel = partVisibilityStates[2];

const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = (typeof checkedStates)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [checkedName, checked]: CheckedState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${toggleButtonTag}
        appearance="${() => appearance}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${checkedName} ${appearanceName} Toggle Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${toggleButtonTag}>
`;

export const toggleButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        partVisibilityStates,
        checkedStates,
        appearanceStates
    ])
);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    [partVisibilityStatesOnlyLabel],
    checkedStates,
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [disabledStateIsEnabled],
    [partVisibilityStatesOnlyLabel],
    checkedStates,
    appearanceStates
] as const);

export const toggleButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsfromStates(
        component,
        {
            hover: interactionStatesHover,
            hoverActive: interactionStates,
            active: interactionStates,
            focus: interactionStates,
        }
    )
);

export const hiddenButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${toggleButtonTag} hidden
            >Hidden Toggle Button</${toggleButtonTag}
        >`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${toggleButtonTag}>Toggle button</${toggleButtonTag}>`
    )
);
