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
type OrientationState = readonly [string, 'horizontal' | 'vertical'];

const states: SliderState[] = [
    ['Enabled', false, false],
    ['Readonly', false, true],
    ['Disabled', true, false]
];

const orientationStates: OrientationState[] = [
    ['Horizontal', 'horizontal'],
    ['Vertical', 'vertical']
];

const sliderSize = '200px';

const interactionStates = cartesianProduct([orientationStates, states] as const);

const getSliderStyle = (orientation: OrientationState[1]): string => (
    orientation === 'horizontal' ? `width: ${sliderSize};` : `height: ${sliderSize};`
);

const component = (
    [orientationName, orientation]: OrientationState,
    [stateName, disabled, readOnly]: SliderState
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 8px; margin: 8px;">
        <span>${() => `${orientationName} ${stateName}`}</span>
        <${sliderTag}
            style="${() => getSliderStyle(orientation)}"
            value="40"
            orientation="${() => orientation}"
            ?disabled="${() => disabled}"
            ?readonly="${() => readOnly}"
            value-visible
        ></${sliderTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [orientationStates, states])
);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);
