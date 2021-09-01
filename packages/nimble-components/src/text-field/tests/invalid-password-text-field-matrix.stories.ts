import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    DisabledState,
    disabledStates,
    matrixThemeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';

interface TextFieldArgs {
    label: string;
    type: string;
    value: string;
}

const metadata: Meta<TextFieldArgs> = {
    title: 'Tests/Text Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        }
    }
};

export default metadata;

const valueStates = [
    ['Placeholder', 'placeholder="placeholder"'],
    ['Value', 'value="Hello"']
];
type ValueState = typeof valueStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [valueName, value]: ValueState
): string => `
    <nimble-text-field invalid type='password' ${value} ${disabled}>
        ${valueName} ${disabledName}
    </nimble-text-field>`;

export const passwordTextFieldThemeMatrixInvalid: Story = (): string => matrixThemeWrapper(component, [disabledStates, valueStates]);
