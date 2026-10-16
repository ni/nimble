import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { applicationBackgroundColor, bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { fvBulkEditFieldTag } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const statusStates = [
    ['Unchanged', 'unchanged', true, 'Austin'],
    ['Mixed values', 'mixed', true, ''],
    ['Changed', 'changed', false, 'Shared lab'],
    ['Will clear', 'will-clear', false, '']
] as const;
type StatusState = (typeof statusStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Bulk Edit Field',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const field = ([name, status, resetDisabled, value]: StatusState): ViewTemplate => html`
    <div style="width: 320px; margin: 0 8px 8px 0; padding: 8px; background: var(${applicationBackgroundColor.cssCustomProperty}); font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">
        <div style="margin-bottom: 8px;">${() => name}</div>
        <${fvBulkEditFieldTag}
            label="Location"
            status="${() => status}"
            ?reset-disabled="${() => resetDisabled}"
        >
            <${textFieldTag} :value="${() => value}"></${textFieldTag}>
        </${fvBulkEditFieldTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(field, [statusStates])
);
