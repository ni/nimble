import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TabsArgs {
    activeId: string;
    toolbar: boolean;
    tabDisabled: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#tabpanel) - Tabs are a set of layered
sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an
associated tab element, that when activated, displays the panel. The list of tab elements is arranged along
one edge of the currently displayed panel, most commonly the top edge.

If you want a sequence of tabs that navigate to different URLs, use the Anchor Tabs component instead.`;

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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-tabs activeid="${x => x.activeId}">
            ${when(x => x.toolbar, html<TabsArgs>`<nimble-tabs-toolbar><nimble-button appearance="ghost">Toolbar Button</nimble-button></nimble-tabs-toolbar>`)}
            <nimble-tab id="1" ?disabled="${x => x.tabDisabled}">Tab One</nimble-tab>
            <nimble-tab id="2">Tab Two</nimble-tab>
            <nimble-tab id="3">Tab Three</nimble-tab>
            <nimble-tab-panel>Content of the first tab</nimble-tab-panel>
            <nimble-tab-panel>Content of the second tab</nimble-tab-panel>
            <nimble-tab-panel>Content of the third tab</nimble-tab-panel>
        </nimble-tabs>
    `),
    argTypes: {
        activeId: {
            options: ['1', '2', '3'],
            control: { type: 'radio' },
        },
        tabDisabled: {
            name: 'tab 1 disabled'
        }
    },
    args: {
        activeId: '1',
        toolbar: false,
        tabDisabled: false
    }
};

export default metadata;

export const tabs: StoryObj<TabsArgs> = {};
