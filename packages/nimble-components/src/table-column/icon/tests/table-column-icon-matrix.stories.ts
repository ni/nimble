import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { Table, tableTag } from '../../../table';
import { tableColumnIconTag } from '..';
import { iconCheckTag } from '../../../icons/check';
import { mappingIconTag } from '../../../mapping/icon';
import { mappingSpinnerTag } from '../../../mapping/spinner';
import { isChromatic } from '../../../utilities/tests/isChromatic';
import { iconXmarkTag } from '../../../icons/xmark';
import { mappingTextTag } from '../../../mapping/text';
import { TableColumnMappingWidthMode } from '../types';
import { iconQuestionTag } from '../../../icons/question';

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
    title: 'Tests/Table Column: Icon',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 520px; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}">
        <${tableColumnIconTag}
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
        </${tableColumnIconTag}>
        <${tableColumnIconTag}
            field-name="code"
            key-type="number"
        >
            Column 2
            <${mappingIconTag} key="-1" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingIconTag} key="1" text="One" icon="${iconCheckTag}" severity="warning"></${mappingIconTag}>
            <${mappingIconTag} key="2" text="Two" icon="${iconCheckTag}" severity="error"></${mappingIconTag}>
        </${tableColumnIconTag}>
        <${tableColumnIconTag}
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
        </${tableColumnIconTag}>
        <${tableColumnIconTag}
            field-name="code"
            key-type="number"
        >
            Column 3
            <${mappingIconTag} key="-1" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="information"></${mappingIconTag}>
        </${tableColumnIconTag}>
    </${tableTag}>
`;

export const tableColumnIconThemeMatrix: StoryFn = createMatrixThemeStory(component());

tableColumnIconThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
