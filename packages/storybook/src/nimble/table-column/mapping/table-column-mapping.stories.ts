import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { tableTag } from '../../../../../nimble-components/src/table';
import { iconXmarkTag } from '../../../../../nimble-components/src/icons/xmark';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { iconCheckLargeTag } from '../../../../../nimble-components/src/icons/check-large';
import { iconChartDiagramChildFocusTag } from '../../../../../nimble-components/src/icons/chart-diagram-child-focus';
import { mappingIconTag } from '../../../../../nimble-components/src/mapping/icon';
import { mappingSpinnerTag } from '../../../../../nimble-components/src/mapping/spinner';
import { sharedMappingValidityDescription } from '../../../../../nimble-components/src/table-column/enum-base/tests/shared-storybook-docs';
import { mappingTextTag } from '../../../../../nimble-components/src/mapping/text';
import { mappingEmptyTag } from '../../../../../nimble-components/src/mapping/empty';
import { TableColumnMappingWidthMode } from '../../../../../nimble-components/src/table-column/mapping/types';
import { tableColumnMappingTag } from '../../../../../nimble-components/src/table-column/mapping';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import { isChromatic } from '../../../utilities/isChromatic';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

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

const metadata: Meta<MappingColumnTableArgs> = {
    title: 'Components/Table Column: Mapping',
    parameters: {}
};

export default metadata;

interface MappingColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    keyType: string;
    widthMode: keyof typeof TableColumnMappingWidthMode;
    checkValidity: () => void;
    validity: () => void;
    content: undefined;
}

const widthModeDescription = `When set to \`iconSize\`, the column will have a fixed width that makes the column the appropriate width to render only a single icon in the cell.
This should only be set when the header contains a single icon (no text) and none of the child mapping elements will result in text being rendered in a cell. When unset or set
to \`default\`, the column will be resizable and be sized based on its fractional-width and min-pixel-width values. A column with its \`width-mode\` set to \`iconSize\` should
should not be the right-most column in the table.`;

const validityDescription = `${sharedMappingValidityDescription}
-   \`invalidIconName\`: \`true\` when an icon mapping's \`icon\` value is not the tag name of a valid, loaded Nimble icon (e.g. \`nimble-icon-check\`)
`;

export const mappingColumn: StoryObj<MappingColumnTableArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MappingColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
        >
            <${tableColumnTextTag} field-name="firstName" >
                Name
            </${tableColumnTextTag}>
            <${tableColumnMappingTag} field-name="status" group-index="0">
                Status
                <${mappingIconTag} key="fail" icon="${iconXmarkTag}" severity="error" text="Not a Simpson"></${mappingIconTag}>
                <${mappingIconTag} key="success" icon="${iconCheckLargeTag}" severity="success" text="Is a Simpson"></${mappingIconTag}>
                <${mappingSpinnerTag} key="calculating" text="Calculating" text-hidden></${mappingSpinnerTag}>
                <${mappingEmptyTag} key="unknown" text="Unknown"></${mappingEmptyTag}>
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag} field-name="isChild" key-type="boolean" width-mode="${x => TableColumnMappingWidthMode[x.widthMode]}">
                <${iconChartDiagramChildFocusTag} title="Is child"></${iconChartDiagramChildFocusTag}> 
            
                <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" text="Not a child" text-hidden></${mappingIconTag}>
                <${mappingIconTag} key="true" icon="${iconCheckLargeTag}" severity="success" text="Is a child" text-hidden></${mappingIconTag}>
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag} field-name="gender" key-type="string">
                Gender
                <${mappingTextTag} key="male" text="Male"></${mappingTextTag}>
                <${mappingTextTag} key="female" text="Female"></${mappingTextTag}>
            </${tableColumnMappingTag}>
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
            table: { category: apiCategory.attributes },
            control: false
        },
        keyType: {
            name: 'key-type',
            control: false,
            defaultValue: { summary: '"string"' },
            description:
                'The data type of the key values used for this column. Must be one of `"string"`, `"number"`, or `"boolean"`. Defaults to `"string"` if unspecified.',
            table: { category: apiCategory.attributes }
        },
        widthMode: {
            name: 'width-mode',
            options: Object.keys(TableColumnMappingWidthMode),
            control: { type: 'radio' },
            description: widthModeDescription,
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'mapping column'
            }),
            table: { category: apiCategory.methods },
            control: false
        },
        validity: {
            description: validityDescription,
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        },
        content: {
            name: 'default',
            description:
                'One or more mapping elements which specify how to render each possible data value.',
            table: { category: apiCategory.slots },
            control: false
        }
    },
    args: {
        ...sharedTableArgs(simpleData),
        fieldName: 'firstName',
        keyType: 'string',
        widthMode: 'iconSize',
        checkValidity: () => {},
        validity: () => {}
    }
};
