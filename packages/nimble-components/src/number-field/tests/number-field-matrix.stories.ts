import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { matrixThemeWrapper } from '../../tests/utilities/theme-test-helpers';
import '../index';

interface NumberFieldArgs {
    label: string;
    value: number;
}

const metadata: Meta<NumberFieldArgs> = {
    title: 'Tests/Number Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        }
    }
};

export default metadata;

const matrixComponents = `
    <nimble-number-field placeholder='placeholder'>placeholder</nimble-number-field>
    <nimble-number-field value='1234'>With value</nimble-number-field>
    <nimble-number-field disabled placeholder='placeholder'>Disabled with placeholder</nimble-number-field>
    <nimble-number-field disabled value='1234'>Disabled with value</nimble-number-field>`;

export const numberFieldThemeMatrix: Story = (): string => matrixThemeWrapper(matrixComponents);
