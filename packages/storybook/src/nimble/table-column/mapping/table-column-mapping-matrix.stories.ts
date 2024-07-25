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
import { mappingEmptyTag } from '@ni/nimble-components/dist/esm/mapping/empty';
import { isChromatic } from '../../../utilities/isChromatic';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const data = [
    {
        id: '-1',
        code: -1
    },
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
    <${tableTag} id-field-name="id" style="height: 600px; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}">
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingIconTag} key="-1" text="Icon" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Icon, text-hidden" icon="${iconXmarkTag}" text-hidden></${mappingIconTag}>
            <${mappingSpinnerTag} key="1" text="Spinner"></${mappingSpinnerTag}>
            <${mappingSpinnerTag} key="2" text="Spinner, text-hidden" text-hidden></${mappingSpinnerTag}>
            <${mappingTextTag} key="3" text="Text"></${mappingTextTag}>
            <${mappingEmptyTag} key="4" text="Empty mapping"></${mappingEmptyTag}>
        </${tableColumnMappingTag}>
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
        >
            Column 2
            <${mappingTextTag} key="-1" text="Unknown value"></${mappingTextTag}>
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
            <${mappingEmptyTag} key="-1" text="Unknown value"></${mappingEmptyTag}>
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
            <${mappingTextTag} key="-1" text="Unknown value"></${mappingTextTag}>
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
