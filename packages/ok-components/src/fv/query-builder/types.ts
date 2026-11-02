import type {
    QueryDocument,
    QueryEditorDraft
} from './portable-interface';

export type QueryBuilderLogicalOperator = 'and' | 'or';

export type QueryBuilderFieldType = | 'string'
    | 'number'
    | 'date'
    | 'boolean'
    | 'enum'
    | 'array'
    | 'custom-property';

export type QueryBuilderOperatorId = | 'equals'
    | 'contains'
    | 'starts-with'
    | 'ends-with'
    | 'is-blank'
    | 'is-one-of'
    | 'not-equals'
    | 'greater-than'
    | 'greater-or-equal'
    | 'less-than'
    | 'less-or-equal'
    | 'between'
    | 'between-dates'
    | 'is-empty'
    | 'before'
    | 'after'
    | 'is'
    | 'is-not'
    | 'is-any-of'
    | 'is-none-of'
    | 'does-not-contain'
    | 'has-key'
    | 'key-equals'
    | 'key-contains';

export type QueryBuilderOperandKind = 'none' | 'scalar' | 'collection' | 'range' | 'key' | 'key-value';

export type QueryBuilderScalar = string | number | boolean | null;

export type QueryBuilderOperand = | { readonly kind: 'none' }
    | { readonly kind: 'scalar', readonly value: QueryBuilderScalar }
    | { readonly kind: 'collection', readonly values: readonly string[] }
    | { readonly kind: 'range', readonly start: string | number | null, readonly end: string | number | null }
    | { readonly kind: 'key', readonly key: string }
    | { readonly kind: 'key-value', readonly key: string, readonly value: string };

export interface QueryBuilderOption {
    readonly label: string;
    readonly value: string;
}

export interface QueryBuilderOperatorDefinition {
    readonly id: QueryBuilderOperatorId;
    readonly operandKind: QueryBuilderOperandKind;
}

export interface QueryBuilderField {
    readonly id: string;
    readonly label: string;
    readonly type: QueryBuilderFieldType;
    readonly operators: readonly QueryBuilderOperatorId[];
    readonly options?: readonly QueryBuilderOption[];
}

export interface QueryBuilderRule {
    readonly id: string;
    readonly revision: number;
    readonly fieldId: string;
    readonly operatorId: QueryBuilderOperatorId;
    readonly operand: QueryBuilderOperand;
}

export interface QueryBuilderSavedQuery {
    readonly id: string;
    readonly name: string;
    readonly document: QueryDocument;
}

export interface QueryBuilderSaveRequest {
    readonly kind: 'create' | 'update';
    readonly id?: string;
    readonly name: string;
    readonly document: QueryDocument;
}

export interface QueryBuilderEventDetail {
    readonly selectedId: string | undefined;
    readonly draft: QueryEditorDraft;
    readonly query: QueryDocument | null;
    readonly ruleCount: number;
    readonly valid: boolean;
}

export interface QueryBuilderAIRequestDetail {
    readonly prompt: string;
    readonly draft: QueryEditorDraft;
    readonly query: QueryDocument | null;
}

export interface QueryBuilderLabels {
    readonly toggleLogic: (logic: string) => string;
    readonly queryConditions: string;
    readonly configureQuery: string;
    readonly completeFilterExpression: string;
    readonly startFilterGroup: string;
    readonly endFilterGroup: string;
    readonly matchingFields: string;
    readonly logicalOperator: string;
    readonly queryHelperText: string;
    readonly closeEditorHint: string;
    readonly askAi: string;
    readonly aiPromptDescription: string;
    readonly aiPreviewReady: string;
    readonly queries: string;
    readonly saved: string;
    readonly currentQuery: string;
    readonly unsavedChanges: string;
    readonly unsavedDraft: string;
    readonly manageSavedQueries: string;
    readonly aiPromptPlaceholder: string;
    readonly generateQuery: string;
    readonly reviewGeneratedQuery: string;
    readonly clearAll: string;
    readonly cancel: string;
    readonly apply: string;
    readonly noSavedQueries: string;
    readonly queryApplied: string;
    readonly queryCanceled: string;
    readonly queryCleared: string;
    readonly saveAsNew: string;
    readonly updateSavedQuery: string;
    readonly editSavedQueries: string;
    readonly save: string;
    readonly saveChanges: string;
    readonly queryName: string;
    readonly delete: string;
    readonly confirmDelete: string;
    readonly cancelDelete: string;
    readonly createSavedQuery: string;
    readonly saveFailed: string;
    readonly deleteFailed: string;
    readonly savedQuerySaved: string;
    readonly savedQueryDeleted: string;
    readonly nameRequired: string;
    readonly deleteConfirmation: string;
    readonly movePopoverHint: string;
    readonly closeSavedMenu: string;
    readonly selectSavedQuery: string;
    readonly field: string;
    readonly operator: string;
    readonly value: string;
    readonly collectionValueLabel?: string;
    readonly collectionValueHint?: string;
    readonly loadingOptions: string;
    readonly editRule: string;
    readonly removeRule: (fieldLabel: string) => string;
    readonly removeValue: (value: string) => string;
    readonly addFilter: string;
    readonly addCondition?: string;
    readonly addFirstFilter: string;
    readonly addGroup: string;
    readonly groupSplitUnavailable: string;
    readonly noFilters: string;
    readonly done: string;
    readonly close: string;
    readonly and: string;
    readonly or: string;
    readonly true: string;
    readonly false: string;
    readonly unset: string;
    readonly selectOption: string;
    readonly addValue: string;
    readonly emptyCollection: string;
    readonly rangeStart: string;
    readonly rangeEnd: string;
    readonly key: string;
    readonly comparisonValue: string;
    readonly invalidRule: string;
    readonly noAvailableFields: string;
    readonly incomplete: string;
    readonly invalid: string;
    readonly operators: Readonly<{ [key: string]: string }>;
    readonly errors: {
        readonly required: string,
        readonly invalidNumber: string,
        readonly invalidDate: string,
        readonly invalidRange: string,
        readonly invalidCollection: string,
        readonly invalidJsonArray?: string,
        readonly invalidOption: string,
        readonly invalidKey: string,
        readonly invalidValue: string,
        readonly unsupportedField: string,
        readonly unsupportedOperator: string,
        readonly duplicateIdentifier: string
    };
}

const operatorDefinitionEntries: readonly (readonly [QueryBuilderFieldType, readonly QueryBuilderOperatorDefinition[]])[] = [
    ['string', [
        { id: 'equals', operandKind: 'scalar' },
        { id: 'contains', operandKind: 'scalar' },
        { id: 'starts-with', operandKind: 'scalar' },
        { id: 'ends-with', operandKind: 'scalar' },
        { id: 'is-blank', operandKind: 'none' },
        { id: 'is-one-of', operandKind: 'collection' }
    ]],
    ['number', [
        { id: 'equals', operandKind: 'scalar' },
        { id: 'not-equals', operandKind: 'scalar' },
        { id: 'greater-than', operandKind: 'scalar' },
        { id: 'greater-or-equal', operandKind: 'scalar' },
        { id: 'less-than', operandKind: 'scalar' },
        { id: 'less-or-equal', operandKind: 'scalar' },
        { id: 'between', operandKind: 'range' },
        { id: 'is-empty', operandKind: 'none' }
    ]],
    ['date', [
        { id: 'equals', operandKind: 'scalar' },
        { id: 'before', operandKind: 'scalar' },
        { id: 'after', operandKind: 'scalar' },
        { id: 'between', operandKind: 'range' },
        { id: 'is-empty', operandKind: 'none' }
    ]],
    ['boolean', [{ id: 'is', operandKind: 'scalar' }]],
    ['enum', [
        { id: 'is', operandKind: 'scalar' },
        { id: 'is-not', operandKind: 'scalar' },
        { id: 'is-any-of', operandKind: 'collection' },
        { id: 'is-none-of', operandKind: 'collection' }
    ]],
    ['array', [
        { id: 'contains', operandKind: 'scalar' },
        { id: 'does-not-contain', operandKind: 'scalar' },
        { id: 'is-empty', operandKind: 'none' }
    ]],
    ['custom-property', [
        { id: 'has-key', operandKind: 'key' },
        { id: 'key-equals', operandKind: 'key-value' },
        { id: 'key-contains', operandKind: 'key-value' }
    ]]
];

export const operatorDefinitions = Object.fromEntries(operatorDefinitionEntries) as Readonly<{
    [fieldType in QueryBuilderFieldType]: readonly QueryBuilderOperatorDefinition[];
}>;

const operatorLabels: QueryBuilderLabels['operators'] = Object.fromEntries([
    ['equals', 'Equals'],
    ['contains', 'Contains'],
    ['starts-with', 'Starts with'],
    ['ends-with', 'Ends with'],
    ['is-blank', 'Is blank'],
    ['is-one-of', 'Is one of'],
    ['not-equals', 'Does not equal'],
    ['greater-than', 'Greater than'],
    ['greater-or-equal', 'Greater than or equal to'],
    ['less-than', 'Less than'],
    ['less-or-equal', 'Less than or equal to'],
    ['between', 'Between'],
    ['is-empty', 'Is empty'],
    ['before', 'Before'],
    ['after', 'After'],
    ['is', 'Is'],
    ['is-not', 'Is not'],
    ['is-any-of', 'Is any of'],
    ['is-none-of', 'Is none of'],
    ['does-not-contain', 'Does not contain'],
    ['has-key', 'Has key'],
    ['key-equals', 'Key equals'],
    ['key-contains', 'Key contains']
] as const);

export const defaultQueryBuilderLabels: QueryBuilderLabels = {
    toggleLogic: logic => `Toggle logic. Currently ${logic}.`,
    queryConditions: 'Query conditions',
    configureQuery: 'Configure query',
    completeFilterExpression: 'Complete the filter expression.',
    startFilterGroup: 'Start filter group',
    endFilterGroup: 'End filter group',
    matchingFields: 'Matching fields',
    logicalOperator: 'Logical operator',
    queryHelperText: 'Type to add a condition · Tab to complete · Delete to remove',
    closeEditorHint: 'Press Tab to close the editor.',
    askAi: 'Ask Nigel',
    aiPromptDescription: 'Generate a query with Nigel using natural language',
    aiPreviewReady: 'AI query preview ready for review.',
    queries: 'Queries',
    saved: 'Saved',
    currentQuery: 'Current query',
    unsavedChanges: 'Unsaved changes',
    unsavedDraft: 'Unsaved draft',
    manageSavedQueries: 'Manage saved query',
    aiPromptPlaceholder: 'E.g., Failed tests in Production that took longer than 1 second',
    generateQuery: 'Create query',
    reviewGeneratedQuery: 'Review generated query',
    clearAll: 'Clear all',
    cancel: 'Cancel',
    apply: 'Apply',
    noSavedQueries: 'No saved queries',
    queryApplied: 'Query applied.',
    queryCanceled: 'Changes canceled.',
    queryCleared: 'Query cleared.',
    saveAsNew: 'Create saved query',
    updateSavedQuery: 'Update saved query',
    editSavedQueries: 'Edit saved query',
    save: 'Save',
    saveChanges: 'Save changes',
    queryName: 'Name',
    delete: 'Delete',
    confirmDelete: 'Delete query',
    cancelDelete: 'Cancel',
    createSavedQuery: 'Create saved query',
    saveFailed: 'Could not save this query. Try again.',
    deleteFailed: 'Could not delete this query. Try again.',
    savedQuerySaved: 'Saved query saved.',
    savedQueryDeleted: 'Saved query deleted.',
    nameRequired: 'Enter a name.',
    deleteConfirmation: 'Delete this saved query? This cannot be undone.',
    movePopoverHint: 'Use the arrow keys to move the query editor.',
    closeSavedMenu: 'Close saved queries',
    selectSavedQuery: 'Select saved query',
    field: 'Field',
    operator: 'Operator',
    value: 'Value',
    collectionValueLabel: 'Values (JSON array)',
    collectionValueHint: 'Enter a JSON array, for example ["one", "two"] or [1, 2].',
    loadingOptions: 'Loading options...',
    editRule: 'Edit filter',
    removeRule: fieldLabel => `Remove ${fieldLabel} filter`,
    removeValue: value => `Remove ${value}`,
    addFilter: 'Add filter',
    addCondition: 'Add condition',
    addFirstFilter: 'Add first filter',
    addGroup: 'Add group',
    groupSplitUnavailable: 'A group cannot be inserted here without changing the query logic.',
    noFilters: 'No filters active',
    done: 'Done',
    close: 'Close filter editor',
    and: 'AND',
    or: 'OR',
    true: 'True',
    false: 'False',
    unset: 'Choose a value',
    selectOption: 'Select an option',
    addValue: 'Add value',
    emptyCollection: 'No values selected',
    rangeStart: 'Minimum value',
    rangeEnd: 'Maximum value',
    key: 'Property key',
    comparisonValue: 'Comparison value',
    invalidRule: 'Invalid filter',
    noAvailableFields: 'No supported filter fields are available.',
    incomplete: 'Incomplete',
    invalid: 'Invalid',
    operators: operatorLabels,
    errors: {
        required: 'A value is required.',
        invalidNumber: 'Enter a finite number.',
        invalidDate: 'Enter a valid date.',
        invalidRange: 'Enter a valid range with the first value no greater than the second.',
        invalidCollection: 'Add at least one non-empty, unique value.',
        invalidJsonArray: 'Enter a valid JSON array.',
        invalidOption: 'Choose a configured option.',
        invalidKey: 'Enter a property key.',
        invalidValue: 'Enter a comparison value.',
        unsupportedField: 'This field is unavailable.',
        unsupportedOperator: 'This operator is unavailable for the selected field.',
        duplicateIdentifier: 'Filter identifiers must be unique.'
    }
};

export function getOperatorDefinition(
    field: QueryBuilderField | undefined,
    operatorId: string
): QueryBuilderOperatorDefinition | undefined {
    return field ? getSupportedOperators(field).find(operator => operator.id === operatorId) : undefined;
}

export function getSupportedOperators(field: QueryBuilderField): readonly QueryBuilderOperatorDefinition[] {
    if (!Object.prototype.hasOwnProperty.call(operatorDefinitions, field.type)) {
        return [];
    }
    const supported = new Set(field.operators);
    return operatorDefinitions[field.type].filter(operator => supported.has(operator.id));
}

export function createEmptyOperand(kind: QueryBuilderOperandKind): QueryBuilderOperand {
    switch (kind) {
        case 'none':
            return { kind: 'none' };
        case 'scalar':
            return { kind: 'scalar', value: null };
        case 'collection':
            return { kind: 'collection', values: [] };
        case 'range':
            return { kind: 'range', start: null, end: null };
        case 'key':
            return { kind: 'key', key: '' };
        case 'key-value':
            return { kind: 'key-value', key: '', value: '' };
        default:
            throw new TypeError('Unsupported query operand kind.');
    }
}

export function cloneOperand(operand: QueryBuilderOperand): QueryBuilderOperand {
    switch (operand.kind) {
        case 'collection':
            return { kind: 'collection', values: [...operand.values] };
        case 'range':
            return { ...operand };
        case 'key':
            return { ...operand };
        case 'key-value':
            return { ...operand };
        case 'scalar':
            return { ...operand };
        case 'none':
            return { kind: 'none' };
        default:
            throw new TypeError('Unsupported query operand.');
    }
}

export function getOperandError(
    field: QueryBuilderField,
    rule: QueryBuilderRule,
    labels: Pick<QueryBuilderLabels, 'errors'>,
    rawNumberValues: ReadonlyMap<string, string> = new Map()
): string | undefined {
    const operator = getOperatorDefinition(field, rule.operatorId);
    if (!operator) {
        return labels.errors.unsupportedOperator;
    }

    if (rule.operand.kind !== operator.operandKind) {
        return labels.errors.invalidValue;
    }

    switch (rule.operand.kind) {
        case 'none':
            return undefined;
        case 'scalar': {
            const value = rule.operand.value;
            if (field.type === 'boolean') {
                return typeof value === 'boolean' ? undefined : labels.errors.required;
            }
            if (field.type === 'number') {
                const rawValue = rawNumberValues.get(rule.id);
                if (rawValue !== undefined && (rawValue.trim() === '' || !Number.isFinite(Number(rawValue)))) {
                    return rawValue.trim() === '' ? labels.errors.required : labels.errors.invalidNumber;
                }
                if (typeof value === 'number' && Number.isFinite(value)) {
                    return undefined;
                }
                return value === null ? labels.errors.required : labels.errors.invalidNumber;
            }
            if (field.type === 'date') {
                if (typeof value === 'string' && isDateOnly(value)) {
                    return undefined;
                }
                if (value === null || value === '') {
                    return labels.errors.required;
                }
                return labels.errors.invalidDate;
            }
            if (typeof value !== 'string' || value.length === 0) {
                return labels.errors.required;
            }
            if (field.type === 'enum' && !field.options?.some(option => option.value === value)) {
                return labels.errors.invalidOption;
            }
            return undefined;
        }
        case 'collection': {
            const values = rule.operand.values;
            if (values.length === 0 || values.some(value => value.trim().length === 0)) {
                return labels.errors.invalidCollection;
            }
            if (new Set(values).size !== values.length) {
                return labels.errors.invalidCollection;
            }
            if (field.type === 'enum' && values.some(value => !field.options?.some(option => option.value === value))) {
                return labels.errors.invalidOption;
            }
            return undefined;
        }
        case 'range': {
            const rawStart = rawNumberValues.get(`${rule.id}:start`);
            const rawEnd = rawNumberValues.get(`${rule.id}:end`);
            if (field.type === 'number') {
                for (const rawValue of [rawStart, rawEnd]) {
                    if (rawValue !== undefined && rawValue.trim().length > 0 && !Number.isFinite(Number(rawValue))) {
                        return labels.errors.invalidNumber;
                    }
                }
            }
            const start = rawStart ?? rule.operand.start;
            const end = rawEnd ?? rule.operand.end;
            const parseEndpoint = (value: string | number | null): number | string | null => {
                if (field.type !== 'number' || typeof value !== 'string') {
                    return value;
                }
                if (value.trim() === '' || !Number.isFinite(Number(value))) {
                    return null;
                }
                return Number(value);
            };
            const parsedStart = parseEndpoint(start);
            const parsedEnd = parseEndpoint(end);
            if (parsedStart === null || parsedEnd === null) {
                return labels.errors.required;
            }
            if (field.type === 'number') {
                return typeof parsedStart === 'number'
                    && typeof parsedEnd === 'number'
                    && Number.isFinite(parsedStart)
                    && Number.isFinite(parsedEnd)
                    && parsedStart <= parsedEnd
                    ? undefined
                    : labels.errors.invalidRange;
            }
            return typeof parsedStart === 'string'
                && typeof parsedEnd === 'string'
                && isDateOnly(parsedStart)
                && isDateOnly(parsedEnd)
                && parsedStart <= parsedEnd
                ? undefined
                : labels.errors.invalidRange;
        }
        case 'key':
            return rule.operand.key.trim().length > 0 ? undefined : labels.errors.invalidKey;
        case 'key-value':
            if (rule.operand.key.trim().length === 0) {
                return labels.errors.invalidKey;
            }
            return rule.operand.value.length > 0 ? undefined : labels.errors.invalidValue;
        default:
            return labels.errors.invalidValue;
    }
}

export function isDateOnly(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}