import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/src/testing/async-helpers';
import { menuTag } from '@ni/nimble-components/src/menu';
import { menuItemTag } from '@ni/nimble-components/src/menu-item';
import { TablePageObject } from '@ni/nimble-components/src/table/testing/table.pageobject';
import { Table, tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnMenuButtonTag } from '../../../../../nimble-components/src/table-column/menu-button';
import { TableColumnMenuButtonPageObject } from '../../../../../nimble-components/src/table-column/menu-button/testing/table-column-menu-button.pageobject';
import { sharedMatrixParameters } from '../../../utilities/matrix';
import { backgroundStates } from '../../../utilities/states';
import { createFixedThemeStory } from '../../../utilities/storybook';

const data = [
    {
        id: '0',
        firstName: 'Ralph'
    },
    {
        id: '1',
        firstName: 'Milhouse'
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = html`
    <${tableTag} id-field-name="id" style="height: 150px">
        <${tableColumnMenuButtonTag}
            field-name="firstName"
            menu-slot="button-column-menu"
        >
            Menu button column
        </${tableColumnMenuButtonTag}>

        <${menuTag} slot="button-column-menu">
            <${menuItemTag}>Item 1</${menuItemTag}>
            <${menuItemTag}>Item 2</${menuItemTag}>
            <${menuItemTag}>Item 3</${menuItemTag}>
        </${menuTag}>
    </${tableTag}>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

const playFunction = async (): Promise<void> => {
    const table = document.querySelector<Table>('nimble-table')!;
    await table.setData(data);
    await waitForUpdatesAsync();

    const tablePageObject = new TablePageObject(table);
    const columnPageObject = new TableColumnMenuButtonPageObject(
        tablePageObject
    );
    await columnPageObject.getMenuButton(0, 0)!.openMenu();
};

export const tableColumnMenuButtonOpenedLightThemeWhiteBackground: StoryFn = createFixedThemeStory(component, lightThemeWhiteBackground);

tableColumnMenuButtonOpenedLightThemeWhiteBackground.play = playFunction;

export const tableColumnMenuButtonOpenedColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);

tableColumnMenuButtonOpenedColorThemeDarkGreenBackground.play = playFunction;

export const tableColumnMenuButtonOpenedDarkThemeBlackBackground: StoryFn = createFixedThemeStory(component, darkThemeBlackBackground);

tableColumnMenuButtonOpenedDarkThemeBlackBackground.play = playFunction;
