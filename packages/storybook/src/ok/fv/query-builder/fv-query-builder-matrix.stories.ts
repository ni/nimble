import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import {
    fvQueryBuilderTag,
    type FvQueryBuilder,
    type QueryDocument
} from '@ni/ok-components/dist/esm/fv/query-builder';
import {
    cartesianProduct,
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';
import { disableStorybookZoomTransform } from '../../../utilities/storybook';
import { queryBuilderDefinition, queryBuilderPresets } from './fixtures';

const metadata: Meta = {
    title: 'Tests Ok/Fv Query Builder',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

interface BuilderState {
    readonly name: string;
    readonly query?: QueryDocument;
    readonly view?: 'closed' | 'query' | 'create' | 'saved' | 'menu';
    readonly disabled?: boolean;
    readonly nigel?: boolean;
    readonly creation?: boolean;
    readonly editing?: boolean;
    readonly deletion?: boolean;
    readonly prompt?: boolean;
    readonly preview?: boolean;
    readonly confirmation?: boolean;
    readonly pending?: boolean;
    readonly error?: boolean;
    readonly persistence?: boolean;
}

const states: readonly BuilderState[] = [
    { name: 'Closed', view: 'closed' },
    { name: 'Disabled', view: 'closed', disabled: true },
    { name: 'Empty', query: queryBuilderPresets.empty },
    { name: 'Basic' },
    { name: 'Grouped', query: queryBuilderPresets.multigroup },
    { name: 'Invalid operand', query: queryBuilderPresets.validation },
    { name: 'Complex', query: queryBuilderPresets.complex },
    { name: 'Create saved query', view: 'create' },
    { name: 'Edit saved query', view: 'saved' },
    { name: 'Delete confirmation', view: 'saved', confirmation: true },
    { name: 'Save pending', view: 'saved', pending: true },
    { name: 'Save error', view: 'saved', error: true },
    { name: 'Persistence unavailable', view: 'saved', persistence: false },
    { name: 'Nigel prompt', prompt: true },
    { name: 'Generated preview', preview: true },
    { name: 'Saved-query menu', view: 'menu' }
];

const featureStates: readonly BuilderState[] = cartesianProduct([
    [false, true],
    [false, true],
    [false, true],
    [false, true],
    ['saved', 'menu'] as const
]).map(([nigel, creation, editing, deletion, view]) => ({
    name: `Nigel ${nigel}, creation ${creation}, editing ${editing}, deletion ${deletion}, ${view}`,
    view,
    nigel,
    creation,
    editing,
    deletion
}));

// Inert cells prevent callout autofocus from dismissing neighboring matrix examples.
const component = (state: BuilderState): ViewTemplate => html`
    <section inert style="display: inline-block; vertical-align: top; width: 960px; max-width: 100%; min-height: 560px; padding: 16px; box-sizing: border-box;">
        <h3>${() => state.name}</h3>
        <${fvQueryBuilderTag}
            data-state="${() => state.name}"
            :definition="${() => queryBuilderDefinition}"
            :query="${() => structuredClone(state.query ?? queryBuilderPresets.basic)}"
            :disabled="${() => state.disabled ?? false}"
            :showNigelPrompt="${() => state.nigel ?? true}"
            :allowSavedQueryCreation="${() => state.creation ?? true}"
            :allowSavedQueryEditing="${() => state.editing ?? true}"
            :allowSavedQueryDeletion="${() => state.deletion ?? true}"
        ></${fvQueryBuilderTag}>
    </section>
`;

const prepareBuilders: NonNullable<StoryFn['play']> = async ({ canvasElement }) => {
    await waitForUpdatesAsync();
    for (const builder of canvasElement.querySelectorAll<FvQueryBuilder>(fvQueryBuilderTag)) {
        const state = [...states, ...featureStates].find(candidate => candidate.name === builder.dataset.state);
        if (!state) {
            throw new Error('Matrix builder state was not found.');
        }
        builder.savedQueries = [{ id: 'saved', name: 'Failed production tests', document: queryBuilderPresets.saved }];
        if (state.persistence !== false) {
            builder.saveHandler = async request => {
                await waitForUpdatesAsync();
                return {
                    id: request.id ?? 'new',
                    name: request.name,
                    document: request.document
                };
            };
            builder.deleteHandler = async () => {};
        }
    }
    await waitForUpdatesAsync();
    for (const builder of canvasElement.querySelectorAll<FvQueryBuilder>(fvQueryBuilderTag)) {
        const state = [...states, ...featureStates].find(candidate => candidate.name === builder.dataset.state)!;
        if (state.view === 'saved' || state.view === 'menu') {
            const option = builder.shadowRoot?.querySelector<HTMLElement>('[data-saved-query-id="saved"]');
            if (!option) {
                throw new Error('Matrix saved-query option was not rendered.');
            }
            option.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            builder.savedQueryName = 'Updated production tests';
            const nameInput = builder.shadowRoot?.querySelector<HTMLInputElement>('[data-control="saved-query-name"]');
            if (!nameInput) {
                throw new Error('Matrix saved-query name input was not rendered.');
            }
            nameInput.value = builder.savedQueryName;
            nameInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
        builder.isQuickEdit = state.view === undefined || state.view === 'query';
        builder.isCreatingSavedQuery = state.view === 'create';
        builder.isManagerOpen = state.view !== 'closed' && state.view !== 'menu';
        builder.isSavedMenuOpen = state.view === 'menu';
        builder.isAiPromptOpen = state.prompt ?? false;
        builder.aiQueryPreview = state.preview ? queryBuilderPresets.saved : null;
        builder.confirmingDelete = state.confirmation ?? false;
        builder.isOperationPending = state.pending ?? false;
        builder.operationError = state.error ? builder.labels.saveFailed : '';
    }
    await waitForUpdatesAsync();
};

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    ${createMatrix(component, [states])}
`);
statesThemeMatrix.play = prepareBuilders;

export const featuresThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    ${createMatrix(component, [featureStates])}
`);
featuresThemeMatrix.play = prepareBuilders;
