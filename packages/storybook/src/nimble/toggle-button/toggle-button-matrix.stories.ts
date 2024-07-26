import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { iconArrowExpanderDownTag } from '../../../../nimble-components/src/icons/arrow-expander-down';
import { iconKeyTag } from '../../../../nimble-components/src/icons/key';
import { toggleButtonTag } from '../../../../nimble-components/src/toggle-button';
import {
    appearanceStates,
    type AppearanceState,
    type AppearanceVariantState,
    type PartVisibilityState,
    appearanceVariantStates,
    partVisibilityStates,
    partVisibilityStatesOnlyLabel
} from '../patterns/button/states';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    disabledStateIsEnabled
} from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = (typeof checkedStates)[number];

const metadata: Meta = {
    title: 'Tests/Toggle Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [checkedName, checked]: CheckedState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState
): ViewTemplate => html`
    <${toggleButtonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${checkedName} ${appearanceVariantName} ${appearanceName} Toggle Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${toggleButtonTag}>
`;

export const toggleButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        partVisibilityStates,
        checkedStates,
        disabledStates,
        appearanceStates,
        appearanceVariantStates
    ])
);

const interactionStatesHover = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    checkedStates,
    disabledStates,
    appearanceStates,
    appearanceVariantStates
] as const);

const interactionStates = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    checkedStates,
    [disabledStateIsEnabled],
    appearanceStates,
    appearanceVariantStates
] as const);

export const toggleButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
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
