import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { tabsTag } from '..';
import { buttonTag } from '../../button';
import { tabTag } from '../../tab';
import { tabPanelTag } from '../../tab-panel';
import { tabsToolbarTag } from '../../tabs-toolbar';

interface TabsArgs {
    activeId: string;
    toolbar: boolean;
    tabDisabled: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#tabpanel) - Tabs are a set of layered
sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an
associated tab element, that when activated, displays the panel. The list of tab elements is arranged along
one edge of the currently displayed panel, most commonly the top edge.

Content in tab panels should be sized and arranged such that it fits horizontally within the panel to avoid
horizontal scrolling. Content may be any height; the tab panel will display a vertical scrollbar if necessary.

If you want a sequence of tabs that navigate to different URLs, use the Anchor Tabs component instead.`;

const metadata: Meta<TabsArgs> = {
    title: 'Tabs',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${tabsTag} activeid="${x => x.activeId}">
            ${when(x => x.toolbar, html<TabsArgs>`<${tabsToolbarTag}><${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}></${tabsToolbarTag}>`)}
            <${tabTag} id="1" ?disabled="${x => x.tabDisabled}">Tab One</${tabTag}>
            <${tabTag} id="2">Tab Two</${tabTag}>
            <${tabTag} id="3">Tab Three</${tabTag}>
            <${tabPanelTag}>Content of the first tab</${tabPanelTag}>
            <${tabPanelTag}>Content of the second tab</${tabPanelTag}>
            <${tabPanelTag}>Content of the third tab</${tabPanelTag}>
        </${tabsTag}>
    `),
    argTypes: {
        activeId: {
            options: ['1', '2', '3'],
            control: { type: 'radio' }
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
