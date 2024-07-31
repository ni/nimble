import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import type { TableRecord } from '../../../../../nimble-components/src/table/types';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { tableColumnMenuButtonTag } from '../../../../../nimble-components/src/table-column/menu-button';
import type { MenuButtonColumnToggleEventDetail } from '../../../../../nimble-components/src/table-column/menu-button/types';
import { Menu, menuTag } from '../../../../../nimble-components/src/menu';
import { MenuItem, menuItemTag } from '../../../../../nimble-components/src/menu-item';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../../utilities/storybook';
import { iconCheckTag } from '@ni/nimble-components/src/icons/check';
import { iconCheckLargeTag } from '@ni/nimble-components/src/icons/check-large';

const colors = ['Red', 'Green', 'Blue', 'Black', 'Yellow'] as const;
type Color = typeof colors[number];

const simpleData = [
    {
        id: 'Ralph Wiggum',
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Blue'
    },
    {
        id: 'Milhouse Van Houten',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Green'
    },
    {
        id: 'Ned Flanders',
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Red'
    },
    {
        id: 'Maggie Simpson',
        firstName: 'Maggie',
        lastName: 'Simpson',
        favoriteColor: 'Red'
    },
    {
        id: 'Homer Simpson',
        firstName: 'Homer',
        lastName: 'Simpson',
        favoriteColor: 'Blue'
    },
    {
        id: 'Marge Simpson',
        firstName: 'Marge',
        lastName: 'Simpson',
        favoriteColor: 'Black'
    },
    {
        id: 'Bart Simpson',
        firstName: 'Bart',
        lastName: 'Simpson',
        favoriteColor: 'Green'
    },
    {
        id: 'Lisa Simpson',
        firstName: 'Lisa',
        lastName: 'Simpson',
        favoriteColor: 'Yellow'
    },
    {
        id: 'Moe Szyslak',
        firstName: 'Moe',
        lastName: 'Szyslak',
        favoriteColor: 'Red'
    },
    {
        id: 'Barney Gumble',
        firstName: 'Barney',
        lastName: 'Gumble',
        favoriteColor: 'Red'
    },
    {
        id: 'Lenny Leonard',
        firstName: 'Lenny',
        lastName: 'Leonard',
        favoriteColor: 'Black'
    },
    {
        id: 'Carl Carlson',
        firstName: 'Carl',
        lastName: 'Carlson',
        favoriteColor: 'Yellow'
    },
    {
        id: 'Waylon Smithers',
        firstName: 'Waylon',
        lastName: 'Smithers',
        favoriteColor: 'Black'
    },
    {
        id: 'Edna Krabappel',
        firstName: 'Edna',
        lastName: 'Krabappel',
        favoriteColor: 'Black'
    },
    {
        id: 'Seymour Skinner',
        firstName: 'Seymour',
        lastName: 'Skinner',
        favoriteColor: 'Green'
    },
    {
        id: 'Patty Bouvier',
        firstName: 'Patty',
        lastName: 'Bouvier',
        favoriteColor: 'Green'
    },
    {
        id: 'Selma Bouvier',
        firstName: 'Selma',
        lastName: 'Bouvier',
        favoriteColor: 'Red'
    },
    {
        id: 'Nelson Muntz',
        firstName: 'Nelson',
        lastName: 'Muntz',
        favoriteColor: 'Blue'
    },
    {
        id: 'Jimbo Jones',
        firstName: 'Jimbo',
        lastName: 'Jones',
        favoriteColor: 'Blue'
    },
    {
        id: 'Kearney Zzyzwicz',
        firstName: 'Kearney',
        lastName: 'Zzyzwicz',
        favoriteColor: 'Blue'
    },
    {
        id: 'Dolph Starbeam',
        firstName: 'Dolph',
        lastName: 'Starbeam',
        favoriteColor: 'Blue'
    },
    {
        id: 'Wendell Borton',
        firstName: 'Wendell',
        lastName: 'Borton',
        favoriteColor: 'Green'
    },
    {
        id: 'Martin Prince',
        firstName: 'Martin',
        lastName: 'Prince',
        favoriteColor: 'Yellow'
    },
    {
        id: 'Sherri Mackleberry',
        firstName: 'Sherri',
        lastName: 'Mackleberry',
        favoriteColor: 'Red'
    },
    {
        id: 'Terri Mackleberry',
        firstName: 'Terri',
        lastName: 'Mackleberry',
        favoriteColor: 'Black'
    },
    {
        id: 'Rod Flanders',
        firstName: 'Rod',
        lastName: 'Flanders',
        favoriteColor: 'Green'
    },
    {
        id: 'Todd Flanders',
        firstName: 'Todd',
        lastName: 'Flanders',
        favoriteColor: 'Red'
    },
    {
        id: 'Agnes Skinner',
        firstName: 'Agnes',
        lastName: 'Skinner',
        favoriteColor: 'Blue'
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Menu Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [
                ...sharedTableActions,
                'menu-button-column-toggle',
                'menu-button-column-beforetoggle'
            ]
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface MenuButtonColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    menuSlot: string;
    updateMenuItems: (
        storyArgs: MenuButtonColumnTableArgs,
        e: CustomEvent<MenuButtonColumnToggleEventDetail>
    ) => void;
    menuRef: Menu;
    toggleEvent: never;
    beforeToggleEvent: never;
    currentData: TableRecord[];
}

export const menuButtonColumn: StoryObj<MenuButtonColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MenuButtonColumnTableArgs>`
        ${disableStorybookZoomTransform} 
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="id"
        >
            <${tableColumnTextTag} field-name="firstName">
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="lastName">
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnMenuButtonTag}
                field-name="${x => x.fieldName}"
                menu-slot="${x => x.menuSlot}"
                @menu-button-column-beforetoggle="${(x, c) => x.updateMenuItems(x, c.event as CustomEvent<MenuButtonColumnToggleEventDetail>)}"
            >
                Favorite Color
            </${tableColumnMenuButtonTag}>

            <${menuTag} ${ref('menuRef')} slot="${x => x.menuSlot}">
            </${menuTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                "Set this attribute to identify which field in the data record contains the visible text value for each cell's menu button in the column. The field values must be of type `string`.",
            control: false,
            table: { category: apiCategory.attributes }
        },
        menuSlot: {
            name: 'menu-slot',
            description:
                "The name of the slot within the `nimble-table` instance where the menu associated with the column's menu button will be provided.",
            control: false,
            table: { category: apiCategory.attributes }
        },
        updateMenuItems: {
            table: {
                disable: true
            }
        },
        menuRef: {
            table: {
                disable: true
            }
        },
        currentData: {
            table: {
                disable: true
            }
        },
        toggleEvent: {
            name: 'menu-button-column-toggle',
            description:
                'Emitted when the `toggle` event is fired on a menu button in the column.',
            control: false,
            table: { category: apiCategory.events }
        },
        beforeToggleEvent: {
            name: 'menu-button-column-beforetoggle',
            description:
                'Emitted when the `beforetoggle` event is fired on a menu button in the column. If necessary, a handler for this event should be used to update the menu items for the menu button associated with the event.',
            control: false,
            table: { category: apiCategory.events }
        }
    },
    args: {
        fieldName: 'favoriteColor',
        menuSlot: 'color-menu',
        menuRef: undefined,
        currentData: [...simpleData],
        updateMenuItems: (
            storyArgs: MenuButtonColumnTableArgs,
            e: CustomEvent<MenuButtonColumnToggleEventDetail>
        ): void => {
            if (e.detail.newState) {
                const recordId = e.detail.recordId;
                const record = storyArgs.currentData.find(d => d.id === recordId)!;

                const changeFavoriteColor = (color: string): void => {
                    record.favoriteColor = color;
                    void storyArgs.tableRef.setData(storyArgs.currentData);
                };

                const menuItems: MenuItem[] = [];
                for (const color of colors) {
                    const item = document.createElement(menuItemTag);
                    item.textContent = `${color}`;
                    item.addEventListener('change', () => changeFavoriteColor(color));
                    if (record.favoriteColor === color) {
                        // const checkIcon = document.createElement(iconCheckTag);
                        const checkIcon = document.createElement(iconCheckLargeTag);
                        checkIcon.slot = 'start';
                        item.appendChild(checkIcon);
                    }
                    menuItems.push(item);
                }
                storyArgs.menuRef.replaceChildren(...menuItems);
            }
        }
    }
};
