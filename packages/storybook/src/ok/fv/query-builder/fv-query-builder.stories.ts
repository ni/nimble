import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref } from '@ni/fast-element';
import {
    fvQueryBuilderTag,
    type FvQueryBuilder,
    type QueryBuilderEventDetail,
    type QueryBuilderSavedQuery,
    type QueryDocument
} from '@ni/ok-components/dist/esm/fv/query-builder';
import {
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
}

const template = html<StoryArgs>`
    ${okWarning({
        componentName: 'fv query builder',
        statusLink: './?path=/docs/component-status--docs#ok-components'
    })}
    ${disableStorybookZoomTransform}
    <div style="max-width: 1000px; padding: 16px; box-sizing: border-box;">
        <${fvQueryBuilderTag} label="Test result filters" ${ref('builder')}></${fvQueryBuilderTag}>
        <output aria-live="polite" style="display: block; min-height: 1.5em; margin-top: 8px;" ${ref('status')}></output>
    </div>
`;

const savedQueryNames: { readonly [id: string]: string } = {
    failedProduction: 'Failed production tests',
    longRunning: 'Long running'
};

function renderState(
    query: QueryDocument,
    context: unknown,
    options: { readonly failFirstSave?: boolean } = {}
): Element {
    const source: StoryArgs = {};
    const result = createUserSelectedThemeStory(template)(source, context);
    const builder = source.builder;
    if (!builder) {
        throw new Error('Story template did not create the query builder.');
    }

    builder.definition = queryBuilderDefinition;
    builder.savedQueries = Object.entries(queryBuilderSavedPresets).map(([id, document]) => ({
        id,
        name: savedQueryNames[id] ?? 'Regression failures',
        document: cloneDocument(document)
    }));
    builder.query = cloneDocument(query);

    const hostRecords = new Map<string, QueryBuilderSavedQuery>(
        builder.savedQueries.map(record => [record.id, record])
    );
    let nextId = 0;
    let failFirstSave = options.failFirstSave ?? false;
    builder.saveHandler = async request => {
        await new Promise<void>(resolve => {
            setTimeout(resolve, 150);
        });
        if (failFirstSave) {
            failFirstSave = false;
            if (source.status) {
                source.status.textContent = 'Demo: the first save fails; retry to persist.';
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

    builder.addEventListener('query-change', event => {
        const detail = (event as CustomEvent<QueryBuilderEventDetail>).detail;
        if (source.status) {
            source.status.textContent = `Working draft: ${detail.ruleCount} conditions${detail.valid ? '' : ' (incomplete or invalid)'}.`;
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
            source.status.textContent = 'Working changes canceled.';
        }
    });
    return result;
}

const metadata: Meta<StoryArgs> = {
    title: 'Ok/Fv Query Builder',
    render: (_args, context) => renderState(queryBuilderPresets.basic, context),
    args: {}
};

export default metadata;

export const empty: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.empty, context)
};

export const basic: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.basic, context)
};

export const multiGroup: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.multigroup, context)
};

export const validation: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.validation, context)
};

export const savedFilters: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.saved, context, { failFirstSave: true })
};

export const complex: StoryObj<StoryArgs> = {
    render: (_args, context) => renderState(queryBuilderPresets.complex, context)
};
