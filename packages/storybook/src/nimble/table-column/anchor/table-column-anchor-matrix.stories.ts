import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tableColumnAnchorTag } from '@ni/nimble-components/dist/esm/table-column/anchor';
import {
    placeholderStates,
    type PlaceholderState
} from '../../../utilities/states';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/matrix';

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

const appearanceStates = [
    ['Default', AnchorAppearance.default],
    ['Prominent', AnchorAppearance.prominent]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const underlineHiddenStates = [
    ['Underline Hidden', true],
    ['', false]
] as const;
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

const metadata: Meta = {
    title: 'Tests/Table Column: Anchor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [appearanceName, appearance]: AppearanceState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState,
    [placeholderName, placeholder]: PlaceholderState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        ${appearanceName} ${underlineHiddenName} Anchor Table Column ${placeholderName} 
    </label>
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tableColumnAnchorTag}
            label-field-name="firstName"
            href-field-name="link"
            group-index="0"
            appearance="${() => appearance}"
            ?underline-hidden="${() => underlineHidden}"
            placeholder="${() => placeholder}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnAnchorTag}>
    </${tableTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        appearanceStates,
        underlineHiddenStates,
        placeholderStates
    ])
);

themeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);
        })
    );
};
