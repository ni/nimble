import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { accordionTag } from '@ni/nimble-components/dist/esm/accordion';
import { accordionItemTag } from '@ni/nimble-components/dist/esm/accordion/item';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { hiddenWrapper } from '../../utilities/hidden';
import { type DisabledState, disabledStates } from '../../utilities/states';

const expandModeStates = [
    ['Multiple', 'multiple'],
    ['Single', 'single']
] as const;
type ExpandModeState = (typeof expandModeStates)[number];

const appearanceStates = [
    ['Ghost', 'ghost'],
    ['Outline', 'outline'],
    ['Block', 'block']
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const metadata: Meta = {
    title: 'Tests/Accordion',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [expandLabel, expandMode]: ExpandModeState,
    [appearanceLabel, appearance]: AppearanceState,
    [disabledLabel, disabled]: DisabledState
): ViewTemplate => html`
    <${accordionTag}
        expand-mode="${() => expandMode}"
        appearance="${() => appearance}"
        style="max-width: 560px; display:block;"
    >
        <${accordionItemTag} ${() => (disabled ? 'disabled' : '')}>
            ${() => `${disabledLabel} Item (${expandLabel}, ${appearanceLabel})`}
        </${accordionItemTag}>
        <${accordionItemTag}>Second</${accordionItemTag}>
    </${accordionTag}>
`;
export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        expandModeStates,
        appearanceStates,
        disabledStates
    ])
);

const interactionStates = cartesianProduct([
    expandModeStates,
    appearanceStates,
    disabledStates
] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: [],
        focus: interactionStates
    })
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${accordionTag} hidden>
            <${accordionItemTag}>Hidden item</${accordionItemTag}>
        </${accordionTag}>`
    )
);
