import { html, repeat, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { anchorTabTag } from '../../../../nimble-components/src/anchor-tab';
import { tabsToolbarTag } from '../../../../nimble-components/src/tabs-toolbar';
import { buttonTag } from '../../../../nimble-components/src/button';
import { anchorTabsTag } from '../../../../nimble-components/src/anchor-tabs';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';
import { ExampleTabsType } from '../patterns/tabs/types';

interface AnchorTabsArgs {
    activeid: string;
    content: undefined;
    tabsType: ExampleTabsType;
}

interface AnchorTabArgs {
    href: string;
    disabled: boolean;
    id: string;
    title: string;
}

interface ToolbarArgs {
    toolbar: boolean;
}

const simpleTabs = [
    {
        title: 'Google',
        id: '1',
        disabled: true,
        href: 'https://www.google.com'
    },
    { title: 'NI', id: '2', disabled: false, href: 'https://www.ni.com' },
    { title: 'Nimble', id: '3', disabled: false, href: 'https://nimble.ni.dev' }
] as const;

const wideTabs = [
    {
        title: 'Tab 1 that is too long to fit in the drop down width',
        id: '1',
        disabled: false,
        href: 'https://nimble.ni.dev'
    },
    {
        title: 'Tab 2 that is also too long but disabled',
        id: '2',
        disabled: true,
        href: 'https://nimble.ni.dev'
    },
    { title: 'Short', id: '2', disabled: false, href: 'https://nimble.ni.dev' }
] as const;

const manyTabs: AnchorTabArgs[] = [];
for (let i = 0; i < 100; i++) {
    manyTabs.push({
        title: `Tab ${i}`,
        id: `${i}`,
        disabled: false,
        href: `https://nimble.ni.dev?tabid=${i}`
    });
}

const tabSets = {
    [ExampleTabsType.simpleTabs]: simpleTabs,
    [ExampleTabsType.wideTabs]: wideTabs,
    [ExampleTabsType.manyTabs]: manyTabs
} as const;

const metadata: Meta<AnchorTabsArgs> = {
    title: 'Components/Anchor Tabs'
};

export default metadata;

export const anchorTabs: StoryObj<AnchorTabsArgs> = {
    render: createUserSelectedThemeStory(html`
    <${anchorTabsTag} activeid="${x => x.activeid}">
        ${repeat(
        x => tabSets[x.tabsType] as AnchorTabArgs[],
        html<AnchorTabArgs>`
            <${anchorTabTag}
                ?disabled="${x => x.disabled}"
                id="${x => x.id}"
                href="${x => x.href}"
            >
                ${x => x.title}
            </${anchorTabTag}>
        `
    )}
    </${anchorTabsTag}>
    `),
    argTypes: {
        activeid: {
            options: ['None', '1', '2', '3'],
            control: { type: 'radio' },
            description: `The \`id\` of the \`${anchorTabTag}\` that should be indicated as currently active/selected. It is the application's responsibility to set \`activeid\` to the tab matching the currently loaded URL.`,
            table: { category: apiCategory.attributes }
        },
        tabsType: {
            name: 'default',
            description:
                'Add tabs or a toolbar by slotting them as child content in the default slot.',
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
        }
    },
    args: {
        activeid: 'None',
        tabsType: ExampleTabsType.simpleTabs
    }
};

export const anchorTab: StoryObj<AnchorTabArgs> = {
    render: createUserSelectedThemeStory(html`
        <${anchorTabsTag} activeid="1">
            <${anchorTabTag} id="1" ?disabled="${x => x.disabled}" href="${x => x.href}">${x => x.title}</${anchorTabTag}>
            <${anchorTabTag} id="2" href="https://www.ni.com">NI</${anchorTabTag}>
            <${anchorTabTag} id="3" href="https://nimble.ni.dev">Nimble</${anchorTabTag}>
        </${anchorTabsTag}>
    `),
    argTypes: {
        href: {
            description: hrefDescription({
                componentName: 'anchor tab',
                includeDisable: false
            }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'anchor tab' }),
            table: { category: apiCategory.attributes }
        },
        id: {
            description: `Set the \`id\` attribute on each tab and use the value to set the \`activeid\` attribute on the \`${anchorTabsTag}\` element to indicate the currently selected tab.`,
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
        href: 'https://www.google.com',
        disabled: false,
        title: 'Google'
    }
};

export const tabsToolbar: StoryObj<ToolbarArgs> = {
    render: createUserSelectedThemeStory(html`
        <${anchorTabsTag} activeid="1">
            ${when(x => x.toolbar, html<ToolbarArgs>`<${tabsToolbarTag}><${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}></${tabsToolbarTag}>`)}
            <${anchorTabTag} id="1" disabled href="https://www.google.com">Google</${anchorTabTag}>
            <${anchorTabTag} id="2" href="https://www.ni.com">NI</${anchorTabTag}>
            <${anchorTabTag} id="3" href="https://nimble.ni.dev">Nimble</${anchorTabTag}>
        </${anchorTabsTag}>
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
