import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
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
    DisabledState,
    disabledStateIsEnabled
} from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const openStates = [
    ['', false],
    ['Open', true]
] as const;
type OpenState = (typeof openStates)[number];

const metadata: Meta = {
    title: 'Tests/Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [openName, open]: OpenState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
): ViewTemplate => html`
    <${menuButtonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?open="${() => open}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${openName} ${appearanceVariantName} ${appearanceName} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${menuButtonTag}>
`;

export const menuButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        openStates,
        partVisibilityStates,
        disabledStates,
        appearanceStates,
        appearanceVariantStates
    ])
);

const interactionStatesHover = cartesianProduct([
    openStates,
    [partVisibilityStatesOnlyLabel],
    disabledStates,
    appearanceStates,
    appearanceVariantStates
] as const);

const interactionStates = cartesianProduct([
    openStates,
    [partVisibilityStatesOnlyLabel],
    [disabledStateIsEnabled],
    appearanceStates,
    appearanceVariantStates
] as const);

export const menuButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hiddenMenuButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuButtonTag} hidden>Hidden Menu Button</${menuButtonTag}>`
    )
);
