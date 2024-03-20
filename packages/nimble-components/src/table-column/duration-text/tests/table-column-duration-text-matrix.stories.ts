import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnDurationTextTag } from '..';
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

const placeholderStates: [string, string | undefined][] = [
    ['With Placeholder', 'Custom placeholder'],
    ['', undefined]
];
type PlaceholderState = (typeof placeholderStates)[number];

// prettier-ignore
const component = (
    [placeholderName, placeholder]: PlaceholderState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        Duration Text Table Column ${placeholderName}
    </label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDurationTextTag}
            field-name="duration"
            group-index="0"
            placeholder="${() => placeholder}"
        >
            Duration
        </${tableColumnDurationTextTag}>
    </${tableTag}>
`;

export const tableColumnDurationTextThemeMatrix: StoryFn = createMatrixThemeStory(createMatrix(component, [placeholderStates]));

tableColumnDurationTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
