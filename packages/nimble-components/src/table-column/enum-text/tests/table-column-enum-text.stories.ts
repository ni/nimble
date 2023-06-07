import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnEnumTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';
import { mappingTextTag } from '../../../mapping/text';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        status: 'fail',
        isChild: true
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        status: 'success',
        isChild: false
    },
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        status: 'success',
        isChild: false
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        status: 'success',
        isChild: true
    },
    {
        firstName: 'Greg',
        lastName: '',
        status: 'foo',
        isChild: true
    },
    {
        firstName: 'Frank',
        lastName: '',
        status: 'bar',
        isChild: false
    }
];

const enumTextColumnDescription = 'The `nimble-table-column-enum-text` column renders string, number, or boolean values as mapped text in the `nimble-table`.';

const metadata: Meta<EnumTextColumnTableArgs> = {
    title: 'Table Column - Enum Text',
    parameters: {
        docs: {
            description: {
                component: enumTextColumnDescription
            }
        }
    }
};

export default metadata;

interface EnumTextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    keyType: string;
    checkValidity: () => void;
    validity: () => void;
}

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:

-   \`invalidMappingKeyValueForType\`: \`true\` a mapping has a \`key\` that is not of the \`key-type\` declared by the column
-   \`multipleDefaultMappings\`: \`true\` when multiple mappings have the \`default-mapping\` attribute
-   \`unsupportedMappingType\`: \`true\` when the column contains a mapping element other than \`nimble-mapping-text\`
-   \`duplicateMappingKey\`: \`true\` when multiple mappings have the same \`key\` value
-   \`missingKeyValue\`: \`true\` when a mapping has no \`key\` value, and it is not marked with \`default-mapping\`
`;

export const enumTextColumn: StoryObj<EnumTextColumnTableArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html<EnumTextColumnTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag} field-name="firstName" >
                Name
            </${tableColumnTextTag}>
            <${tableColumnEnumTextTag} field-name="status" group-index="0">
                Status
                <${mappingTextTag} key="fail" label="Not a Simpson"></${mappingTextTag}>
                <${mappingTextTag} key="success" label="Is a Simpson"></${mappingTextTag}>
                <${mappingTextTag} default-mapping label="Unknown"></${mappingTextTag}>
            </${tableColumnEnumTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
        fieldName: {
            name: 'field-name',
            description:
                "Set this attribute to identify which field in the data record contains the value for each cell in the column. The field values' type must match the type specified by the `key-type` attribute.",
            control: { type: 'none' }
        },
        keyType: {
            name: 'key-type',
            control: { type: 'none' },
            defaultValue: { summary: '"string"' },
            description:
                'The data type of the key values used for this column. Must be one of `"string"`, `"number"`, or `"boolean"`. Defaults to `"string"` if unspecified.'
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'Returns `true` if the column configuration is valid, otherwise `false`.'
        },
        validity: {
            description: validityDescription
        }
    },
    args: {
        ...sharedTableArgs(simpleData),
        fieldName: 'firstName',
        keyType: 'string',
        checkValidity: () => {},
        validity: () => {}
    }
};
