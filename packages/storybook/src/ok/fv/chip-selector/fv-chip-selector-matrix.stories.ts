import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { fvChipSelectorTag } from '@ni/ok-components/dist/esm/fv/chip-selector';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const selectionStates = [
    ['Empty', ''],
    ['Selected', 'Red,Yellow,Orange,Blue']
] as const;

const openStates = [
    ['Closed', false],
    ['Open', true]
] as const;

const disabledStates = [
    ['Enabled', false],
    ['Disabled', true]
] as const;

const metadata: Meta = {
    title: 'Tests Ok/Fv Chip Selector',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [selectionLabel, selectedValues]: (typeof selectionStates)[number],
    [openLabel, open]: (typeof openStates)[number],
    [disabledLabel, disabled]: (typeof disabledStates)[number]
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 28px 0; width: 320px;">
        <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
            ${() => `${selectionLabel} ${openLabel} ${disabledLabel}`}
        </div>
        <${fvChipSelectorTag}
            label="Label"
            options="Red,Yellow,Orange,Blue,Purple,Violet,Pink"
            selected-values="${() => selectedValues}"
            ?open="${() => open}"
            ?disabled="${() => disabled}"
        ></${fvChipSelectorTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [selectionStates, openStates, disabledStates])
);