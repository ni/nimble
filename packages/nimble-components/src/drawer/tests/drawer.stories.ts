import { html } from '@microsoft/fast-element';
import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../../button/index';
import '../../checkbox/index';
import '../index';
import { DrawerLocation, DrawerState } from '../types';

interface DrawerArgs {
    location: DrawerLocation;
    state: DrawerState;
    modal: boolean;
    content: string;
}

const metadata: Meta<DrawerArgs> = {
    title: 'Drawer',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-drawer
            ?modal="${x => x.modal}"
            location="${x => x.location}"
            state="${x => x.state}"            
            :innerHTML="${x => x.content}">
        </nimble-drawer>
        <nimble-button
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
            onclick="document.querySelector('nimble-drawer').state = document.querySelector('nimble-drawer').hidden ? 'opening' : 'closing';"
            >
            Show/Hide Drawer (animated)
        </nimble-button>
    `),
    argTypes: {
        location: {
            options: [DrawerLocation.Left, DrawerLocation.Right],
            control: { type: 'select' }
        },
        state: {
            options: [
                DrawerState.Opening,
                DrawerState.Opened,
                DrawerState.Closing,
                DrawerState.Closed
            ],
            control: { type: 'select' }
        }
    },
    args: {
        location: DrawerLocation.Left,
        state: DrawerState.Opened,
        modal: true,
        content: '<div style="margin: 10px;"><p>Example Content</p></div>'
    }
};

const drawerHeaderFooterContent = html`
    <div class="header" style="margin-left: 20px; margin-top: 20px;">
        <h3>Header</h3>
    </div>
    <div
        class="content"
        style="flex: 1 1; margin-left: 20px; margin-top: 20px; overflow-y: auto;"
    >
        <p>Drawer Example with Header and Footer</p>
        <p>3 divs (header/content/footer)</p>
        <p>Content has "flex: 1 1;" style</p>
        <div style="height: 1000px;">
            (Large-height content to ensure content scrollbar appears)
        </div>
    </div>
    <div
        class="footer"
        style="position: relative; height: 70px; border-top: 2px solid #e7e7e7; "
    >
        <div style="position: absolute; right: 20px; top: 20px;">
            <nimble-button appearance="ghost">Cancel</nimble-button>
            <nimble-button appearance="outline">OK</nimble-button>
        </div>
    </div>
`;

export default metadata;

export const drawer: Story<DrawerArgs> = {};

export const headerFooter: Story<DrawerArgs> = {
    args: {
        content: drawerHeaderFooterContent.html as string
    }
};
