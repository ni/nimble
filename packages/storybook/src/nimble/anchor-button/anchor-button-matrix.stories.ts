import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { iconLinkTag } from '../../../../nimble-components/src/icons/link';
import { iconArrowExpanderRightTag } from '../../../../nimble-components/src/icons/arrow-expander-right';
import { anchorButtonTag } from '../../../../nimble-components/src/anchor-button';
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
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
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
