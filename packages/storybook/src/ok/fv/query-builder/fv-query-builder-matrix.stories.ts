import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import type { FvSplitButton } from '@ni/ok-components/dist/esm/fv/split-button';
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
    parameters: {
        ...sharedMatrixParameters(),
        chromatic: { viewports: [1440] }
    }
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
    <section inert style="width: 660px; min-height: 640px; padding: 16px; box-sizing: border-box;">
        <h3 style="color: var(${bodyFontColor.cssCustomProperty});">${() => state.name}</h3>
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
        const region = builder.queryPopoverRegion;
        if (!region) {
            throw new Error('Matrix query popover region was not rendered.');
        }
        // Keep offscreen examples beside their anchors instead of locking them to the viewport.
        region.fixedPlacement = false;
        region.horizontalViewportLock = false;
        region.verticalViewportLock = false;
        region.horizontalDefaultPosition = 'right';
        region.verticalPositioningMode = 'locktodefault';
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
    await Promise.all(Array.from(canvasElement.querySelectorAll<FvQueryBuilder>(fvQueryBuilderTag)).map(async builder => {
        const state = [...states, ...featureStates].find(candidate => candidate.name === builder.dataset.state)!;
        if (state.view === 'saved' || state.view === 'menu') {
            const option = builder.shadowRoot?.querySelector<HTMLElement>('[data-saved-query-id="saved"]');
            if (!option) {
                throw new Error('Matrix saved-query option was not rendered.');
            }
            option.click();
            await waitForUpdatesAsync();
            if (state.editing !== false) {
                builder.savedQueryName = 'Updated production tests';
                const nameInput = builder.shadowRoot?.querySelector<HTMLInputElement>('[data-control="saved-query-name"]');
                if (!nameInput) {
                    throw new Error('Matrix saved-query name input was not rendered.');
                }
                nameInput.value = builder.savedQueryName;
                nameInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            }
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
    }));
    await waitForUpdatesAsync();
    await Promise.all(Array.from(canvasElement.querySelectorAll<FvQueryBuilder>(fvQueryBuilderTag))
        .filter(builder => builder.isManagerOpen)
        .map(async builder => {
            const region = builder.queryPopoverRegion!;
            if (!region.classList.contains('loaded')) {
                await new Promise<void>(resolve => {
                    region.addEventListener('loaded', () => resolve(), { once: true });
                });
            }
        }));
};

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    <div style="display: grid; grid-template-columns: repeat(2, 660px);">
        ${createMatrix(component, [states])}
    </div>
`);
statesThemeMatrix.play = prepareBuilders;

export const featuresThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    <div style="display: grid; grid-template-columns: repeat(2, 660px);">
        ${createMatrix(component, [featureStates.filter(state => state.view === 'saved')])}
    </div>
`);
featuresThemeMatrix.play = async context => {
    await prepareBuilders(context);
    const buttons = Array.from(context.canvasElement.querySelectorAll<FvQueryBuilder>(fvQueryBuilderTag))
        .map(builder => {
            const button = builder.shadowRoot?.querySelector<FvSplitButton>('.query-action-split-button');
            if (!button || button.disabled) {
                throw new Error('Matrix query action split button must be available.');
            }
            button.open = true;
            return button;
        });
    await waitForUpdatesAsync();
    await Promise.all(buttons.map(async button => {
        const region = button.region;
        if (!region) {
            throw new Error('Matrix query action menu region was not rendered.');
        }
        region.fixedPlacement = false;
        region.horizontalViewportLock = false;
        region.verticalViewportLock = false;
        region.verticalPositioningMode = 'locktodefault';
        if (!region.classList.contains('loaded')) {
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => resolve(), { once: true });
            });
        }
    }));
    await waitForUpdatesAsync();
};

export const menuFeaturesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${disableStorybookZoomTransform}
    <div style="display: grid; grid-template-columns: repeat(2, 660px);">
        ${createMatrix(component, [featureStates.filter(state => state.view === 'menu')])}
    </div>
`);
menuFeaturesThemeMatrix.play = prepareBuilders;
