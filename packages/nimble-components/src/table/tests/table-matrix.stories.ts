import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import type { Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { MenuButton } from '../../menu-button';

const metadata: Meta = {
    title: 'Tests/Table',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/'
        }
    }
};

export default metadata;

const data = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow'
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson'
    },
    {
        firstName: null,
        lastName: null,
        favoriteColor: null
    }
] as const;

const actionMenuStates = [true, false];
type ActionMenuState = (typeof actionMenuStates)[number];

// prettier-ignore
const component = (
    showActionMenu: ActionMenuState
): ViewTemplate => html`
    <nimble-table>
        <nimble-table-column-text
            field-name="firstName"
            placeholder="no value"
            action-menu-slot="${showActionMenu ? 'action-menu' : ''}"
            action-menu-label="${showActionMenu ? 'Menu' : ''}"
        >
            <nimble-icon-user></nimble-icon-user>
        </nimble-table-column-text>
        <nimble-table-column-text field-name="lastName" placeholder="no value">Last Name</nimble-table-column-text>
        <nimble-table-column-text field-name="favoriteColor" placeholder="no value">Favorite Color</nimble-table-column-text>

        ${when(() => showActionMenu, html`
            <nimble-menu slot="action-menu">
                <nimble-menu-item>Item 1</nimble-menu-item>
                <nimble-menu-item>Item 2</nimble-menu-item>
                <nimble-menu-item>Item 3</nimble-menu-item>
                <nimble-menu-item>Item 4</nimble-menu-item>
            </nimble-menu>
        `)}
    </nimble-table>
`;

export const tableThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [actionMenuStates])
);

tableThemeMatrix.play = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    document.querySelectorAll<Table>('nimble-table').forEach(async table => {
        table.setData(data);

        await waitForUpdatesAsync();
        const row = table.shadowRoot!.querySelector('nimble-table-row')!;
        row.classList.add('hover');
        const cell = row.shadowRoot!.querySelector('nimble-table-cell')!;
        const menuButton = cell.shadowRoot!.querySelector<MenuButton>('nimble-menu-button')!;
        menuButton.toggleButton!.control.click();
        await waitForUpdatesAsync();
    });
};

export const hiddenTable: Story = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
