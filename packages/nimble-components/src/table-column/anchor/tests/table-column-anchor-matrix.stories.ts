import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnAnchorTag } from '..';
import { iconUserTag } from '../../../icons/user';
import { Table, tableTag } from '../../../table';
import { AnchorAppearance } from '../../../anchor/types';
import {
    controlLabelFont,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Table Column: Anchor',
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
        firstName: 'https://nimble.ni.dev',
        link: 'https://nimble.ni.dev'
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

const appearanceStates: [string, string | undefined][] = Object.entries(
    AnchorAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

const underlineHiddenStates: [string, boolean][] = [
    ['Underline Hidden', true],
    ['', false]
];
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

// prettier-ignore
const component = (
    [appearanceName, appearance]: AppearanceState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">${appearanceName} ${underlineHiddenName} Anchor Table Column</label>
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tableColumnAnchorTag}
            label-field-name="firstName"
            href-field-name="link"
            group-index="0"
            appearance="${() => appearance}"
            ?underline-hidden="${() => underlineHidden}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnAnchorTag}>
    </${tableTag}>
`;

export const tableColumnAnchorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [appearanceStates, underlineHiddenStates])
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
