import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnAnchorTag } from '..';
import {
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

const columnTypeOverviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Table Column Types',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: columnTypeOverviewText
            }
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes
    }
};

export default metadata;

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        url: 'https://www.google.com/search?q=ralph+wiggum'
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
        lastName: 'Simpson'
    }
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnchorColumnTableArgs extends SharedTableArgs {
    labelFieldName: string;
    hrefFieldName: string;
    placeholderText: string;
}

const textColumnDescription = 'The `nimble-table-column-text` column is used to display string fields as text in the `nimble-table`.';

export const anchorColumn: StoryObj<AnchorColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: textColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<AnchorColumnTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnAnchorTag}
                label-field-name="${x => x.labelFieldName}"
                href-field-name="${x => x.hrefFieldName}"
                placeholder="${x => x.placeholderText}"
            >
            First Name
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
                'Set this attribute to identify which field in the data record contains the visible text value for each cell in the column. The field values must be of type `string`.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' }
        },
        hrefFieldName: {
            name: 'href-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the link url for each cell in the column. If the field is not defined in a particular record, that cell will be displayed as plain text instead of a link. The field values must be of type `string`.',
            options: ['url'],
            control: { type: 'radio' }
        },
        placeholderText: {
            name: 'placeholder',
            description:
                'Optionally set this attribute to change the text that is displayed if the label value for a record is `null`, `undefined`, or not present. If unset, an empty string will be displayed.'
        }
    },
    args: {
        labelFieldName: 'firstName',
        hrefFieldName: 'url',
        placeholderText: '(no first name provided)',
        ...sharedTableArgs(simpleData)
    }
};
