import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnAnchorTag } from '..';
import {
    sharedTableActions,
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';
import { AnchorAppearance } from '../../../anchor/types';

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Anchor',
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
        sortOrder: 10
    },
    {
        firstName: '100',
        url: 'https://www.google.com/search?q=100',
        sortOrder: 5
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        url: 'https://www.google.com/search?q=milhouse+van+houten',
        sortOrder: 8
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        url: 'https://www.google.com/search?q=ned+flanders',
        sortOrder: 9
    },
    {
        firstName: 'Maggie (no link)',
        lastName: 'Simpson',
        sortOrder: 7
    },
    {
        lastName: 'Simpson',
        url: 'https://www.google.com/search?q=simpsons',
        sortOrder: -1
    },
    {
        lastName: 'Simpson',
        sortOrder: -2
    },
    {
        firstName: '0',
        url: 'https://www.google.com/search?q=0',
        sortOrder: 2
    },
    {
        firstName: 'false',
        url: 'https://www.google.com/search?q=false',
        sortOrder: 0
    },
    {
        firstName: 'abc',
        url: 'https://www.google.com/search?q=abc',
        sortOrder: 6
    },
    {
        firstName: '5',
        url: 'https://www.google.com/search?q=5',
        sortOrder: 3
    },
    {
        firstName: '20',
        url: 'https://www.google.com/search?q=20',
        sortOrder: 4
    },
    {
        firstName: 'true',
        url: 'https://www.google.com/search?q=true',
        sortOrder: 1
    }
] as const;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnchorColumnTableArgs extends SharedTableArgs {
    labelFieldName: string;
    hrefFieldName: string;
    appearance: keyof typeof AnchorAppearance;
    underlineHidden: boolean;
}

export const anchorColumn: StoryObj<AnchorColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<AnchorColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnAnchorTag}
                label-field-name="${x => x.labelFieldName}"
                href-field-name="${x => x.hrefFieldName}"
                sort-by-field-name="sortOrder"
                appearance="${x => x.appearance}"
                ?underline-hidden="${x => x.underlineHidden}"
            >
            Link Column
            </${tableColumnAnchorTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
            Last Name
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        labelFieldName: {
            name: 'label-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the visible text value for each cell in the column. The field values must be of type `string`. If a given row does not define a property with this name, that row will use the url as the label.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' }
        },
        hrefFieldName: {
            name: 'href-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the link url for each cell in the column. If the field is not defined in a particular record, that cell will be displayed as plain text instead of a link. The field values must be of type `string`.',
            control: { type: 'none' }
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text.'
        },
        underlineHidden: {
            name: 'underline-hidden',
            defaultValue: { summary: 'false' },
            description: 'Causes the underline to be hidden except on hover.'
        }
    },
    args: {
        labelFieldName: 'firstName',
        hrefFieldName: 'url',
        appearance: 'default',
        underlineHidden: false,
        ...sharedTableArgs(simpleData)
    }
};
