import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnIconTag, tableColumnMappingTag } from '..';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { iconXmarkTag } from '../../../icons/xmark';
import { tableColumnTextTag } from '../../text';
import { iconCheckLargeTag } from '../../../icons/check-large';
import { mappingIconTag } from '../mappings/icon';
import { iconQuestionTag } from '../../../icons/question';
import { mappingTextTag } from '../mappings/text';

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
    },
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
            description:
                'Property whose value is an object containing flags representing validity conditions of the column.'
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

export default metadata;

interface MappingColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    keyType: string;
    checkValidity: () => void;
    validity: () => void;
}

const iconColumnDescription = 'The `nimble-table-column-icon` column renders string, number, or boolean values as a Nimble icon or `nimble-spinner` in the `nimble-table`.';

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
    `)
};

const mappingColumnDescription = 'The `nimble-table-column-mapping` column renders string, number, or boolean values as mapped text in the `nimble-table`.';

export const mappingColumn: StoryObj<MappingColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: mappingColumnDescription
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
            <${tableColumnMappingTag} field-name="status" group-index="0">
                Status
                <${mappingTextTag} key="fail" label="Not a Simpson"></${mappingTextTag}>
                <${mappingTextTag} key="success" label="Is a Simpson"></${mappingTextTag}>
                <${mappingTextTag} default-mapping label="Unknown"></${mappingTextTag}>
            </${tableColumnMappingTag}>
        </${tableTag}>
    `)
};
