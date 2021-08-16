import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { backgrounds } from '../../../.storybook/preview';
import '../index';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox/Tests',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        }
    }
};

export default metadata;

export const checkboxThemeMatrix: Story = (): string => `${backgrounds
    .map(
        background => `
    <nimble-theme-provider theme="${background.theme}">
        <div style="background-color: ${background.value}; padding:20px;">
            <nimble-checkbox checked>Checked</nimble-checkbox>
            <nimble-checkbox>Unchecked</nimble-checkbox>
            <nimble-checkbox disabled checked>Checked</nimble-checkbox>
            <nimble-checkbox disabled>Unchecked</nimble-checkbox>
        </div>
    </nimble-theme-provider>
`
    )
    .join('')}`;
