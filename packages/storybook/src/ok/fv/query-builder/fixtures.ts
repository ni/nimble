import type {
    JsonValue,
    QueryBuilderDefinition,
    QueryDocument,
    QueryNode
} from '@ni/ok-components/dist/esm/fv/query-builder';

const statusValues = [
    { const: 'passed', title: 'Passed' },
    { const: 'failed', title: 'Failed' },
    { const: 'running', title: 'Running' },
    { const: 'skipped', title: 'Skipped' },
    { const: 'error', title: 'Error' }
];

export const queryBuilderDefinition: QueryBuilderDefinition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            valueSchema: { oneOf: statusValues },
            operatorIds: ['is', 'is-not', 'is-any-of', 'is-none-of'],
            editor: { kind: 'select' }
        },
        {
            id: 'workspace',
            path: '/workspace',
            label: 'Workspace',
            valueSchema: {
                oneOf: [
                    { const: 'default', title: 'Default' },
                    { const: 'production', title: 'Production' },
                    { const: 'staging', title: 'Staging' },
                    { const: 'qa', title: 'QA' }
                ]
            },
            operatorIds: ['is', 'is-not', 'is-any-of', 'is-none-of'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration (ms)',
            valueSchema: { type: 'number', minimum: 0 },
            operatorIds: ['equals', 'not-equals', 'greater-than', 'greater-or-equal', 'less-than', 'less-or-equal', 'between', 'is-empty']
        },
        {
            id: 'temperature',
            path: '/temperature',
            label: 'Temperature (C)',
            valueSchema: { type: 'number' },
            operatorIds: ['greater-than', 'between', 'is-empty']
        },
        {
            id: 'name',
            path: '/name',
            label: 'Test name',
            valueSchema: { type: 'string' },
            operatorIds: ['equals', 'contains', 'starts-with', 'ends-with', 'is-blank', 'is-one-of']
        },
        {
            id: 'serial',
            path: '/serial',
            label: 'Serial number',
            valueSchema: { type: 'string' },
            operatorIds: ['equals', 'contains', 'is-one-of']
        },
        {
            id: 'description',
            path: '/description',
            label: 'Description',
            valueSchema: { type: 'string' },
            operatorIds: ['contains', 'is-blank']
        },
        {
            id: 'started_at',
            path: '/started_at',
            label: 'Started at',
            valueSchema: { type: 'string', format: 'date' },
            operatorIds: ['equals', 'before', 'after', 'between-dates', 'is-empty'],
            editor: { kind: 'date' }
        },
        {
            id: 'updated_at',
            path: '/updated_at',
            label: 'Updated at',
            valueSchema: { type: 'string', format: 'date' },
            operatorIds: ['before', 'after', 'is-empty'],
            editor: { kind: 'date' }
        },
        {
            id: 'passed',
            path: '/passed',
            label: 'Passed',
            valueSchema: { type: 'boolean' },
            operatorIds: ['is'],
            editor: { kind: 'boolean' }
        },
        {
            id: 'active',
            path: '/active',
            label: 'Active',
            valueSchema: { type: 'boolean' },
            operatorIds: ['is'],
            editor: { kind: 'boolean' }
        },
        {
            id: 'tags',
            path: '/tags',
            label: 'Tags',
            valueSchema: { type: 'array', items: { type: 'string' } },
            operatorIds: ['contains', 'does-not-contain', 'is-empty']
        },
        {
            id: 'keywords',
            path: '/keywords',
            label: 'Keywords',
            valueSchema: { type: 'array', items: { type: 'string' } },
            operatorIds: ['contains', 'is-empty']
        },
        {
            id: 'custom',
            path: '/custom',
            label: 'Custom property',
            valueSchema: { type: 'object', additionalProperties: { type: 'string' } },
            operatorIds: ['has-key', 'key-equals', 'key-contains'],
            editor: { kind: 'key-value' }
        }
    ],
    operators: [
        { id: 'equals', label: 'Equals', operand: { kind: 'field-value' } },
        { id: 'contains', label: 'Contains', operand: { kind: 'schema', schema: { type: 'string' } } },
        { id: 'starts-with', label: 'Starts with', operand: { kind: 'field-value' } },
        { id: 'ends-with', label: 'Ends with', operand: { kind: 'field-value' } },
        { id: 'is-blank', label: 'Is blank', operand: { kind: 'none' } },
        { id: 'is-one-of', label: 'Is one of', operand: { kind: 'field-value-list' } },
        { id: 'not-equals', label: 'Does not equal', operand: { kind: 'field-value' } },
        { id: 'greater-than', label: 'Greater than', operand: { kind: 'field-value' } },
        { id: 'greater-or-equal', label: 'Greater than or equal to', operand: { kind: 'field-value' } },
        { id: 'less-than', label: 'Less than', operand: { kind: 'field-value' } },
        { id: 'less-or-equal', label: 'Less than or equal to', operand: { kind: 'field-value' } },
        {
            id: 'between',
            label: 'Between',
            operand: { kind: 'range', endpointSchema: { type: 'number' } },
            editor: { kind: 'range' }
        },
        {
            id: 'between-dates',
            label: 'Between',
            operand: { kind: 'range', endpointSchema: { type: 'string', format: 'date' } },
            editor: { kind: 'range' }
        },
        { id: 'is-empty', label: 'Is empty', operand: { kind: 'none' } },
        { id: 'before', label: 'Before', operand: { kind: 'field-value' } },
        { id: 'after', label: 'After', operand: { kind: 'field-value' } },
        { id: 'is', label: 'Is', operand: { kind: 'field-value' } },
        { id: 'is-not', label: 'Is not', operand: { kind: 'field-value' } },
        { id: 'is-any-of', label: 'Is any of', operand: { kind: 'field-value-list' } },
        { id: 'is-none-of', label: 'Is none of', operand: { kind: 'field-value-list' } },
        { id: 'does-not-contain', label: 'Does not contain', operand: { kind: 'schema', schema: { type: 'string' } } },
        {
            id: 'has-key',
            label: 'Has key',
            operand: {
                kind: 'schema',
                schema: { type: 'string', minLength: 1 }
            },
            editor: { kind: 'text' }
        },
        {
            id: 'key-equals',
            label: 'Key equals',
            operand: {
                kind: 'schema',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', minLength: 1 },
                        value: { type: 'string' }
                    },
                    required: ['key', 'value'],
                    additionalProperties: false
                }
            },
            editor: { kind: 'key-value' }
        },
        {
            id: 'key-contains',
            label: 'Key contains',
            operand: {
                kind: 'schema',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', minLength: 1 },
                        value: { type: 'string' }
                    },
                    required: ['key', 'value'],
                    additionalProperties: false
                }
            },
            editor: { kind: 'key-value' }
        }
    ]
};

function predicate(fieldId: string, operatorId: string, value?: JsonValue): QueryNode {
    return {
        kind: 'predicate',
        fieldId,
        operatorId,
        ...(value === undefined ? {} : { value })
    };
}

function document(...nodes: QueryNode[]): QueryDocument {
    return {
        version: 1,
        root: nodes.length === 0
            ? null
            : nodes.length === 1
                ? nodes[0]!
                : { kind: 'group', combinator: 'and', children: nodes }
    };
}

type PresetName = 'empty' | 'basic' | 'multigroup' | 'validation' | 'saved' | 'complex';

export const queryBuilderPresets: Readonly<Record<PresetName, QueryDocument>> = {
    empty: document(),
    basic: document(
        predicate('status', 'is-any-of', ['failed', 'error']),
        predicate('duration', 'greater-than', 500),
        predicate('workspace', 'is', 'production')
    ),
    multigroup: {
        version: 1,
        root: {
            kind: 'group',
            combinator: 'or',
            children: [
                {
                    kind: 'group',
                    combinator: 'and',
                    children: [
                        predicate('status', 'is-any-of', ['failed', 'error']),
                        predicate('duration', 'greater-than', 500),
                        predicate('workspace', 'is', 'production')
                    ]
                },
                {
                    kind: 'group',
                    combinator: 'or',
                    children: [
                        predicate('tags', 'contains', 'regression'),
                        predicate('started_at', 'after', '2024-01-01')
                    ]
                }
            ]
        }
    },
    validation: document(
        predicate('status', 'is-any-of', ['failed']),
        predicate('duration', 'greater-than', null),
        predicate('workspace', 'is', 'production')
    ),
    saved: document(
        predicate('status', 'is-any-of', ['failed', 'error']),
        predicate('workspace', 'is', 'production')
    ),
    complex: {
        version: 1,
        root: {
            kind: 'group',
            combinator: 'or',
            children: [
                {
                    kind: 'group',
                    combinator: 'and',
                    children: [
                        predicate('status', 'is-any-of', ['failed', 'error']),
                        predicate('duration', 'greater-than', 1000),
                        predicate('workspace', 'is', 'production'),
                        predicate('started_at', 'after', '2024-01-01')
                    ]
                },
                {
                    kind: 'group',
                    combinator: 'or',
                    children: [
                        predicate('tags', 'contains', 'regression'),
                        predicate('name', 'contains', 'Integration'),
                        predicate('temperature', 'greater-than', 80)
                    ]
                }
            ]
        }
    }
};

export const queryBuilderSavedPresets: Readonly<Record<'failedProduction' | 'longRunning' | 'regressionFailures', QueryDocument>> = {
    failedProduction: queryBuilderPresets.basic,
    longRunning: document(predicate('duration', 'greater-than', 1000)),
    regressionFailures: queryBuilderPresets.multigroup
};

export const queryBuilderOperandExamples: readonly { readonly name: string; readonly query: QueryDocument }[] = [
    { name: 'No-value predicate', query: document(predicate('description', 'is-blank')) },
    {
        name: 'Boolean false and numeric zero',
        query: document(predicate('passed', 'is', false), predicate('duration', 'greater-than', 0))
    },
    { name: 'Enum collection', query: document(predicate('status', 'is-none-of', ['skipped', 'running'])) },
    { name: 'Free-text collection', query: document(predicate('name', 'is-one-of', ['Test, nightly', 'Integration'])) },
    { name: 'Numeric range', query: document(predicate('duration', 'between', { start: 0, end: 500 })) },
    { name: 'Date range', query: document(predicate('started_at', 'between-dates', { start: '2026-01-01', end: '2026-06-30' })) },
    { name: 'Array member', query: document(predicate('tags', 'does-not-contain', 'quarantined')) },
    { name: 'Key-only custom property', query: document(predicate('custom', 'has-key', 'build')) },
    { name: 'Key and value', query: document(predicate('custom', 'key-contains', { key: 'branch', value: 'release' })) }
];

export function cloneDocument(query: QueryDocument): QueryDocument {
    return structuredClone(query);
}
