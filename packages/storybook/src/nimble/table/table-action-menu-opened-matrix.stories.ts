import type { Meta, StoryFn } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { waitForUpdatesAsync } from '../../../../nimble-components/src/testing/async-helpers';
import { iconUserTag } from '../../../../nimble-components/src/icons/user';
import { menuTag } from '../../../../nimble-components/src/menu';
import { menuItemTag } from '../../../../nimble-components/src/menu-item';
import { tableColumnTextTag } from '../../../../nimble-components/src/table-column/text';
import { Table, tableTag } from '../../../../nimble-components/src/table';
import { TablePageObject } from '../../../../nimble-components/src/table/testing/table.pageobject';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

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

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = html`
    <${tableTag}>
        <${tableColumnTextTag}
            field-name="firstName"
            action-menu-slot="action-menu"
            action-menu-label="Menu"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor">Favorite Color</${tableColumnTextTag}>

        <${menuTag} slot="action-menu">
            <${menuItemTag}>Item 1</${menuItemTag}>
            <${menuItemTag}>Item 2</${menuItemTag}>
            <${menuItemTag}>Item 3</${menuItemTag}>
            <${menuItemTag}>Item 4</${menuItemTag}>
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

    const pageObject = new TablePageObject(table);
    await pageObject.clickCellActionMenu(0, 0);
};

export const tableActionMenuOpenedLightThemeWhiteBackground: StoryFn = createFixedThemeStory(component, lightThemeWhiteBackground);

tableActionMenuOpenedLightThemeWhiteBackground.play = playFunction;

export const tableActionMenuOpenedColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);

tableActionMenuOpenedColorThemeDarkGreenBackground.play = playFunction;

export const tableActionMenuOpenedDarkThemeBlackBackground: StoryFn = createFixedThemeStory(component, darkThemeBlackBackground);

tableActionMenuOpenedDarkThemeBlackBackground.play = playFunction;
