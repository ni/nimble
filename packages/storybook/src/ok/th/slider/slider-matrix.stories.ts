import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { sliderTag } from '@ni/ok-components/dist/esm/th/slider';
import {
    cartesianProduct,
    createMatrix,
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Th Slider',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

type SliderState = readonly [string, boolean, boolean];

const states: SliderState[] = [
    ['Enabled', false, false],
    ['Readonly', false, true],
    ['Disabled', true, false]
];

const interactionStates = cartesianProduct([states] as const);

const component = ([name, disabled, readOnly]: SliderState): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 8px; margin: 8px;">
        <span>${() => name}</span>
        <${sliderTag}
            style="width: 200px;"
            value="40"
            ?disabled="${() => disabled}"
            ?readonly="${() => readOnly}"
            value-visible
        ></${sliderTag}>
    </div>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [states])
);

export const orientationsThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: flex; gap: 32px; align-items: flex-start; padding: 16px;">
        <${sliderTag} value="40" value-visible></${sliderTag}>
        <${sliderTag} value="40" orientation="vertical" value-visible></${sliderTag}>
    </div>
`);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);
