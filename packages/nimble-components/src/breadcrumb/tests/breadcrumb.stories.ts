import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import '..';
import '../../breadcrumb-item';
import { createRenderer } from '../../utilities/tests/storybook';

interface BreadcrumbArgs {
    options: ItemArgs[];
}

interface ItemArgs {
    href?: string;
    target?: string;
    label: string;
}

const overviewText = `A breadcrumb component is used as a navigational aid, allowing users
to maintain awareness of their locations within a program, app, or a website.
Breadcrumb items, in addition to href and target, support all other [HTMLAnchorElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) attributes/properties.`;

const metadata: Meta<BreadcrumbArgs> = {
    title: 'Breadcrumb',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        },
        actions: {
            handles: ['click']
        }
    }
};

export default metadata;

// Using '#', window.location.href, or parent.location.href for the default hyperlink for the breadcrumb items in these stories all seem to trigger a navigation
// which isn't desirable, so using 'javascript:' which is also a no-op (but a non-empty href, so the items have the link styling we want)
// eslint-disable-next-line no-script-url
const noOpUrl = 'javascript:';

export const standardBreadcrumb: StoryObj<BreadcrumbArgs> = {
    // prettier-ignore
    render: createRenderer(html`
        <nimble-breadcrumb>
            ${repeat(x => x.options, html<ItemArgs>`
                <nimble-breadcrumb-item href="${x => x.href}" target="${x => x.target}">${x => x.label}</nimble-breadcrumb-item>
            `)}
        </nimble-breadcrumb>
`),
    argTypes: {
        options: {
            description:
                'Nest one or more `<nimble-breadcrumb-item />`s inside `<nimble-breadcrumb />`. Each can optionally set `href`, `target`, etc. '
                + 'With a standard breadcrumb containing multiple items, the last breadcrumb represents the current page (with no `href` specified, '
                + 'rendering with a bold font).'
        }
    },
    args: {
        options: [
            {
                href: noOpUrl,
                label: 'Page 1'
            },
            {
                href: noOpUrl,
                label: 'Page 2'
            },
            {
                label: 'Current (No Link)'
            }
        ]
    }
};

export const breadcrumbItem: StoryObj<ItemArgs> = {
    // prettier-ignore
    render: createRenderer(html`
        <nimble-breadcrumb>
            <nimble-breadcrumb-item href="${x => x.href}" target="${x => x.target}">Breadcrumb Item</nimble-breadcrumb-item>
        </nimble-breadcrumb>
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
        label: 'Breadcrumb Item'
    }
};
