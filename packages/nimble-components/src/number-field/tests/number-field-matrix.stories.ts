import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState,
    HiddenState,
    hiddenStates
} from '../../utilities/tests/matrix';
import '../index';

const metadata: Meta = {
    title: 'Tests/Number Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;
const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', '1234', null]
];
type ValueState = typeof valueStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [valueName, valueValue, placeholderValue]: ValueState,
    hidden: HiddenState
): ViewTemplate => html`
    <nimble-number-field
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?disabled="${() => disabled}"
        ?hidden="${() => hidden}"
    >
        ${() => valueName} ${() => disabledName}
    </nimble-number-field>
`;

export const numberFieldThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [disabledStates, valueStates, hiddenStates]))
);
