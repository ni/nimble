import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { Table, tableTag } from '../../../table';
import { tableColumnTextTag } from '..';
import { controlLabelFont, controlLabelFontColor } from '../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Table Column: Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        firstName: 'Ralph'
    },
    {
        id: '1',
        firstName: 'Milhouse'
    },
    {
        id: '2',
        firstName: null
    },
    {
        id: '3',
        firstName: ''
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
    Text Table Column ${placeholderName}
</label>
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tableColumnTextTag}
            field-name="id"
            placeholder="${() => placeholder}"
        >
            ID
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            field-name="firstName"
            group-index="0"
            placeholder="${() => placeholder}"
        >
            First name
        </${tableColumnTextTag}>
    </${tableTag}>
`;

export const tableColumnTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [placeholderStates])
);

tableColumnTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
