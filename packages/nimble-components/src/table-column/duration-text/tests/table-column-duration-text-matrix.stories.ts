import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnDurationTextTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { Table, tableTag } from '../../../table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Table Column: Duration Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        duration: 90001000
    },
    {
        id: '1',
        duration: 190001000
    },
    {
        id: '2'
    }
] as const;

// prettier-ignore
const component = (): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">Duration Text Table Column</label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDurationTextTag}
            field-name="duration"
            group-index="0"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnDurationTextTag}>
    </${tableTag}>
`;

export const tableColumnDurationTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

tableColumnDurationTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
