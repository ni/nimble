import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../../utilities/tests/matrix';
import { Table, tableTag } from '../../../table';
import { tableColumnIconTag } from '..';
import { iconCheckTag } from '../../../icons/check';
import { mappingIconTag } from '../../../mapping/icon';
import { mappingSpinnerTag } from '../../../mapping/spinner';

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
const component = (): ViewTemplate => html`
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
    component()
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
