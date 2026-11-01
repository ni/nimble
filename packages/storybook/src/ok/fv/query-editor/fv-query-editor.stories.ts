import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref } from '@ni/fast-element';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import {
    fvQueryEditorTag,
    type FvQueryEditor,
    type QueryBuilderDefinition,
    type QueryDocument,
    type QueryEditorLayout
} from '@ni/ok-components/dist/esm/fv/query-editor';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    okWarning
} from '../../../utilities/storybook';

interface StoryArgs {
    editor?: FvQueryEditor;
    label: string;
    disabled: boolean;
    defaultField: string;
    layout: QueryEditorLayout;
    definition: QueryBuilderDefinition;
    query: QueryDocument;
}

const definition: QueryBuilderDefinition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            valueSchema: {
                oneOf: [
                    { const: 'failed', title: 'Failed' },
                    { const: 'error', title: 'Error' },
                    { const: 'passed', title: 'Passed' }
                ]
            },
            operatorIds: ['is-any-of'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration (ms)',
            valueSchema: { type: 'number', minimum: 0 },
            operatorIds: ['greater-than', 'between']
        },
        {
            id: 'workspace',
            path: '/workspace',
            label: 'Workspace',
            valueSchema: {
                oneOf: [
                    { const: 'development', title: 'Development' },
                    { const: 'production', title: 'Production' }
                ]
            },
            operatorIds: ['is'],
            editor: { kind: 'select' }
        }
    ],
    operators: [
        { id: 'is-any-of', label: 'is any of', operand: { kind: 'field-value-list' } },
        { id: 'greater-than', label: 'greater than', operand: { kind: 'field-value' } },
        {
            id: 'between',
            label: 'between',
            operand: { kind: 'range', endpointSchema: { type: 'number', minimum: 0 } }
        },
        { id: 'is', label: 'is', operand: { kind: 'field-value' } }
    ]
};

const statusQuery: QueryDocument = {
    version: 1,
    root: {
        kind: 'predicate',
        fieldId: 'status',
        operatorId: 'is-any-of',
        value: ['failed', 'error']
    }
};

const durationQuery: QueryDocument = {
    version: 1,
    root: {
        kind: 'predicate',
        fieldId: 'duration',
        operatorId: 'greater-than',
        value: 500
    }
};

const sampleQuery: QueryDocument = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'and',
        children: [statusQuery.root!, durationQuery.root!]
    }
};

const groupedQuery: QueryDocument = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'or',
        children: [
            sampleQuery.root!,
            {
                kind: 'predicate',
                fieldId: 'workspace',
                operatorId: 'is',
                value: 'production'
            }
        ]
    }
};

const formattedQuery: QueryDocument = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'and',
        children: [
            statusQuery.root!,
            {
                kind: 'group',
                combinator: 'or',
                children: [
                    durationQuery.root!,
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [
                            { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'production' },
                            {
                                kind: 'group',
                                combinator: 'or',
                                children: [
                                    statusQuery.root!,
                                    {
                                        kind: 'group',
                                        combinator: 'and',
                                        children: [
                                            durationQuery.root!,
                                            { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'development' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

const template = html<StoryArgs>`
    ${okWarning({
        componentName: 'fv query editor',
        statusLink: './?path=/docs/component-status--docs#ok-components'
    })}
    ${disableStorybookZoomTransform}
    <div class="query-editor-story" style="max-width: 1000px; padding: 16px; box-sizing: border-box;">
        <${fvQueryEditorTag}
            label="${x => x.label}"
            ?disabled="${x => x.disabled}"
            default-field="${x => x.defaultField}"
            layout="${x => x.layout}"
            ${ref('editor')}
        ></${fvQueryEditorTag}>
    </div>
`;

function renderEditor(
    args: StoryArgs,
    context: unknown,
    minHeight?: number
): Element {
    const source: StoryArgs = { ...args };
    const result = createUserSelectedThemeStory(template)(source, context);
    if (!source.editor) {
        throw new Error('Story template did not create the query editor.');
    }
    if (minHeight !== undefined) {
        const storyContainer = result.querySelector<HTMLElement>('.query-editor-story');
        if (!storyContainer) {
            throw new Error('Story template did not create the query editor container.');
        }
        storyContainer.style.minHeight = `${minHeight}px`;
    }
    source.editor.definition = args.definition;
    source.editor.query = args.query;
    return result;
}

const metadata: Meta<StoryArgs> = {
    title: 'Ok/Fv Query Editor',
    render: (args, context) => renderEditor(args, context),
    argTypes: {
        label: {
            description: 'Accessible name for the query editor.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            control: 'boolean',
            table: { category: apiCategory.attributes }
        },
        defaultField: {
            name: 'default-field',
            description: 'Field used when adding a condition without choosing one from autocomplete.',
            table: { category: apiCategory.attributes }
        },
        layout: {
            control: 'radio',
            options: ['inline', 'formatted'],
            table: { category: apiCategory.attributes }
        },
        definition: {
            control: 'object',
            description: 'Field and operator configuration for the query editor.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        query: {
            control: 'object',
            description: 'Initial query document rendered by the editor.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        editor: { control: false, table: { disable: true } }
    },
    args: {
        label: 'Query conditions',
        disabled: false,
        defaultField: '',
        layout: 'inline',
        definition,
        query: sampleQuery
    }
};

export default metadata;

export const basic: StoryObj<StoryArgs> = {};

export const configurable: StoryObj<StoryArgs> = {};

export const multiselect: StoryObj<StoryArgs> = {
    render: (args, context) => renderEditor(args, context, 420),
    play: async ({ canvasElement }) => {
        const editor = canvasElement.querySelector<FvQueryEditor>(fvQueryEditorTag);
        const chip = editor?.shadowRoot?.querySelector<HTMLElement>('[data-rule-id]');
        if (!chip) {
            throw new Error('Could not find the sample status filter chip.');
        }
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
    }
};

export const empty: StoryObj<StoryArgs> = {
    args: {
        query: { version: 1, root: null }
    }
};

export const valueDropdown: StoryObj<StoryArgs> = {
    args: {
        query: {
            version: 1,
            root: groupedQuery.root!.kind === 'group'
                ? groupedQuery.root!.children[1]!
                : null
        }
    },
    render: (args, context) => renderEditor(args, context, 640),
    play: async ({ canvasElement }) => {
        const editor = canvasElement.querySelector<FvQueryEditor>(fvQueryEditorTag);
        const chip = editor?.shadowRoot?.querySelector<HTMLElement>('[data-rule-id]');
        if (!chip) {
            throw new Error('Could not find the sample workspace filter chip.');
        }
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        const region = editor?.editorRegion;
        if (!region) {
            throw new Error('Could not find the workspace condition callout.');
        }
        if (!region.initialLayoutComplete) {
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => resolve(), { once: true });
            });
        }
        const select = editor?.shadowRoot?.querySelector<Select>('[data-control="scalar-select"]');
        if (!select) {
            throw new Error('Could not find the workspace value dropdown.');
        }
        select.focus();
        select.open = true;
    }
};

export const grouped: StoryObj<StoryArgs> = {
    args: {
        query: groupedQuery
    }
};

export const formatted: StoryObj<StoryArgs> = {
    args: {
        query: formattedQuery,
        layout: 'formatted'
    }
};
