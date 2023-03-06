import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { radioGroupTag } from '..';
import { radioTag } from '../../radio';

const metadata: Meta = {
    title: 'Tests/Radio Group',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        }
    }
};

export default metadata;

const orientationStates = [
    ['Horizontal', Orientation.horizontal],
    ['Vertical', Orientation.vertical]
] as const;
type OrientationState = (typeof orientationStates)[number];

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

export const radioGroupThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, orientationStates])
);

export const hiddenRadioGroup: Story = createStory(
    hiddenWrapper(
        html`<${radioGroupTag} hidden>Hidden Radio Group</${radioGroupTag}>`
    )
);

export const hiddenRadio: Story = createStory(
    hiddenWrapper(html`<${radioTag} hidden>Hidden Radio</${radioTag}>`)
);

export const textCustomized: Story = createMatrixThemeStory(
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

export const heightTest: Story = createStory(
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
