import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref } from '@ni/fast-element';
import {
    fvQueryBuilderTag,
    type FvQueryBuilder,
    type QueryBuilderEventDetail,
    type QueryBuilderDefinition,
    type QueryBuilderSavedQuery,
    type QueryDocument
} from '@ni/ok-components/dist/esm/fv/query-builder';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    okWarning
} from '../../../utilities/storybook';
import {
    cloneDocument,
    queryBuilderDefinition,
    queryBuilderPresets,
    queryBuilderSavedPresets
} from './fixtures';

interface StoryArgs {
    builder?: FvQueryBuilder;
    status?: HTMLOutputElement;
    label: string;
    disabled: boolean;
    showNigelPrompt: boolean;
    allowSavedQueryCreation: boolean;
    allowSavedQueryEditing: boolean;
    allowSavedQueryDeletion: boolean;
    preset: keyof typeof queryBuilderPresets;
    definition: QueryBuilderDefinition;
    query?: QueryDocument;
    savedQueries: readonly QueryBuilderSavedQuery[];
    persistence: boolean;
    failFirstSave: boolean;
    aiPreview: boolean;
}

const template = html<StoryArgs>`
    ${okWarning({
        componentName: 'fv query builder',
        statusLink: './?path=/docs/component-status--docs#ok-components'
    })}
    ${disableStorybookZoomTransform}
    <div style="max-width: 1000px; padding: 16px; box-sizing: border-box;">
        <${fvQueryBuilderTag}
            label="${x => x.label}"
            :disabled="${x => x.disabled}"
            :showNigelPrompt="${x => x.showNigelPrompt}"
            :allowSavedQueryCreation="${x => x.allowSavedQueryCreation}"
            :allowSavedQueryEditing="${x => x.allowSavedQueryEditing}"
            :allowSavedQueryDeletion="${x => x.allowSavedQueryDeletion}"
            ${ref('builder')}
        ></${fvQueryBuilderTag}>
        <output aria-live="polite" style="display: block; min-height: 1.5em; margin-top: 8px;" ${ref('status')}></output>
    </div>
`;

const savedQueryNames: { readonly [id: string]: string } = {
    failedProduction: 'Failed production tests',
    longRunning: 'Long running'
};

function renderState(
    args: StoryArgs,
    context: unknown
): Element {
    const source: StoryArgs = { ...args };
    const result = createUserSelectedThemeStory(template)(source, context);
    const builder = source.builder;
    if (!builder) {
        throw new Error('Story template did not create the query builder.');
    }

    builder.definition = args.definition;
    builder.savedQueries = structuredClone(args.savedQueries);
    builder.query = cloneDocument(args.query ?? queryBuilderPresets[args.preset]);
    builder.aiQueryPreview = args.aiPreview ? cloneDocument(queryBuilderPresets.saved) : null;

    const hostRecords = new Map<string, QueryBuilderSavedQuery>(
        builder.savedQueries.map(record => [record.id, record])
    );
    let nextId = 0;
    let failFirstSave = args.failFirstSave;
    builder.saveHandler = async request => {
        await new Promise<void>(resolve => {
            setTimeout(resolve, 150);
        });
        if (failFirstSave) {
            failFirstSave = false;
            if (source.status) {
                source.status.textContent = 'Demo: the first save failed. Retry to save the query.';
            }
            throw new Error('Simulated first-save failure.');
        }
        if (request.id === undefined) {
            nextId += 1;
        }
        const record: QueryBuilderSavedQuery = {
            id: request.id ?? `story-query-${nextId}`,
            name: request.name,
            document: cloneDocument(request.document)
        };
        hostRecords.set(record.id, record);
        return record;
    };
    builder.deleteHandler = async id => {
        await new Promise<void>(resolve => {
            setTimeout(resolve, 100);
        });
        hostRecords.delete(id);
    };
    if (!args.persistence) {
        builder.saveHandler = undefined;
        builder.deleteHandler = undefined;
    }

    builder.addEventListener('query-change', event => {
        const detail = (event as CustomEvent<QueryBuilderEventDetail>).detail;
        if (source.status) {
            source.status.textContent = `Draft: ${detail.ruleCount} conditions${detail.valid ? '' : ' (incomplete or invalid)'}.`;
        }
    });
    builder.addEventListener('query-apply', event => {
        const detail = (event as CustomEvent<{ readonly query: QueryDocument, readonly selectedId?: string }>).detail;
        if (source.status) {
            source.status.textContent = `Applied ${detail.query.root ? 'the selected query' : 'no filters'}${detail.selectedId ? ` (${detail.selectedId})` : ''}.`;
        }
    });
    builder.addEventListener('query-cancel', () => {
        if (source.status) {
            source.status.textContent = 'Draft changes canceled.';
        }
    });
    builder.addEventListener('query-ai-request', () => {
        builder.aiQueryPreview = cloneDocument(queryBuilderPresets.saved);
        if (source.status) {
            source.status.textContent = 'Demo: a sample query is ready for review. This example does not call an AI service.';
        }
    });
    return result;
}

const metadata: Meta<StoryArgs> = {
    title: 'Ok/Fv Query Builder',
    render: (args, context) => renderState(args, context),
    argTypes: {
        label: { description: 'Accessible name for the query builder.', table: { category: apiCategory.attributes } },
        disabled: { control: 'boolean', description: 'Disable interaction with the query builder.', table: { category: apiCategory.attributes } },
        showNigelPrompt: { control: 'boolean', description: 'Show Ask Nigel, the prompt input, and the generated-query preview.', table: { category: apiCategory.attributes } },
        allowSavedQueryCreation: { control: 'boolean', description: 'Allow creating saved queries, including copies of existing saved queries.', table: { category: apiCategory.attributes } },
        allowSavedQueryEditing: { control: 'boolean', description: 'Allow editing and updating existing saved queries. Users can still change conditions and save a new query when this is false.', table: { category: apiCategory.attributes } },
        allowSavedQueryDeletion: { control: 'boolean', description: 'Allow deleting saved queries.', table: { category: apiCategory.attributes } },
        definition: { control: 'object', description: 'Fields and operators available in the query editor.', table: { category: apiCategory.nonAttributeProperties } },
        query: {
            control: 'object',
            description: 'Custom query document. When set, this overrides the selected preset.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        savedQueries: { control: 'object', description: 'Saved queries available in the dropdown menu.', table: { category: apiCategory.nonAttributeProperties } },
        preset: { control: 'select', options: Object.keys(queryBuilderPresets), description: 'Sample query to edit when no custom query is set.', table: { category: 'Demo' } },
        persistence: { control: 'boolean', description: 'Enable in-memory save and delete handlers for this example.', table: { category: 'Demo' } },
        failFirstSave: { control: 'boolean', description: 'Make the first save fail so you can retry without losing the draft.', table: { category: 'Demo' } },
        aiPreview: { control: 'boolean', description: 'Show a sample generated query for review.', table: { category: 'Demo' } },
        builder: { control: false, table: { disable: true } },
        status: { control: false, table: { disable: true } }
    },
    args: {
        label: 'Test result filters',
        disabled: false,
        showNigelPrompt: true,
        allowSavedQueryCreation: true,
        allowSavedQueryEditing: true,
        allowSavedQueryDeletion: true,
        preset: 'basic',
        definition: queryBuilderDefinition,
        savedQueries: Object.entries(queryBuilderSavedPresets).map(([id, document]) => ({
            id,
            name: savedQueryNames[id] ?? 'Regression failures',
            document: cloneDocument(document)
        })),
        persistence: true,
        failFirstSave: false,
        aiPreview: false
    }
};

export default metadata;

export const configurable: StoryObj<StoryArgs> = {};
