import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
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
import { mappingSpinnerTag } from '../../../mapping/spinner';
import { sharedMappingValidityDescription } from '../../enum-base/tests/shared';

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
        status: 'calculating',
        isChild: true
    },
    {
        firstName: 'Frank',
        lastName: '',
        status: 'foo',
        isChild: false
    }
];

const iconColumnDescription = 'The `nimble-table-column-icon` column renders string, number, or boolean values as a Nimble icon or `nimble-spinner` in the `nimble-table`.';

const metadata: Meta<IconColumnTableArgs> = {
    title: 'Incubating/Table Column - Icon',
    parameters: {
        docs: {
            description: {
                component: iconColumnDescription
            }
        }
    }
};

export default metadata;

interface IconColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    keyType: string;
    checkValidity: () => void;
    validity: () => void;
}

const validityDescription = `${sharedMappingValidityDescription}
-   \`invalidIconName\`: \`true\` when a mapping's \`icon\` value is not the tag name of a valid, loaded Nimble icon (e.g. \`nimble-icon-check\`)
`;

export const iconColumn: StoryObj<IconColumnTableArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html<IconColumnTableArgs>`
        ${incubatingWarning({ componentName: 'table', statusLink: 'https://github.com/orgs/ni/projects/7/views/21' })}
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
                <${mappingSpinnerTag} key="calculating" label="Calculating"></${mappingSpinnerTag}>
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
