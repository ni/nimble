import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    matrixThemeWrapper,
    disabledStates,
    DisabledState
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/4ec38f56-6100-411f-8993-fde767635c44/'
        }
    }
};

export default metadata;

const options = `
    <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
    <nimble-listbox-option value="2" disabled>Option 2</nimble-listbox-option>
    <nimble-listbox-option value="3">Option 3</nimble-listbox-option>`;

const component = ([_, disabled]: DisabledState): string => `
    <nimble-select ${disabled}>${options}</nimble-select>
`;

export const selectThemeMatrix: Story = (): string => matrixThemeWrapper(component, [disabledStates]);
