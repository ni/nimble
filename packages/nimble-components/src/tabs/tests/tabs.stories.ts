import { html, repeat, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '../index';
import '../../tab';
import '../../tab-panel';
import '../../tabs-toolbar';
import '../../button';

interface TabsArgs {
    tabs: TabArgs[];
    toolbar: string;
}

interface TabArgs {
    label: string;
    content: string;
    disabled: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#tabpanel) - Tabs are a set of layered 
sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an 
associated tab element, that when activated, displays the panel. The list of tab elements is arranged along 
one edge of the currently displayed panel, most commonly the top edge.`;

const metadata: Meta<TabsArgs> = {
    title: 'Tabs',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
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

export const tabs: StoryObj = {};

export const toolbar: StoryObj = {
    args: {
        toolbar:
            '<nimble-button appearance="ghost">Toolbar Button</nimble-button>'
    }
};
