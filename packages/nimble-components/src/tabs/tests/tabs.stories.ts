import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';

const metadata: Meta = {
    title: 'Tabs',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
    },
    render: (): string => `
        <nimble-tabs>
            <nimble-tab>Tab One</nimble-tab>
            <nimble-tab>Tab Two</nimble-tab>
            <nimble-tab>Tab Three</nimble-tab>
            <nimble-tab-panel>Content of the first tab</nimble-tab-panel>
            <nimble-tab-panel>Content of the second tab</nimble-tab-panel>
            <nimble-tab-panel>Content of the third tab</nimble-tab-panel>
        </nimble-tabs>
    `
};

export default metadata;

export const tabs: Story = {};
