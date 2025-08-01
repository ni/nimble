import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
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
import { textCustomizationWrapper } from '../../utilities/text-customization';

const metadata: Meta = {
    title: 'Tests/Button',
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
    <${buttonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${buttonTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

const interactionStates = cartesianProduct([
    [disabledStateIsEnabled],
    appearanceStates,
    appearanceVariantStates,
    [partVisibilityStatesOnlyLabel]
] as const);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    appearanceStates,
    appearanceVariantStates,
    [partVisibilityStatesOnlyLabel]
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
    hiddenWrapper(html`<${buttonTag} hidden>Hidden Button</${buttonTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${buttonTag}>Button</${buttonTag}>`)
);

// The baseline of the elements should be aligned when positioned inline.
export const inlineAlignment: StoryFn = createStory(
    html`<span style="font: var(${bodyFont.cssCustomProperty});">
        <span style="text-decoration: underline;">Text</span>
        <${buttonTag}>
            <span style="text-decoration: underline;">Button</span>
        </${buttonTag}>
        <span style="text-decoration: underline;">Text</span>
        <${buttonTag}>
            <${iconKeyTag} slot="start"></${iconKeyTag}>
            <span style="text-decoration: underline;">Button</span>
        </${buttonTag}>
        <div
            style="display:inline-block; width:50px; height:50px; border: 1px black solid;"
        ></div>
    </span>`
);
