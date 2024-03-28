import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
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
import {
    placeholderStates,
    type PlaceholderState
} from '../../../utilities/tests/states';

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

const metadata: Meta = {
    title: 'Tests/Table Column: Date Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [placeholderName, placeholder]: PlaceholderState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        Date Text Table Column ${placeholderName} 
    </label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDateTextTag}
            field-name="date"
            group-index="0"
            placeholder="${() => placeholder}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnDateTextTag}>
    </${tableTag}>
`;

export const tableColumnDateTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [placeholderStates])
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
