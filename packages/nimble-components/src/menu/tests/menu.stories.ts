import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';
import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';

interface MenuArgs {
    options: ItemArgs[];
}

interface ItemArgs {
    text: string;
    disabled: boolean;
    icon: boolean;
}

const metadata: Meta = {
    title: 'Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createRenderer<MenuArgs>(html`
        <nimble-menu>
            ${repeat(x => x.options, html<ItemArgs>`
                <nimble-menu-item ?disabled="${x => x.disabled}">
                    ${when(x => x.icon, html`<div slot="start">${admin16X16.data}</div>`)}
                    ${x => x.text}
                </nimble-menu-item>
            `)}
        </nimble-menu>
        `),
    args: {
        options: [
            {
                text: 'Item 1',
                disabled: false,
                icon: false
            },
            {
                text: 'Item 2',
                disabled: false,
                icon: false
            },
            {
                text: 'Item 3',
                disabled: false,
                icon: false
            }
        ]
    }
};

export default metadata;

export const menu: Story = {};
