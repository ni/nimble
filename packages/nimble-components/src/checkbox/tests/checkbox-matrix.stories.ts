import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    matrixThemeWrapper,
    disabledStates,
    DisabledState
} from '../../tests/utilities/theme-test-helpers';
import '../index';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Tests/Checkbox',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        }
    }
};

export default metadata;

const checkedStates = [
    ['Checked', 'checked'],
    ['Unchecked', '']
];
type CheckedState = typeof checkedStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [checkedName, checked]: CheckedState
): string => `
    <nimble-checkbox ${checked} ${disabled}>
        ${checkedName} ${disabledName}
    </nimble-checkbox>`;

export const checkboxThemeMatrix: Story = (): string => matrixThemeWrapper(component, [disabledStates, checkedStates]);
