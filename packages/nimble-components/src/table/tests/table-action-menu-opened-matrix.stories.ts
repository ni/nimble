import type { Meta, StoryFn } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { Table, tableTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { backgroundStates } from '../../utilities/tests/states';
import { TablePageObject } from './table.pageobject';
import { iconUserTag } from '../../icons/user';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import { tableColumnTextTag } from '../../table-column/text';

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
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

// prettier-ignore
const component = html`
    <${tableTag}>
        <${tableColumnTextTag}
            field-name="firstName"
            placeholder="no value"
            action-menu-slot="action-menu"
            action-menu-label="Menu"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName" placeholder="no value">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor" placeholder="no value">Favorite Color</${tableColumnTextTag}>

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
    const table = document.querySelector<Table>('nimble-table')!;
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
