import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnAnchorTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { Table, tableTag } from '../../../table';
import { AnchorAppearance } from '../../../anchor/types';

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

const appearanceStates: [string, string | undefined][] = Object.entries(
    AnchorAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

// prettier-ignore
const component = (
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <label style="color: var(--ni-nimble-control-label-font-color); font: var(--ni-nimble-control-label-font)">${appearanceName} Anchor Table Column</label>
    <${tableTag} id-field-name="id" style="height: 300px">
        <${tableColumnAnchorTag}
            label-field-name="firstName"
            href-field-name="link"
            placeholder="no value"
            group-index="0"
            appearance="${() => appearance}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnAnchorTag}>
    </${tableTag}>
`;

export const tableColumnAnchorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [appearanceStates])
);

tableColumnAnchorThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
