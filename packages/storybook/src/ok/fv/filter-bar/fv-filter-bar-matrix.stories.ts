import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { fvFilterBarTag } from '@ni/ok-components/dist/esm/fv/filter-bar';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';
import filterBarStory from './fv-filter-bar.stories';

const states = [
    ['With values', false, true, 800, true],
    ['Narrow', false, true, 320, true],
    ['Disabled', true, true, 800, true],
    ['Without clear button', false, false, 800, true],
    ['Empty', false, true, 800, false]
] as const;

const metadata: Meta = {
    title: 'Tests Ok/Fv Filter Bar',
    parameters: sharedMatrixParameters()
};

export default metadata;

const component = (
    [label, disabled, showClearButton, width, hasValues]: (typeof states)[number]
): ViewTemplate => html`
    <div style="${() => `width: ${width}px; margin-bottom: 16px;`}">
        <${fvFilterBarTag}
            label="${() => label}"
            :query="${() => (hasValues ? filterBarStory.args?.query : { version: 1, root: null })}"
            :definition="${() => filterBarStory.args?.definition}"
            ?disabled="${() => disabled}"
            :showClearButton="${() => showClearButton}"
        ></${fvFilterBarTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [states])
);
