import { html, repeat, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TabsArgs {
    tabs: TabArgs[];
    activeId: string;
    toolbar: string;
}

interface TabArgs {
    label: string;
    id: string;
    href: string;
    disabled: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#tabpanel) - Tabs are a set of layered
sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an
associated tab element, that when activated, displays the panel. The list of tab elements is arranged along
one edge of the currently displayed panel, most commonly the top edge.`;

const metadata: Meta<TabsArgs> = {
    title: 'Anchor Tabs',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-anchor-tabs activeid="${x => x.activeId}">
            ${when(x => x.toolbar, html<TabsArgs>`<nimble-tabs-toolbar :innerHTML="${x => x.toolbar}"></nimble-tabs-toolbar>`)}
            ${repeat(x => x.tabs, html<TabArgs>`
                <nimble-anchor-tab id="${x => x.id}" ?disabled="${x => x.disabled}" href="${x => x.href}" target="iframe">${x => x.label}</nimble-anchor-tab>
            `)}
        </nimble-anchor-tabs>
        <iframe name="iframe" src="${x => x.tabs[0]!.href}" style="width: 100%; height: 1000px;"></iframe>
    `),
    args: {
        tabs: [
            {
                label: 'Icons',
                id: 'icons',
                href: '/?path=/story/icons--icons',
                disabled: false
            },
            {
                label: 'Spinner',
                id: 'spinner',
                href: '/?path=/story/spinner--spinner',
                disabled: false
            },
            {
                label: 'Text Field',
                id: 'text-field',
                href: '/?path=/story/text-field--underline-text-field',
                disabled: false
            }
        ],
        activeId: 'icons'
    }
};

export default metadata;

export const tabs: StoryObj<TabsArgs> = {};

export const toolbar: StoryObj<TabsArgs> = {
    args: {
        toolbar:
            '<nimble-button appearance="ghost">Toolbar Button</nimble-button>'
    }
};
