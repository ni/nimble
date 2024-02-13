import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    InteractionState,
    interactionStates
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
    [interactionName, interaction]: InteractionState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [checkedName, checked]: CheckedState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${toggleButtonTag}
        class="${() => interaction}"
        appearance="${() => appearance}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${interactionName} ${checkedName} ${appearanceName} Toggle Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${toggleButtonTag}>
`;

export const toggleButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        interactionStates.slice(0, 1),
        partVisibilityStates,
        checkedStates,
        disabledStates,
        appearanceStates
    ])
);

export const toggleButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        interactionStates.filter(x => x[0] && !x[0].includes('Active')),
        [[false, true, false]],
        checkedStates,
        disabledStates,
        appearanceStates
    ])
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
