import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnDateTextTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { Table, tableTag } from '../../../table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Table Column: Date Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        date: new Date('Dec 21, 2020, 3:45:03 PM').valueOf()
    },
    {
        id: '1',
        date: new Date('Dec 21, 2020, 3:45:03 PM').valueOf()
    },
    {
        id: '2'
    }
] as const;

// prettier-ignore
const component = (): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">Date Text Table Column</label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDateTextTag}
            field-name="date"
            group-index="0"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnDateTextTag}>
    </${tableTag}>
`;

export const tableColumnDateTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

tableColumnDateTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
