import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import { standardPadding } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { radioTag } from '../../../../nimble-components/src/radio';
import { radioGroupTag } from '../../../../nimble-components/src/radio-group';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState
} from '../../utilities/states';
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
    [orientationName, orientation]: OrientationState,
    [errorName, errorVisible, errorText]: ErrorState
): ViewTemplate => html`<${radioGroupTag}
    orientation="${() => orientation}"
    ?disabled="${() => disabled}"
    ?error-visible="${() => errorVisible}"
    error-text="${() => errorText}"
    value="1"
    style="width: 250px; margin: var(${standardPadding.cssCustomProperty});"
>
    <label slot="label">${orientationName} ${disabledName} ${errorName}</label>
    <${radioTag} value="1">Option 1</${radioTag}>
    <${radioTag} value="2">Option 2</${radioTag}>
</${radioGroupTag}>`;

export const radioGroupThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [disabledStates, orientationStates, errorStates])
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
