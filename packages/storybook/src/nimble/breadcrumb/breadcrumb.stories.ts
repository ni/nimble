import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html, repeat } from '@ni/fast-element';
import { breadcrumbItemTag } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { breadcrumbTag } from '@ni/nimble-components/dist/esm/breadcrumb';
import { BreadcrumbAppearance } from '@ni/nimble-components/dist/esm/breadcrumb/types';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';
import { ExampleBreadcrumbItemsType } from './types';

interface BreadcrumbArgs {
    itemsType: ExampleBreadcrumbItemsType;
    appearance: keyof typeof BreadcrumbAppearance;
}

interface ItemArgs {
    href?: string;
    label: string;
}

interface BreadcrumbItemArgs extends ItemArgs {
    click: undefined;
}

const metadata: Meta<BreadcrumbArgs> = {
    title: 'Components/Breadcrumb',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['click']
        }
    }
};

const many = Array.from({ length: 100 }).map((_x, i) => ({
    label: i + 1 === 100 ? 'Current (no link)' : `Page ${i + 1}`,
    href: i + 1 === 100 ? undefined : `https://www.ni.com/?item=${i + 1}`
}));

const simple = [
    { label: 'Page 1', href: 'https://www.ni.com' },
    { label: 'Page 2', href: 'https://www.ni.com' },
    { label: 'Current (no link)', href: undefined }
] as const;

const wide = [
    {
        label: 'Page 1 that is too long and should probably be shorter but is not and sometimes you have to pick which battles to fight and which to let go of',
        href: 'https://www.ni.com'
    },
    {
        label: 'Page 2 that is also long but not too long',
        href: 'https://www.ni.com'
    },
    { label: 'Current (no link)', href: undefined }
] as const;

const breadcrumbItemSets = {
    [ExampleBreadcrumbItemsType.simple]: simple,
    [ExampleBreadcrumbItemsType.many]: many,
    [ExampleBreadcrumbItemsType.wide]: wide
} as const;

export default metadata;

const defaultHrefDescription = hrefDescription({
    componentName: 'breadcrumb item',
    includeDisable: false
});
const itemHrefDescription = `${defaultHrefDescription} If the last breadcrumb item represents the current page it should have no \`href\` set.`;

export const _standardBreadcrumb: StoryObj<BreadcrumbArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${breadcrumbTag}
            appearance="${x => BreadcrumbAppearance[x.appearance]}"

        >
            ${repeat(x => breadcrumbItemSets[x.itemsType], html<ItemArgs, BreadcrumbArgs>`
                <${breadcrumbItemTag}
                    href="${x => x.href}"
                >
                    ${x => x.label}
                </${breadcrumbItemTag}>
            `)}
        </${breadcrumbTag}>
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    name: 'Standard Breadcrumb',
    argTypes: {
        itemsType: {
            name: 'default',
            description: `The \`${breadcrumbItemTag}\` elements that populate this breadcrumb. 

With a standard breadcrumb containing multiple items, the last breadcrumb represents the current page.`,
            table: { category: apiCategory.slots },
            options: Object.values(ExampleBreadcrumbItemsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleBreadcrumbItemsType.simple]:
                        'Simple breadcrumb items',
                    [ExampleBreadcrumbItemsType.many]: 'Many breadcrumb items',
                    [ExampleBreadcrumbItemsType.wide]: 'Wide breadcrumb items'
                }
            }
        },
        appearance: {
            options: Object.keys(BreadcrumbAppearance),
            description: appearanceDescription({ componentName: 'breadcrumb' }),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        itemsType: ExampleBreadcrumbItemsType.simple,
        appearance: 'default'
    }
};

export const breadcrumbItem: StoryObj<BreadcrumbItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <${breadcrumbTag}>
            <${breadcrumbItemTag}
                href="${x => x.href}"
            >
                ${x => x.label}
            </${breadcrumbItemTag}>
        </${breadcrumbTag}>
    `),
    argTypes: {
        href: {
            description: itemHrefDescription,
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: 'The text content of the breadcrumb item.',
            type: 'string',
            table: { category: apiCategory.slots }
        },
        click: {
            description:
                'Event emitted when the user activates the breadcrumb item link, for example by clicking on it or pressing Enter while focused.',
            control: false,
            table: { category: apiCategory.events }
        }
    },
    args: {
        href: 'http://www.ni.com',
        label: 'Breadcrumb Item'
    }
};
