import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tableColumnDurationTextTag } from '@ni/nimble-components/dist/esm/table-column/duration-text';
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
        duration: 90001000
    },
    {
        id: '1',
        duration: 190001000
    },
    {
        id: '2'
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Duration Text',
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
        Duration Text Table Column ${placeholderName}
    </label>
    <${tableTag} id-field-name="id" style="height: 250px">
        <${tableColumnDurationTextTag}
            field-name="duration"
            group-index="0"
            placeholder="${() => placeholder}"
        >
            Duration
        </${tableColumnDurationTextTag}>
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
