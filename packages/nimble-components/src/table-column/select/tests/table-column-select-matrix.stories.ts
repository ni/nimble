import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnSelectTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { Table, tableTag } from '../../../table';
import { SelectAppearance } from '../../../select/types';
import {
    controlLabelFont,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Table Column: Select',
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
    SelectAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

const underlineHiddenStates: [string, boolean | undefined][] = [
    ['Underline Hidden', true],
    ['', undefined]
];
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

// prettier-ignore
const component = (
    [appearanceName, appearance]: AppearanceState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">${appearanceName} ${underlineHiddenName} Select Table Column</label>
    <${tableTag} id-field-name="id" style="height: 300px">
        <${tableColumnSelectTag}
            label-field-name="firstName"
            href-field-name="link"
            group-index="0"
            appearance="${() => appearance}"
            underline-hidden="${() => underlineHidden}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnSelectTag}>
    </${tableTag}>
`;

export const tableColumnSelectThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [appearanceStates, underlineHiddenStates])
);

tableColumnSelectThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
