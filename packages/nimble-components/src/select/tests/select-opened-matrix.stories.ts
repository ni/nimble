import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { matrixThemeWrapper } from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        }
    }
};

export default metadata;

const positionStates = [
    ['Below', 'position="below"'],
    ['Above', 'position="above"']
];
type PositionState = typeof positionStates[number];

const options = `
    <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
    <nimble-listbox-option value="2" disabled>Option 2</nimble-listbox-option>
    <nimble-listbox-option value="3">Option 3</nimble-listbox-option>`;

const component = ([_, position]: PositionState): string => `
    <nimble-select ${position} open style="margin-bottom: 120px; margin-top: 120px;">${options}</nimble-select>
`;

export const selectOpenedThemeMatrix: Story = (): string => matrixThemeWrapper(component, [positionStates]);
