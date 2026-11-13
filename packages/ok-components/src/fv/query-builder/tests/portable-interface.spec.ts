import {
    validateDefinition,
    validateQuery,
    type QueryBuilderDefinition,
    type QueryDocument,
    type QueryNode
} from '../portable-interface';

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
                    { const: 'passed', title: 'Passed' }
                ]
            },
            operatorIds: ['in'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration',
            valueSchema: { type: 'number', minimum: 0 },
            operatorIds: ['gt', 'between']
        },
        {
            id: 'enabled',
            path: '/enabled',
            label: 'Enabled',
            valueSchema: { type: 'boolean' },
            operatorIds: ['is']
        }
    ],
    operators: [
        { id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } },
        { id: 'gt', label: 'Greater than', operand: { kind: 'field-value' } },
        {
            id: 'between',
            label: 'Between',
            operand: { kind: 'range', endpointSchema: { type: 'number', minimum: 0 } }
        },
        { id: 'is', label: 'Is', operand: { kind: 'field-value' } }
    ]
};

function expectIssueCode(
    result: ReturnType<typeof validateDefinition> | ReturnType<typeof validateQuery>,
    code: string
): void {
    expect(result.valid).toBeFalse();
    if (!result.valid) {
        expect(result.issues.some(item => item.code === code)).toBeTrue();
    }
}

function withFieldUpdate(
    index: number,
    update: (field: QueryBuilderDefinition['fields'][number]) => QueryBuilderDefinition['fields'][number]
): QueryBuilderDefinition {
    return {
        ...definition,
        fields: definition.fields.map((field, fieldIndex) => (fieldIndex === index ? update(field) : field))
    };
}

describe('portable query interface', () => {
    it('validates definitions and preserves their input', () => {
        const result = validateDefinition(definition);

        expect(result.valid).toBeTrue();
        if (result.valid) {
            expect(Object.isFrozen(result.value)).toBeTrue();
            expect(result.value.fields[0]?.id).toBe('status');
        }
    });

    it('validates range, array-member, and key-only editor definitions', () => {
        const editorDefinition: QueryBuilderDefinition = {
            version: 1,
            fields: [
                {
                    id: 'duration',
                    path: '/duration',
                    label: 'Duration',
                    valueSchema: { type: 'number' },
                    operatorIds: ['between']
                },
                {
                    id: 'started-at',
                    path: '/startedAt',
                    label: 'Started at',
                    valueSchema: { type: 'string', format: 'date' },
                    operatorIds: ['between-dates']
                },
                {
                    id: 'tags',
                    path: '/tags',
                    label: 'Tags',
                    valueSchema: { type: 'array', items: { type: 'string' } },
                    operatorIds: ['contains']
                },
                {
                    id: 'custom',
                    path: '/custom',
                    label: 'Custom property',
                    valueSchema: { type: 'object', additionalProperties: { type: 'string' } },
                    operatorIds: ['has-key']
                }
            ],
            operators: [
                { id: 'between', label: 'Between', operand: { kind: 'range', endpointSchema: { type: 'number' } } },
                {
                    id: 'between-dates',
                    label: 'Between',
                    operand: { kind: 'range', endpointSchema: { type: 'string', format: 'date' } }
                },
                { id: 'contains', label: 'Contains', operand: { kind: 'schema', schema: { type: 'string' } } },
                {
                    id: 'has-key',
                    label: 'Has key',
                    operand: { kind: 'schema', schema: { type: 'string', minLength: 1 } },
                    editor: { kind: 'text' }
                }
            ]
        };

        expect(validateDefinition(editorDefinition).valid).toBeTrue();
    });

    it('rejects invalid schemas, remote references, and unsupported versions explicitly', () => {
        const badSchema = withFieldUpdate(1, field => ({ ...field, valueSchema: { type: 'not-a-json-schema-type' } }));
        expectIssueCode(validateDefinition(badSchema), 'invalid-schema');

        const remoteRef = withFieldUpdate(1, field => ({ ...field, valueSchema: { $ref: 'https://example.invalid/schema' } }));
        expectIssueCode(validateDefinition(remoteRef), 'invalid-schema');

        const badVersion = { ...definition, version: 2 };
        expectIssueCode(validateDefinition(badVersion), 'unsupported-version');
    });

    it('checks references only in schema-bearing locations', () => {
        const annotations = withFieldUpdate(1, field => ({
            ...field,
            valueSchema: {
                type: 'number',
                examples: [{ $ref: 'https://example.invalid/example' }],
                default: { $dynamicRef: 'https://example.invalid/default' },
                properties: { $ref: { type: 'string' } },
                $defs: { $dynamicRef: { type: 'string' } }
            }
        }));
        expect(validateDefinition(annotations).valid).toBeTrue();

        const schemas: QueryBuilderDefinition['fields'][number]['valueSchema'][] = [
            { type: 'number', allOf: [{ $ref: 'https://example.invalid/schema' }] },
            { type: 'number', properties: { nested: { $dynamicRef: 'https://example.invalid/schema' } } },
            { type: 'number', $defs: { nested: { $ref: 'https://example.invalid/schema' } } },
            { type: 'number', not: { $ref: 'https://example.invalid/schema' } }
        ];
        for (const valueSchema of schemas) {
            expectIssueCode(validateDefinition(withFieldUpdate(1, field => ({ ...field, valueSchema }))), 'invalid-schema');
        }
    });

    it('validates a zero maximum directly and inside oneOf branches', () => {
        const maximum = withFieldUpdate(1, field => ({
            ...field,
            valueSchema: { type: 'number', maximum: 0 }
        }));
        const alternativeSchema: QueryBuilderDefinition['fields'][number]['valueSchema'] = {
            oneOf: [{ type: 'number', maximum: 0 }, { type: 'number', minimum: 1 }]
        };
        const alternatives = withFieldUpdate(1, field => ({ ...field, valueSchema: alternativeSchema }));
        const query = (value: number): QueryDocument => ({
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value }
        });

        for (const value of [-1, 0]) {
            expect(validateQuery(query(value), maximum).valid).toBeTrue();
            expect(validateQuery(query(value), alternatives).valid).toBeTrue();
        }
        expect(validateQuery(query(5), maximum).valid).toBeFalse();
        expect(validateQuery(query(5), alternatives).valid).toBeTrue();
    });

    it('rejects unknown and disallowed operators', () => {
        const unknownOperator = withFieldUpdate(0, field => ({ ...field, operatorIds: ['missing'] }));
        expectIssueCode(validateDefinition(unknownOperator), 'unknown-operator');

        const query: QueryDocument = {
            version: 1,
            root: {
                kind: 'predicate',
                fieldId: 'status',
                operatorId: 'gt',
                value: 10
            }
        };
        expectIssueCode(validateQuery(query, definition), 'unsupported-operator');
    });

    it('validates recursive documents and canonical empty queries', () => {
        const query: QueryDocument = {
            version: 1,
            root: {
                kind: 'group',
                combinator: 'or',
                children: [
                    {
                        kind: 'predicate',
                        fieldId: 'status',
                        operatorId: 'in',
                        value: ['failed']
                    },
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [
                            {
                                kind: 'predicate',
                                fieldId: 'duration',
                                operatorId: 'gt',
                                value: 0
                            },
                            {
                                kind: 'predicate',
                                fieldId: 'enabled',
                                operatorId: 'is',
                                value: false
                            }
                        ]
                    }
                ]
            }
        };
        expect(validateQuery(query, definition).valid).toBeTrue();
        expect(validateQuery({ version: 1, root: null }, definition).valid).toBeTrue();
        expectIssueCode(validateQuery({
            version: 1,
            root: { kind: 'group', combinator: 'and', children: [query.root!] }
        }, definition), 'invalid-query');
    });

    it('limits parenthesized query groups to four nested levels', () => {
        const predicate: QueryNode = {
            kind: 'predicate',
            fieldId: 'duration',
            operatorId: 'gt',
            value: 10
        };
        const nestedGroup = (depth: number): QueryNode => {
            let node: QueryNode = predicate;
            for (let level = 0; level < depth; level += 1) {
                node = {
                    kind: 'group',
                    combinator: 'and',
                    children: [predicate, node]
                };
            }
            return node;
        };
        const queryWithNesting = (depth: number): QueryDocument => ({
            version: 1,
            root: {
                kind: 'group',
                combinator: 'and',
                children: [predicate, nestedGroup(depth)]
            }
        });

        expect(validateQuery(queryWithNesting(4), definition).valid).toBeTrue();

        const tooDeep = validateQuery(queryWithNesting(5), definition);
        expectIssueCode(tooDeep, 'invalid-query');
        if (!tooDeep.valid) {
            expect(tooDeep.issues[0]?.message).toContain('4 levels');
        }
    });

    it('checks operand arity, schema constraints, range ordering, and typed uniqueness', () => {
        const missingValue: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt' }
        };
        expectIssueCode(validateQuery(missingValue, definition), 'incomplete-expression');

        const belowMinimum: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: -1 }
        };
        expectIssueCode(validateQuery(belowMinimum, definition), 'invalid-value');

        const backwardsRange: QueryDocument = {
            version: 1,
            root: {
                kind: 'predicate',
                fieldId: 'duration',
                operatorId: 'between',
                value: { start: 5, end: 1 }
            }
        };
        expectIssueCode(validateQuery(backwardsRange, definition), 'invalid-value');

        const duplicateValues: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'status', operatorId: 'in', value: ['failed', 'failed'] }
        };
        expectIssueCode(validateQuery(duplicateValues, definition), 'invalid-value');

        const wrongType: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: '0' }
        };
        expectIssueCode(validateQuery(wrongType, definition), 'invalid-value');
    });

    it('asserts real dates and offset-bearing datetimes without coercion', () => {
        const dateDefinition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'date',
                path: '/date',
                label: 'Date',
                valueSchema: { type: 'string', format: 'date' },
                operatorIds: ['eq']
            }],
            operators: [{ id: 'eq', label: 'Equals', operand: { kind: 'field-value' } }]
        };
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'date', operatorId: 'eq', value: '2026-02-30' }
        }, dateDefinition).valid).toBeFalse();

        const datetimeDefinition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'timestamp',
                path: '/timestamp',
                label: 'Timestamp',
                valueSchema: { type: 'string', format: 'date-time' },
                operatorIds: ['eq']
            }],
            operators: [{ id: 'eq', label: 'Equals', operand: { kind: 'field-value' } }]
        };
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'timestamp', operatorId: 'eq', value: '2026-10-26T22:00:00' }
        }, datetimeDefinition).valid).toBeFalse();
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'timestamp', operatorId: 'eq', value: '2026-10-26T22:00:00-05:00' }
        }, datetimeDefinition).valid).toBeTrue();
    });
});
