import { html, ref } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { ExampleDataType } from './types';
import { Table, tableTag } from '..';
import { TableRowSelectionMode } from '../types';
import { iconUserTag } from '../../icons/user';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import { tableColumnTextTag } from '../../table-column/text';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../../label-provider/base/tests/label-user-stories-utils';
import { labelProviderTableTag } from '../../label-provider/table';

interface TableArgs extends LabelUserArgs {
    data: ExampleDataType;
    selectionMode: keyof typeof TableRowSelectionMode;
    leafMode: boolean;
    idFieldName: undefined;
    parentIdFieldName: undefined;
    validity: undefined;
    checkValidity: undefined;
    setSelectedRecordIds: undefined;
    getSelectedRecordIds: undefined;
    tableRef: Table;
    updateData: (args: TableArgs) => void;
}

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        age: 12,
        quote: "I'm in danger!",
        parentId: undefined
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 12,
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!",
        parentId: undefined
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        age: 34,
        quote: 'Hi diddly-ho neighbor!',
        parentId: undefined
    }
] as const;

const hierarchicalData = [
    {
        firstName: 'Jacqueline',
        lastName: 'Bouvier',
        age: 80,
        quote: "I have laryngitis. It hurts to talk, so I'll just say one thing. You never do anything right.",
        id: '0',
        parentId: undefined
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 35,
        quote: "Oh, I've Always Wanted To Use Rosemary In Something!",
        id: '',
        parentId: '0'
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 12,
        quote: 'Cowabunga!',
        id: '2',
        parentId: ''
    },
    {
        firstName: 'Lisa',
        lastName: 'Simpson',
        age: 10,
        quote: 'I Am The Lizard Queen!',
        id: '3',
        parentId: ''
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        age: 1,
        quote: '<pacifier noise>',
        id: '4',
        parentId: ''
    },
    {
        firstName: 'Selma',
        lastName: 'Bouvier',
        age: 45,
        quote: "Hey relax. I've told ya' I've got money. I bought stock in a mace company just before society crumbled.",
        id: '5',
        parentId: '0'
    },
    {
        firstName: 'Patty',
        lastName: 'Bouvier',
        quote: "What do you know, he's wearing pants.",
        age: 45,
        id: '6',
        parentId: '0'
    },
    {
        firstName: 'Mona',
        lastName: 'Simpson',
        age: 77,
        quote: "Homer, if you're watching this, either I'm dead, or you've gone through my stuff",
        id: '7',
        parentId: undefined
    },
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        quote: "D'oh!",
        age: 35,
        id: '8',
        parentId: '7'
    },
    {
        firstName: 'Agnes',
        lastName: 'Skinner',
        age: 88,
        quote: 'See you in hell, Seymour.',
        id: '9',
        parentId: undefined
    },
    {
        firstName: 'Seymour',
        lastName: 'Skinner',
        quote: 'Isn’t it nice we hate the same things?',
        age: 42,
        id: '10',
        parentId: '9'
    }
];

const leafHierarchicalData = [
    {
        firstName: 'Health',
        id: 'Health',
        parentId: undefined
    },
    {
        firstName: 'CPU',
        id: 'Health.CPU',
        parentId: 'Health'
    },
    {
        firstName: '0.UsePercentage',
        lastName: 'Double',
        quote: '21.1%',
        id: 'Health.CPU.0.UsePercentage',
        parentId: 'Health.CPU'
    },
    {
        firstName: '1.UsePercentage',
        lastName: 'Double',
        quote: '15.6%',
        id: 'Health.CPU.1.UsePercentage',
        parentId: 'Health.CPU'
    },
    {
        firstName: '2.UsePercentage',
        lastName: 'Double',
        quote: '29.7%',
        id: 'Health.CPU.2.UsePercentage',
        parentId: 'Health.CPU'
    },
    {
        firstName: '3.UsePercentage',
        lastName: 'Double',
        quote: '18%',
        id: 'Health.CPU.3.UsePercentage',
        parentId: 'Health.CPU'
    },
    {
        firstName: 'Count',
        lastName: 'Integer',
        quote: '4',
        id: 'Health.CPU.Count',
        parentId: 'Health.CPU'
    },
    {
        firstName: 'MeanUsePercentage',
        lastName: 'Double',
        quote: '21.1%',
        id: 'Health.CPU.MeanUsePercentage',
        parentId: 'Health.CPU'
    },
    {
        firstName: 'Disk',
        id: 'Health.Disk',
        parentId: 'Health'
    },
    {
        firstName: 'Free',
        lastName: 'Double',
        quote: '400.5 GB',
        id: 'Health.Disk.Free',
        parentId: 'Health.Disk'
    },
    {
        firstName: 'Total',
        lastName: 'Double',
        quote: '499.5 GB',
        id: 'Health.Disk.Total',
        parentId: 'Health.Disk'
    },
    {
        firstName: 'UsePercentage',
        lastName: 'Double',
        quote: '19.81%',
        id: 'Health.Disk.UsePercentage',
        parentId: 'Health.Disk'
    },
    {
        firstName: 'Used',
        lastName: 'Double',
        quote: '99.0 GB',
        id: 'Health.Disk.Used',
        parentId: 'Health.Disk'
    },
    {
        firstName: 'Memory',
        id: 'Health.Memory',
        parentId: 'Health'
    },
    {
        firstName: 'Available',
        lastName: 'Double',
        quote: '2.2 GB',
        id: 'Health.Memory.Available',
        parentId: 'Health.Memory'
    },
    {
        firstName: 'Free',
        lastName: 'Double',
        quote: '2.2 GB',
        id: 'Health.Memory.Free',
        parentId: 'Health.Memory'
    },
    {
        firstName: 'Total',
        lastName: 'Double',
        quote: '8.5 GB',
        id: 'Health.Memory.Total',
        parentId: 'Health.Memory'
    },
    {
        firstName: 'UsePercentage',
        lastName: 'Double',
        quote: '74.2 %',
        id: 'Health.Memory.UsePercentage',
        parentId: 'Health.Memory'
    },
    {
        firstName: 'Used',
        lastName: 'Double',
        quote: '6.3 GB',
        id: 'Health.Memory.Used',
        parentId: 'Health.Memory'
    },
    {
        firstName: 'TestMonitor.0.Status',
        lastName: 'String',
        quote: 'Passed',
        id: 'TestMonitor.0.Status',
        parentId: undefined
    },
];

const firstNames = ['John', 'Sally', 'Joe', 'Michael', 'Sam'];
const lastNames = ['Davidson', 'Johnson', 'Abraham', 'Wilson'];
const ages = [16, 32, 48, 64];
const largeData = [];
for (let i = 0; i < 10000; i++) {
    const possibleParent = Math.floor(Math.random() * 100);
    const parentId = possibleParent < i ? possibleParent.toString() : undefined;
    largeData.push({
        id: i.toString(),
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        age: ages[i % ages.length],
        quote: `I'm number ${i + 1}!`,
        parentId
    });
}

const dataSets = {
    [ExampleDataType.simpleData]: simpleData,
    [ExampleDataType.largeDataSet]: largeData,
    [ExampleDataType.hierarchicalDataSet]: hierarchicalData,
    [ExampleDataType.leafHierarchicalDataSet]: leafHierarchicalData
} as const;

const dataSetIdFieldNames = {
    [ExampleDataType.simpleData]: 'firstName',
    [ExampleDataType.largeDataSet]: 'id',
    [ExampleDataType.hierarchicalDataSet]: 'id',
    [ExampleDataType.leafHierarchicalDataSet]: 'id'
} as const;

const overviewText = `The \`nimble-table\` is a component that offers a way to render tabular data in a variety of ways in each column.
For information about configuring table columns, see **Table Column Configuration** and **Table Column Types**.`;

const dataDescription = `To set the data on the table, call \`setData()\` with an array data records. Each record is made up of fields,
which are key/value pairs. The key in each pair must be of type \`string\`, which is defined by the type \`TableFieldName\`. The value
in each pair must be of type \`string\`, \`number\`, \`boolean\`, \`null\`, or \`undefined\`, which is defined by the type \`TableFieldValue\`.

The table will not automatically update if the contents of the array change after calling \`setData()\`. To trigger an update, call
\`setData()\` again with the same array reference or with a new array.

<details>
    <summary>Framework specific considerations</summary>
    - Angular: In addition to exposing the \`setData()\` function in Angular, you can use the \`data$\` property to provide an
    \`Observable<TableRecord[]>\`. Nimble will automatically subscribe and unsubscribe to the provided \`Observable\` and call
    \`setData()\` on the web component when new values are emitted. The \`data$\` \`Observable\` should only be used when an application
    does not need to be in control of the timing of when \`setData()\` is called and when the returned \`Promise\` resolves.
    - Blazor: Blazor does not expose a \`setData()\` function. Use the \`Data\` property on the Blazor component to set new data on the table.
    Setting a new value on the property in Blazor will internally call \`setData()\` on the web component.
</details>
`;

const idFieldNameDescription = `An optional string attribute that specifies the field name within a row's record to use as a row's ID.
If the attribute is not specified, a default ID will be generated. If the attribute is invalid, no rows in the table will be rendered,
and the table will enter an invalid state according to the \`validity\` property and \`checkValidity()\` function.

While the ID is optional, it is required when row selection is enabled.

The attribute is invalid in the following conditions:
-   Multiple records were found with the same ID. This will cause \`validity.duplicateRecordId\` to be \`true\`.
-   A record was found that did not have a field with the name specified by \`id-field-name\`. This will cause \`validity.missingRecordId\` to be \`true\`.
-   A record was found where \`id-field-name\` did not refer to a value of type \`string\`. This will cause \`validity.invalidRecordId\` to be \`true\`.`;

const parentIdFieldNameDescription = `An optional string attribute that specifies the field name within a row's record to use as a row's parent ID, which,
when used in combination with the \`idFieldName\` attribute, will display the table data in a hierarchical fashion. If the attribute is not specified, the
data in the table will always be presented without hierarchy.

The attribute is invalid in the following conditions:
-   When this attribute is set, but \`id-field-name\` is unset. This will cause \`validity.idFieldNameNotConfigured\` to be \`true\`.
-   When there are circular references between records discovered based on field values of \`parent-id-field-name\` for one record and \`id-field-name\` of another. This will cause \`validity.invalidParentIdConfiguration\` to be \`true\`.
-   When an id specified by \`parent-id-field-name\` is not discovered in any record. This will cause \`validity.invalidParentIdConfiguration\` to be \`true\`.`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the table's configuration can be in.
The object's type is \`TableValidity\`, and it contains the following boolean properties:

-   \`duplicateRecordId\`: \`true\` when multiple records were found with the same ID
-   \`missingRecordId\`: \`true\` when a record was found that did not have a field with the name specified by \`id-field-name\`, or when \`parent-id-field-name\` is set but \`id-field-name\` is not
-   \`invalidRecordId\`: \`true\` when a record was found where \`id-field-name\` did not refer to a value of type \`string\`
-   \`duplicateColumnId\`: \`true\` when multiple columns were defined with the same \`column-id\`
-   \`missingColumnId\`: \`true\` when a \`column-id\` was specified for some, but not all, columns
-   \`invalidColumnConfiguration\`: \`true\` when one or more columns have an invalid configuration. Call \`checkValidity()\` on each column to see which configuration is invalid and read the \`validity\` property of a column for more information about why it's invalid.
-   \`duplicateSortIndex\`: \`true\` when \`sort-index\` is specified as the same value for multiple columns that have \`sort-direction\` set to a value other than \`none\`
-   \`duplicateGroupIndex\`: \`true\` when \`group-index\` is specified as the same value for multiple columns
-   \`idFieldNameNotConfigured\`: \`true\` when a feature that requires \`id-field-name\` to be configured, such as row selection, is enabled but an \`id-field-name\` is not set
`;

const setSelectedRecordIdsDescription = `A function that makes the rows associated with the provided record IDs selected in the table.
If a record does not exist in the table's data, it will not be selected. If multiple record IDs are specified when the table's selection
mode is \`single\`, only the first record that exists in the table's data will become selected.`;

const metadata: Meta<TableArgs> = {
    title: 'Components/Table',
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: [
                'action-menu-beforetoggle',
                'action-menu-toggle',
                'selection-change',
                'column-configuration-change',
                'row-expand-toggle'
            ]
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            selection-mode="${x => TableRowSelectionMode[x.selectionMode]}"
            id-field-name="${x => dataSetIdFieldNames[x.data]}"
            data-unused="${x => x.updateData(x)}"
            parent-id-field-name="parentId"
            ?leaf-mode="${x => x.leafMode}"
        >
            <${tableColumnTextTag}
                column-id="first-name-column"
                field-name="firstName"
                action-menu-slot="name-menu" action-menu-label="Configure name"
            >
                Relative path
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="quote-column"
                field-name="quote"
            >
                Value
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="last-name-column"
                field-name="lastName"
            >
                Type
            </${tableColumnTextTag}>

            <${menuTag} slot="name-menu">
                <${menuItemTag}>Copy path</${menuItemTag}>
                <${menuItemTag}>Copy relative path</${menuItemTag}>
                <${menuItemTag}>Visualize</${menuItemTag}>
                <${menuItemTag}>Delete</${menuItemTag}>
            </${menuTag}>
        </${tableTag}>
    `),
    argTypes: {
        data: {
            name: 'setData(data)',
            description: dataDescription,
            options: Object.values(ExampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleDataType.simpleData]: 'Simple data',
                    [ExampleDataType.largeDataSet]: 'Large data set (10k rows)',
                    [ExampleDataType.hierarchicalDataSet]: 'Hierarchical data'
                }
            }
        },
        selectionMode: {
            table: {
                defaultValue: { summary: 'none' }
            },
            options: Object.keys(TableRowSelectionMode),
            description:
                'Controls whether the table supports selecting a single row at a time, multiple rows at a time, or no rows. When selection is enabled, `id-field-name` must be specified.',
            control: { type: 'radio' }
        },
        getSelectedRecordIds: {
            name: 'getSelectedRecordIds()',
            description:
                'A function that returns an array of record IDs that represent the selected row(s) in the table.',
            control: false
        },
        setSelectedRecordIds: {
            name: 'setSelectedRecordIds()',
            description: setSelectedRecordIdsDescription,
            control: false
        },
        idFieldName: {
            name: 'id-field-name',
            table: {
                defaultValue: { summary: 'undefined' }
            },
            description: idFieldNameDescription,
            control: false
        },
        parentIdFieldName: {
            name: 'parent-id-field-name',
            table: {
                defaultValue: { summary: 'undefined' }
            },
            description: parentIdFieldNameDescription,
            control: false
        },
        validity: {
            description: validityDescription,
            control: false
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'A function that returns `true` if the configuration of the table is valid and `false` if the configuration of the table is not valid.',
            control: false
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
        }
    },
    args: {
        data: ExampleDataType.leafHierarchicalDataSet,
        selectionMode: TableRowSelectionMode.multiple,
        idFieldName: undefined,
        validity: undefined,
        checkValidity: undefined,
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                await x.tableRef.setData(dataSets[x.data]);
            })();
        },
        leafMode: true
    }
};
addLabelUseMetadata(metadata, labelProviderTableTag);

export default metadata;

export const table: StoryObj<TableArgs> = {};
