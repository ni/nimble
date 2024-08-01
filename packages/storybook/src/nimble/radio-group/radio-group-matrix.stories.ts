import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import { radioTag } from '../../../../nimble-components/src/radio';
import { radioGroupTag } from '../../../../nimble-components/src/radio-group';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { disabledStates, DisabledState } from '../../utilities/states';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const orientationStates = [
    ['Horizontal', Orientation.horizontal],
    ['Vertical', Orientation.vertical]
] as const;
type OrientationState = (typeof orientationStates)[number];

const metadata: Meta = {
    title: 'Tests/Radio Group',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
    [orientationName, orientation]: OrientationState
): ViewTemplate => html`<${radioGroupTag}
    orientation="${() => orientation}"
    ?disabled="${() => disabled}"
    value="1"
>
    <label slot="label">${orientationName} ${disabledName}</label>
    <${radioTag} value="1">Option 1</${radioTag}>
    <${radioTag} value="2">Option 2</${radioTag}>
</${radioGroupTag}>`;

export const radioGroupThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [disabledStates, orientationStates])
);

export const hiddenRadioGroup: StoryFn = createStory(
    hiddenWrapper(
        html`<${radioGroupTag} hidden>Hidden Radio Group</${radioGroupTag}>`
    )
);

export const hiddenRadio: StoryFn = createStory(
    hiddenWrapper(html`<${radioTag} hidden>Hidden Radio</${radioTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${radioGroupTag}>
                <label slot="label">Radio buttons</label>
                <${radioTag}>Option 1</${radioTag}>
                <${radioTag}>Option 2</${radioTag}>
            </${radioGroupTag}>
        `
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${radioGroupTag} style="border: 1px dashed; width: 200px">
                <label slot="label">With Label</label>
                <${radioTag}>Option 1</${radioTag}>
                <${radioTag}>Option 2</${radioTag}>
            </${radioGroupTag}>
            <${radioGroupTag} style="border: 1px dashed; width: 200px">
                <${radioTag}>Option 1</${radioTag}>
                <${radioTag}>Option 2</${radioTag}>
            </${radioGroupTag}>
        </div>
    `
);
