import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { BreadcrumbAppearance } from '../types';
import { breadcrumbTag } from '..';
import { breadcrumbItemTag } from '../../breadcrumb-item';

interface BreadcrumbArgs {
    options: ItemArgs[];
    appearance: keyof typeof BreadcrumbAppearance;
    allowNavigation: boolean;
}

interface ItemArgs {
    href?: string;
    target?: string;
    label: string;
}

interface BreadcrumbItemArgs extends ItemArgs {
    allowNavigation: boolean;
}

const overviewText = `A breadcrumb component is used as a navigational aid, allowing users
to maintain awareness of their locations within a program, app, or a website.
Breadcrumb items, in addition to href and target, support all other [HTMLAnchorElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) attributes/properties.
See the [nimble-angular Readme](https://github.com/ni/nimble/blob/main/angular-workspace/projects/ni/nimble-angular/README.md#using-nimble-breadcrumb-with-angulars-routerlink)
for information on using this component in Angular with RouterLink directives.`;

const metadata: Meta<BreadcrumbArgs> = {
    title: 'Components/Breadcrumb',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {}
    }
};

export default metadata;

export const _standardBreadcrumb: StoryObj<BreadcrumbArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${breadcrumbTag}
            appearance="${x => BreadcrumbAppearance[x.appearance]}"
        >
            ${repeat(x => x.options, html<ItemArgs, BreadcrumbArgs>`
                <${breadcrumbItemTag}
                    href="${x => x.href}"
                    target="${x => x.target}"
                    @click="${(_x, c) => c.parent.allowNavigation}"
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
            description:
                'Nest one or more `<nimble-breadcrumb-item />`s inside `<nimble-breadcrumb />`. Each can optionally set `href`, `target`, etc. '
                + 'With a standard breadcrumb containing multiple items, the last breadcrumb represents the current page (with no `href` specified, '
                + 'rendering with a bold font).'
        },
        appearance: {
            options: Object.keys(BreadcrumbAppearance),
            control: { type: 'radio' }
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
        appearance: 'default',
        allowNavigation: false
    }
};

export const breadcrumbItem: StoryObj<BreadcrumbItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <${breadcrumbTag}>
            <${breadcrumbItemTag}
                href="${x => x.href}"
                target="${x => x.target}"
                @click="${x => x.allowNavigation}"
            >
                Breadcrumb Item
            </${breadcrumbItemTag}>
        </${breadcrumbTag}>
    `),
    argTypes: {
        href: {
            description:
                '(Optional) The URL that this breadcrumb item/ link points to. Generally, the last breadcrumb item '
                + 'representing the current page has no `href` set.'
        },
        target: {
            description:
                '(Optional) Where to display the linked URL (destination browsing context): `_self`, `_blank`, etc.',
            type: 'string'
        }
    },
    args: {
        href: 'http://www.ni.com',
        label: 'Breadcrumb Item',
        allowNavigation: false
    }
};
