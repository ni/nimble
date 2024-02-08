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

const metadata: Meta<TabsArgs> = {
    title: 'Components/Tabs',
    decorators: [withActions],
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
