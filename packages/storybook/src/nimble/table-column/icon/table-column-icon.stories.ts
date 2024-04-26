import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { iconCheckLargeTag } from '@ni/nimble-components/dist/esm/icons/check-large';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { mappingSpinnerTag } from '@ni/nimble-components/dist/esm/mapping/spinner';
import { sharedMappingValidityDescription } from '@ni/nimble-components/dist/esm/table-column/enum-base/tests/shared-storybook-docs';
import { mappingTextTag } from '@ni/nimble-components/dist/esm/mapping/text';
import { tableColumnIconTag } from '@ni/nimble-components/dist/esm/table-column/icon';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import { isChromatic } from '../../../utilities/isChromatic';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        status: 'fail',
        isChild: true,
        gender: 'male'
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        status: 'success',
        isChild: false,
        gender: 'female'
    },
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        status: 'calculating',
        isChild: false,
        gender: 'male'
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        status: 'success',
        isChild: true,
        gender: 'male'
    },
    {
        firstName: 'Abbey',
        lastName: '?',
        status: 'unknown',
        isChild: false,
        gender: 'female'
    }
] as const;

const metadata: Meta<IconColumnTableArgs> = {
    title: 'Components/Table Column: Icon',
    parameters: {}
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
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
        >
            <${tableColumnTextTag} field-name="firstName" >
                Name
            </${tableColumnTextTag}>
            <${tableColumnIconTag} field-name="status" group-index="0">
                Status
                <${mappingIconTag} key="fail" icon="${iconXmarkTag}" severity="error" text="Not a Simpson"></${mappingIconTag}>
                <${mappingIconTag} key="success" icon="${iconCheckLargeTag}" severity="success" text="Is a Simpson"></${mappingIconTag}>
                <${mappingSpinnerTag} key="calculating" text="Calculating" text-hidden></${mappingSpinnerTag}>
                <${mappingIconTag} key="unknown" text="Unknown" text-hidden></${mappingIconTag}>
            </${tableColumnIconTag}>
            <${tableColumnIconTag} field-name="isChild" key-type="boolean">
                Is Child
                <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" text="Not a child"></${mappingIconTag}>
                <${mappingIconTag} key="true" icon="${iconCheckLargeTag}" severity="success" text="Is a child"></${mappingIconTag}>
            </${tableColumnIconTag}>
            <${tableColumnIconTag} field-name="gender" key-type="string">
                Gender
                <${mappingTextTag} key="male" text="Male"></${mappingTextTag}>
                <${mappingTextTag} key="female" text="Female"></${mappingTextTag}>
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
