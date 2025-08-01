import { html, ref, when } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    TableColumnSortDirection,
    TableRowSelectionMode
} from '@ni/nimble-components/dist/esm/table/types';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import { iconCommentTag } from '@ni/nimble-components/dist/esm/icons/comment';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import {
    ExampleColumnFractionalWidthType,
    ExampleGroupingDisabledType,
    ExampleGroupType,
    ExampleSortType
} from '@ni/nimble-components/dist/esm/table-column/base/tests/types';
import {
    type SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from './table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Quincy',
        lastName: 'Wiggum',
        favoriteColor: 'Blue',
        quote: "I've got everything I need to convict your boy, except for motive, means, and opportunity."
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

const overviewText = `This page contains information about configuring the columns of a \`nimble-table\`. 
See [Table](?path=/docs/components-table--docs) for information about configuring the table itself and the **Table Column** pages for 
information about specific types of column.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column Configuration',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<SharedTableArgs>`
    <${tableTag}
        ${ref('tableRef')}
        data-unused="${x => x.updateData(x)}"
        id-field-name="firstName"
        style="height: 320px"
        selection-mode="${x => TableRowSelectionMode[x.selectionMode]}
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
        <${tableColumnTextTag}
            field-name="favoriteColor"
        >
            Favorite Color
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            field-name="quote"
        >
            Quote
        </${tableColumnTextTag}>
    </${tableTag}>
    `),
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        }
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface ApiTableArgs extends SharedTableArgs {
    content: undefined;
    columnHidden: undefined;
    columnId: undefined;
    actionMenuSlot: undefined;
    actionMenuLabel: undefined;
    sortDirection: undefined;
    sortingDisabled: undefined;
    sortIndex: undefined;
    groupIndex: undefined;
    groupingDisabled: undefined;
    fractionalWidth: undefined;
    minPixelWidth: undefined;
}

export const api: StoryObj<ApiTableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    argTypes: {
        content: {
            name: 'default',
            description:
                'Text or an icon added to the default slot of the column will be placed in the column header. See **Setting header content** for more information.',
            table: { category: apiCategory.slots },
            control: false
        },
        columnHidden: {
            name: 'column-hidden',
            description:
                'Whether the column is hidden from display. See **Hiding** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        columnId: {
            name: 'column-id',
            description:
                "Optionally use the `column-id` attribute to uniquely identify a column for features like adding an action menu. If you aren't using features that require a column id you may leave it unset for all columns. If you provide `column-id` for any column within a table then you must provide it for all and they must be unique strings.",
            table: { category: apiCategory.attributes },
            control: false
        },
        actionMenuSlot: {
            name: 'action-menu-slot',
            description:
                'Configure this column to have an action menu by setting this attribute to the name of a slot in the table that contains the menu.',
            table: { category: apiCategory.attributes },
            control: false
        },
        actionMenuLabel: {
            name: 'action-menu-label',
            description:
                'Configures the title and accessible label of the action menu button for this column.',
            table: { category: apiCategory.attributes },
            control: false
        },
        sortDirection: {
            name: 'sort-direction',
            description:
                'The direction to sort the data in the column. See **Sorting** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        sortingDisabled: {
            name: 'sorting-disabled',
            description:
                'Whether to disallow a user from sorting a column by interacting with its header. See **Sorting** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        sortIndex: {
            name: 'sort-index',
            description:
                'Specifies the sort precedence of the column within the set of all sorted columns. See **Sorting** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        groupIndex: {
            name: 'group-index',
            description:
                'Specifies the group precedence of the column within the set of all grouped columns. See **Grouping** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        groupingDisabled: {
            name: 'grouping-disabled',
            description:
                'Prevents the column from participating in grouping. See **Grouping** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        fractionalWidth: {
            name: 'fractional-width',
            description:
                'Configures the proportion of the table width that this column should occupy initially. See **Column width** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        },
        minPixelWidth: {
            name: 'min-pixel-width',
            description:
                'Configures the minimum width that the column can be interactively resized to. See **Column width** for more information.',
            table: { category: apiCategory.attributes },
            control: false
        }
    }
};

type ColumnOrderOption = 'FirstName, LastName' | 'LastName, FirstName';

interface ColumnOrderTableArgs extends SharedTableArgs {
    columnOrder: ColumnOrderOption;
}

const addingColumnsDescription = `Configure columns by adding column elements as children of the table. 
The order of the elements controls the order that columns will appear in the table.`;

export const addingColumns: StoryObj<ColumnOrderTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: addingColumnsDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<ColumnOrderTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
        >
            ${when(x => x.columnOrder === 'FirstName, LastName', html`
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
            `)}
            ${when(x => x.columnOrder === 'LastName, FirstName', html`
                <${tableColumnTextTag}
                    field-name="lastName"
                >
                Last Name
                </${tableColumnTextTag}>
                <${tableColumnTextTag}
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
            description: addingColumnsDescription,
            options: ['FirstName, LastName', 'LastName, FirstName'],
            control: { type: 'radio' }
        }
    },
    args: {
        columnOrder: 'FirstName, LastName'
    }
};

type HeaderIconOption = 'user' | 'comment';

interface HeaderContentTableArgs extends SharedTableArgs {
    headerIcon: HeaderIconOption;
    headerText: string;
}

const headerContentIntro = 'The content of each column header comes from whatever is slotted in the column element.';
const headerTextContent = `If you provide only text content (or text content inside a \`<span>\`), Nimble will style it
and add a \`title\` to show a tooltip when truncated.`;
const headerIconContent = 'If you provide icon content, you should set your own `title` on the icon element.';
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
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
        >
            <${tableColumnTextTag}
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

const columnHiddenDescription = 'Columns can be added to the table but hidden from display. One use case for this is to sort by a field but not display its value.';

interface ColumnHiddenTableArgs extends SharedTableArgs {
    columnHidden: boolean;
}

export const columnHidden: StoryObj<ColumnHiddenTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: columnHiddenDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<ColumnHiddenTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
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
            description:
                'Add the `column-hidden` attribute to hide a column from display.'
        }
    },
    args: {
        columnHidden: false
    }
};

const sortedOptions = {
    [ExampleSortType.none]: [],
    [ExampleSortType.firstColumnAscending]: [
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.ascending,
            sortingDisabled: false
        }
    ],
    [ExampleSortType.firstColumnDescending]: [
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.descending,
            sortingDisabled: false
        }
    ],
    [ExampleSortType.secondColumnDescendingFirstColumnAscending]: [
        {
            columnId: 'last-name-column',
            sortDirection: TableColumnSortDirection.descending,
            sortingDisabled: false
        },
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.ascending,
            sortingDisabled: false
        }
    ],
    [ExampleSortType.firstColumnAscendingSecondColumnDisabled]: [
        {
            columnId: 'first-name-column',
            sortDirection: TableColumnSortDirection.ascending,
            sortingDisabled: false
        },
        {
            columnId: 'last-name-column',
            sortDirection: TableColumnSortDirection.none,
            sortingDisabled: true
        }
    ]
} as const;

const sortedColumnsDescription = `A column within the table is configured to be sorted by specifying a \`sort-direction\` and a \`sort-index\` on
it. The \`sort-direction\` indicates the direction to sort (\`ascending\` or \`descending\`), and the \`sort-index\` specifies the sort precedence
of the column within the set of all sorted columns. Columns within the table will be sorted from lowest \`sort-index\` to highest \`sort-index\`. 
Columns can be interactively sorted by the user by clicking/Shift-clicking on the column headers (which will not change \`sort-index\` or \`sort-direction\`).
To disable sorting on a column (both programmatic and interactive sorting), set \`sorting-disabled\` to \`true\` on it.
Sorting is based on the underlying field values in the column, not the rendered values.`;

interface SortingTableArgs extends SharedTableArgs {
    sortedColumns: ExampleSortType;
    getColumnSortData: (
        columnId: string,
        args: SortingTableArgs
    ) => {
        direction: TableColumnSortDirection,
        sortingDisabled: boolean,
        index: number | undefined
    };
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
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
        >
            <${tableColumnTextTag}
                field-name="firstName"
                sort-direction="${x => x.getColumnSortData('first-name-column', x).direction}"
                sort-index="${x => x.getColumnSortData('first-name-column', x).index}"
                sorting-disabled="${x => x.getColumnSortData('first-name-column', x).sortingDisabled}"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
                sort-direction="${x => x.getColumnSortData('last-name-column', x).direction}"
                sort-index="${x => x.getColumnSortData('last-name-column', x).index}"
                sorting-disabled="${x => x.getColumnSortData('last-name-column', x).sortingDisabled}"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="favoriteColor"
                sort-direction="${x => x.getColumnSortData('favorite-color-column', x).direction}"
                sort-index="${x => x.getColumnSortData('favorite-color-column', x).index}"
                sorting-disabled="${x => x.getColumnSortData('favorite-color-column', x).sortingDisabled}"
            >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="quote"
                sort-direction="${x => x.getColumnSortData('quote-column', x).direction}"
                sort-index="${x => x.getColumnSortData('quote-column', x).index}"
                sorting-disabled="${x => x.getColumnSortData('quote-column', x).sortingDisabled}"
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
                    [ExampleSortType.none]: 'None',
                    [ExampleSortType.firstColumnAscending]:
                        'First name ascending',
                    [ExampleSortType.firstColumnDescending]:
                        'First name descending',
                    [ExampleSortType.secondColumnDescendingFirstColumnAscending]:
                        'Last name descending then first name ascending',
                    [ExampleSortType.firstColumnAscendingSecondColumnDisabled]:
                        'First name ascending; sorting disabled for last name'
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
            sortingDisabled: boolean,
            index: number | undefined
        } => {
            const sortData = sortedOptions[args.sortedColumns];
            const matchingIndex = sortData.findIndex(
                sortedColumn => sortedColumn.columnId === columnId
            );
            if (matchingIndex === -1) {
                return {
                    direction: TableColumnSortDirection.none,
                    sortingDisabled: false,
                    index: undefined
                };
            }

            return {
                direction: sortData[matchingIndex]!.sortDirection,
                sortingDisabled: sortData[matchingIndex]!.sortingDisabled,
                index: matchingIndex
            };
        }
    }
};

const groupedRowOptions = {
    [ExampleGroupType.none]: [],
    [ExampleGroupType.firstName]: [
        {
            columnId: 'first-name-column'
        }
    ],
    [ExampleGroupType.lastName]: [
        {
            columnId: 'last-name-column'
        }
    ],
    [ExampleGroupType.firstThenLastName]: [
        {
            columnId: 'first-name-column'
        },
        {
            columnId: 'last-name-column'
        }
    ],
    [ExampleGroupType.lastThenFirstName]: [
        {
            columnId: 'last-name-column'
        },
        {
            columnId: 'first-name-column'
        }
    ]
} as const;

const groupingDisabledOptions = {
    [ExampleGroupingDisabledType.firstName]: {
        columnId: 'first-name-column'
    },
    [ExampleGroupingDisabledType.lastName]: {
        columnId: 'last-name-column'
    }
};

function getColumnGroupData(
    columnId: string,
    groupType: ExampleGroupType
): { index: number | undefined } {
    const groupData = groupedRowOptions[groupType];
    const matchingIndex = groupData.findIndex(
        groupedColumn => groupedColumn.columnId === columnId
    );
    if (matchingIndex === -1) {
        return {
            index: undefined
        };
    }

    return {
        index: matchingIndex
    };
}

function getGroupingDisabledData(
    columnId: string,
    groupDisabledTypes: ExampleGroupingDisabledType[]
): boolean {
    const groupingDisabledData = groupDisabledTypes.map(
        x => groupingDisabledOptions[x]
    );
    return groupingDisabledData.findIndex(x => x.columnId === columnId) >= 0;
}

const groupedRowsDescription = `A column can be configured such that all values within that column that have the same value get parented under a collapsible row.
There will be a collapsible row per unique value in a given column. When \`group-index\` is set on a column, that column will be grouped. If more than one column is
configured with a \`group-index\`, the precedence is determined by the value of \`group-index\` on each column. Grouping is based on the underlying field values in the column,
not the rendered values.`;

const groupingDisabledDescription = 'A groupable column can disable its ability to be grouped through setting `grouping-disabled`.';

interface GroupingTableArgs extends SharedTableArgs {
    groupedColumns: ExampleGroupType;
    groupingDisabled: ExampleGroupingDisabledType[];
}

export const grouping: StoryObj<GroupingTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: groupedRowsDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<GroupingTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
        >
            <${tableColumnTextTag}
                field-name="firstName"
                group-index="${x => getColumnGroupData('first-name-column', x.groupedColumns).index}"
                grouping-disabled="${x => getGroupingDisabledData('first-name-column', x.groupingDisabled)}"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
                group-index="${x => getColumnGroupData('last-name-column', x.groupedColumns).index}"
                grouping-disabled="${x => getGroupingDisabledData('last-name-column', x.groupingDisabled)}"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="favoriteColor"
            >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="quote"
            >
                Quote
            </${tableColumnTextTag}>

        </${tableTag}>
    `),
    argTypes: {
        groupedColumns: {
            name: 'Group configuration',
            description: groupedRowsDescription,
            options: Object.values(ExampleGroupType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleGroupType.none]: 'None',
                    [ExampleGroupType.firstName]: 'Group by first name',
                    [ExampleGroupType.lastName]: 'Group by last name',
                    [ExampleGroupType.firstThenLastName]:
                        'Group by first name then last.',
                    [ExampleGroupType.lastThenFirstName]:
                        'Group by last name then first.'
                }
            }
        },
        groupingDisabled: {
            name: 'Grouping disabled configuration',
            description: groupingDisabledDescription,
            control: {
                type: 'check',
                labels: {
                    [ExampleGroupingDisabledType.firstName]:
                        'Disable first name grouping',
                    [ExampleGroupingDisabledType.lastName]:
                        'Disable last name grouping'
                }
            },
            options: Object.values(ExampleGroupingDisabledType)
        }
    },
    args: {
        groupedColumns: ExampleGroupType.lastName,
        groupingDisabled: []
    }
};

interface ColumnWidthTableArgs extends SharedTableArgs {
    fractionalWidth: ExampleColumnFractionalWidthType;
    minPixelWidth: number;
    getColumnWidthData: (
        columnId: string,
        args: ColumnWidthTableArgs
    ) => number | undefined;
}

const fractionalWidthOptions = {
    [ExampleColumnFractionalWidthType.default]: [],
    [ExampleColumnFractionalWidthType.firstColumnHalfSize]: [
        {
            columnId: 'first-name-column',
            width: 0.5
        }
    ],
    [ExampleColumnFractionalWidthType.firstColumTwiceSize]: [
        {
            columnId: 'first-name-column',
            width: 2
        }
    ],
    [ExampleColumnFractionalWidthType.thirdColumnHalfFourthColumnTwice]: [
        {
            columnId: 'favorite-color-column',
            width: 0.5
        },
        {
            columnId: 'quote-column',
            width: 2
        }
    ]
} as const;

const widthDescription = `Configure each column's width relative to the other columns with the \`fractional-width\` property. For example, a column with a \`fractional-width\` set to 2 will be twice as wide as a column with a \`fractional-width\` set to 1. 
The default value for \`fractional-width\` is 1, and columns that don't support \`fractional-width\` explicitly, or another API responsible for managing the width of the column, will also behave as if they have a \`fractional-width\` of 1. This value only serves
as an initial state for a column. Once a column has been manually resized the column will use a fractional width calculated by the table from the resize.`;

const minPixelWidthDescription = `Table columns that support having a \`fractional-width\` can also be configured to have a minimum width such that its width
will never shrink below the specified pixel width. This applies to both when a table is resized as well as when a column is interactively resized.`;

export const width: StoryObj<ColumnWidthTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: widthDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<ColumnWidthTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="firstName"
            style="height: 320px"
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
        >
           <${tableColumnTextTag}
                field-name="firstName"
                fractional-width="${x => x.getColumnWidthData('first-name-column', x)}"
                min-pixel-width="${x => x.minPixelWidth}"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
                fractional-width="${x => x.getColumnWidthData('last-name-column', x)}"
                min-pixel-width="${x => x.minPixelWidth}"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="favoriteColor"
                fractional-width="${x => x.getColumnWidthData('favorite-color-column', x)}"
                min-pixel-width="${x => x.minPixelWidth}"
           >
                Favorite Color
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="quote"
                fractional-width="${x => x.getColumnWidthData('quote-column', x)}"
                min-pixel-width="${x => x.minPixelWidth}"
            >
                Quote
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fractionalWidth: {
            name: 'Fractional width configuration',
            description: widthDescription,
            options: Object.values(ExampleColumnFractionalWidthType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleColumnFractionalWidthType.default]: 'Default',
                    [ExampleColumnFractionalWidthType.firstColumnHalfSize]:
                        'First column half size',
                    [ExampleColumnFractionalWidthType.firstColumTwiceSize]:
                        'First column double size',
                    [ExampleColumnFractionalWidthType.thirdColumnHalfFourthColumnTwice]:
                        'Third column half size, fourth column double size'
                }
            }
        },
        minPixelWidth: {
            name: 'min-pixel-width',
            description: minPixelWidthDescription,
            control: {
                type: 'number'
            }
        },
        getColumnWidthData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        fractionalWidth: ExampleColumnFractionalWidthType.default,
        minPixelWidth: 100,
        getColumnWidthData: (
            columnId: string,
            args: ColumnWidthTableArgs
        ): number | undefined => {
            const widthData = fractionalWidthOptions[args.fractionalWidth];
            const matchingIndex = widthData?.findIndex(
                column => column.columnId === columnId
            );
            if (matchingIndex === -1) {
                return 1;
            }

            return widthData[matchingIndex]?.width;
        }
    }
};
