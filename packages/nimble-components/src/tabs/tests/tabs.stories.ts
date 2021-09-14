import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';

interface TabsArgs {
    tabs: TabArgs[];
}

interface TabArgs {
    label: string;
    content: string;
    disabled: boolean;
}

const metadata: Meta<TabsArgs> = {
    title: 'Tabs',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
    },
    render: ({ tabs }): string => `
        <nimble-tabs>
            ${tabs
        .map(
            tab => `<nimble-tab ${tab.disabled ? 'disabled' : ''}>${
                tab.label
            }</nimble-tab>`
        )
        .join('')}
            ${tabs
        .map(
            tab => `<nimble-tab-panel>${tab.content}</nimble-tab-panel>`
        )
        .join('')}
        </nimble-tabs>
    `,
    args: {
        tabs: [
            {
                label: 'Tab One',
                content: 'Content of the first tab',
                disabled: false
            },
            {
                label: 'Tab Two',
                content: 'Content of the second tab',
                disabled: false
            },
            {
                label: 'Tab Three',
                content: 'Content of the third tab',
                disabled: false
            }
        ]
    }
};

export default metadata;

export const tabs: Story<TabsArgs> = {};

export const disabled: Story<TabsArgs> = {
    args: {
        tabs: [
            {
                label: 'Tab One',
                content: 'Content of the first tab',
                disabled: false
            },
            {
                label: 'Disabled Tab',
                content: 'Content of the disabled tab',
                disabled: true
            },
            {
                label: 'Tab Three',
                content: 'Content of the third tab',
                disabled: false
            }
        ]
    }
};
