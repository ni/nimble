import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import '..';
import '../../breadcrumb-item';
import { createRenderer } from '../../utilities/tests/storybook';
import { BreadcrumbItemAppearance } from '../../breadcrumb-item/types';

interface ButtonArgs {
    label: string;
    appearance: string;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
}

const overviewText = 'A breadcrumb component is used as a navigational aid, allowing users to maintain awareness of their locations within a program, app, or a website.';

const metadata: Meta<ButtonArgs> = {
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
    },
    argTypes: {
        appearance: {
            options: Object.values(BreadcrumbItemAppearance),
            control: { type: 'radio' }
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-breadcrumb>
            <nimble-breadcrumb-item appearance="${x => x.appearance}" href="#">Page 1</nimble-breadcrumb-item>
            <nimble-breadcrumb-item appearance="${x => x.appearance}" href="${() => parent.location.href}">Current Page</nimble-breadcrumb-item>
            <nimble-breadcrumb-item appearance="${x => x.appearance}" href="#">Page 3</nimble-breadcrumb-item>
            <nimble-breadcrumb-item appearance="${x => x.appearance}">Page 4 (No Link)</nimble-breadcrumb-item>
        </nimble-breadcrumb>
`),
    args: {
        label: 'Hypertext Breadcrumb',
        appearance: 'hypertext',
        disabled: false
    }
};

export default metadata;

export const hypertextBreadcrumb: StoryObj<ButtonArgs> = {
    args: {
        label: 'Hypertext Breadcrumb',
        appearance: BreadcrumbItemAppearance.Hypertext
    }
};

export const hoverFillBreadcrumb: StoryObj<ButtonArgs> = {
    args: {
        label: 'HoverFill Breadcrumb',
        appearance: BreadcrumbItemAppearance.HoverFill
    }
};
