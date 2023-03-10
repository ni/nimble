import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../utilities/tests/storybook';
import { ExampleSortType } from './types';
import { Table, tableTag } from '../../table';
import { TableColumnSortDirection } from '../../table/types';
import { iconUserTag } from '../../icons/user';
import { iconCommentTag } from '../../icons/comment';
import { tableColumnTextTag } from '../text';

interface CommonTableArgs {
    idFieldName: undefined;
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
        firstName: 'Maude',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: "Neddy doesn't believe in insurance. He considers it a form of gambling."
    },
    {
        firstName: 'Rod',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Lies make baby Jesus cry.'
    },
    {
        firstName: 'Todd',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Dad, should I poke Rod with a sharp thing like the mouse did?'
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        favoriteColor: 'Red'
    }
] as const;

const idFieldName = 'firstName';

const overviewText = `This page contains information about configuring the columns of a \`nimble-table\`. 
See the **Table** story for information about configuring the table itself.`;

const metadata: Meta<CommonTableArgs> = {
    title: 'Table Columns',
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
    render: createUserSelectedThemeStory(html<CommonTableArgs>`
    ${usageWarning('table')}
    <${tableTag}
        ${ref('tableRef')}
        id-field-name="${idFieldName}"
        data-unused="${x => x.updateData(x)}"
    >
        <${tableColumnTextTag}
            column-id="first-name-column"
            field-name="firstName"
        >
            First Name
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="last-name-column"
            field-name="lastName"
        >
            Last Name
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="favorite-color-column"
            field-name="favoriteColor"
        >
            Favorite Color
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="quote-column"
            field-name="quote"
        >
            Quote
        </${tableColumnTextTag}>
    </${tableTag}>
    `),
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

// In the Docs tab, Storybook doesn't render the title of the first story
// This is a placeholder to get the useful ones to render
export const columns: StoryObj<CommonTableArgs> = {};

type ColumnOrderOption = 'FirstName, LastName' | 'LastName, FirstName';

interface ColumnOrderTableArgs extends CommonTableArgs {
    columnOrder: ColumnOrderOption;
}

const columnOrderDescription = `Configure columns by adding column elements as children of the table. 
The order of the elements controls the order that columns will appear in the table.`;

export const columnOrder: StoryObj<ColumnOrderTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: columnOrderDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<ColumnOrderTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${idFieldName}"
            data-unused="${x => x.updateData(x)}"
        >
            ${when(x => x.columnOrder === 'FirstName, LastName', html`
                <${tableColumnTextTag}
                    column-id="first-name-column"
                    field-name="firstName"
                >
                First Name
                </${tableColumnTextTag}>
                <${tableColumnTextTag}
                    column-id="last-name-column"
                    field-name="lastName"
                >
                Last Name
                </${tableColumnTextTag}>
            `)}
            ${when(x => x.columnOrder === 'LastName, FirstName', html`
                <${tableColumnTextTag}
                    column-id="last-name-column"
                    field-name="lastName"
                >
                Last Name
                </${tableColumnTextTag}>
                <${tableColumnTextTag}
                    column-id="first-name-column"
                    field-name="firstName"
                >
                First Name
                </${tableColumnTextTag}>
            `)}
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        columnOrder: {
            name: 'Column order',
            description: columnOrderDescription,
            options: ['FirstName, LastName', 'LastName, FirstName'],
            control: { type: 'radio' }
        }
    },
    args: {
        columnOrder: 'FirstName, LastName'
    }
};

type HeaderIconOption = 'user' | 'comment';

interface HeaderContentTableArgs extends CommonTableArgs {
    headerIcon: HeaderIconOption;
    headerText: string;
}

const headerContentIntro = 'The content of each column header comes from whatever is slotted in the column element.';
const headerTextContent = `If you provide only text content, Nimble will style it
and add a \`title\` to show a tooltip when truncated.`;
const headerIconContent = 'If you provide icon content, you should set your own `title`.';
const headerTitleContent = 'Titles should use "Headline Casing" and Nimble will automatically capitalize them for display in the header.';
const headerContentDescription = `${headerContentIntro} ${headerTextContent} ${headerIconContent} ${headerTitleContent}`;
const headerTextContentDescription = `${headerContentIntro} ${headerTextContent} ${headerTitleContent}`;
const headerIconContentDescription = `${headerContentIntro} ${headerIconContent} ${headerTitleContent}`;

export const headerContent: StoryObj<HeaderContentTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: headerContentDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<HeaderContentTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${idFieldName}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName"
            >
                ${when(x => x.headerIcon === 'user', html`
                    <${iconUserTag} title="First Name"></${iconUserTag}>
                `)}
                ${when(x => x.headerIcon === 'comment', html`
                    <${iconCommentTag} title="First Name"></${iconCommentTag}>
                `)}
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName"
            >
                ${x => x.headerText}
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        headerIcon: {
            name: 'First column header icon',
            description: headerIconContentDescription,
            options: ['user', 'comment'],
            control: { type: 'radio' }
        },
        headerText: {
            name: 'Second column header text',
            description: headerTextContentDescription
        }
    },
    args: {
        headerIcon: 'user',
        headerText: 'Last Name'
    }
};

const commonColumnAttributes = 'In addition to the attributes described in other stories there are other attributes available on all column types.';

interface CommonAttributesTableArgs extends CommonTableArgs {
    columnHidden: boolean;
    columnId: string;
}

export const commonAttributes: StoryObj<CommonAttributesTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: commonColumnAttributes
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<CommonAttributesTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${idFieldName}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName"
                ?column-hidden=${x => x.columnHidden}
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="favorite-color-column"
                field-name="favoriteColor"
            >
                Favorite Color
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        columnHidden: {
            name: 'column-hidden',
            description: 'Add the `column-hidden` attribute to hide a column from display. One use case for this is to sort by a field but not display its value.',
        },
        columnId: {
            name: 'column-id',
            description: 'Optionally use the `column-id` attribute to uniquely identify a column for features like adding an action menu. If you aren\'t using features that require a column id you may leave it unset for all columns. If you provide `column-id` for any column within a table then you must provide it for all and they must be unique strings.'
        }
    },
    args: {
        columnHidden: false,
    }
};

const sortedOptions = {
    [ExampleSortType.firstColumnAscending]: [
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.ascending
        }
    ],
    [ExampleSortType.firstColumnDescending]: [
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.descending
        }
    ],
    [ExampleSortType.secondColumnDescendingFirstColumnAscending]: [
        {
            columnId: 'last-name-column',
            sortDirection: TableColumnSortDirection.descending
        },
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.ascending
        }
    ]
} as const;

const sortedColumnsDescription = `A column within the table is configured to be sorted by specifying a \`sort-direction\` and a \`sort-index\` on
it. The \`sort-direction\` indicates the direction to sort (\`ascending\` or \`descending\`), and the \`sort-index\` specifies the sort precedence
of the column within the set of all sorted columns. Columns within the table will be sorted from lowest \`sort-index\` to highest \`sort-index\`. 
Sorting is based on the underlying field values in the column, not the rendered values.`;

interface SortingTableArgs extends CommonTableArgs {
    sortedColumns: ExampleSortType;
    getColumnSortData: (
        columnId: string,
        args: SortingTableArgs
    ) => { direction: TableColumnSortDirection, index: number | undefined };
}

export const sorting: StoryObj<SortingTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: sortedColumnsDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<SortingTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${idFieldName}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName"
                sort-direction="${x => x.getColumnSortData('first-name-column', x).direction}" sort-index="${x => x.getColumnSortData('first-name-column', x).index}"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName"
                sort-direction="${x => x.getColumnSortData('last-name-column', x).direction}" sort-index="${x => x.getColumnSortData('last-name-column', x).index}"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="favorite-color-column"
                field-name="favoriteColor"
                sort-direction="${x => x.getColumnSortData('favorite-color-column', x).direction}" sort-index="${x => x.getColumnSortData('favorite-color-column', x).index}"
            >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="quote-column"
                field-name="quote"
                sort-direction="${x => x.getColumnSortData('quote-column', x).direction}" sort-index="${x => x.getColumnSortData('quote-column', x).index}"
            >
                Quote
            </${tableColumnTextTag}>

        </${tableTag}>
    `),
    argTypes: {
        sortedColumns: {
            name: 'Sort configuration',
            description: sortedColumnsDescription,
            options: Object.values(ExampleSortType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleSortType.firstColumnAscending]:
                        'First name ascending',
                    [ExampleSortType.firstColumnDescending]:
                        'First name descending',
                    [ExampleSortType.secondColumnDescendingFirstColumnAscending]:
                        'Last name descending then first name ascending'
                }
            }
        },
        getColumnSortData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        sortedColumns: ExampleSortType.firstColumnAscending,
        getColumnSortData: (
            columnId: string,
            args: SortingTableArgs
        ): {
            direction: TableColumnSortDirection,
            index: number | undefined
        } => {
            const sortData = sortedOptions[args.sortedColumns];
            const matchingIndex = sortData.findIndex(
                sortedColumn => sortedColumn.columnId === columnId
            );
            if (matchingIndex === -1) {
                return {
                    direction: TableColumnSortDirection.none,
                    index: undefined
                };
            }

            return {
                direction: sortData[matchingIndex]!.sortDirection,
                index: matchingIndex
            };
        }
    }
};

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
            id-field-name="${idFieldName}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="name-column"
                field-name="${x => x.fieldName}"
            >
            Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="quote-column"
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
                'Set this attribute to identify which field in the data record should be displayed in each column',
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
