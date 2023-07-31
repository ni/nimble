import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
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
import { sharedMappingValidityDescription } from '../../enum-base/tests/shared';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        status: 'fail'
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        status: 'success'
    },
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        status: 'success'
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        status: 'success'
    }
];

const enumTextColumnDescription = 'The `nimble-table-column-enum-text` column renders string, number, or boolean values as mapped text in the `nimble-table`.';

const metadata: Meta<EnumTextColumnTableArgs> = {
    title: 'Incubating/Table Column - Enum Text',
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

export const enumTextColumn: StoryObj<EnumTextColumnTableArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html<EnumTextColumnTableArgs>`
        ${incubatingWarning({ componentName: 'table', statusLink: 'https://github.com/orgs/ni/projects/7/views/21' })}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag} field-name="firstName" >
                Name
            </${tableColumnTextTag}>
            <${tableColumnEnumTextTag} field-name="status">
                Status
                <${mappingTextTag} key="fail" text="Not a Simpson"></${mappingTextTag}>
                <${mappingTextTag} key="success" text="Is a Simpson"></${mappingTextTag}>
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
            description: sharedMappingValidityDescription
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
