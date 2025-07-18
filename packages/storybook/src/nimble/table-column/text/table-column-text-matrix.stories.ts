import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
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

const metadata: Meta = {
    title: 'Tests/Table Column: Text',
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

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [placeholderStates])
);

themeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);
        })
    );
};
