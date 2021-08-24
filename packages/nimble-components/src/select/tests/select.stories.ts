import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';

interface SelectArgs {
    label: string;
}

const metadata: Meta<SelectArgs> = {
    title: 'Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: ({ label }: SelectArgs): string => `
        <nimble-select
        >
            ${label}
        </nimble-select>
`,
    args: {
        label: 'Select label'
    }
};

export default metadata;

export const select: Story<SelectArgs> = {};
