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
        code: -1
    },
    {
        id: '5',
        code: -2
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
    <${tableTag} id-field-name="id" style="height: 450px; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}">
        <${tableColumnIconTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingIconTag} key="-2" text="Unknown value"></${mappingIconTag}>
            <${mappingIconTag} key="-1" text="Another unknown value" text-hidden></${mappingIconTag}>
            <${mappingIconTag} key="0" text="Zero" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingIconTag} key="1" text="One" icon="${iconXmarkTag}" text-hidden></${mappingIconTag}>
            <${mappingSpinnerTag} key="2" text="Two"></${mappingSpinnerTag}>
            <${mappingSpinnerTag} key="3" text="Three" text-hidden></${mappingSpinnerTag}>
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
