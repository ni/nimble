import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnMenuButtonTag } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import { Menu, menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { DelegatedEventEventDetails } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { MenuButtonToggleEventDetail } from '@ni/nimble-components/dist/esm/menu-button/types';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import { TableRowSelectionMode } from '@ni/nimble-components/dist/esm/table/types';

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Menu Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        // selectionMode: {
        //     table: {
        //         disable: true
        //     }
        // },
    }
};

export default metadata;

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        url: 'https://www.google.com/search?q=ralph+wiggum',
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        url: 'https://www.google.com/search?q=milhouse+van+houten'
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        url: 'https://www.google.com/search?q=ned+flanders'
    },
    {
        firstName: 'Maggie (no link)',
        lastName: 'Simpson'
    },
    {
        lastName: 'Simpson',
        url: 'https://www.google.com/search?q=simpsons'
    },
    {
        lastName: 'Simpson'
    }
] as const;

const firstNames = ['John', 'Sally', 'Joe', 'Michael', 'Sam'];
const lastNames = ['Davidson', 'Johnson', 'Abraham', 'Wilson'];
const ages = [16, 32, 48, 64];
const largeData = [];
for (let i = 0; i < 10000; i++) {
    const possibleParent = Math.floor(Math.random() * 100);
    const parentId = possibleParent < i ? possibleParent.toString() : undefined;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    largeData.push({
        id: i.toString(),
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        age: ages[i % ages.length],
        quote: `I'm number ${i + 1}!`,
        parentId
    });
}

interface MenuButtonColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    updateMenuItems: (storyArgs: MenuButtonColumnTableArgs, e: CustomEvent<DelegatedEventEventDetails>) => void;
    menuRef: Menu;
}

export const menuButtonColumn: StoryObj<MenuButtonColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MenuButtonColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
            data-unused="${x => x.updateData(x)}"
            id-field-name="id"
        >
            <${tableColumnTextTag}
                field-name="firstName"
            >
            First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
            Last Name
            </${tableColumnTextTag}>
            <${tableColumnMenuButtonTag}
                fractional-width="0.5"
                field-name="fullName"
                appearance="${x => x.appearance}"
                appearance-variant="${x => x.appearanceVariant}"
                @delegated-event="${(x, c) => x.updateMenuItems(x, c.event as CustomEvent<DelegatedEventEventDetails>)}"
            >
            Menu Button Column
            </${tableColumnMenuButtonTag}>

            <${menuTag} ${ref('menuRef')} slot="temp-menu">
            </${menuTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record contains the visible text value for each cell\'s menu button in the column. The field values must be of type `string`.',
            control: { type: 'radio' }
        },
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' },
            description:
                'Controls the appearance of the menu button within each cell.'
        },
        appearanceVariant: {
            name: 'appearance-variant',
            control: { type: 'radio' },
            options: Object.keys(ButtonAppearanceVariant),
            description: 'Controls the appearance variant of the menu button within each cell.'
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
        }
    },
    args: {
        fieldName: 'firstName',
        appearance: 'outline',
        appearanceVariant: 'default',
        menuRef: undefined,
        updateMenuItems: (storyArgs: MenuButtonColumnTableArgs, e: CustomEvent<DelegatedEventEventDetails>): void => {
            const originalEvent = e.detail.originalEvent;
            if (originalEvent.type === 'beforetoggle') {
                const beforeToggleEvent = originalEvent as CustomEvent<MenuButtonToggleEventDetail>;
                if (beforeToggleEvent.detail.newState) {
                    const recordId = e.detail.recordId;

                    const item1 = document.createElement(menuItemTag);
                    item1.textContent = `Item 1 (record ${recordId})`;
                    const item2 = document.createElement(menuItemTag);
                    item2.textContent = `Item 2 (record ${recordId})`;

                    storyArgs.menuRef.replaceChildren(item1, item2);
                }
            }
        },
        ...sharedTableArgs(largeData)
    }
};