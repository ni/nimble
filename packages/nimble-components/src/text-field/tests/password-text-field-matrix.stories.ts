import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { matrixThemeWrapper } from '../../tests/utilities/theme-test-helpers';
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

const matrixComponents = `
    <nimble-text-field type='password' placeholder='placeholder'>placeholder</nimble-text-field>
    <nimble-text-field type='password' value='Hello'>With value</nimble-text-field>
    <nimble-text-field type='password' disabled placeholder='placeholder'>Disabled with placeholder</nimble-text-field>
    <nimble-text-field type='password' disabled value='Hello'>Disabled with value</nimble-text-field>
    <nimble-text-field type='password' invalid value='Hello'>Invalid</nimble-text-field>`;

export const passwordTextFieldThemeMatrix: Story = (): string => matrixThemeWrapper(matrixComponents);
