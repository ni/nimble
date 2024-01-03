import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../../utilities/tests/matrix';
import { Table, tableTag } from '../../../table';
import { tableColumnEnumTextTag } from '..';
import { mappingTextTag } from '../../../mapping/text';

const metadata: Meta = {
    title: 'Tests/Table Column: Enum Text',
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
const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnEnumTextTag}
            field-name="code"
            key-type="number"
            group-index="0"
        >
            Column 1
            <${mappingTextTag} key="0" text="Zero"></${mappingTextTag}>
            <${mappingTextTag} key="1" text="One"></${mappingTextTag}>
        </${tableColumnEnumTextTag}>
    </${tableTag}>
`;

export const tableColumnEnumTextThemeMatrix: StoryFn = createMatrixThemeStory(
    component()
);

tableColumnEnumTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
