import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import '..';
import '../../breadcrumb-item';
import { createRenderer } from '../../utilities/tests/storybook';

interface BreadcrumbArgs {
    options: ItemArgs[];
    useProminentLinksStyle: boolean;
}

interface ItemArgs {
    href?: string;
    target?: string;
    label: string;
}

const overviewText = `A breadcrumb component is used as a navigational aid, allowing users
to maintain awareness of their locations within a program, app, or a website.  
Breadcrumb items, in addition to href and target, support all other [HTMLAnchorElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) attributes/properties.  
See the [nimble-angular Readme](https://github.com/ni/nimble/blob/main/angular-workspace/projects/ni/nimble-angular/README.md#using-nimble-breadcrumb-with-angulars-routerlink) 
for information on using this component in Angular with RouterLink directives.`;

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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        },
        actions: {}
    }
};

export default metadata;

// Using '#', window.location.href, or parent.location.href for the default hyperlink for the breadcrumb items in these stories all seem to trigger a navigation
// which isn't desirable, so using 'javascript:' which is also a no-op (but a non-empty href, so the items have the link styling we want)
// eslint-disable-next-line no-script-url
const noOpUrl = 'javascript:';

export const _standardBreadcrumb: StoryObj<BreadcrumbArgs> = {
    // prettier-ignore
    render: createRenderer(html`
        <nimble-breadcrumb class="${x => (x.useProminentLinksStyle ? 'prominent-links' : '')}">
            ${repeat(x => x.options, html<ItemArgs>`
                <nimble-breadcrumb-item href="${x => x.href}" target="${x => x.target}">${x => x.label}</nimble-breadcrumb-item>
            `)}
        </nimble-breadcrumb>
`),
    storyName: 'Standard Breadcrumb',
    argTypes: {
        options: {
            description:
                'Nest one or more `<nimble-breadcrumb-item />`s inside `<nimble-breadcrumb />`. Each can optionally set `href`, `target`, etc. '
                + 'With a standard breadcrumb containing multiple items, the last breadcrumb represents the current page (with no `href` specified, '
                + 'rendering with a bold font).'
        },
        useProminentLinksStyle: {
            description:
                'To use the alternate (Prominent Links) style (which swaps the default and active/mouseover link colors), add the CSS class `prominent-links` to the '
                + '`<nimble-breadcrumb>` element.'
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
        ],
        useProminentLinksStyle: false
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
