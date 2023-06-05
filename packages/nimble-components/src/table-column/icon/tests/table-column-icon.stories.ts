import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnIconTag } from '..';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { iconXmarkTag } from '../../../icons/xmark';
import { tableColumnTextTag } from '../../text';
import { iconCheckLargeTag } from '../../../icons/check-large';
import { iconQuestionTag } from '../../../icons/question';
import { mappingIconTag } from '../../../mapping/icon';

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

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<MappingColumnTableArgs> = {
    title: 'Table Column Types',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    }
};

export default metadata;

interface MappingColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    keyType: string;
    checkValidity: () => void;
    validity: () => void;
}

const iconColumnDescription = 'The `nimble-table-column-icon` column renders string, number, or boolean values as a Nimble icon or `nimble-spinner` in the `nimble-table`.';

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:

-   \`invalidMappingKeyValueForType\`: \`true\` a mapping has a \`key\` that is not of the \`key-type\` declared by the column
-   \`multipleDefaultMappings\`: \`true\` when multiple mappings have the \`default-mapping\` attribute
-   \`unsupportedMappingType\`: \`true\` when the column contains a mapping element other than \`nimble-mapping-text\`
-   \`duplicateMappingKey\`: \`true\` when multiple mappings have the same \`key\` value
-   \`missingKeyValue\`: \`true\` when a mapping has no \`key\` value, and it is not marked with \`default-mapping\`
-   \`invalidIconName\`: \`true\` when a mapping's \`icon\` value is not the tag name of a valid, loaded Nimble icon (e.g. \`nimble-icon-check\`)
`;

export const iconColumn: StoryObj<MappingColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: iconColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MappingColumnTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag} field-name="firstName" >
                Name
            </${tableColumnTextTag}>
            <${tableColumnIconTag} field-name="status" group-index="0">
                Status
                <${mappingIconTag} key="fail" icon="${iconXmarkTag}" severity="error" label="Not a Simpson"></${mappingIconTag}>
                <${mappingIconTag} key="success" icon="${iconCheckLargeTag}" severity="success" label="Is a Simpson"></${mappingIconTag}>
                <${mappingIconTag} default-mapping icon="${iconQuestionTag}" label="Unknown"></${mappingIconTag}>
            </${tableColumnIconTag}>
            <${tableColumnIconTag} field-name="isChild" key-type="boolean">
                Is Child
                <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" label="Not a child"></${mappingIconTag}>
                <${mappingIconTag} key="true" icon="${iconCheckLargeTag}" severity="success" label="Is a child"></${mappingIconTag}>
            </${tableColumnIconTag}>
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
