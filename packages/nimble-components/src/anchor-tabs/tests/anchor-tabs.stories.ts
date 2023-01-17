import { html, ref, repeat, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import type { AnchorTabs } from '..';

interface TabsArgs {
    tabs: TabArgs[];
    activeId: string;
    toolbar: string;
    tabsRef: AnchorTabs;
    onTabClick: (tabs: AnchorTabs, tabId: string) => boolean;
    onTabKeypress: (tabs: AnchorTabs, tabId: string, event: Event) => boolean;
}

interface TabArgs {
    label: string;
    id: string;
    href: string;
    disabled: boolean;
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
        <nimble-anchor-tabs ${ref('tabsRef')} activeid="icons">
            ${when(x => x.toolbar, html<TabsArgs>`<nimble-tabs-toolbar :innerHTML="${x => x.toolbar}"></nimble-tabs-toolbar>`)}
            ${repeat(x => x.tabs, html<TabArgs, TabsArgs>`
                <nimble-anchor-tab
                    id="${x => x.id}"
                    ?disabled="${x => x.disabled}"
                    href="${x => x.href}"
                    target="iframe"
                    @click="${(x, c) => c.parent.onTabClick(c.parent.tabsRef, x.id)}"
                    @keypress="${(x, c) => c.parent.onTabKeypress(c.parent.tabsRef, x.id, c.event)}"
                >${x => x.label}</nimble-anchor-tab>
            `)}
        </nimble-anchor-tabs>
        <iframe name="iframe" src="${x => x.tabs[0]!.href}"></iframe>
        <style class="code-hide">
            nimble-anchor-tabs {
                padding-bottom: 3px;
            }
            iframe {
                width: 100%;
                height: 1000px;
            }
        </style>
    `),
    argTypes: {
        activeId: {
            description:
                "The `id` of the `nimble-anchor-tab` that should be indicated as currently active/selected. It is the application's responsibility to set `activeId` to the tab matching the currently loaded URL."
        },
        onTabClick: {
            table: {
                disable: true
            }
        },
        onTabKeypress: {
            table: {
                disable: true
            }
        }
    },
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
        onTabClick: (tabs: AnchorTabs, tabId: string) => {
            tabs.activeid = tabId;
            return true;
        },
        onTabKeypress: (tabs: AnchorTabs, tabId: string, event: Event) => {
            switch ((event as KeyboardEvent).key) {
                case 'Space':
                case 'Enter':
                    tabs.activeid = tabId;
                    break;
                default:
            }
            return true;
        }
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
