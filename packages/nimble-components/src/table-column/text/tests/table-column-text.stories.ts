import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { Table, tableTag } from '../../../table';
import { tableColumnTextTag } from '..';

interface CommonTableArgs {
    tableRef: Table;
    updateData: (args: CommonTableArgs) => void;
}

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
] as const;

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`. 
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for 
information about common column configuration.`;

const metadata: Meta<CommonTableArgs> = {
    title: 'Table Column Types',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/'
        }
    },
    // prettier-ignore
    argTypes: {
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(simpleData);
            })();
        }
    }
};

export default metadata;

type TextColumnFieldNameOption = 'firstName' | 'lastName';

interface TextColumnTableArgs extends CommonTableArgs {
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
