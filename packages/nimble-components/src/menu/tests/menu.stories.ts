import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../../icons/admin';
import '../../icons/logout';

interface MenuArgs {
    itemOptions: ItemArgs[];
    slottedComponent: boolean;
}

interface ItemArgs {
    text: string;
    disabled: boolean;
    icon: boolean;
}

const metadata: Meta<MenuArgs> = {
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
            ${when(x => x.slottedComponent, html`
                <div style="display: grid; font-family: Source Sans Pro; font-size: 11px;">
                    <div style="font-weight: bold; color: black;">lvadmin User</div>
                    <div style="color: gray;">lvadmin</div>
                </div>
                <nimble-menu-item><nimble-admin-icon></nimble-admin-icon>Account</nimble-menu-item>
                <nimble-menu-item><div slot="start"><nimble-logout-icon></nimble-logout-icon></div>Log out</nimble-menu-item>
                `)}
            ${when(x => !x.slottedComponent, html<MenuArgs>`
                <header>Header 1</header>
                ${repeat(x => x.itemOptions.slice(0, 3), html<ItemArgs>`
                    <nimble-menu-item ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<nimble-admin-icon></nimble-admin-icon>`)}
                        ${x => x.text}
                    </nimble-menu-item>
                `)}
                <hr>
                <header>Header 2</header>
                ${repeat(x => x.itemOptions.slice(3, 6), html<ItemArgs>`
                    <nimble-menu-item ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<nimble-admin-icon></nimble-admin-icon>`)}
                        ${x => x.text}
                    </nimble-menu-item>
                `)}
            `)}
        </nimble-menu>
        `),
    args: {
        itemOptions: [
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
            },
            {
                text: 'Item 4',
                disabled: false,
                icon: false
            },
            {
                text: 'Item 5',
                disabled: false,
                icon: false
            },
            {
                text: 'Item 6',
                disabled: false,
                icon: false
            }
        ],
        slottedComponent: false
    }
};

export default metadata;

export const menu: Story<MenuArgs> = {
    args: { slottedComponent: false }
};

export const slottedMenu: Story<MenuArgs> = {
    args: { slottedComponent: true }
};
