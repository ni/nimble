import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TabsArgs {
    activeId: string;
    toolbar: boolean;
    tabHref: string;
    tabDisabled: boolean;
}

const overviewText = `Anchor tabs are a sequence of links that are styled to look like tab elements, where one link can
be distinguished as the currently active item. Use this component instead of the standard tabs component when each tab
represents a different URL to navigate to. Use the standard tabs component when the tabs should switch between different
tab panels hosted on the same page.`;

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
            ${when(x => x.toolbar, html<TabsArgs>`<nimble-tabs-toolbar><nimble-button appearance="ghost">Toolbar Button</nimble-button></nimble-tabs-toolbar>`)}
            <nimble-anchor-tab id="1" ?disabled="${x => x.tabDisabled}" href="${x => x.tabHref}">Google</nimble-anchor-tab>
            <nimble-anchor-tab id="2" href="https://www.ni.com">NI</nimble-anchor-tab>
            <nimble-anchor-tab id="3" href="https://nimble.ni.dev">Nimble</nimble-anchor-tab>
        </nimble-anchor-tabs>
    `),
    argTypes: {
        activeId: {
            options: ['None', '1', '2', '3'],
            control: { type: 'radio' },
            description:
                "The `id` of the `nimble-anchor-tab` that should be indicated as currently active/selected. It is the application's responsibility to set `activeId` to the tab matching the currently loaded URL."
        },
        tabHref: {
            name: 'tab 1 href'
        },
        tabDisabled: {
            name: 'tab 1 disabled'
        }
    },
    args: {
        activeId: 'None',
        toolbar: false,
        tabHref: 'https://www.google.com',
        tabDisabled: false
    }
};

export default metadata;

export const anchorTabs: StoryObj<TabsArgs> = {};
