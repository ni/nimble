import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TableArgs {
    disabled: boolean;
    selected: boolean;
    showAlert: (message: string) => void;
}

const metadata: Meta<TableArgs> = {
    title: 'Table',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20/specs/'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-table>
            <nimble-menu slot="actionMenu" @open-change="${x => x.showAlert('open change')}">
                <nimble-menu-item @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
                <nimble-menu-item @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item>
            </nimble-menu>

            <div slot="expandedRow-id-3" style="border: 1px solid red;">
                <nimble-table style="height: 200px;">
                </nimble-table>
            </div>
        </nimble-table>
    `),
    args: {
        disabled: false,
        selected: false,
        showAlert: (message: string) => {
            // eslint-disable-next-line no-alert
            alert(message);
        }
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
