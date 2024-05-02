import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { iconQuestionTag } from '@ni/nimble-components/dist/esm/icons/question';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { mappingSpinnerTag } from '@ni/nimble-components/dist/esm/mapping/spinner';
import { mappingTextTag } from '@ni/nimble-components/dist/esm/mapping/text';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { TableColumnMappingWidthMode } from '@ni/nimble-components/dist/esm/table-column/mapping/types';
import { isChromatic } from '../../../utilities/isChromatic';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const data = [
    {
        id: '0',
        code: 0
    },
    {
        id: '1',
        code: 1
    },
    {
        id: '2',
        code: 2
    },
    {
        id: '3',
        code: 3
    },
    {
        id: '4',
        code: 4
    },
    {
        id: '5',
        code: 5
    },
    {
        id: '6',
        code: 6
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Mapping',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 520px; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}">
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingIconTag} key="0" text="Icon" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingIconTag} key="1" text="Icon, text-hidden" icon="${iconXmarkTag}" text-hidden></${mappingIconTag}>
            <${mappingSpinnerTag} key="2" text="Spinner"></${mappingSpinnerTag}>
            <${mappingSpinnerTag} key="3" text="Spinner, text-hidden" text-hidden></${mappingSpinnerTag}>
            <${mappingIconTag} key="4" text="Undefined icon, text-hidden" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="5" text="Undefined icon"></${mappingIconTag}>
            <${mappingTextTag} key="6" text="Text"</${mappingTextTag}>
        </${tableColumnMappingTag}>
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
        >
            Column 2
            <${mappingIconTag} key="-1" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingIconTag} key="1" text="One" icon="${iconCheckTag}" severity="warning"></${mappingIconTag}>
            <${mappingIconTag} key="2" text="Two" icon="${iconCheckTag}" severity="error"></${mappingIconTag}>
        </${tableColumnMappingTag}>
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
            width-mode="${TableColumnMappingWidthMode.iconSize}"
        >
            <${iconQuestionTag} title="Icon-only column"></${iconQuestionTag}>
            <${mappingIconTag} key="-1" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="success" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="1" text="One" icon="${iconCheckTag}" severity="warning" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="2" text="Two" icon="${iconCheckTag}" severity="error" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="3" text="Three" icon="${iconCheckTag}" severity="information" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="4" text="Four" icon="${iconCheckTag}" text-hidden></${mappingIconTag}>
        </${tableColumnMappingTag}>
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
        >
            Column 3
            <${mappingIconTag} key="-1" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="information"></${mappingIconTag}>
        </${tableColumnMappingTag}>
    </${tableTag}>
`;

export const tableColumnMappingThemeMatrix: StoryFn = createMatrixThemeStory(component());

tableColumnMappingThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
