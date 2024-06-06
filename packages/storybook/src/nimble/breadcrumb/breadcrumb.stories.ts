import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html, repeat } from '@microsoft/fast-element';
import { breadcrumbItemTag } from '../../../../nimble-components/src/breadcrumb-item';
import { breadcrumbTag } from '../../../../nimble-components/src/breadcrumb';
import { BreadcrumbAppearance } from '../../../../nimble-components/src/breadcrumb/types';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

interface BreadcrumbArgs {
    options: ItemArgs[];
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
            ${repeat(x => x.options, html<ItemArgs, BreadcrumbArgs>`
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
        options: {
            name: 'default',
            description: `The \`${breadcrumbItemTag}\` elements that populate this breadcrumb. 

With a standard breadcrumb containing multiple items, the last breadcrumb represents the current page.`,
            table: { category: apiCategory.slots }
        },
        appearance: {
            options: Object.keys(BreadcrumbAppearance),
            description: appearanceDescription({ componentName: 'breadcrumb' }),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        options: [
            {
                href: '#',
                label: 'Page 1'
            },
            {
                href: '#',
                label: 'Page 2'
            },
            {
                label: 'Current (No Link)'
            }
        ],
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
