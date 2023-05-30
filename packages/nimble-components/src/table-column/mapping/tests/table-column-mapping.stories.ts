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

const metadata: Meta<SharedTableArgs> = {
    title: 'Table Column Types',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MappingColumnTableArgs extends SharedTableArgs {}

const mappingColumnDescription = 'The `nimble-table-column-mapping` column renders string, number, or boolean values as mapped text in the `nimble-table`.';

export const iconColumn: StoryObj<MappingColumnTableArgs> = {
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
