import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { backgrounds } from '../../../.storybook/preview';
import '../index';

interface TextFieldArgs {
    label: string;
    type: string;
    value: string;
}

const metadata: Meta<TextFieldArgs> = {
    title: 'Text Field/Tests',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        }
    }
};

export default metadata;

export const textFieldThemeMatrix: Story = (): string => `${backgrounds
    .map(
        background => `
    <nimble-theme-provider theme="${background.theme}">
        <div style="background-color: ${background.value}; padding:20px;">
            <nimble-text-field placeholder='placeholder'>placeholder</nimble-text-field>
            <nimble-text-field value='Hello'>With value</nimble-text-field>
            <nimble-text-field disabled placeholder='placeholder'>Disabled with placeholder</nimble-text-field>
            <nimble-text-field disabled value='Hello'>Disabled with value</nimble-text-field>
        </div>
    </nimble-theme-provider>
`
    )
    .join('')}`;
