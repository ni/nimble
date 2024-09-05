import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { tableColumnTextTag } from '../../../../nimble-components/src/table-column/text';
import { Table, tableTag } from '../../../../nimble-components/src/table';
import type { TableRecord } from '../../../../nimble-components/src/table/types';
import { tableFitRowsHeight } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { createFixedThemeStory } from '../../utilities/storybook';
import { createMatrix, sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

interface SimpleData extends TableRecord {
    firstName: string;
    lastName: string;
    favoriteColor: string;
}

const data: SimpleData[] = [];
for (let i = 0; i < 50; i++) {
    data.push({
        firstName: `First Name ${i}`,
        lastName: `Last Name ${i}`,
        favoriteColor: `Favorite Color ${i}`
    });
}

const groupingStates = [
    ['Not Grouped', undefined],
    ['Grouped', 0]
] as const;
type GroupingState = (typeof groupingStates)[number];

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [_groupingName, groupIndex]: GroupingState
): ViewTemplate => html`
    <style>
        ${tableTag} {
            height: var(${tableFitRowsHeight.cssCustomProperty});
            margin-bottom: 20px;
        }
    </style>
    <${tableTag}>
        <${tableColumnTextTag} field-name="firstName" group-index="${() => groupIndex}">First Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor">Favorite Color</${tableColumnTextTag}>
    </${tableTag}>
`;

const playFunction = async (rowCount: number): Promise<void> => {
    const tableData = data.slice(0, rowCount);
    await Promise.all(
        Array.from(document.querySelectorAll<Table>(tableTag)).map(
            async table => {
                await table.setData(tableData);
            }
        )
    );
};

export const tableFitRowsHeightWith5Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates]),
    backgroundStates[0]
);

tableFitRowsHeightWith5Rows.play = async () => playFunction(5);

export const tableFitRowsHeightWith10Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates]),
    backgroundStates[0]
);
tableFitRowsHeightWith10Rows.play = async () => playFunction(10);

export const tableFitRowsHeightWith50Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates]),
    backgroundStates[0]
);
tableFitRowsHeightWith50Rows.play = async () => playFunction(50);
