import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import type { TableRecord } from '../../../../../nimble-components/src/table/types';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { tableColumnMenuButtonTag } from '../../../../../nimble-components/src/table-column/menu-button';
import type { MenuButtonColumnToggleEventDetail } from '../../../../../nimble-components/src/table-column/menu-button/types';
import { Menu, menuTag } from '../../../../../nimble-components/src/menu';
import { menuItemTag } from '../../../../../nimble-components/src/menu-item';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

const simpleData = [
    {
        id: 'Ralph Wiggum',
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        id: 'Milhouse Van Houten',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        id: 'Ned Flanders',
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    },
    {
        id: 'Maggie Simpson',
        firstName: 'Maggie',
        lastName: 'Simpson',
        favoriteColor: 'Red'
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
