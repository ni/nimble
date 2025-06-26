import { html, repeat, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { anchorTabTag } from '@ni/nimble-components/dist/esm/anchor-tab';
import { tabsToolbarTag } from '@ni/nimble-components/dist/esm/tabs-toolbar';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { anchorTabsTag } from '@ni/nimble-components/dist/esm/anchor-tabs';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';
import { ExampleTabsType } from '../patterns/tabs/types';
import {
    defaultSlotDescription,
    endSlotDescription
} from '../patterns/tabs/doc-strings';

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
    default: boolean;
    end: boolean;
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
        title: 'Tab 1 that is too long and should probably be shorter but is not',
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
    { title: 'Short', id: '3', disabled: false, href: 'https://nimble.ni.dev' }
] as const;

const manyTabs: AnchorTabArgs[] = [];
for (let i = 1; i <= 100; i++) {
    manyTabs.push({
        title: `Tab ${i}`,
        id: `${i}`,
        disabled: false,
        href: `https://nimble.ni.dev?tabid=${i}`
    });
}

const tabSets = {
    [ExampleTabsType.simpleTabs]: simpleTabs,
    [ExampleTabsType.simpleTabsWithToolbar]: simpleTabs,
    [ExampleTabsType.wideTabs]: wideTabs,
    [ExampleTabsType.manyTabs]: manyTabs
} as const;

const metadata: Meta<AnchorTabsArgs> = {
    title: 'Components/Anchor Tabs'
};

export default metadata;

export const anchorTabs: StoryObj<AnchorTabsArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${anchorTabsTag} activeid="${x => x.activeid}">
        ${repeat(x => tabSets[x.tabsType] as AnchorTabArgs[], html<AnchorTabArgs>`
            <${anchorTabTag}
                ?disabled="${x => x.disabled}"
                id="${x => x.id}"
                href="${x => x.href}"
            >
                ${x => x.title}
            </${anchorTabTag}>
        `)}
        ${when(x => x.tabsType === ExampleTabsType.simpleTabsWithToolbar, html`
            <${tabsToolbarTag}>
                <${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}>
                <${buttonTag} appearance="ghost" slot="end">Toolbar Button 2</${buttonTag}>
                <${buttonTag} appearance="ghost" slot="end">Toolbar Button 3</${buttonTag}>
            </${tabsToolbarTag}>
        `)}
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
                    [ExampleTabsType.simpleTabsWithToolbar]:
                        'Simple tabs with toolbar',
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
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${anchorTabsTag} activeid="1" style="width: 800px;">
            <${tabsToolbarTag}>
                ${when(x => x.default, html`
                    <${buttonTag} appearance="ghost">Toolbar Button 1</${buttonTag}>
                `)}
                ${when(x => x.end, html`
                    <${buttonTag} slot="end" appearance="ghost">Toolbar Button 2</${buttonTag}>
                    <${buttonTag} slot="end" appearance="ghost">Toolbar Button 3</${buttonTag}>
                `)}
            </${tabsToolbarTag}>
            <${anchorTabTag} id="1" disabled href="https://www.google.com">Google</${anchorTabTag}>
            <${anchorTabTag} id="2" href="https://www.ni.com">NI</${anchorTabTag}>
            <${anchorTabTag} id="3" href="https://nimble.ni.dev">Nimble</${anchorTabTag}>
        </${anchorTabsTag}>
    `),
    argTypes: {
        default: {
            name: 'default',
            description: defaultSlotDescription,
            table: { category: apiCategory.slots }
        },
        end: {
            name: 'end',
            description: endSlotDescription,
            table: { category: apiCategory.slots }
        }
    },
    args: {
        default: true,
        end: true
    }
};
