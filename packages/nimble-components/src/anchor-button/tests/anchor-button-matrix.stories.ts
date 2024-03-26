import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
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
    disabledStateIsEnabled
} from '../../utilities/tests/states';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { anchorButtonTag } from '..';
import { iconLinkTag } from '../../icons/link';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';
import {
    appearanceStates,
    type AppearanceState,
    type AppearanceVariantState,
    type PartVisibilityState,
    appearanceVariantStates,
    partVisibilityStates
} from '../../patterns/button/tests/states';

const metadata: Meta = {
    title: 'Tests/Anchor Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <${anchorButtonTag}
        href="https://nimble.ni.dev"
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconLinkTag} slot="start"></${iconLinkTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Link ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderRightTag} slot="end"></${iconArrowExpanderRightTag}>`)}
    </${anchorButtonTag}>
`;

export const anchorButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    appearanceStates,
    appearanceVariantStates,
    [partVisibilityStatesOnlyLabel]
] as const);

const interactionStates = cartesianProduct([
    [disabledStateIsEnabled],
    appearanceStates,
    appearanceVariantStates,
    [partVisibilityStatesOnlyLabel]
] as const);

export const anchorButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
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

export const hiddenAnchorButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${anchorButtonTag} hidden
            >Hidden Anchor Button</${anchorButtonTag}
        >`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${anchorButtonTag}>Anchor Button</${anchorButtonTag}>`
    )
);
