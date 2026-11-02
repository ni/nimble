import { compileSchema, draft2020 } from 'json-schema-library';
import { remotes } from 'json-schema-library/remotes';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonSchema202012 = boolean | { [keyword: string]: JsonValue };

export type QueryBuilderOperandDefinition = | { readonly kind: 'none' }
    | { readonly kind: 'field-value' }
    | { readonly kind: 'field-value-list', readonly minItems?: number }
    | { readonly kind: 'range', readonly endpointSchema: JsonSchema202012 }
    | { readonly kind: 'schema', readonly schema: JsonSchema202012 };

export type QueryBuilderEditorDefinition = | { readonly kind: 'auto' }
    | { readonly kind: 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'range' | 'key-value' }
    | {
        readonly kind: 'select' | 'combobox',
        readonly optionsSource?: QueryOptionSourceDefinition
    };

export interface QueryOptionSourceDefinition {
    readonly sourceId: string;
    readonly dependsOn?: readonly string[];
    readonly searchable?: boolean;
    readonly pageSize?: number;
}

export interface QueryBuilderFieldDefinition {
    readonly id: string;
    readonly path: string;
    readonly label: string;
    readonly valueSchema: JsonSchema202012;
    readonly operatorIds: readonly string[];
    readonly editor?: QueryBuilderEditorDefinition;
}

export interface QueryBuilderOperatorDefinition {
    readonly id: string;
    readonly label: string;
    readonly operand: QueryBuilderOperandDefinition;
    readonly editor?: QueryBuilderEditorDefinition;
}

export interface QueryBuilderDefinition {
    readonly version: 1;
    readonly fields: readonly QueryBuilderFieldDefinition[];
    readonly operators: readonly QueryBuilderOperatorDefinition[];
}

export interface QueryPredicate {
    readonly kind: 'predicate';
    readonly fieldId: string;
    readonly operatorId: string;
    readonly value?: JsonValue;
}

export interface QueryGroup {
    readonly kind: 'group';
    readonly combinator: 'and' | 'or';
    readonly children: readonly QueryNode[];
}

export type QueryNode = QueryGroup | QueryPredicate;

export interface QueryDocument {
    readonly version: 1;
    readonly root: QueryNode | null;
}

/** Maximum supported nesting depth for parenthesized query groups. */
export const MAX_QUERY_GROUP_DEPTH = 4;

export type QueryEditorDraftToken = | {
    readonly kind: 'condition',
    readonly id: string,
    readonly fieldId: string,
    readonly operatorId: string,
    readonly value?: JsonValue,
    readonly rawInputs?: Readonly<{ [key: string]: string }>
}
    | { readonly kind: 'logic', readonly logic: 'and' | 'or' }
    | { readonly kind: 'open', readonly id: string }
    | { readonly kind: 'close' };

export interface QueryEditorDraft {
    readonly version: 1;
    readonly tokens: readonly QueryEditorDraftToken[];
    readonly caretPosition: number;
    readonly inputText: string;
}

export type QueryBuilderIssueCode = | 'unsupported-version'
    | 'invalid-definition'
    | 'invalid-query'
    | 'invalid-draft'
    | 'duplicate-id'
    | 'invalid-field-path'
    | 'unknown-field'
    | 'unknown-operator'
    | 'unsupported-operator'
    | 'invalid-schema'
    | 'invalid-value'
    | 'invalid-editor-options'
    | 'unsupported-editor'
    | 'incomplete-expression'
    | 'unknown-option-source'
    | 'missing-option-resolver'
    | 'missing-option-context'
    | 'options-load-failed';

export type QueryBuilderIssueTarget = 'definition' | 'query' | 'draft' | 'options';

export interface QueryBuilderIssue {
    readonly code: QueryBuilderIssueCode;
    readonly target: QueryBuilderIssueTarget;
    readonly path: string;
    readonly message: string;
}

export type ValidationResult<T> = | { readonly valid: true, readonly value: T, readonly issues: readonly [] }
    | { readonly valid: false, readonly issues: readonly QueryBuilderIssue[] };

export interface QueryOption {
    readonly value: JsonPrimitive;
    readonly label: string;
    readonly disabled?: boolean;
}

export interface QueryOptionPage {
    readonly options: readonly QueryOption[];
    readonly nextCursor?: string;
}

export interface QueryOptionRequest {
    readonly sourceId: string;
    readonly fieldId: string;
    readonly operatorId: string;
    readonly dependentValues: Readonly<{ [key: string]: JsonValue }>;
    readonly searchText?: string;
    readonly cursor?: string;
    readonly pageSize?: number;
}

export type QueryOptionContext = Readonly<{ [key: string]: JsonValue }>;

export interface QueryOptionFailure {
    readonly code: 'unknown-option-source' | 'options-load-failed';
    readonly message: string;
}

export interface QueryOptionResolver {
    resolve(request: QueryOptionRequest, signal: AbortSignal): Promise<QueryOptionPage>;
}

export type QueryOptionState = | { readonly status: 'idle' }
    | { readonly status: 'blocked', readonly issues: readonly QueryBuilderIssue[] }
    | { readonly status: 'loading', readonly options: readonly QueryOption[] }
    | { readonly status: 'ready', readonly options: readonly QueryOption[], readonly nextCursor?: string }
    | { readonly status: 'error', readonly options: readonly QueryOption[], readonly issues: readonly QueryBuilderIssue[] };

type JsonSchemaValidator = ReturnType<typeof compileSchema>;

const draft2020MetaSchemaUri = 'https://json-schema.org/draft/2020-12/schema';
const standardMetaSchemas = remotes.filter(
    schema => typeof schema.$id === 'string' && schema.$id.startsWith('https://json-schema.org/draft/2020-12/')
);
const validatorOptions = {
    drafts: [draft2020],
    remotes: standardMetaSchemas,
    formatAssertion: true as const,
    throwOnInvalidRef: true,
    throwOnInvalidSchema: true
};
const metaSchema = standardMetaSchemas.find(schema => schema.$id === draft2020MetaSchemaUri);
if (!metaSchema) {
    throw new Error('The JSON Schema 2020-12 meta-schema is not available.');
}
const metaValidator = compileSchema(metaSchema, validatorOptions);
const schemaValidatorCache = new WeakMap<object, JsonSchemaValidator>();
const booleanSchemaValidators = new Map<boolean, JsonSchemaValidator>();
const definitionCache = new WeakMap<QueryBuilderDefinition, ReadonlyMap<string, JsonSchemaValidator>>();

function isRecord(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonValue(value: unknown, seen = new Set<object>()): value is JsonValue {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object') {
        return false;
    }
    if (seen.has(value)) {
        return false;
    }
    seen.add(value);
    const valid = Array.isArray(value)
        ? value.every(item => isJsonValue(item, seen))
        : Object.getPrototypeOf(value) === Object.prototype
            && Object.values(value).every(item => isJsonValue(item, seen));
    seen.delete(value);
    return valid;
}

function cloneAndFreeze<T>(value: T): T {
    if (Array.isArray(value)) {
        return Object.freeze(value.map((item: unknown) => cloneAndFreeze(item))) as T;
    }
    if (isRecord(value)) {
        return Object.freeze(Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneAndFreeze(item)])
        )) as T;
    }
    return value;
}

function issue(
    code: QueryBuilderIssueCode,
    target: QueryBuilderIssueTarget,
    path: string,
    message: string
): QueryBuilderIssue {
    return { code, target, path, message };
}

function validResult<T>(value: T): ValidationResult<T> {
    return { valid: true, value, issues: [] };
}

function invalidResult<T>(issues: readonly QueryBuilderIssue[]): ValidationResult<T> {
    return { valid: false, issues };
}

function appendPointer(path: string, segment: string | number): string {
    return `${path}/${String(segment).replace(/~/g, '~0').replace(/\//g, '~1')}`;
}

function hasOwn(value: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function validateLocalSchemaReferences(
    schema: JsonSchema202012,
    path: string,
    issues: QueryBuilderIssue[]
): void {
    const pending: { readonly value: unknown, readonly path: string }[] = [{ value: schema, path }];
    while (pending.length > 0) {
        const current = pending.pop()!;
        if (Array.isArray(current.value)) {
            current.value.forEach((value, index) => pending.push({
                value,
                path: appendPointer(current.path, index)
            }));
        } else if (isRecord(current.value)) {
            const dialect = current.value.$schema;
            if (dialect !== undefined && dialect !== draft2020MetaSchemaUri) {
                issues.push(issue('invalid-schema', 'definition', appendPointer(current.path, '$schema'), 'Only JSON Schema Draft 2020-12 is supported.'));
            }
            for (const key of ['$ref', '$dynamicRef']) {
                const ref = current.value[key];
                if (ref !== undefined && (typeof ref !== 'string' || !ref.startsWith('#'))) {
                    issues.push(issue('invalid-schema', 'definition', appendPointer(current.path, key), 'Only local JSON Schema references are supported.'));
                }
            }
            Object.entries(current.value).forEach(([key, value]) => pending.push({
                value,
                path: appendPointer(current.path, key)
            }));
        }
    }
}

function getSchemaValidator(schema: JsonSchema202012): JsonSchemaValidator {
    const cached = typeof schema === 'object'
        ? schemaValidatorCache.get(schema)
        : booleanSchemaValidators.get(schema);
    if (cached) {
        return cached;
    }
    const validator = compileSchema(schema, validatorOptions);
    if (typeof schema === 'object') {
        schemaValidatorCache.set(schema, validator);
    } else {
        booleanSchemaValidators.set(schema, validator);
    }
    return validator;
}

function validateSchemaFragment(schema: unknown, path: string, issues: QueryBuilderIssue[]): schema is JsonSchema202012 {
    if (typeof schema !== 'boolean' && !isRecord(schema)) {
        issues.push(issue('invalid-schema', 'definition', path, 'A JSON Schema must be an object or boolean.'));
        return false;
    }
    const typedSchema = schema as JsonSchema202012;
    validateLocalSchemaReferences(typedSchema, path, issues);
    if (issues.some(item => item.target === 'definition' && item.path.startsWith(path))) {
        return false;
    }
    const result = metaValidator.validate(typedSchema);
    if (!result.valid || result.errorsAsync.length > 0) {
        issues.push(issue('invalid-schema', 'definition', path, result.errors[0]?.message ?? 'The JSON Schema is invalid.'));
        return false;
    }
    try {
        getSchemaValidator(typedSchema);
    } catch (error) {
        issues.push(issue('invalid-schema', 'definition', path, error instanceof Error ? error.message : 'The JSON Schema could not be compiled.'));
        return false;
    }
    return true;
}

function getStaticChoices(schema: JsonSchema202012): readonly QueryOption[] | undefined {
    if (typeof schema === 'boolean') {
        return undefined;
    }
    if (Array.isArray(schema.oneOf)) {
        const options: QueryOption[] = [];
        for (const branch of schema.oneOf) {
            if (!isRecord(branch) || !isJsonPrimitive(branch.const) || typeof branch.title !== 'string' || branch.title.length === 0) {
                return undefined;
            }
            options.push({ value: branch.const, label: branch.title });
        }
        return options;
    }
    if (Array.isArray(schema.enum) && schema.enum.every(isJsonPrimitive)) {
        return schema.enum.map(value => ({ value, label: JSON.stringify(value) }));
    }
    return undefined;
}

function isJsonPrimitive(value: unknown): value is JsonPrimitive {
    return value === null || typeof value === 'string' || typeof value === 'boolean'
        || (typeof value === 'number' && Number.isFinite(value));
}

function getSimpleSchemaType(schema: JsonSchema202012): string | undefined {
    if (typeof schema === 'boolean') {
        return undefined;
    }
    if (Array.isArray(schema.oneOf)) {
        const types = new Set<string>();
        for (const branch of schema.oneOf) {
            if (isRecord(branch) && typeof branch.type === 'string') {
                types.add(branch.type);
            }
        }
        if (types.size === 1) {
            return [...types][0];
        }
    }
    if (Array.isArray(schema.type)) {
        const types = schema.type.filter((type): type is string => typeof type === 'string' && type !== 'null');
        return types.length === 1 ? types[0] : undefined;
    }
    return typeof schema.type === 'string' ? schema.type : undefined;
}

function inferEditor(schema: JsonSchema202012, choices: readonly QueryOption[] | undefined): QueryBuilderEditorDefinition['kind'] | undefined {
    if (choices) {
        return 'select';
    }
    if (typeof schema === 'boolean') {
        return undefined;
    }
    const type = getSimpleSchemaType(schema);
    if (type === 'string' && schema.format === 'date') {
        return 'date';
    }
    if (type === 'string' && schema.format === 'date-time') {
        return 'datetime';
    }
    if (type === 'string') {
        return 'text';
    }
    if (type === 'number' || type === 'integer') {
        return 'number';
    }
    if (type === 'boolean') {
        return 'boolean';
    }
    return undefined;
}

function hasExpectedSchemaType(schema: JsonSchema202012, expected: string): boolean {
    if (typeof schema !== 'boolean' && !isRecord(schema)) {
        return false;
    }
    if (typeof schema === 'boolean') {
        return false;
    }
    const type = schema.type;
    return type === expected || (Array.isArray(type) && type.includes(expected));
}

function isKeyValueSchema(schema: JsonSchema202012): boolean {
    if (typeof schema === 'boolean' || schema.type !== 'object' || schema.additionalProperties !== false
        || !Array.isArray(schema.required) || schema.required.length !== 2
        || !schema.required.includes('key') || !schema.required.includes('value')
        || !isRecord(schema.properties)) {
        return false;
    }
    const keySchema = schema.properties.key;
    const valueSchema = schema.properties.value;
    return Object.keys(schema.properties).length === 2
        && keySchema !== undefined
        && valueSchema !== undefined
        && hasExpectedSchemaType(keySchema as JsonSchema202012, 'string')
        && hasExpectedSchemaType(valueSchema as JsonSchema202012, 'string');
}

function editorCompatibilityIssues(
    definition: QueryBuilderDefinition,
    issues: QueryBuilderIssue[]
): void {
    for (const [fieldIndex, field] of definition.fields.entries()) {
        for (const operatorId of field.operatorIds) {
            const operatorIndex = definition.operators.findIndex(operator => operator.id === operatorId);
            const operator = definition.operators[operatorIndex];
            if (!operator) {
                continue;
            }
            const path = `/fields/${fieldIndex}/editor`;
            const operand = operator.operand;
            if (operand.kind === 'none') {
                if (operator.editor && operator.editor.kind !== 'auto') {
                    issues.push(issue('unsupported-editor', 'definition', `/operators/${operatorIndex}/editor`, 'Unary operators do not have a value editor.'));
                }
                continue;
            }

            let effectiveSchema = field.valueSchema;
            if (operand.kind === 'schema') {
                effectiveSchema = operand.schema;
            } else if (operand.kind === 'range') {
                effectiveSchema = operand.endpointSchema;
            }
            const choices = getStaticChoices(effectiveSchema);
            const explicit = operator.editor ?? field.editor;
            let kind: QueryBuilderEditorDefinition['kind'] | undefined;
            if (explicit && explicit.kind !== 'auto') {
                kind = explicit.kind;
            } else if (operand.kind === 'range') {
                kind = 'range';
            } else {
                kind = inferEditor(effectiveSchema, choices);
            }
            const source = explicit && (explicit.kind === 'select' || explicit.kind === 'combobox')
                ? explicit.optionsSource
                : undefined;

            if (!kind) {
                issues.push(issue('unsupported-editor', 'definition', path, `No supported editor can be inferred for field "${field.id}" and operator "${operator.id}".`));
                continue;
            }
            if (operand.kind === 'range') {
                if (kind !== 'range') {
                    issues.push(issue('unsupported-editor', 'definition', path, 'Range operands require the range editor.'));
                }
                const endpointType = getSimpleSchemaType(operand.endpointSchema);
                if (endpointType !== 'number' && endpointType !== 'integer'
                    && !(endpointType === 'string' && typeof operand.endpointSchema !== 'boolean' && operand.endpointSchema.format === 'date')) {
                    issues.push(issue('unsupported-editor', 'definition', `/operators/${operatorIndex}/operand/endpointSchema`, 'Range endpoints must be numbers, integers, or date-only strings.'));
                }
                continue;
            }
            if (kind === 'range') {
                issues.push(issue('unsupported-editor', 'definition', path, 'The range editor requires a range operand.'));
            } else if (kind === 'key-value' && (operand.kind !== 'schema' || !isKeyValueSchema(operand.schema))) {
                issues.push(issue('unsupported-editor', 'definition', path, 'The key-value editor requires an object schema with exactly required string key/value properties.'));
            } else if (kind === 'select') {
                if (source && choices) {
                    issues.push(issue('invalid-editor-options', 'definition', path, 'Static choices and a dynamic option source cannot be combined.'));
                } else if (!source && !choices) {
                    issues.push(issue('invalid-editor-options', 'definition', path, 'A select editor requires static choices or an option source.'));
                }
            } else if (kind === 'combobox') {
                if (!source || choices || !hasExpectedSchemaType(effectiveSchema, 'string')) {
                    issues.push(issue('invalid-editor-options', 'definition', path, 'A combobox requires a dynamic source, no static choices, and a string schema.'));
                }
            } else if (source) {
                issues.push(issue('invalid-editor-options', 'definition', path, 'Only select and combobox editors can use an option source.'));
            }
            if (['text', 'number', 'boolean', 'date', 'datetime'].includes(kind)) {
                const inferred = inferEditor(effectiveSchema, undefined);
                let compatible = false;
                switch (kind) {
                    case 'text':
                        compatible = inferred === 'text';
                        break;
                    case 'number':
                        compatible = inferred === 'number';
                        break;
                    case 'boolean':
                        compatible = inferred === 'boolean';
                        break;
                    case 'date':
                        compatible = inferred === 'date';
                        break;
                    case 'datetime':
                        compatible = inferred === 'datetime';
                        break;
                    default:
                        break;
                }
                if (!compatible && !(kind === 'text' && typeof effectiveSchema !== 'boolean' && effectiveSchema.type === 'string')) {
                    issues.push(issue('unsupported-editor', 'definition', path, `The ${kind} editor is incompatible with the effective schema.`));
                }
            }
        }
    }
}

function validateDefinitionInner(input: unknown): ValidationResult<QueryBuilderDefinition> {
    if (!isJsonValue(input) || !isRecord(input)) {
        return invalidResult([issue('invalid-definition', 'definition', '', 'A definition must be a JSON object.')]);
    }
    const issues: QueryBuilderIssue[] = [];
    if (input.version !== 1) {
        issues.push(issue('unsupported-version', 'definition', '/version', 'Only query-builder definition version 1 is supported.'));
    }
    if (!Array.isArray(input.fields) || input.fields.length === 0) {
        issues.push(issue('invalid-definition', 'definition', '/fields', 'A definition must include at least one field.'));
    }
    if (!Array.isArray(input.operators) || input.operators.length === 0) {
        issues.push(issue('invalid-definition', 'definition', '/operators', 'A definition must include at least one operator.'));
    }
    const topKeys = new Set(['version', 'fields', 'operators']);
    Object.keys(input).filter(key => !topKeys.has(key)).forEach(key => {
        issues.push(issue('invalid-definition', 'definition', appendPointer('', key), 'Unknown definition property.'));
    });
    if (!Array.isArray(input.fields) || !Array.isArray(input.operators)) {
        return invalidResult(issues);
    }

    const fields = new Map<string, number>();
    input.fields.forEach((field, index) => {
        const path = `/fields/${index}`;
        if (!isRecord(field) || typeof field.id !== 'string' || typeof field.path !== 'string'
            || typeof field.label !== 'string' || !Array.isArray(field.operatorIds)) {
            issues.push(issue('invalid-definition', 'definition', path, 'Field requires id, path, label, valueSchema, and operatorIds.'));
            return;
        }
        if (fields.has(field.id)) {
            issues.push(issue('duplicate-id', 'definition', `${path}/id`, `Duplicate field ID "${field.id}".`));
        }
        fields.set(field.id, index);
        if (!/^\/(?:[^~/]|~[01])+(?:\/(?:[^~/]|~[01])*)*$/.test(field.path)) {
            issues.push(issue('invalid-field-path', 'definition', `${path}/path`, 'Field path must be a non-root JSON Pointer.'));
        }
        if (field.label.length === 0 || !/^[A-Za-z][A-Za-z0-9._-]*$/.test(field.id)) {
            issues.push(issue('invalid-definition', 'definition', path, 'Field IDs and labels must be non-empty and IDs must use the documented format.'));
        }
        const fieldKeys = new Set(['id', 'path', 'label', 'valueSchema', 'operatorIds', 'editor']);
        Object.keys(field).filter(key => !fieldKeys.has(key)).forEach(key => {
            issues.push(issue('invalid-definition', 'definition', appendPointer(path, key), 'Unknown field property.'));
        });
        validateSchemaFragment(field.valueSchema, `${path}/valueSchema`, issues);
        if (field.editor !== undefined && !isEditorDefinition(field.editor)) {
            issues.push(issue('invalid-definition', 'definition', `${path}/editor`, 'Invalid editor definition.'));
        }
        const uniqueOperators = new Set<string>();
        field.operatorIds.forEach((operatorId, operatorIndex) => {
            if (typeof operatorId !== 'string' || uniqueOperators.has(operatorId)) {
                issues.push(issue('invalid-definition', 'definition', `${path}/operatorIds/${operatorIndex}`, 'Operator IDs must be unique strings.'));
            }
            uniqueOperators.add(operatorId as string);
        });
    });

    const operators = new Map<string, number>();
    input.operators.forEach((operator, index) => {
        const path = `/operators/${index}`;
        if (!isRecord(operator) || typeof operator.id !== 'string' || typeof operator.label !== 'string'
            || !isOperandDefinition(operator.operand)) {
            issues.push(issue('invalid-definition', 'definition', path, 'Operator requires id, label, and operand.'));
            return;
        }
        if (operators.has(operator.id)) {
            issues.push(issue('duplicate-id', 'definition', `${path}/id`, `Duplicate operator ID "${operator.id}".`));
        }
        operators.set(operator.id, index);
        if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(operator.id) || operator.label.length === 0) {
            issues.push(issue('invalid-definition', 'definition', path, 'Operator IDs and labels must be non-empty and IDs must use the documented format.'));
        }
        const operatorKeys = new Set(['id', 'label', 'operand', 'editor']);
        Object.keys(operator).filter(key => !operatorKeys.has(key)).forEach(key => {
            issues.push(issue('invalid-definition', 'definition', appendPointer(path, key), 'Unknown operator property.'));
        });
        if (operator.editor !== undefined && !isEditorDefinition(operator.editor)) {
            issues.push(issue('invalid-definition', 'definition', `${path}/editor`, 'Invalid editor definition.'));
        }
        if (operator.operand.kind === 'schema') {
            validateSchemaFragment(operator.operand.schema, `${path}/operand/schema`, issues);
        } else if (operator.operand.kind === 'range') {
            validateSchemaFragment(operator.operand.endpointSchema, `${path}/operand/endpointSchema`, issues);
        }
        if (operator.operand.kind === 'field-value-list' && operator.operand.minItems !== undefined
            && (!Number.isInteger(operator.operand.minItems) || operator.operand.minItems < 1)) {
            issues.push(issue('invalid-definition', 'definition', `${path}/operand/minItems`, 'minItems must be a positive integer.'));
        }
    });

    input.fields.forEach((field, index) => {
        if (!isRecord(field) || !Array.isArray(field.operatorIds)) {
            return;
        }
        field.operatorIds.forEach((operatorId, operatorIndex) => {
            if (typeof operatorId === 'string' && !operators.has(operatorId)) {
                issues.push(issue('unknown-operator', 'definition', `/fields/${index}/operatorIds/${operatorIndex}`, `Unknown operator "${operatorId}".`));
            }
        });
    });

    if (issues.length > 0) {
        return invalidResult(issues);
    }
    if (!isDefinition(input)) {
        return invalidResult([issue('invalid-definition', 'definition', '', 'The definition shape is invalid.')]);
    }
    const definition = cloneAndFreeze(input);
    editorCompatibilityIssues(definition, issues);
    if (issues.length > 0) {
        return invalidResult(issues);
    }
    const validators = new Map<string, JsonSchemaValidator>();
    definition.fields.forEach(field => validators.set(`field:${field.id}`, getSchemaValidator(field.valueSchema)));
    definition.operators.forEach(operator => {
        if (operator.operand.kind === 'schema') {
            validators.set(`operator:${operator.id}`, getSchemaValidator(operator.operand.schema));
        }
    });
    definitionCache.set(definition, validators);
    return validResult(definition);
}

function isEditorDefinition(value: unknown): value is QueryBuilderEditorDefinition {
    if (!isRecord(value) || typeof value.kind !== 'string') {
        return false;
    }
    if (value.kind === 'auto') {
        return Object.keys(value).length === 1;
    }
    if (['text', 'number', 'boolean', 'date', 'datetime', 'range', 'key-value'].includes(value.kind)) {
        return Object.keys(value).length === 1;
    }
    if (value.kind === 'select' || value.kind === 'combobox') {
        if (Object.keys(value).some(key => key !== 'kind' && key !== 'optionsSource')) {
            return false;
        }
        return value.optionsSource === undefined || isOptionSourceDefinition(value.optionsSource);
    }
    return false;
}

function isOptionSourceDefinition(value: unknown): value is QueryOptionSourceDefinition {
    return isRecord(value)
        && typeof value.sourceId === 'string'
        && /^[A-Za-z][A-Za-z0-9._-]*$/.test(value.sourceId)
        && Object.keys(value).every(key => ['sourceId', 'dependsOn', 'searchable', 'pageSize'].includes(key))
        && (value.dependsOn === undefined || (Array.isArray(value.dependsOn)
            && value.dependsOn.every(item => typeof item === 'string')
            && new Set(value.dependsOn).size === value.dependsOn.length))
        && (value.searchable === undefined || typeof value.searchable === 'boolean')
        && (value.pageSize === undefined || (Number.isInteger(value.pageSize) && Number(value.pageSize) >= 1));
}

function isOperandDefinition(value: unknown): value is QueryBuilderOperandDefinition {
    if (!isRecord(value) || typeof value.kind !== 'string') {
        return false;
    }
    if (value.kind === 'none' || value.kind === 'field-value') {
        return Object.keys(value).length === 1;
    }
    if (value.kind === 'field-value-list') {
        return Object.keys(value).every(key => key === 'kind' || key === 'minItems')
            && (value.minItems === undefined || (Number.isInteger(value.minItems) && Number(value.minItems) >= 1));
    }
    if (value.kind === 'range') {
        return Object.keys(value).length === 2 && value.endpointSchema !== undefined;
    }
    return value.kind === 'schema' && Object.keys(value).length === 2 && value.schema !== undefined;
}

function isFieldDefinition(value: unknown): value is QueryBuilderFieldDefinition {
    return isRecord(value)
        && typeof value.id === 'string'
        && typeof value.path === 'string'
        && typeof value.label === 'string'
        && (typeof value.valueSchema === 'boolean' || isRecord(value.valueSchema))
        && Array.isArray(value.operatorIds)
        && value.operatorIds.every(item => typeof item === 'string')
        && (value.editor === undefined || isEditorDefinition(value.editor));
}

function isOperatorDefinition(value: unknown): value is QueryBuilderOperatorDefinition {
    return isRecord(value)
        && typeof value.id === 'string'
        && typeof value.label === 'string'
        && isOperandDefinition(value.operand)
        && (value.editor === undefined || isEditorDefinition(value.editor));
}

function isDefinition(value: unknown): value is QueryBuilderDefinition {
    return isRecord(value)
        && value.version === 1
        && Array.isArray(value.fields)
        && value.fields.every(isFieldDefinition)
        && Array.isArray(value.operators)
        && value.operators.every(isOperatorDefinition);
}

function isQueryNode(value: unknown): value is QueryNode {
    if (!isRecord(value)) {
        return false;
    }
    if (value.kind === 'predicate') {
        return typeof value.fieldId === 'string'
            && typeof value.operatorId === 'string'
            && Object.keys(value).every(key => ['kind', 'fieldId', 'operatorId', 'value'].includes(key))
            && (!hasOwn(value, 'value') || isJsonValue(value.value));
    }
    return value.kind === 'group'
        && (value.combinator === 'and' || value.combinator === 'or')
        && Array.isArray(value.children)
        && value.children.length >= 2
        && Object.keys(value).every(key => ['kind', 'combinator', 'children'].includes(key))
        && value.children.every(isQueryNode);
}

function isQueryDocument(value: unknown): value is QueryDocument {
    return isRecord(value)
        && value.version === 1
        && hasOwn(value, 'root')
        && Object.keys(value).every(key => key === 'version' || key === 'root')
        && (value.root === null || isQueryNode(value.root));
}

export function validateDefinition(input: unknown): ValidationResult<QueryBuilderDefinition> {
    if (isDefinition(input) && Object.isFrozen(input)) {
        const definition = input;
        const cached = definitionCache.get(definition);
        if (cached) {
            return validResult(definition);
        }
    }
    return validateDefinitionInner(input);
}

function issueForSchemaErrors(
    errors: ReturnType<JsonSchemaValidator['validate']>['errors'],
    target: QueryBuilderIssueTarget,
    path: string
): QueryBuilderIssue[] {
    return errors.map(error => issue(
        'invalid-value',
        target,
        `${path}${error.data.pointer === '#' ? '' : error.data.pointer.replace(/^#/, '')}`,
        error.message
    ));
}

function excessiveGroupDepthPath(root: unknown): string | undefined {
    const stack: { readonly node: unknown, readonly path: string, readonly parentDepth: number, readonly isRoot: boolean }[] = [
        { node: root, path: '/root', parentDepth: 0, isRoot: true }
    ];
    const visitedDepth = new Map<object, number>();
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (!isRecord(current.node) || current.node.kind !== 'group' || !Array.isArray(current.node.children)) {
            continue;
        }
        const depth = current.isRoot ? 0 : current.parentDepth + 1;
        if (!current.isRoot && depth > MAX_QUERY_GROUP_DEPTH) {
            return current.path;
        }
        const previousDepth = visitedDepth.get(current.node);
        if (previousDepth !== undefined && previousDepth >= depth) {
            continue;
        }
        visitedDepth.set(current.node, depth);
        current.node.children.forEach((node, index) => stack.push({
            node,
            path: appendPointer(`${current.path}/children`, index),
            parentDepth: depth,
            isRoot: false
        }));
    }
    return undefined;
}

function validateQueryInner(input: unknown, definition: QueryBuilderDefinition): ValidationResult<QueryDocument> {
    const issues: QueryBuilderIssue[] = [];
    if (!isRecord(input)) {
        return invalidResult([issue('invalid-query', 'query', '', 'A query document must be a JSON object.')]);
    }
    if (input.version !== 1) {
        return invalidResult([issue('unsupported-version', 'query', '/version', 'Only query document version 1 is supported.')]);
    }
    const excessiveDepthPath = excessiveGroupDepthPath(input.root);
    if (excessiveDepthPath !== undefined) {
        return invalidResult([issue(
            'invalid-query',
            'query',
            excessiveDepthPath,
            `Query groups cannot be nested more than ${MAX_QUERY_GROUP_DEPTH} levels.`
        )]);
    }
    if (!isJsonValue(input)) {
        return invalidResult([issue('invalid-query', 'query', '', 'A query document must be a JSON object.')]);
    }
    if (!isQueryDocument(input)) {
        return invalidResult([issue('invalid-query', 'query', '/root', 'The query document shape is invalid.')]);
    }
    const fieldMap = new Map(definition.fields.map(field => [field.id, field]));
    const operatorMap = new Map(definition.operators.map(operator => [operator.id, operator]));
    const validators = definitionCache.get(definition);
    if (input.root === null) {
        return issues.length > 0 ? invalidResult(issues) : validResult(cloneAndFreeze(input));
    }
    const stack: { readonly node: unknown, readonly path: string }[] = [{ node: input.root, path: '/root' }];
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (!isRecord(current.node)) {
            issues.push(issue('invalid-query', 'query', current.path, 'A query node must be an object.'));
            continue;
        }
        if (current.node.kind === 'group') {
            if ((current.node.combinator !== 'and' && current.node.combinator !== 'or')
                || !Array.isArray(current.node.children)
                || current.node.children.length < 2
                || Object.keys(current.node).some(key => !['kind', 'combinator', 'children'].includes(key))) {
                issues.push(issue('invalid-query', 'query', current.path, 'A group requires a combinator and at least two child nodes.'));
                continue;
            }
            current.node.children.forEach((node, index) => stack.push({
                node,
                path: appendPointer(`${current.path}/children`, index)
            }));
            continue;
        }
        if (current.node.kind !== 'predicate'
            || typeof current.node.fieldId !== 'string'
            || typeof current.node.operatorId !== 'string'
            || Object.keys(current.node).some(key => !['kind', 'fieldId', 'operatorId', 'value'].includes(key))) {
            issues.push(issue('invalid-query', 'query', current.path, 'A predicate requires fieldId and operatorId and does not allow unknown properties.'));
            continue;
        }
        const field = fieldMap.get(current.node.fieldId);
        if (!field) {
            issues.push(issue('unknown-field', 'query', `${current.path}/fieldId`, `Unknown field "${current.node.fieldId}".`));
            continue;
        }
        const operator = operatorMap.get(current.node.operatorId);
        if (!operator) {
            issues.push(issue('unknown-operator', 'query', `${current.path}/operatorId`, `Unknown operator "${current.node.operatorId}".`));
            continue;
        }
        if (!field.operatorIds.includes(operator.id)) {
            issues.push(issue('unsupported-operator', 'query', `${current.path}/operatorId`, `Operator "${operator.id}" is not allowed for field "${field.id}".`));
            continue;
        }
        const hasValue = hasOwn(current.node, 'value');
        const value = current.node.value;
        if (operator.operand.kind === 'none') {
            if (hasValue) {
                issues.push(issue('invalid-value', 'query', `${current.path}/value`, 'Unary predicates must omit value.'));
            }
            continue;
        }
        if (!hasValue) {
            issues.push(issue('incomplete-expression', 'query', `${current.path}/value`, 'Predicate value is required.'));
            continue;
        }
        if (operator.operand.kind === 'field-value') {
            const validator = validators?.get(`field:${field.id}`);
            if (validator) {
                issues.push(...issueForSchemaErrors(validator.validate(value).errors, 'query', `${current.path}/value`));
            }
        } else if (operator.operand.kind === 'field-value-list') {
            if (!Array.isArray(value) || value.length < (operator.operand.minItems ?? 1)) {
                issues.push(issue('invalid-value', 'query', `${current.path}/value`, 'List operand does not meet its minimum item count.'));
            } else {
                const valueValidator = validators?.get(`field:${field.id}`);
                if (valueValidator) {
                    value.forEach((item, index) => {
                        issues.push(...issueForSchemaErrors(valueValidator.validate(item).errors, 'query', `${current.path}/value/${index}`));
                    });
                }
                for (let index = 0; index < value.length; index += 1) {
                    const currentValue: unknown = value[index];
                    if (value.slice(index + 1).some((item: unknown) => (
                        isJsonValue(item)
                        && isJsonValue(currentValue)
                        && jsonValuesEqual(item, currentValue)
                    ))) {
                        issues.push(issue('invalid-value', 'query', `${current.path}/value/${index}`, 'List operand values must be unique.'));
                        break;
                    }
                }
            }
        } else if (operator.operand.kind === 'range') {
            if (!isRecord(value) || !hasOwn(value, 'start') || !hasOwn(value, 'end')
                || Object.keys(value).some(key => key !== 'start' && key !== 'end')) {
                issues.push(issue('invalid-value', 'query', `${current.path}/value`, 'Range operands require start and end values.'));
            } else {
                const endpointValidator = getSchemaValidator(operator.operand.endpointSchema);
                issues.push(...issueForSchemaErrors(
                    endpointValidator.validate(value.start).errors,
                    'query',
                    `${current.path}/value/start`
                ));
                issues.push(...issueForSchemaErrors(
                    endpointValidator.validate(value.end).errors,
                    'query',
                    `${current.path}/value/end`
                ));
                const start = value.start;
                const end = value.end;
                if ((typeof start === 'number' && typeof end === 'number' && start > end)
                    || (typeof start === 'string' && typeof end === 'string' && start > end)) {
                    issues.push(issue('invalid-value', 'query', `${current.path}/value`, 'Range start must not exceed its end.'));
                }
            }
        } else {
            const validator = validators?.get(`operator:${operator.id}`);
            if (validator) {
                issues.push(...issueForSchemaErrors(validator.validate(value).errors, 'query', `${current.path}/value`));
            }
        }
    }
    return issues.length > 0 ? invalidResult(issues) : validResult(cloneAndFreeze(input));
}

function jsonValuesEqual(left: JsonValue, right: JsonValue): boolean {
    if (left === right) {
        return true;
    }
    if (Array.isArray(left) || Array.isArray(right)) {
        return Array.isArray(left) && Array.isArray(right)
            && left.length === right.length
            && left.every((value, index) => jsonValuesEqual(value, right[index]!));
    }
    if (isRecord(left) && isRecord(right)) {
        const keys = Object.keys(left);
        return keys.length === Object.keys(right).length
            && keys.every(key => hasOwn(right, key) && jsonValuesEqual(left[key]!, right[key]!));
    }
    return false;
}

export function validateQuery(input: unknown, definitionInput: unknown): ValidationResult<QueryDocument> {
    const definitionResult = validateDefinition(definitionInput);
    if (!definitionResult.valid) {
        return invalidResult(definitionResult.issues);
    }
    return validateQueryInner(input, definitionResult.value);
}
