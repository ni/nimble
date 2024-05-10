import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { iconCheckLargeTag } from '@ni/nimble-components/dist/esm/icons/check-large';
import { iconChartDiagramChildFocusTag } from '@ni/nimble-components/dist/esm/icons/chart-diagram-child-focus';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { mappingSpinnerTag } from '@ni/nimble-components/dist/esm/mapping/spinner';
import { sharedMappingValidityDescription } from '@ni/nimble-components/dist/esm/table-column/enum-base/tests/shared-storybook-docs';
import { mappingTextTag } from '@ni/nimble-components/dist/esm/mapping/text';
import { TableColumnMappingWidthMode } from '@ni/nimble-components/dist/esm/table-column/mapping/types';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import { isChromatic } from '../../../utilities/isChromatic';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import { mappingEmptyTag } from '@ni/nimble-components/dist/esm/mapping/empty';

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
            control: false
        },
        keyType: {
            name: 'key-type',
            control: false,
            defaultValue: { summary: '"string"' },
            description:
                'The data type of the key values used for this column. Must be one of `"string"`, `"number"`, or `"boolean"`. Defaults to `"string"` if unspecified.'
        },
        widthMode: {
            name: 'width-mode',
            options: Object.keys(TableColumnMappingWidthMode),
            control: { type: 'radio' },
            description: widthModeDescription
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
        widthMode: 'iconSize',
        checkValidity: () => {},
        validity: () => {}
    }
};
