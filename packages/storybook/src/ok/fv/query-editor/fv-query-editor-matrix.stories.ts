import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import {
    fvQueryEditorTag,
    type FvQueryEditor,
    type QueryDocument,
    type QueryEditorLayout
} from '@ni/ok-components/dist/esm/fv/query-editor';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';
import { disableStorybookZoomTransform } from '../../../utilities/storybook';
import { queryBuilderDefinition, queryBuilderOperandExamples } from '../query-builder/fixtures';
import { queryEditorPresets } from './fixtures';

const metadata: Meta = {
    title: 'Tests Ok/Fv Query Editor',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

// Inert cells keep all callouts open when their controls request focus.
const component = (
    name: string,
    query: QueryDocument,
    layout: QueryEditorLayout = 'inline',
    disabled = false,
    open = false
): ViewTemplate => html`
    <section inert style="display: inline-block; vertical-align: top; width: 660px; min-height: ${() => (open ? 640 : 180)}px; padding: 16px; box-sizing: border-box;">
        <h3>${() => `${name}, ${layout}${disabled ? ', disabled' : ''}`}</h3>
        <${fvQueryEditorTag}
            label="Query conditions"
            :definition="${() => queryBuilderDefinition}"
            :query="${() => structuredClone(query)}"
            layout="${() => layout}"
            :disabled="${() => disabled}"
        ></${fvQueryEditorTag}>
    </section>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    ${createMatrix(
        ([name, query]: [string, QueryDocument], layout: QueryEditorLayout) => component(name, query, layout),
        [Object.entries(queryEditorPresets), ['inline', 'formatted']]
    )}
    ${createMatrix(
        (layout: QueryEditorLayout) => component('Disabled', queryEditorPresets.basic, layout, true),
        [['inline', 'formatted']]
    )}
`);

export const operandsThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    ${createMatrix(
        ({ name, query }: (typeof queryBuilderOperandExamples)[number]) => component(name, query, 'inline', false, true),
        [queryBuilderOperandExamples]
    )}
`);

const openConditions: NonNullable<StoryFn['play']> = async ({ canvasElement }) => {
    await waitForUpdatesAsync();
    for (const editor of canvasElement.querySelectorAll<FvQueryEditor>(fvQueryEditorTag)) {
        const chip = editor.shadowRoot?.querySelector<HTMLElement>('[data-rule-id]');
        if (!chip) {
            throw new Error('Matrix condition chip was not rendered.');
        }
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    }
    await waitForUpdatesAsync();
    await Promise.all(Array.from(canvasElement.querySelectorAll<FvQueryEditor>(fvQueryEditorTag)).map(async editor => {
        const region = editor.editorRegion;
        if (!region) {
            throw new Error('Matrix condition callout was not rendered.');
        }
        if (!region.initialLayoutComplete) {
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => resolve(), { once: true });
            });
        }
    }));
};
operandsThemeMatrix.play = openConditions;

export const valueDropdownThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    ${component('Workspace dropdown', {
        version: 1,
        root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'production' }
    }, 'inline', false, true)}
`);
valueDropdownThemeMatrix.play = async context => {
    await openConditions(context);
    for (const editor of context.canvasElement.querySelectorAll<FvQueryEditor>(fvQueryEditorTag)) {
        const select = editor.shadowRoot?.querySelector<Select>('[data-control="scalar-select"]');
        if (!select) {
            throw new Error('Matrix workspace dropdown was not rendered.');
        }
        select.open = true;
    }
    await waitForUpdatesAsync();
};
