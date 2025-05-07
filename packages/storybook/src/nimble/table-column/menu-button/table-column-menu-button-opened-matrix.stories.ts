import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@ni/fast-element';
import { tableTag } from '../../../../../nimble-components/src/table';
import { menuTag } from '../../../../../nimble-components/src/menu';
import { menuItemTag } from '../../../../../nimble-components/src/menu-item';
import { tableColumnMenuButtonTag } from '../../../../../nimble-components/src/table-column/menu-button';
import { TableColumnMenuButtonPageObject } from '../../../../../nimble-components/src/table-column/menu-button/testing/table-column-menu-button.pageobject';
import { TablePageObject } from '../../../../../nimble-components/src/table/testing/table.pageobject';
import { waitForUpdatesAsync } from '../../../../../nimble-components/src/testing/async-helpers';
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
    const table = document.querySelector(tableTag)!;
    await table.setData(data);
    await waitForUpdatesAsync();

    const tablePageObject = new TablePageObject(table);
    const columnPageObject = new TableColumnMenuButtonPageObject(
        tablePageObject
    );
    await columnPageObject.getMenuButton(0, 0)!.openMenu();
};

export const lightTheme$Open: StoryFn = createFixedThemeStory(component, lightThemeWhiteBackground);
lightTheme$Open.play = playFunction;

export const colorTheme$Open: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);
colorTheme$Open.play = playFunction;

export const darkTheme$Open: StoryFn = createFixedThemeStory(component, darkThemeBlackBackground);
darkTheme$Open.play = playFunction;
