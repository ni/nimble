import { html, repeat, when } from '@microsoft/fast-element';
import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../../button';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../index';

interface TabsArgs {
    tabs: TabArgs[];
    toolbar: string;
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
    // prettier-ignore
    render: createRenderer(html`
        <nimble-tabs>
            ${when(x => x.toolbar, html<TabsArgs>`<nimble-tabs-toolbar :innerHTML="${x => x.toolbar}"></nimble-tabs-toolbar>`)}
            ${repeat(x => x.tabs, html<TabArgs>`
                <nimble-tab ?disabled="${x => x.disabled}">${x => x.label}</nimble-tab>
            `)}
            ${repeat(x => x.tabs, html<TabArgs>`
                <nimble-tab-panel>${x => x.content}</nimble-tab-panel>
            `)}
        </nimble-tabs>
    `),
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

export const toolbar: Story<TabsArgs> = {
    args: {
        toolbar:
            '<nimble-button appearance="ghost">Toolbar Button</nimble-button>'
    }
};
