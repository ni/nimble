import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
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

const minColumnWidthStates = [
    ['Small Minimum', 100],
    ['Large Minimum (show horizontal scrollbar)', 500]
] as const;
type MinColumnWidthState = (typeof minColumnWidthStates)[number];

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [_groupingName, groupIndex]: GroupingState,
    [_minColumnWidthName, minColumnWidth]: MinColumnWidthState
): ViewTemplate => html`
    <style>
        ${tableTag} {
            height: var(${tableFitRowsHeight.cssCustomProperty});
            /** Set a fixed width to guarantee that the large minimum column width
            will cause the table to scroll horizontally. */
            width: 600px;
            margin-bottom: 20px;
        }
    </style>
    <${tableTag}>
        <${tableColumnTextTag} field-name="firstName" group-index="${() => groupIndex}" min-pixel-width="${() => minColumnWidth}">First Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName" min-pixel-width="${() => minColumnWidth}">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor" min-pixel-width="${() => minColumnWidth}">Favorite Color</${tableColumnTextTag}>
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

export const fit5Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates, minColumnWidthStates]),
    backgroundStates[0]
);

fit5Rows.play = async () => await playFunction(5);

export const fit10Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates, minColumnWidthStates]),
    backgroundStates[0]
);
fit10Rows.play = async () => await playFunction(10);

export const fit50Rows: StoryFn = createFixedThemeStory(
    createMatrix(component, [groupingStates, minColumnWidthStates]),
    backgroundStates[0]
);
fit50Rows.play = async () => await playFunction(50);
