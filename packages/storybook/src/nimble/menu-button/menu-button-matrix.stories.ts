import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
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
    type DisabledState,
    disabledStateIsEnabled
} from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Tests/Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
): ViewTemplate => html`
    <${menuButtonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${menuButtonTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        partVisibilityStates,
        disabledStates,
        appearanceStates,
        appearanceVariantStates
    ])
);

const interactionStatesHover = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    disabledStates,
    appearanceStates,
    appearanceVariantStates
] as const);

const interactionStates = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    [disabledStateIsEnabled],
    appearanceStates,
    appearanceVariantStates
] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuButtonTag} hidden>Hidden Menu Button</${menuButtonTag}>`
    )
);
