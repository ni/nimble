import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { tabTag } from '@ni/nimble-components/dist/esm/tab';
import { tabPanelTag } from '@ni/nimble-components/dist/esm/tab-panel';
import { tabsToolbarTag } from '@ni/nimble-components/dist/esm/tabs-toolbar';
import { tabsTag } from '@ni/nimble-components/dist/esm/tabs';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface TabsArgs {
    activeId: string;
    toolbar: boolean;
    tabDisabled: boolean;
}

const metadata: Meta<TabsArgs> = {
    title: 'Components/Tabs',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
