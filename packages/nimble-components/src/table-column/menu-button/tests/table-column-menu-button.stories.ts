import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import {
    sharedTableActions,
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../../base/tests/table-column-stories-utils';
import { ButtonAppearance, ButtonAppearanceVariant } from '../../../button/types';
import { tableColumnMenuButtonTag } from '..';
import { tableColumnTextTag } from '../../text';

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
        selectionMode: {
            table: {
                disable: true
            }
        },
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

interface MenuButtonColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
}

export const menuButtonColumn: StoryObj<MenuButtonColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MenuButtonColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
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
                field-name="firstName"
                appearance="${x => x.appearance}"
                appearance-variant="${x => x.appearanceVariant}"
            >
            Menu Button Column
            </${tableColumnMenuButtonTag}>
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
        }
    },
    args: {
        fieldName: 'firstName',
        appearance: 'outline',
        appearanceVariant: 'default',
        ...sharedTableArgs(simpleData)
    }
};
