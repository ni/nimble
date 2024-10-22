import { html, repeat, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '../../../../nimble-components/src/button';
import { tabTag } from '../../../../nimble-components/src/tab';
import { tabPanelTag } from '../../../../nimble-components/src/tab-panel';
import { tabsToolbarTag } from '../../../../nimble-components/src/tabs-toolbar';
import { tabsTag } from '../../../../nimble-components/src/tabs';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';
import { ExampleTabsType } from '../patterns/tabs/types';

interface TabsArgs {
    activeid: string;
    content: undefined;
    change: undefined;
    tabsType: ExampleTabsType;
}

interface TabArgs {
    disabled: boolean;
    id: string;
    title: string;
}

interface TabPanelArgs {
    content: string;
}

interface ToolbarArgs {
    toolbar: boolean;
}

const metadata: Meta<TabsArgs> = {
    title: 'Components/Tabs',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    }
};

const simpleTabs = [
    { title: 'Tab 1', id: '1', disabled: false },
    { title: 'Tab 2', id: '2', disabled: true },
    { title: 'Tab 3', id: '3', disabled: false }
] as const;

const wideTabs = [
    {
        title: 'Tab 1 that is too long to fit in the drop down width',
        id: '1',
        disabled: false
    },
    {
        title: 'Tab 2 that is also too long but disabled',
        id: '2',
        disabled: true
    },
    { title: 'Short', id: '3', disabled: false }
] as const;

const manyTabs: TabArgs[] = [];
for (let i = 0; i < 100; i++) {
    manyTabs.push({
        title: `Tab ${i}`,
        id: `${i}`,
        disabled: false
    });
}

const tabSets = {
    [ExampleTabsType.simpleTabs]: simpleTabs,
    [ExampleTabsType.wideTabs]: wideTabs,
    [ExampleTabsType.manyTabs]: manyTabs
} as const;

export default metadata;

export const tabs: StoryObj<TabsArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${tabsTag} activeid="${x => x.activeid}">
        ${repeat(x => (tabSets[x.tabsType] as TabArgs[]), html<TabArgs>`
            <${tabTag}
                ?disabled="${x => x.disabled}"
                id="${x => x.id}"
            >
                ${x => x.title}
            </${tabTag}>
        `)}
        ${repeat(x => (tabSets[x.tabsType] as TabArgs[]), html<TabArgs>`
            <${tabPanelTag}>Content of tab ${x => x.id}</${tabPanelTag}>
        `, { positioning: true })}
        </${tabsTag}>
    `),
    argTypes: {
        activeid: {
            options: ['1', '2', '3'],
            control: { type: 'radio' },
            description: `The \`id\` of the \`${tabTag}\` that should be indicated as currently active/selected.`,
            table: { category: apiCategory.attributes }
        },
        tabsType: {
            name: 'default',
            description:
                'Add tabs, tab panels, or a toolbar by slotting them as child content in the default slot.',
            options: Object.values(ExampleTabsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleTabsType.simpleTabs]: 'Simple tabs',
                    [ExampleTabsType.manyTabs]: 'Many tabs',
                    [ExampleTabsType.wideTabs]: 'Wide tabs'
                }
            },
            table: { category: apiCategory.slots }
        },
        change: {
            description: 'Event emitted when the active tab is changed',
            control: false,
            table: { category: apiCategory.events }
        }
    },
    args: {
        activeid: '1',
        tabsType: ExampleTabsType.simpleTabs
    }
};

export const tab: StoryObj<TabArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${tabsTag}>
            <${tabTag} id="1" ?disabled="${x => x.disabled}">Tab One</${tabTag}>
            <${tabTag} id="2">${x => x.title}</${tabTag}>
            <${tabPanelTag}>Content of the first tab</${tabPanelTag}>
            <${tabPanelTag}>Content of the second tab</${tabPanelTag}>
        </${tabsTag}>
    `),
    argTypes: {
        disabled: {
            description: disabledDescription({ componentName: 'tab' }),
            table: { category: apiCategory.attributes }
        },
        id: {
            description: `Optionally set the \`id\` attribute on each tab and use the value to set the \`activeid\` attribute on the \`${tabsTag}\` element to indicate the currently selected tab. Nimble will automatically generate sequential ids if not provided.`,
            control: false,
            table: { category: apiCategory.attributes }
        },
        title: {
            name: 'default',
            description:
                'Set the name of each tab by providing text content in its default slot.',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        disabled: true,
        title: 'Tab Two'
    }
};

export const tabPanel: StoryObj<TabPanelArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${tabsTag}>
            <${tabTag}>Tab One</${tabTag}>
            <${tabTag}>Tab Two</${tabTag}>
            <${tabPanelTag}>${x => x.content}</${tabPanelTag}>
            <${tabPanelTag}>Content of the second tab</${tabPanelTag}>
        </${tabsTag}>
    `),
    argTypes: {
        content: {
            description:
                'Populate the content of each tab panel by slotting arbitrary HTML into its default slot.',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        content: 'Content of the first tab'
    }
};

export const tabToolbar: StoryObj<ToolbarArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${tabsTag}>
            ${when(x => x.toolbar, html<TabsArgs>`<${tabsToolbarTag}><${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}></${tabsToolbarTag}>`)}
            <${tabTag}>Tab One</${tabTag}>
            <${tabTag}>Tab Two</${tabTag}>
            <${tabPanelTag}>Content of the first tab</${tabPanelTag}>
            <${tabPanelTag}>Content of the second tab</${tabPanelTag}>
        </${tabsTag}>
    `),
    argTypes: {
        toolbar: {
            name: 'default',
            description: `Add a tabs toolbar as a child of the tabs and populate its content with \`${buttonTag}\` elements.`,
            table: { category: apiCategory.slots }
        }
    },
    args: {
        toolbar: true
    }
};
