import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory
} from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnAnchorTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { TableRowSelectionMode } from '../../../table/types';
import { Table, tableTag } from '../../../table';

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
        firstName: 'Ralph',
        link: 'https://nimble.ni.dev'
    },
    {
        id: '1',
        link: 'https://nimble.ni.dev'
    },
    {
        id: '2',
        firstName: null
    }
] as const;

const selectionModeStates = Object.values(TableRowSelectionMode);
type SelectionModeState = (typeof selectionModeStates)[number];

// prettier-ignore
const component = (
    selectionMode: SelectionModeState
): ViewTemplate => html`
    <${tableTag} selection-mode="${() => selectionMode}"" id-field-name="id" style="height: 300px">
        <${tableColumnAnchorTag} label-field-name="firstName" href-field-name="link" placeholder="no value" group-index="0"><${iconUserTag}></${iconUserTag}></${tableColumnAnchorTag}>
    </${tableTag}>
`;

export const tableColumnAnchorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [selectionModeStates])
);

tableColumnAnchorThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
                await table.setSelectedRecordIds(['1', '2']);
            }
        )
    );
};
