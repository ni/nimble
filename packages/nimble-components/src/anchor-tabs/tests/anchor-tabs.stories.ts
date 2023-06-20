import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { anchorTabsTag } from '..';
import { anchorTabTag } from '../../anchor-tab';
import { tabsToolbarTag } from '../../tabs-toolbar';
import { buttonTag } from '../../button';

interface TabsArgs {
    activeId: string;
    toolbar: boolean;
    tabHref: string;
    tabDisabled: boolean;
}

const overviewText = `Anchor tabs are a sequence of links that are styled to look like tab elements, where one link can
be distinguished as the currently active item. Use this component instead of the standard tabs component when each tab
represents a different URL to navigate to. Use the standard tabs component when the tabs should switch between different
tab panels hosted on the same page.

In an Angular application, it is common to integrate with the router by setting \`nimbleRouterLink\` (rather than \`href\`)
on each \`nimble-anchor-tab\` element. In those cases, it is recommended to also set \`replaceUrl="true"\` so that switching
between tabs does not add to the browser history.`;

const metadata: Meta<TabsArgs> = {
    title: 'Components/Anchor Tabs',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${anchorTabsTag} activeid="${x => x.activeId}">
            ${when(x => x.toolbar, html<TabsArgs>`<${tabsToolbarTag}><${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}></${tabsToolbarTag}>`)}
            <${anchorTabTag} id="1" ?disabled="${x => x.tabDisabled}" href="${x => x.tabHref}">Google</${anchorTabTag}>
            <${anchorTabTag} id="2" href="https://www.ni.com">NI</${anchorTabTag}>
            <${anchorTabTag} id="3" href="https://nimble.ni.dev">Nimble</${anchorTabTag}>
        </${anchorTabsTag}>
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
