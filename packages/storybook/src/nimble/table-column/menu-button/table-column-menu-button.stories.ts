import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnMenuButtonTag } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import type { MenuButtonColumnToggleEventDetail } from '@ni/nimble-components/dist/esm/table-column/menu-button/types';
import { Menu, menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
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

const simpleData = [
    {
        id: 'Ralph Wiggum',
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow'
    },
    {
        id: 'Milhouse Van Houten',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson'
    },
    {
        id: 'Ned Flanders',
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe'
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
        favoriteColor: 'Purple'
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
        favoriteColor: 'Orange'
    },
    {
        id: 'Barney Gumble',
        firstName: 'Barney',
        lastName: 'Gumble',
        favoriteColor: 'Pink'
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
        favoriteColor: 'White'
    },
    {
        id: 'Waylon Smithers',
        firstName: 'Waylon',
        lastName: 'Smithers',
        favoriteColor: 'Brown'
    },
    {
        id: 'Edna Krabappel',
        firstName: 'Edna',
        lastName: 'Krabappel',
        favoriteColor: 'Gray'
    },
    {
        id: 'Seymour Skinner',
        firstName: 'Seymour',
        lastName: 'Skinner',
        favoriteColor: 'Beige'
    },
    {
        id: 'Patty Bouvier',
        firstName: 'Patty',
        lastName: 'Bouvier',
        favoriteColor: 'Teal'
    },
    {
        id: 'Selma Bouvier',
        firstName: 'Selma',
        lastName: 'Bouvier',
        favoriteColor: 'Lavender'
    },
    {
        id: 'Nelson Muntz',
        firstName: 'Nelson',
        lastName: 'Muntz',
        favoriteColor: 'Magenta'
    },
    {
        id: 'Jimbo Jones',
        firstName: 'Jimbo',
        lastName: 'Jones',
        favoriteColor: 'Cyan'
    },
    {
        id: 'Kearney Zzyzwicz',
        firstName: 'Kearney',
        lastName: 'Zzyzwicz',
        favoriteColor: 'Azure'
    },
    {
        id: 'Dolph Starbeam',
        firstName: 'Dolph',
        lastName: 'Starbeam',
        favoriteColor: 'Aquamarine'
    },
    {
        id: 'Wendell Borton',
        firstName: 'Wendell',
        lastName: 'Borton',
        favoriteColor: 'Turquoise'
    },
    {
        id: 'Martin Prince',
        firstName: 'Martin',
        lastName: 'Prince',
        favoriteColor: 'Sienna'
    },
    {
        id: 'Sherri Mackleberry',
        firstName: 'Sherri',
        lastName: 'Mackleberry',
        favoriteColor: 'Periwinkle'
    },
    {
        id: 'Terri Mackleberry',
        firstName: 'Terri',
        lastName: 'Mackleberry',
        favoriteColor: 'Coral'
    },
    {
        id: 'Rod Flanders',
        firstName: 'Rod',
        lastName: 'Flanders',
        favoriteColor: 'Cyan'
    },
    {
        id: 'Todd Flanders',
        firstName: 'Todd',
        lastName: 'Flanders',
        favoriteColor: 'Magenta'
    },
    {
        id: 'Agnes Skinner',
        firstName: 'Agnes',
        lastName: 'Skinner',
        favoriteColor: 'Azure'
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

                const changeFavoriteColor = (color: string): void => {
                    const newData = storyArgs.currentData.map(d => {
                        if (d.id !== recordId) {
                            return d;
                        }
                        return {
                            ...d,
                            favoriteColor: color
                        };
                    });
                    storyArgs.currentData = newData;
                    void storyArgs.tableRef.setData(newData);
                };

                const item1 = document.createElement(menuItemTag);
                item1.textContent = `[${recordId}] Blue`;
                item1.addEventListener('change', () => changeFavoriteColor('Blue'));

                const item2 = document.createElement(menuItemTag);
                item2.textContent = `[${recordId}] Green`;
                item2.addEventListener('change', () => changeFavoriteColor('Green'));

                const item3 = document.createElement(menuItemTag);
                item3.textContent = `[${recordId}] Purple`;
                item3.addEventListener('change', () => changeFavoriteColor('Purple'));

                storyArgs.menuRef.replaceChildren(item1, item2, item3);
            }
        }
    }
};
