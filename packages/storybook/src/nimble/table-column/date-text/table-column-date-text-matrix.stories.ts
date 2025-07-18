import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tableColumnDateTextTag } from '@ni/nimble-components/dist/esm/table-column/date-text';
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
        date: new Date('Dec 21, 2020, 3:45:03 PM').valueOf()
    },
    {
        id: '1',
        date: new Date('Dec 21, 2020, 3:45:03 PM').valueOf()
    },
    {
        id: '2'
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Date Text',
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
        Date Text Table Column ${placeholderName} 
    </label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDateTextTag}
            field-name="date"
            group-index="0"
            placeholder="${() => placeholder}"
        >
            <${iconUserTag}></${iconUserTag}>
        </${tableColumnDateTextTag}>
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
