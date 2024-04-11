import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { anchorTag } from '..';
import {
    disabledStates,
    type DisabledState,
    disabledStateIsEnabled
} from '../../utilities/tests/states';

const appearanceStates = [
    ['Default', AnchorAppearance.default],
    ['Prominent', AnchorAppearance.prominent]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const underlineHiddenStates = [
    ['', false],
    ['Underline Hidden', true]
] as const;
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

const metadata: Meta = {
    title: 'Tests/Anchor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${anchorTag}
        href=${() => (disabled ? undefined : 'https://nimble.ni.dev')}
        ?underline-hidden="${() => underlineHidden}"
        appearance="${() => appearance}"
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${underlineHiddenName} ${appearanceName} ${disabledName} Link`}</${anchorTag}>
`;

export const anchorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        underlineHiddenStates,
        appearanceStates
    ])
);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    underlineHiddenStates,
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [disabledStateIsEnabled],
    underlineHiddenStates,
    appearanceStates
] as const);

export const anchorInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hiddenAnchor: StoryFn = createStory(
    hiddenWrapper(html`<${anchorTag} hidden>Hidden Anchor</${anchorTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${anchorTag}>Link</${anchorTag}>`)
);

export const textWrapping: StoryFn = createStory(
    // prettier-ignore
    html`
    <p style="width: 300px; border: 1px solid black">
        <style>
            * {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        Lorem ipsum dolor sit amet, <${anchorTag} href='#'>
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</${anchorTag}> ut aliquip ex ea commodo consequat.
    </p>
    `
);

export const inlineSpacing: StoryFn = createStory(
    html`<style>
        .inline-link {
            font: var(${bodyFont.cssCustomProperty});
        }
    </style>
    <span class="inline-link">ABC<${anchorTag} href='#'>DEF</${anchorTag}>GHI</span>`
);
