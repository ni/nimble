import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        favoriteColor: 'Red'
    }
];

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Table Column Types',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
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

type TextColumnFieldNameOption = 'firstName' | 'lastName';

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: TextColumnFieldNameOption;
    placeholderText: string;
}

const textColumnDescription = 'The `nimble-table-column-text` column is used to display string fields as text in the `nimble-table`.';

export const textColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: textColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                field-name="${x => x.fieldName}"
            >
            Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="quote"
                placeholder="${x => x.placeholderText}"
            >
            Quote
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `string`.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' }
        },
        placeholderText: {
            name: 'placeholder',
            description:
                'Optionally set this attribute to change the text that is displayed if the record value is `null`, `undefined`, or not present. If unset, an empty string will be displayed.'
        }
    },
    args: {
        fieldName: 'firstName',
        placeholderText: '<pacifier noise>'
    }
};
