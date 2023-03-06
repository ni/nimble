import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory, usageWarning } from '../../utilities/tests/storybook';
import { ExampleDataType } from '../../table/tests/types';
import { ExampleSortType } from './types';
import { Table, tableTag } from '../../table';
import { TableColumnSortDirection } from '../../table/types';
import { iconUserTag } from '../../icons/user';
import { tableColumnTextTag } from '../text';

interface TableArgs {
    data: ExampleDataType;
    sortedColumns: ExampleSortType;
    idFieldName: undefined;
    headerText: string;
    validity: undefined;
    checkValidity: undefined;
    tableRef: Table;
    updateData: (args: TableArgs) => void;
    getColumnSortData: (
        columnId: string,
        args: TableArgs
    ) => { direction: TableColumnSortDirection, index: number | undefined };
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
        quote: 'Neddy doesn\'t believe in insurance. He considers it a form of gambling.'
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
    }
] as const;

const dataSets = {
    [ExampleDataType.simpleData]: simpleData,
} as const;

const dataSetIdFieldNames = {
    [ExampleDataType.simpleData]: 'firstName',
} as const;

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

const overviewText = `This page contains information about configuring the columns of a \`nimble-table\`. 
See the **Table** story for information about configuring the table itself.`;

const metadata: Meta<TableArgs> = {
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
    render: createUserSelectedThemeStory(html<TableArgs>`
    ${usageWarning('table')}
    <${tableTag}
        ${ref('tableRef')}
        id-field-name="${() => dataSetIdFieldNames[ExampleDataType.simpleData]}"
        data-unused="${x => x.updateData(x)}"
    >
        <${tableColumnTextTag}
            column-id="first-name-column"
            field-name="firstName" placeholder="no value"
        >
            First Name
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="last-name-column"
            field-name="lastName" placeholder="no value"
        >
            Last Name
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="favorite-color-column"
            field-name="favoriteColor" placeholder="no value"
        >
            Favorite Color
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            column-id="quote-column"
            field-name="quote" placeholder="no value"
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
        },
    },
    args: {
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(dataSets[ExampleDataType.simpleData]);
            })();
        }
    }
};

export default metadata;

// In the Docs tab, Storybook doesn't render the title of the first story
// This is a placeholder to get the useful ones to render
export const columns: StoryObj<TableArgs> = {
};

export const columnOrder: StoryObj<TableArgs> = {
};

const headerContentDescription = `The content of each column header comes from whatever is slotted in the column element. 
If you provide only text content, Nimble will style it, add a \`title\` to show a tooltip when truncated, 
and set appropriate ARIA attributes. If you provide icon content, you should set your own \`title\` and ARIA attributes for it. 
Titles should use "Headline Casing" and Nimble will automatically capitalize them for display.`;

export const headerContent: StoryObj<TableArgs> = {
    parameters: {
        docs: {
            description: {
                story: headerContentDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${() => dataSetIdFieldNames[ExampleDataType.simpleData]}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName" placeholder="no value"
            >
                <${iconUserTag} title="First Name"></${iconUserTag}>
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName" placeholder="no value"
            >
                ${x => x.headerText}
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="favorite-color-column"
                field-name="favoriteColor" placeholder="no value"
            >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="quote-column"
                field-name="quote" placeholder="no value"
            >
                Quote
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        headerText: {
            name: 'Second column header text',
            description:
                headerContentDescription
        },
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        },
    },
    args: {
        headerText: 'Last Name',
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(dataSets[ExampleDataType.simpleData]);
            })();
        }
    }
};

const sortedColumnsDescription = `A column within the table is configured to be sorted by specifying a \`sort-direction\` and a \`sort-index\` on
it. The \`sort-direction\` indicates the direction to sort (\`ascending\` or \`descending\`), and the \`sort-index\` specifies the sort precedence
of the column within the set of all sorted columns. Columns within the table will be sorted from lowest \`sort-index\` to highest \`sort-index\`. 
Sorting is based on the underlying field values in the column, not the rendered values.`;

export const sorting: StoryObj<TableArgs> = {
    parameters: {
        docs: {
            description: {
                story: sortedColumnsDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="${() => dataSetIdFieldNames[ExampleDataType.simpleData]}"
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName" placeholder="no value"
                sort-direction="${x => x.getColumnSortData('first-name-column', x).direction}" sort-index="${x => x.getColumnSortData('first-name-column', x).index}"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName" placeholder="no value"
                sort-direction="${x => x.getColumnSortData('last-name-column', x).direction}" sort-index="${x => x.getColumnSortData('last-name-column', x).index}"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="favorite-color-column"
                field-name="favoriteColor" placeholder="no value"
                sort-direction="${x => x.getColumnSortData('favorite-color-column', x).direction}" sort-index="${x => x.getColumnSortData('favorite-color-column', x).index}"
            >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="quote-column"
                field-name="quote" placeholder="no value"
                sort-direction="${x => x.getColumnSortData('quote-column', x).direction}" sort-index="${x => x.getColumnSortData('quote-column', x).index}"
            >
                Quote
            </${tableColumnTextTag}>

        </${tableTag}>
    `),
    argTypes: {
        sortedColumns: {
            name: 'sort configuration',
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
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
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
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(dataSets[ExampleDataType.simpleData]);
            })();
        },
        getColumnSortData: (
            columnId: string,
            args: TableArgs
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
// export const width: StoryObj<TableArgs> = {};
// export const actionMenu: StoryObj<TableArgs> = {};
// export const text: StoryObj<TableArgs> = {};
