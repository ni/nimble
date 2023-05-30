import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../../utilities/tests/matrix';
import { mappingTextTag } from '../mappings/text';
import { Table, tableTag } from '../../../table';
import { tableColumnIconTag, tableColumnMappingTag } from '..';
import { mappingIconTag } from '../mappings/icon';
import { mappingSpinnerTag } from '../mappings/spinner';
import { iconCheckTag } from '../../../icons/check';

const metadata: Meta = {
    title: 'Tests/Table Column Types',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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
    }
] as const;

// prettier-ignore
const mappingComponent = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnMappingTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingTextTag} key="0" label="Zero"></${mappingTextTag}>
            <${mappingTextTag} key="1" label="One"></${mappingTextTag}>
        </${tableColumnMappingTag}>
    </${tableTag}>
`;

export const tableColumnMappingThemeMatrix: StoryFn = createMatrixThemeStory(
    mappingComponent()
);

tableColumnMappingThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};

// prettier-ignore
const iconComponent = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnIconTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingIconTag} key="0" label="Zero" icon="${iconCheckTag}" severity="success"></${mappingIconTag}>
            <${mappingSpinnerTag} key="1" label="One"></${mappingSpinnerTag}>
        </${tableColumnIconTag}>
    </${tableTag}>
`;

export const tableColumnIconThemeMatrix: StoryFn = createMatrixThemeStory(
    iconComponent()
);

tableColumnIconThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
