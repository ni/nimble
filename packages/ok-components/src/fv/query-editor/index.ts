import { attr, DOM, observable, volatile } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import type { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import type { FvMultiSelect } from '../multi-select';
import type { FvDateTimePicker } from '../date-time-picker';
import { parseValue as parseDatePickerValue } from '../date-time-picker/models/date-time';
import {
    cloneOperand,
    createEmptyOperand,
    defaultQueryBuilderLabels,
    getOperandError,
    getOperatorDefinition,
    getSupportedOperators,
    type QueryBuilderField,
    type QueryBuilderFieldType,
    type QueryBuilderLabels,
    type QueryBuilderLogicalOperator,
    type QueryBuilderOperatorId,
    type QueryBuilderOperatorDefinition,
    type QueryBuilderOperandKind,
    type QueryBuilderRule
} from '../query-builder/types';
import {
    MAX_QUERY_GROUP_DEPTH,
    getSimpleSchemaType,
    isValidSchemaValue,
    validateDefinition,
    validateQuery,
    type JsonPrimitive,
    type JsonValue,
    type QueryBuilderDefinition,
    type QueryBuilderEditorDefinition,
    type QueryBuilderIssue,
    type QueryDocument,
    type QueryEditorDraft as PortableQueryEditorDraft,
    type QueryEditorDraftToken as PortableQueryEditorDraftToken,
    type QueryNode,
    type QueryPredicate,
    type QueryOption,
    type QueryOptionContext,
    type QueryOptionFailure,
    type QueryOptionPage,
    type QueryOptionRequest,
    type QueryOptionResolver,
    type QueryOptionState
} from '../query-builder/portable-interface';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-query-editor': FvQueryEditor;
    }
}

/** One serializable part of an editable query expression. */
type QueryEditorToken = {
    readonly kind: 'condition',
    readonly rule: QueryBuilderRule,
    readonly groupId: string,
    readonly value?: JsonValue,
    readonly rawInputs?: Readonly<{ [key: string]: string }>
}
    | { readonly kind: 'logic', readonly logic: QueryBuilderLogicalOperator, readonly groupId?: string }
    | { readonly kind: 'open', readonly groupId: string }
    | { readonly kind: 'close' };

/** Serializable sequence of query-editor tokens, including incomplete expressions. */
export type QueryEditorDraft = PortableQueryEditorDraft;
export type QueryEditorDraftToken = PortableQueryEditorDraftToken;

/** @internal */
export interface QueryEditorPartView {
    readonly owner: FvQueryEditor;
    readonly kind: QueryEditorDraftToken['kind'] | 'insertion';
    readonly position: number;
    readonly tokenIndex: number;
    readonly layoutRole: 'operator' | 'condition' | 'group-open' | 'group-close' | 'insertion' | '';
    readonly layoutRow: number;
    readonly indentLevel: number;
    readonly indented: boolean;
    readonly rule: QueryBuilderRule | null;
    readonly logic: QueryBuilderLogicalOperator | null;
    readonly text: string;
    readonly fieldLabel: string;
    readonly operatorLabel: string;
    readonly valueLabel: string;
    readonly state: 'complete' | 'incomplete' | 'invalid' | '';
    readonly stateLabel: string;
}

/** @internal */
export interface QueryEditorLineView {
    readonly parts: readonly QueryEditorPartView[];
    readonly indentLevel: number;
}

/** @internal */
export interface QueryEditorOptionView {
    readonly value: string;
    readonly label: string;
    readonly disabled?: boolean;
}

interface QueryEditorTypedOptionView {
    readonly value: JsonPrimitive;
    readonly label: string;
    readonly disabled?: boolean;
}

interface QueryEditorRuleSummary {
    readonly fieldLabel: string;
    readonly operatorLabel: string;
    readonly valueLabel: string;
    readonly text: string;
}

/** @internal */
export type QueryEditorSuggestion = { readonly kind: 'field', readonly value: string, readonly label: string, readonly detail: string }
    | { readonly kind: 'logic', readonly value: QueryBuilderLogicalOperator, readonly label: string, readonly detail: string };

/** Detached snapshot dispatched after a user edit. */
export type QueryEditorEventDetail = {
    /** The current expression, including unfinished structure. */
    readonly draft: QueryEditorDraft,
    /** Number of condition tokens in the draft. */
    readonly ruleCount: number
} & (
    | {
        /** Whether the draft structure and all condition operands are valid. */
        readonly valid: true,
        /** A complete, validated document. */
        readonly query: QueryDocument,
        readonly issues: readonly []
    }
    | {
        /** Whether the draft structure and all condition operands are valid. */
        readonly valid: false,
        /** Invalid or incomplete drafts never expose an executable query. */
        readonly query: null,
        /** Validation issues for an invalid draft. */
        readonly issues: readonly QueryBuilderIssue[]
    }
);

/** Localizable labels used by the query editor, excluding builder-only workflows. */
export type QueryEditorLabels = Pick<
    QueryBuilderLabels,
    | 'addFilter'
    | 'addCondition'
    | 'and'
    | 'comparisonValue'
    | 'closeEditorHint'
    | 'collectionValueHint'
    | 'collectionValueLabel'
    | 'completeFilterExpression'
    | 'done'
    | 'editRule'
    | 'endFilterGroup'
    | 'errors'
    | 'false'
    | 'field'
    | 'incomplete'
    | 'invalid'
    | 'key'
    | 'logicalOperator'
    | 'loadingOptions'
    | 'matchingFields'
    | 'noAvailableFields'
    | 'operator'
    | 'operators'
    | 'queryConditions'
    | 'queryHelperText'
    | 'rangeEnd'
    | 'rangeStart'
    | 'startFilterGroup'
    | 'toggleLogic'
    | 'true'
    | 'unset'
    | 'value'
    | 'or'
> & { readonly loadMoreOptions?: string, readonly retryOptions?: string };

export type QueryEditorLayout = 'inline' | 'formatted';

export { MAX_QUERY_GROUP_DEPTH };

export type {
    QueryBuilderField,
    QueryBuilderFieldType,
    QueryBuilderLogicalOperator,
    QueryBuilderOperand,
    QueryBuilderOperandKind,
    QueryBuilderOption,
    QueryBuilderOperatorId,
    QueryBuilderRule,
    QueryBuilderScalar
} from '../query-builder/types';
export type {
    JsonPrimitive,
    JsonSchema202012,
    JsonValue,
    QueryBuilderDefinition,
    QueryBuilderEditorDefinition,
    QueryBuilderFieldDefinition,
    QueryBuilderIssue,
    QueryBuilderIssueCode,
    QueryBuilderOperandDefinition,
    QueryDocument,
    QueryEditorDraft as PortableQueryEditorDraft,
    QueryEditorDraftToken as PortableQueryEditorDraftToken,
    QueryGroup,
    QueryNode,
    QueryOption,
    QueryOptionContext,
    QueryOptionPage,
    QueryOptionRequest,
    QueryOptionResolver,
    QueryOptionState
} from '../query-builder/portable-interface';

/** Default English query editor labels. */
export const defaultQueryEditorLabels: QueryEditorLabels = defaultQueryBuilderLabels;

function isTerm(token: QueryEditorToken | undefined): boolean {
    return token?.kind === 'condition' || token?.kind === 'close';
}

function isRecord(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonPrimitive(value: unknown): value is JsonPrimitive {
    return value === null || typeof value === 'string' || typeof value === 'boolean'
        || (typeof value === 'number' && Number.isFinite(value));
}

function staticOptions(schema: QueryBuilderDefinition['fields'][number]['valueSchema']): readonly QueryOption[] | undefined {
    if (typeof schema === 'boolean') {
        return undefined;
    }
    if (Array.isArray(schema.oneOf)) {
        const options: QueryOption[] = [];
        for (const [index, item] of schema.oneOf.entries()) {
            if (!isRecord(item) || !isJsonPrimitive(item.const) || typeof item.title !== 'string') {
                return undefined;
            }
            options.push({ value: `option-${index}`, label: item.title });
        }
        return options;
    }
    if (Array.isArray(schema.enum) && schema.enum.every(isJsonPrimitive)) {
        const values = schema.enum.filter(isJsonPrimitive);
        return values.map((value, index) => ({ value: `option-${index}`, label: String(value) }));
    }
    return undefined;
}

function editorOperandKind(operand: QueryBuilderDefinition['operators'][number]['operand']): QueryBuilderOperandKind {
    switch (operand.kind) {
        case 'none':
            return 'none';
        case 'field-value':
            return 'scalar';
        case 'field-value-list':
            return 'collection';
        case 'range':
            return 'range';
        case 'schema': {
            if (typeof operand.schema !== 'boolean' && operand.schema.type === 'object') {
                return 'key-value';
            }
            if (typeof operand.schema !== 'boolean' && operand.schema.type === 'array') {
                return 'collection';
            }
            return 'scalar';
        }
        default:
            return 'none';
    }
}

function editorFieldType(
    schema: QueryBuilderDefinition['fields'][number]['valueSchema'],
    editor: QueryBuilderEditorDefinition | undefined
): QueryBuilderFieldType {
    const kind = editor?.kind;
    if (kind === 'select' || kind === 'combobox') {
        return 'enum';
    }
    if (kind === 'number') {
        return 'number';
    }
    if (kind === 'boolean') {
        return 'boolean';
    }
    if (kind === 'date') {
        return 'date';
    }
    if (kind === 'datetime') {
        return 'string';
    }
    if (kind === 'key-value') {
        return 'custom-property';
    }
    if (kind === 'range') {
        return 'number';
    }
    switch (getSimpleSchemaType(schema)) {
        case 'number':
        case 'integer':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'array':
            return 'array';
        default:
            return typeof schema !== 'boolean' && schema.format === 'date' ? 'date' : 'string';
    }
}

/**
 * A standalone editor for conditions, logical operators, and groups.
 * @fires FvQueryEditor#query-change
 */
export class FvQueryEditor extends FoundationElement {
    /** Disables all editing controls. */
    @attr({ mode: 'boolean' })
    public disabled = false;

    /** Accessible name for the query editor. */
    @attr
    public label = defaultQueryBuilderLabels.queryConditions;

    /** Layout used to display the expression. */
    @attr
    public layout: QueryEditorLayout = 'inline';

    /** Field used when adding a condition without choosing one from autocomplete. */
    @attr({ attribute: 'default-field' })
    public defaultField = '';

    /** Current dynamic option state for the active operand. */
    @observable
    public optionState: QueryOptionState = { status: 'idle' };

    /** Portable field/operator configuration. */
    @observable
    public definition?: QueryBuilderDefinition;

    /** Last complete, schema-valid query document. */
    @observable
    public query: QueryDocument = { version: 1, root: null };

    /** Current editable token sequence; assign to restore an unfinished draft. */
    @observable
    public draft: QueryEditorDraft = { version: 1, tokens: [], caretPosition: 0, inputText: '' };

    /** Resolves configured dynamic option sources. */
    @observable
    public optionResolver?: QueryOptionResolver;

    /** Host values used to satisfy dynamic option dependencies. */
    @observable
    public optionContext: QueryOptionContext = {};

    /** Blocking definition/query/draft issues, excluding option transport errors. */
    @observable
    public issues: readonly QueryBuilderIssue[] = [];

    /** Localized labels for the query editor. */
    @observable
    public labels: QueryEditorLabels = defaultQueryEditorLabels;

    /** @internal */
    @observable
    public editorTokens: readonly QueryEditorToken[] = [];

    /** @internal */
    @observable
    public caretPosition = 0;

    /** @internal */
    @observable
    public queryInputText = '';

    /** @internal */
    @observable
    public queryFieldFocused = false;

    /** @internal */
    @observable
    public activeSuggestionIndex = 0;

    /** @internal */
    @observable
    public activeOptionIndex = -1;

    /** Whether the user dismissed logic suggestions at the query end. */
    @observable
    public logicSuggestionsDismissed = false;

    /** @internal */
    @observable
    public activeSuggestionId = '';

    /** @internal */
    @observable
    public activeRuleId: string | null = null;

    /** @internal */
    @observable
    public editorRegion?: AnchoredRegion;

    /** @internal */
    @observable
    public editorPanelElement?: HTMLElement;

    /** @internal */
    @observable
    public editorPanelErrorElement?: HTMLElement;

    /** @internal */
    @observable
    public collectionInputHintElement?: HTMLElement;

    /** @internal */
    @observable
    public editorPanelArrowOffset: string | null = null;

    /** @internal */
    public readonly editorId = uniqueId('ok-fv-query-editor');
    private activeEditorTrigger: HTMLElement | null = null;
    // Keeps the open chip from resizing and moving its popover while edits update the query.
    private activeRuleSummary: QueryEditorRuleSummary | null = null;
    private shouldFocusFirstEditorField = false;
    private fields: readonly QueryBuilderField[] = [];
    private internallyAssignedQuery?: QueryDocument;
    private internallyAssignedDraft?: QueryEditorDraft;
    private pendingQuery?: QueryDocument;
    private pendingInitialQuery?: QueryDocument;
    private pendingDraft?: QueryEditorDraft;
    private lastValidity?: boolean;
    private lastValidityIssues?: readonly QueryBuilderIssue[];
    private definitionIssues: readonly QueryBuilderIssue[] = [];
    private externalInputIssues: readonly QueryBuilderIssue[] = [];
    private optionRequest?: AbortController;
    private optionRequestVersion = 0;
    private optionPages: readonly QueryOption[] = [];
    private readonly optionLabelCache = new Map<string, QueryOption>();
    private optionCursor?: string;
    private optionSearchText = '';
    private optionFailedCursor?: string;
    private optionContextKey = '';
    private dynamicOptionsDismissed = false;

    /** Number of conditions, including incomplete ones. */
    public get ruleCount(): number {
        return this.editorTokens.reduce((count, token) => count + Number(token.kind === 'condition'), 0);
    }

    /** @internal */
    public get canAddFilter(): boolean {
        return !this.disabled && this.definition !== undefined && this.getDefaultField() !== undefined;
    }

    /** Whether the current draft has valid structure and operands. */
    public get valid(): boolean {
        if (!this.hasValidStructure() || this.hasDuplicateIdentifiers()) {
            return false;
        }
        if (!this.definition) {
            return false;
        }
        if (this.definitionIssues.length > 0 || this.externalInputIssues.length > 0 || this.queryInputText.length > 0) {
            return false;
        }
        const query = this.createQueryFromTokens();
        return query !== undefined && validateQuery(query, this.definition).valid;
    }

    /** @internal */
    @volatile
    public get parts(): readonly QueryEditorPartView[] {
        const result: QueryEditorPartView[] = [];
        for (let position = 0; position <= this.editorTokens.length; position += 1) {
            result.push({
                owner: this,
                kind: 'insertion',
                position,
                tokenIndex: position,
                layoutRole: '',
                layoutRow: 0,
                indentLevel: 0,
                indented: false,
                rule: null,
                logic: null,
                text: '',
                fieldLabel: '',
                operatorLabel: '',
                valueLabel: '',
                state: '',
                stateLabel: ''
            });
            const token = this.editorTokens[position];
            if (!token) {
                continue;
            }
            if (token.kind === 'condition') {
                const state = this.getRuleState(token.rule);
                const summary = token.rule.id === this.activeRuleId && this.activeRuleSummary
                    ? this.activeRuleSummary
                    : this.formatRuleSummary(token.rule);
                result.push({
                    owner: this,
                    kind: token.kind,
                    position,
                    tokenIndex: position,
                    layoutRole: '',
                    layoutRow: 0,
                    indentLevel: 0,
                    indented: false,
                    rule: token.rule,
                    logic: null,
                    text: summary.text,
                    fieldLabel: summary.fieldLabel,
                    operatorLabel: summary.operatorLabel,
                    valueLabel: summary.valueLabel,
                    state,
                    stateLabel: state === 'complete' ? '' : this.labels[state]
                });
            } else {
                let text = '';
                if (token.kind === 'logic') {
                    text = this.getLogicLabel(token.logic);
                } else if (token.kind === 'open') {
                    text = '(';
                } else {
                    text = ')';
                }
                result.push({
                    owner: this,
                    kind: token.kind,
                    position,
                    tokenIndex: position,
                    layoutRole: '',
                    layoutRow: 0,
                    indentLevel: 0,
                    indented: false,
                    rule: null,
                    logic: token.kind === 'logic' ? token.logic : null,
                    text,
                    fieldLabel: '',
                    operatorLabel: '',
                    valueLabel: '',
                    state: '',
                    stateLabel: ''
                });
            }
        }
        return this.layout === 'formatted' ? this.formatParts(result) : result;
    }

    /** @internal */
    public get formattedRows(): readonly QueryEditorLineView[] {
        const rows = new Map<number, QueryEditorPartView[]>();
        for (const part of this.parts) {
            const row = rows.get(part.layoutRow) ?? [];
            row.push(part);
            rows.set(part.layoutRow, row);
        }
        return Array.from(rows.values(), parts => ({
            parts,
            indentLevel: parts.reduce((level, part) => Math.max(level, part.indentLevel), 0)
        }));
    }

    /** @internal */
    public get activeRule(): QueryBuilderRule | undefined {
        const token = this.editorTokens?.find(
            candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId
        );
        return token?.kind === 'condition' ? token.rule : undefined;
    }

    /** @internal */
    public get activeField(): QueryBuilderField | undefined {
        const fieldId = this.activeRule?.fieldId;
        return fieldId ? this.fields.find(field => field.id === fieldId) : undefined;
    }

    /** @internal */
    public get availableFields(): readonly QueryBuilderField[] {
        return this.fields;
    }

    /** @internal */
    public get activeOperators(): ReturnType<typeof getSupportedOperators> {
        return this.activeField ? this.supportedOperators(this.activeField) : [];
    }

    /** @internal */
    public get activeOperandKind(): string {
        return this.activeField
            ? this.getEditorOperator(this.activeField.id, this.activeRule?.operatorId ?? '')?.operandKind ?? 'none'
            : 'none';
    }

    /** @internal */
    public get activeEditorKind(): string {
        const rule = this.activeRule;
        if (!rule) {
            return '';
        }
        if (!this.definition) {
            const type = this.activeField?.type;
            if (type === 'enum') {
                return 'select';
            }
            if (type === 'number') {
                return 'number';
            }
            if (type === 'boolean') {
                return 'boolean';
            }
            return type === 'date' ? 'date' : 'text';
        }
        const operator = this.portableOperator(rule.fieldId, rule.operatorId);
        const explicit = this.getEffectiveEditor(rule.fieldId, rule.operatorId);
        if (explicit && explicit.kind !== 'auto') {
            return explicit.kind;
        }
        if (operator?.operand.kind === 'range') {
            return 'range';
        }
        const schema = this.getEffectiveSchema(rule.fieldId, rule.operatorId);
        if (schema === undefined) {
            return '';
        }
        if (staticOptions(schema) !== undefined) {
            return 'select';
        }
        if (typeof schema === 'boolean') {
            return 'text';
        }
        const type = getSimpleSchemaType(schema);
        if (type === 'string' && schema.format === 'date') {
            return 'date';
        }
        if (type === 'string' && schema.format === 'date-time') {
            return 'datetime';
        }
        if (type === 'number' || type === 'integer' || type === 'boolean') {
            return type === 'integer' ? 'number' : type;
        }
        return 'text';
    }

    /** @internal */
    public get isActiveCombobox(): boolean {
        return Boolean(this.activeRule && this.isDynamicCombobox(
            this.activeRule.fieldId,
            this.activeRule.operatorId
        ));
    }

    /** @internal */
    public get hasActiveOptionSource(): boolean {
        return Boolean(this.activeRule && this.getOptionSource(this.activeRule.fieldId, this.activeRule.operatorId));
    }

    /** @internal */
    public get activeCollectionSearchable(): boolean {
        const rule = this.activeRule;
        const source = rule ? this.getOptionSource(rule.fieldId, rule.operatorId) : undefined;
        return source !== undefined && source.searchable !== false;
    }

    /** @internal */
    public get dynamicOptionListId(): string {
        return `${this.editorId}-dynamic-options`;
    }

    /** @internal */
    public get activeDynamicOptions(): readonly QueryOption[] {
        if (!this.isActiveCombobox || !('options' in this.optionState)) {
            return [];
        }
        return this.optionState.options.map(option => ({
            ...option,
            ...(option.disabled || this.optionFailedCursor !== undefined || this.optionState.status === 'error'
                ? { disabled: true }
                : {})
        }));
    }

    /** @internal */
    public get optionStateMessage(): string {
        return this.optionState.status === 'blocked' || this.optionState.status === 'error'
            ? this.optionState.issues.map(issue => issue.message).join(' ')
            : '';
    }

    /** @internal */
    public get activeOperatorLabel(): string {
        const operatorId = this.activeRule?.operatorId ?? '';
        const portableLabel = this.definition?.operators.find(operator => operator.id === operatorId)?.label;
        if (portableLabel) {
            return portableLabel;
        }
        return this.labels.operators[operatorId] ?? operatorId;
    }

    /** @internal */
    public getOperatorLabel(operatorId: string): string {
        return this.definition?.operators.find(operator => operator.id === operatorId)?.label
            ?? this.labels.operators[operatorId]
            ?? operatorId;
    }

    /** @internal */
    public get activeRuleError(): string {
        const rule = this.activeRule;
        const field = this.activeField;
        if (rule && this.hasDuplicateRuleId(rule.id)) {
            return this.labels.errors.duplicateIdentifier;
        }
        if (rule && this.definition) {
            const token = this.editorTokens.find(
                candidate => candidate.kind === 'condition' && candidate.rule.id === rule.id
            );
            if (token?.kind === 'condition') {
                if (this.portableOperator(rule.fieldId, rule.operatorId)?.operand.kind === 'field-value-list'
                    && token.rawInputs?.['/value'] !== undefined && !Array.isArray(token.value)) {
                    return this.labels.errors.invalidJsonArray ?? 'Enter a valid JSON array.';
                }
                const result = validateQuery({
                    version: 1,
                    root: this.createPredicate(token)
                }, this.definition);
                if (result.valid) {
                    return '';
                }
                if (result.issues.some(issue => issue.code === 'incomplete-expression')) {
                    return this.labels.errors.required;
                }
                return result.issues[0]?.message ?? this.labels.errors.invalidValue;
            }
        }
        return rule && field ? getOperandError(field, rule, this.labels) ?? '' : this.labels.errors.unsupportedField;
    }

    /** @internal */
    public get structureError(): string {
        if (this.hasDuplicateIdentifiers()) {
            return this.labels.errors.duplicateIdentifier;
        }
        return this.hasValidStructure() && this.definition ? '' : this.labels.completeFilterExpression;
    }

    /** @internal */
    /** @internal */
    public get suggestions(): readonly QueryEditorSuggestion[] {
        const search = this.queryInputText.trim().toLocaleLowerCase();
        if (search.length === 0 || this.shouldShowLogicChipPreviews) {
            return [];
        }
        if (this.expectsCondition(this.caretPosition)) {
            return this.fields
                .filter(field => this.supportedOperators(field).length > 0)
                .filter(field => `${field.label} ${field.id}`.toLocaleLowerCase().includes(search))
                .map(field => ({
                    kind: 'field',
                    value: field.id,
                    label: field.label,
                    detail: field.type
                }));
        }
        if (this.expectsLogic(this.caretPosition)) {
            return (['and', 'or'] as const)
                .filter(logic => this.getLogicLabel(logic).toLocaleLowerCase().startsWith(search))
                .map(logic => ({
                    kind: 'logic',
                    value: logic,
                    label: this.getLogicLabel(logic),
                    detail: this.labels.logicalOperator
                }));
        }
        return [];
    }

    /** @internal */
    public get logicChipPreviewOptions(): readonly QueryBuilderLogicalOperator[] {
        if (
            this.caretPosition !== this.editorTokens.length
            || !this.expectsLogic(this.caretPosition)
            || this.queryInputText.length > 0
        ) {
            return [];
        }
        return [this.defaultLogicAt(this.caretPosition)];
    }

    /** @internal */
    public get shouldShowLogicChipPreviews(): boolean {
        return !this.logicSuggestionsDismissed
            && !this.activeRuleId
            && this.logicChipPreviewOptions.length > 0;
    }

    /** @internal */
    public get shouldShowConditionChipPreview(): boolean {
        return this.queryFieldFocused
            && this.canAddFilter
            && !this.activeRuleId
            && !this.logicSuggestionsDismissed
            && this.queryInputText.length === 0
            && !this.shouldShowLogicChipPreviews;
    }

    /** @internal */
    public get queryInputWidth(): string {
        if (this.queryInputText.length === 0) {
            return this.editorTokens.length === 0 ? '60ch' : '8px';
        }

        const nativeInput = this.shadowRoot
            ?.querySelector<TextField>('.query-input')
            ?.shadowRoot?.querySelector<HTMLInputElement>('input');
        const canvasContext = document.createElement('canvas').getContext('2d');
        if (!canvasContext) {
            throw new Error('Expected a canvas context to measure the query input');
        }
        const inputStyle = getComputedStyle(nativeInput ?? this);
        canvasContext.font = inputStyle.font;
        const horizontalPadding = nativeInput
            ? parseFloat(inputStyle.paddingLeft) + parseFloat(inputStyle.paddingRight)
            : 0;
        return `${Math.max(8, Math.ceil(canvasContext.measureText(this.queryInputText).width + horizontalPadding + 1))}px`;
    }

    /** @internal */
    public queryInputTextChanged(): void {
        if (Array.isArray(this.editorTokens)) {
            this.assignDraft(this.editorTokens);
        }
        this.syncActiveSuggestionId();
    }

    /** @internal */
    public activeSuggestionIndexChanged(): void {
        this.syncActiveSuggestionId();
    }

    /** @internal */
    public activeOptionIndexChanged(): void {
        this.syncDynamicOptionAccessibility();
    }

    /** @internal */
    public optionStateChanged(): void {
        DOM.queueUpdate(() => this.syncDynamicOptionAccessibility());
    }

    /** @internal */
    /** @internal */
    public editorTokensChanged(): void {
        this.logicSuggestionsDismissed = false;
        this.syncQueryInputAccessibilityAfterRender();
        this.syncEditorControlAccessibilityAfterRender();
        DOM.queueUpdate(() => this.syncDynamicOptionAccessibility());
    }

    /** @internal */
    public editorPanelElementChanged(): void {
        this.syncEditorControlAccessibilityAfterRender();
    }

    /** @internal */
    public editorPanelErrorElementChanged(): void {
        this.syncEditorControlAccessibilityAfterRender();
    }

    /** @internal */
    public collectionInputHintElementChanged(): void {
        this.syncEditorControlAccessibilityAfterRender();
    }

    /** @internal */
    public caretPositionChanged(): void {
        this.logicSuggestionsDismissed = false;
        if (Array.isArray(this.editorTokens)) {
            this.assignDraft(this.editorTokens);
        }
        this.syncQueryInputAccessibilityAfterRender();
    }

    /** @internal */
    public labelChanged(): void {
        this.syncQueryInputAccessibility();
    }

    /** @internal */
    public labelsChanged(): void {
        this.syncQueryInputAccessibility();
    }

    /** @internal */
    public get suggestionListId(): string {
        return `${this.editorId}-suggestions`;
    }

    /** @internal */
    public get editorPanelId(): string {
        return `${this.editorId}-condition-editor`;
    }

    /** @internal */
    public get editorPanelErrorId(): string {
        return `${this.editorPanelId}-error`;
    }

    /** @internal */
    /** @internal */
    public get activeCollectionValues(): readonly string[] {
        const operand = this.activeRule?.operand;
        return operand?.kind === 'collection' ? operand.values : [];
    }

    /** @internal */
    public get activeCollectionOptionValues(): readonly JsonPrimitive[] {
        const token = this.editorTokens.find(
            candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId
        );
        if (token?.kind === 'condition' && Array.isArray(token.value)) {
            return token.value.filter(isJsonPrimitive);
        }
        return this.activeCollectionValues.map(value => (this.activeRule
            ? this.decodeOptionValue(this.activeRule.fieldId, this.activeRule.operatorId, value)
            : value));
    }

    /** @internal */
    public get activeOptions(): readonly QueryEditorOptionView[] {
        if (!this.definition || !this.activeField || !this.activeRule) {
            return (this.activeField?.options ?? []).map(option => ({ ...option }));
        }
        if (this.getOptionSource(this.activeField.id, this.activeRule.operatorId) !== undefined) {
            const options = 'options' in this.optionState ? this.optionState.options : [];
            const result = options.map(option => ({
                value: this.encodeDynamicOption(option.value),
                label: option.label,
                ...(option.disabled || this.optionState.status === 'error' ? { disabled: true } : {})
            }));
            const operand = this.activeRule.operand;
            const token = this.editorTokens.find(
                candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId
            );
            if (operand.kind === 'scalar'
                && (operand.value !== null || (token?.kind === 'condition' && token.value === null))) {
                const value = this.encodeDynamicOption(operand.value);
                if (!result.some(option => option.value === value)) {
                    result.push({
                        value,
                        label: this.optionLabelCache.get(JSON.stringify(operand.value))?.label ?? JSON.stringify(operand.value),
                        disabled: true
                    });
                }
            }
            return result;
        }
        const schema = this.getEffectiveSchema(this.activeField.id, this.activeRule.operatorId);
        return schema === undefined ? [] : (staticOptions(schema) ?? []).map(option => ({
            value: String(option.value),
            label: option.label
        }));
    }

    /** @internal */
    public get activeCollectionOptions(): readonly QueryEditorTypedOptionView[] {
        const rule = this.activeRule;
        if (!rule) {
            return [];
        }
        const options = this.activeOptions.map(option => ({
            value: this.decodeOptionValue(rule.fieldId, rule.operatorId, option.value),
            label: option.label,
            ...(option.disabled ? { disabled: true } : {})
        }));
        const visibleValues = new Set(options.map(option => JSON.stringify(option.value)));
        for (const value of this.activeCollectionOptionValues) {
            const key = JSON.stringify(value);
            if (visibleValues.has(key)) {
                continue;
            }
            const cached = this.optionLabelCache.get(key);
            options.push({
                value,
                label: cached?.label ?? String(value),
                ...(cached?.disabled || this.optionState.status === 'error' ? { disabled: true } : {})
            });
            visibleValues.add(key);
        }
        return options;
    }

    /** @internal */
    /** @internal */
    public definitionChanged(): void {
        this.cancelOptionRequest();
        const validation = this.definition ? validateDefinition(this.definition) : undefined;
        this.definitionIssues = validation && !validation.valid ? validation.issues : [];
        if (this.definitionIssues.length > 0) {
            this.dispatchEvent(new CustomEvent('configuration-error', {
                bubbles: true,
                composed: true,
                detail: { issues: this.definitionIssues.map(issue => ({ ...issue })) }
            }));
        }
        if (validation?.valid) {
            this.definition = validation.value;
            this.fields = validation.value.fields.map(field => this.createEditorField(field));
        } else {
            this.fields = [];
        }
        if (this.pendingInitialQuery?.root) {
            this.pendingQuery = this.pendingInitialQuery;
        }
        if (validation?.valid) {
            this.restorePendingInputs();
        }
        if (validation?.valid && this.editorTokens.length === 0 && this.query?.root) {
            const initialQuery = validateQuery(this.query, validation.value);
            if (initialQuery.valid) {
                this.editorTokens = this.createTokens(initialQuery.value);
                this.assignDraft(this.editorTokens);
                this.caretPosition = this.editorTokens.length;
            }
        }
        if (this.activeRule && !this.fields.some(field => field.id === this.activeRule?.fieldId)) {
            this.closeEditor(false);
        }
        if (this.definition && validation?.valid) {
            const query = this.createQueryFromTokens();
            const queryResult = query ? validateQuery(query, this.definition) : undefined;
            if (queryResult?.valid) {
                this.assignQuery(queryResult.value);
            }
        }
        this.updateValidationState(true);
    }

    /** @internal */
    public disabledChanged(): void {
        if (this.disabled) {
            this.closeEditor(false);
            this.cancelOptionRequest();
        }
    }

    /** @internal */
    public queryChanged(previous: QueryDocument | undefined, next: QueryDocument): void {
        if (this.pendingInitialQuery?.root && !next.root) {
            return;
        }
        if (this.pendingQuery?.root && !next.root) {
            return;
        }
        if (next !== this.query) {
            return;
        }
        if (next === this.internallyAssignedQuery) {
            this.internallyAssignedQuery = undefined;
            return;
        }
        if (!this.definition) {
            if (!this.isConnected && next.root) {
                this.pendingInitialQuery = next;
            } else if (this.pendingInitialQuery?.root && this.editorTokens.length === 0) {
                return;
            }
            this.pendingQuery = next;
            this.externalInputIssues = [];
            return;
        }
        let validation: ReturnType<typeof validateQuery> | undefined;
        try {
            validation = validateQuery(next, this.definition);
        } catch {
            validation = undefined;
        }
        if (validation?.valid !== true) {
            this.cancelOptionRequest();
            const issues = validation?.valid === false
                ? validation.issues
                : [{ code: 'invalid-query' as const, target: 'query' as const, path: '', message: 'A valid definition is required before assigning a query document.' }];
            this.externalInputIssues = issues;
            if (previous !== undefined && this.definition !== undefined) {
                try {
                    if (validateQuery(previous, this.definition).valid) {
                        this.assignQuery(previous);
                    }
                } catch {
                    // Keep the invalid external value out of the editor state.
                }
            }
            this.updateValidationState(true);
            return;
        }
        this.externalInputIssues = [];
        this.assignQuery(validation.value);
        this.editorTokens = this.createTokens(validation.value);
        this.assignDraft(this.editorTokens);
        this.caretPosition = this.editorTokens.length;
        this.queryInputText = '';
        this.activeRuleId = null;
        this.activeEditorTrigger = null;
        this.editorPanelArrowOffset = null;
        this.updateValidationState(true);
        this.cancelOptionRequest();
    }

    /** @internal */
    public draftChanged(previous: QueryEditorDraft, next: QueryEditorDraft): void {
        if (next !== this.draft) {
            return;
        }
        if (this.pendingQuery?.root && next.tokens.length === 0 && next.inputText.length === 0) {
            return;
        }
        if (next === this.internallyAssignedDraft) {
            this.internallyAssignedDraft = undefined;
            return;
        }
        if (!this.definition) {
            this.pendingDraft = next;
            return;
        }
        if (previous === next) {
            this.internallyAssignedDraft = undefined;
            return;
        }
        this.cancelOptionRequest();
        let converted: readonly QueryEditorToken[] | undefined;
        try {
            converted = this.tokensFromDraft(next);
        } catch {
            this.setIssues([{
                code: 'invalid-draft',
                target: 'draft',
                path: '',
                message: 'The query editor draft shape is invalid.'
            }]);
        }
        if (!converted) {
            this.externalInputIssues = [...this.issues];
            this.assignDraft(this.editorTokens);
            this.updateValidationState(true);
            return;
        }
        this.externalInputIssues = [];
        this.editorTokens = converted;
        this.assignDraft(this.editorTokens);
        const query = this.createQueryFromTokens();
        if (query !== undefined && this.definition !== undefined && validateQuery(query, this.definition).valid) {
            this.assignQuery(query);
        }
        this.caretPosition = next.caretPosition;
        this.queryInputText = next.inputText;
        this.activeRuleId = null;
        this.activeEditorTrigger = null;
        this.updateValidationState(true);
    }

    /** @internal */
    public editorRegionChanged(): void {
        this.updateEditorAnchor();
    }

    /** @internal */
    public handleEditorRegionLayout(): void {
        if (this.updateEditorPanelAvailableWidth(this.activeEditorTrigger)) {
            this.editorRegion?.update();
        }
        this.updateEditorPanelArrowOffset();
        this.focusFirstEditorFieldIfReady();
    }

    /** @internal */
    public handleEditorFocusIn(event: Event): void {
        if (this.findPathElement<HTMLElement>(event, '.editor-field')) {
            if (!this.queryFieldFocused) {
                this.logicSuggestionsDismissed = false;
            }
            this.queryFieldFocused = true;
        }
        const queryInput = this.findPathElement<HTMLElement>(event, '.query-input');
        if (queryInput) {
            queryInput.dataset.focused = 'true';
            DOM.queueUpdate(() => this.syncQueryInputAccessibility());
        }
        const editorControl = this.findPathElement<HTMLElement>(event, '[data-control="scalar-text"]');
        if (editorControl && this.isActiveCombobox) {
            this.dynamicOptionsDismissed = false;
        }
        DOM.queueUpdate(() => this.syncDynamicOptionAccessibility());
        if (!this.activeRuleId) {
            return;
        }
        const panel = this.shadowRoot?.querySelector<HTMLElement>('.editor-panel');
        const target = event.target;
        if (
            panel
            && (
                event.composedPath().includes(panel)
                || (target instanceof Node && panel.contains(target))
            )
        ) {
            return;
        }
        this.closeEditor(false);
    }

    /** @internal */
    public handleEditorFocusOut(event: Event): void {
        if (this.findPathElement<HTMLElement>(event, '.editor-field')) {
            DOM.queueUpdate(() => {
                const focused = this.shadowRoot?.activeElement;
                this.queryFieldFocused = Boolean(focused?.closest('.editor-field'));
            });
        }
        const queryInput = this.findPathElement<HTMLElement>(event, '.query-input');
        queryInput?.removeAttribute('data-focused');
        DOM.queueUpdate(() => this.syncQueryInputAccessibility());
    }

    /** @internal */
    public activeRuleIdChanged(): void {
        this.dynamicOptionsDismissed = false;
        this.activeOptionIndex = -1;
        const collectionSelector = this.shadowRoot?.querySelector<HTMLElement & { open: boolean }>(
            '[data-control="collection-selector"]'
        );
        if (collectionSelector) {
            collectionSelector.open = false;
        }
        this.shouldFocusFirstEditorField = this.activeRuleId !== null;
        this.syncEditorControlAccessibilityAfterRender();
        DOM.queueUpdate(() => {
            this.updateEditorAnchor();
            this.focusFirstEditorFieldIfReady();
            this.syncDynamicOptionAccessibility();
            DOM.queueUpdate(() => this.restoreDatePickerDrafts());
        });
        this.refreshOptions();
    }

    /** @internal */
    public optionResolverChanged(): void {
        this.refreshOptions();
    }

    /** @internal */
    public optionContextChanged(): void {
        this.cancelOptionRequest(true);
        this.refreshOptions();
    }

    /** @internal */
    public loadMoreOptions(): void {
        if (this.optionState.status === 'ready' && this.optionState.nextCursor) {
            void this.resolveOptions(this.optionSearchText, this.optionState.nextCursor, true);
        } else if (this.optionState.status === 'error') {
            void this.resolveOptions(this.optionSearchText, this.optionFailedCursor, this.optionFailedCursor !== undefined);
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.definition && (this.pendingQuery !== undefined || this.pendingDraft !== undefined)) {
            this.restorePendingInputs();
        }
        const hasInitialQuery = this.query?.root !== undefined && this.query.root !== null;
        if (this.editorTokens.length === 0 && hasInitialQuery) {
            this.editorTokens = this.createTokens(this.query);
            this.assignDraft(this.editorTokens);
        }
        this.caretPosition = this.editorTokens.length;
        this.syncActiveSuggestionId();
        this.syncQueryInputAccessibilityAfterRender();
        document.addEventListener('pointerdown', this.documentPointerDownHandler, true);
        document.addEventListener('focusin', this.documentFocusInHandler, true);
        document.addEventListener('scroll', this.editorViewportChangeHandler, true);
        window.addEventListener('resize', this.editorViewportChangeHandler);
        this.pendingInitialQuery = undefined;
    }

    public override disconnectedCallback(): void {
        this.shadowRoot?.querySelector<HTMLElement>('.suggestions')?.hidePopover();
        this.cancelOptionRequest();
        document.removeEventListener('pointerdown', this.documentPointerDownHandler, true);
        document.removeEventListener('focusin', this.documentFocusInHandler, true);
        document.removeEventListener('scroll', this.editorViewportChangeHandler, true);
        window.removeEventListener('resize', this.editorViewportChangeHandler);
        this.activeRuleId = null;
        this.activeEditorTrigger = null;
        super.disconnectedCallback();
    }

    /** @internal */
    public handleClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        const actionElement = this.findPathElement<HTMLElement>(event, '[data-action]');
        const action = actionElement?.dataset.action;
        if (actionElement && action) {
            switch (action) {
                case 'complete-logic': {
                    const logic = actionElement.dataset.logic;
                    if (logic === 'and' || logic === 'or') {
                        this.insertLogic(logic);
                    }
                    return;
                }
                case 'set-caret': {
                    const position = Number(actionElement.dataset.position);
                    this.setCaret(this.getTrailingCaretPosition(event, position) ?? position);
                    return;
                }
                case 'add-condition':
                    this.addFilter(actionElement);
                    return;
                case 'toggle-logic':
                    this.toggleLogic(Number(actionElement.dataset.tokenIndex));
                    return;
                case 'load-more-options':
                case 'retry-options':
                    this.loadMoreOptions();
                    return;
                case 'select-dynamic-option':
                    this.selectDynamicOption(Number(actionElement.dataset.optionIndex));
                    return;
                default:
                    break;
            }
        }

        const conditionChip = this.findPathElement<HTMLElement>(event, '[data-rule-id]');
        if (conditionChip?.dataset.ruleId) {
            this.openEditor(conditionChip.dataset.ruleId, conditionChip);
            return;
        }

        const target = event.target instanceof HTMLElement ? event.target : null;
        if (target?.closest('.query-input')) {
            const trailingPosition = this.getTrailingCaretPosition(event, this.caretPosition);
            if (this.queryInputText.length === 0 && trailingPosition !== null) {
                this.setCaret(trailingPosition);
            }
            return;
        }
        if (target?.closest('.editor-field')) {
            this.setCaretFromPointer(event);
        }
    }

    /** @internal */
    public handleInput(event: Event): void {
        if (this.disabled) {
            return;
        }
        const control = this.findPathElement<HTMLElement>(event, '[data-control]');
        if (control?.dataset.control === 'query-input') {
            const input = control as TextField;
            this.logicSuggestionsDismissed = false;
            this.queryInputText = input.value;
            this.activeSuggestionIndex = 0;
            input.dataset.empty = String(input.value.length === 0);
            input.dataset.placeholder = String(this.editorTokens.length === 0 && input.value.length === 0);
            input.style.setProperty('--query-input-width', this.queryInputWidth);
            if (this.definition) {
                this.updateValidationState(true);
                this.emitPortableQueryChange();
            }
            return;
        }
        if (!control || !this.activeRuleId) {
            return;
        }
        const valueControl = control as TextField | NumberField | Select;
        const value = control.tagName.toLowerCase() === 'ok-fv-date-time-picker'
            ? valueControl.value || (control as FvDateTimePicker).control.value
            : valueControl.value;
        switch (control.dataset.control) {
            case 'scalar-number':
                this.updateScalarInput(value);
                break;
            case 'scalar-text':
                if (this.definition && !this.isActiveCombobox) {
                    this.updateScalarInput(value);
                } else {
                    this.updateScalar(value);
                }
                if (this.definition && this.activeRule && this.isDynamicCombobox(
                    this.activeRule.fieldId,
                    this.activeRule.operatorId
                )) {
                    this.dynamicOptionsDismissed = false;
                    this.activeOptionIndex = -1;
                    void this.resolveOptions(value);
                }
                break;
            case 'collection-values':
                this.updateCollection(value);
                break;
            case 'range-start':
                this.updateRange('start', value);
                break;
            case 'range-end':
                this.updateRange('end', value);
                break;
            case 'property-key':
                this.updateKey(value);
                break;
            case 'property-value':
                this.updatePropertyValue(value);
                break;
            default:
                break;
        }
    }

    /** @internal */
    public handleChange(event: Event): void {
        if (this.disabled) {
            return;
        }
        const control = this.findPathElement<HTMLElement>(event, '[data-control]');
        if (!control || !this.activeRuleId) {
            return;
        }
        if (control.dataset.control === 'collection-selector') {
            this.updateCollectionFromSelectorEvent(event);
            return;
        }
        if (control.dataset.control === 'collection-multi-select') {
            this.updateCollection((control as FvMultiSelect).selectedValues);
            return;
        }
        const value = (control as TextField | NumberField | Select).value;
        switch (control.dataset.control) {
            case 'field':
                this.updateField(value);
                break;
            case 'operator':
                this.updateOperator(value);
                break;
            case 'scalar-select':
                this.updateScalar(value === '' ? null : value);
                break;
            case 'boolean-value':
                if (value === 'true') {
                    this.updateScalar(true);
                } else if (value === 'false') {
                    this.updateScalar(false);
                } else {
                    this.updateScalar(null);
                }
                break;
            default:
                break;
        }
    }

    /** @internal */
    public handleCollectionFilterChange(event: Event): void {
        if (this.disabled || !this.activeCollectionSearchable) {
            return;
        }
        if (!(event instanceof CustomEvent)) {
            throw new Error('Expected the collection selector to emit a filter string.');
        }
        const detail: unknown = event.detail;
        if (!isRecord(detail) || typeof detail.filterText !== 'string') {
            throw new Error('Expected the collection selector to emit a filter string.');
        }
        void this.resolveOptions(detail.filterText);
    }

    /** @internal */
    public handleSuggestionChange(event: Event): void {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }
        const suggestion = this.findPathElement<HTMLElement>(event, '[data-action="select-suggestion"]');
        if (suggestion) {
            this.selectSuggestion(Number(suggestion.dataset.suggestionIndex));
        }
    }

    /** @internal */
    public handleKeydown(event: KeyboardEvent): void {
        if (this.disabled || event.defaultPrevented) {
            return;
        }
        const dynamicControl = this.findPathElement<HTMLElement>(event, '[data-control="scalar-text"]');
        if (dynamicControl && this.isActiveCombobox && this.handleDynamicOptionKeydown(event)) {
            return;
        }
        if (event.key === 'Escape' && this.activeRuleId) {
            event.preventDefault();
            this.closeEditor(true);
            return;
        }
        if (this.handleEditorTabKeydown(event)) {
            return;
        }

        const suggestion = this.findPathElement<HTMLElement>(event, '[data-action="select-suggestion"]');
        if (suggestion) {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.queryInputText = '';
                const input = this.shadowRoot?.querySelector<TextField>('.query-input');
                if (input) {
                    input.value = '';
                }
                this.focusQueryInput();
            }
            return;
        }

        const control = this.findPathElement<HTMLElement>(event, '[data-control="query-input"]');
        if (control) {
            this.handleQueryInputKeydown(event, control as TextField);
            return;
        }

        const chip = this.findPathElement<HTMLElement>(event, '[data-rule-id]');
        if (chip && (event.key === 'Backspace' || event.key === 'Delete')) {
            event.preventDefault();
            this.removeCondition(chip.dataset.ruleId ?? '');
        }
    }

    /** @internal */
    public handleConditionRemove(ruleId: string): void {
        if (!this.disabled) {
            this.removeCondition(ruleId);
        }
    }

    /** @internal */
    public addFilter(trigger?: HTMLElement): void {
        if (this.disabled) {
            return;
        }
        const field = this.getDefaultField();
        if (!field) {
            return;
        }
        const rule = this.createRule(field);
        const position = Math.min(this.caretPosition, this.editorTokens.length);
        const insertion = this.insertConditionAt(position, rule);
        this.caretPosition = insertion.position;
        this.queryInputText = '';
        this.commitTokens(insertion.tokens);
        DOM.queueUpdate(() => {
            const chip = this.getConditionElement(rule.id);
            this.openEditor(rule.id, chip ?? trigger ?? null);
        });
    }

    /** Returns whether the current draft is valid. */
    public validate(): boolean {
        return this.valid;
    }

    /** @internal */
    public getActiveScalarValue(): string {
        const token = this.activeRule
            ? this.editorTokens.find(candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId)
            : undefined;
        if (token?.kind === 'condition' && token.rawInputs?.['/value'] !== undefined) {
            return token.rawInputs['/value'];
        }
        const operand = this.activeRule?.operand;
        if (operand?.kind !== 'scalar') {
            return '';
        }
        if (this.isActiveCombobox) {
            return typeof operand.value === 'string' ? operand.value : '';
        }
        if (this.definition && this.activeRule) {
            if (operand.value === null && !(token?.kind === 'condition' && token.value === null
                && (this.hasActiveOptionSource
                    || staticOptions(this.getEffectiveSchema(this.activeRule.fieldId, this.activeRule.operatorId) ?? true)))) {
                return '';
            }
            return this.encodeOptionValue(this.activeRule.fieldId, this.activeRule.operatorId, operand.value);
        }
        if (operand.value === null) {
            return '';
        }
        return String(operand.value);
    }

    /** @internal */
    public getActiveRangeValue(part: 'start' | 'end'): string {
        const token = this.activeRule
            ? this.editorTokens.find(candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId)
            : undefined;
        if (token?.kind === 'condition' && token.rawInputs?.[`/value/${part}`] !== undefined) {
            return token.rawInputs[`/value/${part}`]!;
        }
        const operand = this.activeRule?.operand;
        if (operand?.kind !== 'range' || operand[part] === null) {
            return '';
        }
        return String(operand[part]);
    }

    /** @internal */
    public getDatePickerValue(value: string): string {
        return parseDatePickerValue(value, 'date') ? value : '';
    }

    /** @internal */
    public getActiveCollectionInput(): string {
        if (this.definition) {
            const token = this.editorTokens.find(
                candidate => candidate.kind === 'condition' && candidate.rule.id === this.activeRuleId
            );
            if (token?.kind === 'condition') {
                return token.rawInputs?.['/value'] ?? JSON.stringify(token.value ?? []);
            }
        }
        return this.activeCollectionValues.join(', ');
    }

    /** @internal */
    public getActiveRangeInputType(): 'number' | 'date' | 'text' {
        const rule = this.activeRule;
        const operator = rule ? this.portableOperator(rule.fieldId, rule.operatorId) : undefined;
        const schema = operator?.operand.kind === 'range' ? operator.operand.endpointSchema : undefined;
        if (schema === undefined || typeof schema === 'boolean') {
            if (this.activeField?.type === 'number' || this.activeField?.type === 'date') {
                return this.activeField.type;
            }
            return 'text';
        }
        const type = getSimpleSchemaType(schema);
        if (type === 'number' || type === 'integer') {
            return 'number';
        }
        return type === 'string' && schema.format === 'date' ? 'date' : 'text';
    }

    /** @internal */
    public getActivePropertyKey(): string {
        const operand = this.activeRule?.operand;
        return operand?.kind === 'key' || operand?.kind === 'key-value' ? operand.key : '';
    }

    /** @internal */
    public getActivePropertyValue(): string {
        const operand = this.activeRule?.operand;
        return operand?.kind === 'key-value' ? operand.value : '';
    }

    /** @internal */
    public getPartAccessibleLabel(kind: QueryEditorPartView['kind']): string {
        return kind === 'open' ? this.labels.startFilterGroup : this.labels.endFilterGroup;
    }

    /** @internal */
    public getLogicAccessibleLabel(logic: QueryBuilderLogicalOperator): string {
        return this.labels.toggleLogic(this.getLogicLabel(logic));
    }

    /** @internal */
    public formatCollectionOption(value: string): string {
        const staticLabel = this.activeOptions.find(option => option.value === value)?.label;
        if (staticLabel) {
            return staticLabel;
        }
        const dynamicValue = this.decodeDynamicOption(value);
        const options = 'options' in this.optionState ? this.optionState.options : [];
        const dynamicLabel = dynamicValue === undefined
            ? undefined
            : options.find(option => Object.is(option.value, dynamicValue))?.label
                ?? this.optionLabelCache.get(JSON.stringify(dynamicValue))?.label;
        return dynamicLabel ?? (dynamicValue === undefined ? value : JSON.stringify(dynamicValue));
    }

    private formatParts(parts: readonly QueryEditorPartView[]): readonly QueryEditorPartView[] {
        const tokenLayouts = new Map<number, {
            readonly row: number,
            readonly role: 'operator' | 'condition' | 'group-open' | 'group-close',
            readonly indentLevel: number
        }>();
        let row = 0;
        let depth = 0;

        for (let index = 0; index < this.editorTokens.length; index += 1) {
            const token = this.editorTokens[index]!;
            if (token.kind === 'logic') {
                const previous = this.editorTokens[index - 1];
                if (!previous || previous.kind === 'logic') {
                    row += 1;
                }
                tokenLayouts.set(index, {
                    row,
                    role: 'operator',
                    indentLevel: depth
                });
                continue;
            }

            if (token.kind === 'open') {
                row += 1;
                tokenLayouts.set(index, { row, role: 'group-open', indentLevel: depth + 1 });
                depth += 1;
                continue;
            }
            if (token.kind === 'condition') {
                const previous = this.editorTokens[index - 1];
                if (previous?.kind !== 'open') {
                    row += 1;
                }
                tokenLayouts.set(index, {
                    row,
                    role: 'condition',
                    indentLevel: depth
                });
            } else if (token.kind === 'close') {
                const previous = this.editorTokens[index - 1];
                if (previous?.kind === 'condition') {
                    row = tokenLayouts.get(index - 1)?.row ?? row + 1;
                } else if (previous?.kind === 'open') {
                    row = tokenLayouts.get(index - 1)?.row ?? row + 1;
                } else {
                    row += 1;
                }
                const indentLevel = previous?.kind === 'condition' ? depth : Math.max(0, depth - 1);
                tokenLayouts.set(index, { row, role: 'group-close', indentLevel });
                depth = Math.max(0, depth - 1);
            }
        }

        const insertionLayouts = new Map<number, {
            readonly row: number,
            readonly role: 'insertion',
            readonly indentLevel: number
        }>();
        depth = 0;
        for (let position = 0; position <= this.editorTokens.length; position += 1) {
            const previous = this.editorTokens[position - 1];
            const next = this.editorTokens[position];
            const targetPosition = next ? position : position - 1;
            const target = next || previous?.kind !== 'logic'
                ? tokenLayouts.get(targetPosition)
                : undefined;
            const targetRow = target?.row ?? (position === 0 ? 1 : row + 1);
            const indentLevel = !next && previous?.kind === 'open'
                ? depth
                : target?.indentLevel ?? depth;
            insertionLayouts.set(position, {
                row: targetRow,
                role: 'insertion',
                indentLevel
            });
            const token = this.editorTokens[position];
            if (token?.kind === 'open') {
                depth += 1;
            } else if (token?.kind === 'close') {
                depth = Math.max(0, depth - 1);
            }
        }

        return parts.map(part => {
            if (part.kind === 'insertion') {
                const layout = insertionLayouts.get(part.position);
                return layout
                    ? {
                        ...part,
                        layoutRow: layout.row,
                        layoutRole: layout.role,
                        indentLevel: layout.indentLevel,
                        indented: layout.indentLevel > 0
                    }
                    : part;
            }
            const layout = tokenLayouts.get(part.tokenIndex);
            return layout
                ? {
                    ...part,
                    layoutRow: layout.row,
                    layoutRole: layout.role,
                    indentLevel: layout.indentLevel,
                    indented: layout.indentLevel > 0
                }
                : part;
        });
    }

    private readonly documentPointerDownHandler = (event: Event): void => {
        if (!event.composedPath().includes(this)) {
            this.shadowRoot?.querySelector<HTMLElement>('.suggestions')?.hidePopover();
        }
        if (this.activeRuleId && !event.composedPath().includes(this)) {
            this.closeEditor(false);
        }
    };

    private readonly documentFocusInHandler = (event: Event): void => {
        if (!event.composedPath().includes(this)) {
            this.shadowRoot?.querySelector<HTMLElement>('.suggestions')?.hidePopover();
        }
        if (this.activeRuleId && !event.composedPath().includes(this)) {
            this.closeEditor(false);
        }
    };

    private readonly editorViewportChangeHandler = (): void => {
        this.updateSuggestionsPopover();
        if (this.updateEditorPanelAvailableWidth(this.activeEditorTrigger)) {
            this.editorRegion?.update();
        }
    };

    private hasValidStructure(): boolean {
        if (this.editorTokens.length === 0) {
            return true;
        }
        interface Scope {
            termCount: number;
            combinator?: QueryBuilderLogicalOperator;
        }
        const scopes: Scope[] = [{ termCount: 0 }];
        let expectsCondition = true;
        for (const token of this.editorTokens) {
            switch (token.kind) {
                case 'open':
                    if (!expectsCondition || scopes.length > MAX_QUERY_GROUP_DEPTH) {
                        return false;
                    }
                    scopes.push({ termCount: 0 });
                    expectsCondition = true;
                    break;
                case 'close':
                    if (expectsCondition || scopes.length === 1 || scopes[scopes.length - 1]!.termCount === 0) {
                        return false;
                    }
                    scopes.pop();
                    scopes[scopes.length - 1]!.termCount += 1;
                    expectsCondition = false;
                    break;
                case 'condition':
                    if (!expectsCondition) {
                        return false;
                    }
                    scopes[scopes.length - 1]!.termCount += 1;
                    expectsCondition = false;
                    break;
                case 'logic':
                    if (expectsCondition) {
                        return false;
                    }
                    if (scopes[scopes.length - 1]!.combinator !== undefined
                        && scopes[scopes.length - 1]!.combinator !== token.logic) {
                        return false;
                    }
                    scopes[scopes.length - 1]!.combinator = token.logic;
                    expectsCondition = true;
                    break;
                default:
                    break;
            }
        }
        return !expectsCondition && scopes.length === 1;
    }

    private hasDuplicateIdentifiers(): boolean {
        const ids = new Set<string>();
        for (const token of this.editorTokens) {
            let id: string | undefined;
            if (token.kind === 'condition') {
                id = token.rule.id;
            } else if (token.kind === 'open') {
                id = token.groupId;
            }
            if (id !== undefined) {
                if (ids.has(id)) {
                    return true;
                }
                ids.add(id);
            }
        }
        return false;
    }

    private hasDuplicateRuleId(ruleId: string): boolean {
        return this.editorTokens.filter(token => token.kind === 'condition' && token.rule.id === ruleId).length > 1;
    }

    private expectsCondition(position: number): boolean {
        const previous = this.editorTokens[position - 1];
        return previous === undefined || previous.kind === 'open' || previous.kind === 'logic';
    }

    private expectsLogic(position: number): boolean {
        return isTerm(this.editorTokens[position - 1]);
    }

    private createTokens(query: QueryDocument): readonly QueryEditorToken[] {
        const tokens: QueryEditorToken[] = [];
        const appendNode = (node: QueryNode, groupId: string): void => {
            if (node.kind === 'predicate') {
                tokens.push(this.createConditionToken(node, groupId));
                return;
            }
            const nestedGroupId = uniqueId('query-group');
            tokens.push({ kind: 'open', groupId: nestedGroupId });
            node.children.forEach((child, index) => {
                if (index > 0) {
                    tokens.push({ kind: 'logic', logic: node.combinator, groupId: nestedGroupId });
                }
                appendNode(child, nestedGroupId);
            });
            tokens.push({ kind: 'close' });
        };
        if (query.root === null) {
            return tokens;
        }
        const rootGroupId = uniqueId('query-group');
        const root = query.root;
        if (root.kind === 'group') {
            root.children.forEach((child, index) => {
                if (index > 0) {
                    tokens.push({ kind: 'logic', logic: root.combinator, groupId: rootGroupId });
                }
                appendNode(child, rootGroupId);
            });
        } else {
            appendNode(root, rootGroupId);
        }
        return tokens;
    }

    private createQueryFromTokens(): QueryDocument | undefined {
        if (!this.hasValidStructure()) {
            return undefined;
        }
        interface Scope {
            readonly groupId: string;
            readonly parent: Scope | null;
            readonly children: QueryNode[];
            combinator?: QueryBuilderLogicalOperator;
        }
        const root: Scope = { groupId: '', parent: null, children: [] };
        let current = root;
        const scopes: Scope[] = [root];
        for (const token of this.editorTokens) {
            if (token.kind === 'open') {
                const child: Scope = { groupId: token.groupId, parent: current, children: [] };
                scopes.push(child);
                current = child;
            } else if (token.kind === 'condition') {
                current.children.push(this.createPredicate(token));
            } else if (token.kind === 'logic') {
                if (current.combinator !== undefined && current.combinator !== token.logic) {
                    return undefined;
                }
                current.combinator = token.logic;
            } else if (token.kind === 'close') {
                if (current === root) {
                    return undefined;
                }
                const child = current;
                current = child.parent!;
                scopes.pop();
                if (child.children.length === 0) {
                    return undefined;
                }
                const node = child.children.length === 1
                    ? child.children[0]!
                    : {
                        kind: 'group' as const,
                        combinator: child.combinator ?? 'and',
                        children: child.children
                    };
                current.children.push(node);
            }
        }
        if (scopes.length !== 1 || (root.children.length > 1 && root.combinator === undefined)) {
            return undefined;
        }
        let rootNode: QueryNode | null;
        if (root.children.length === 0) {
            rootNode = null;
        } else if (root.children.length === 1) {
            rootNode = root.children[0]!;
        } else {
            rootNode = {
                kind: 'group',
                combinator: root.combinator ?? 'and',
                children: root.children
            };
        }
        return { version: 1, root: rootNode };
    }

    private commitTokens(tokens: readonly QueryEditorToken[]): void {
        this.editorTokens = tokens;
        this.assignDraft(tokens);
        const query = this.createQueryFromTokens();
        const validation = query && this.definition ? validateQuery(query, this.definition) : undefined;
        if (validation?.valid && this.queryInputText.length === 0) {
            this.externalInputIssues = [];
            this.assignQuery(validation.value);
        }
        if (tokens.length === 0 && this.queryInputText.length === 0) {
            this.externalInputIssues = [];
        }
        this.updateValidationState(true);
        this.emitPortableQueryChange();
    }

    private emitPortableQueryChange(): void {
        const query = this.createQueryFromTokens();
        const validation = query && this.definition ? validateQuery(query, this.definition) : undefined;
        const valid = this.valid && validation?.valid === true;
        const detail: QueryEditorEventDetail = valid
            ? {
                query: this.cloneQueryDocument(validation.value),
                draft: this.cloneDraft(this.editorTokens),
                ruleCount: this.ruleCount,
                valid: true,
                issues: []
            }
            : {
                query: null,
                draft: this.cloneDraft(this.editorTokens),
                ruleCount: this.ruleCount,
                valid: false,
                issues: [...this.issues]
            };
        this.dispatchEvent(new CustomEvent<QueryEditorEventDetail>('query-change', {
            bubbles: true,
            composed: true,
            detail
        }));
    }

    private assignDraft(tokens: readonly QueryEditorToken[]): void {
        const draft = this.cloneDraft(tokens);
        this.internallyAssignedDraft = draft;
        this.draft = draft;
    }

    private cloneDraft(tokens: readonly QueryEditorToken[]): QueryEditorDraft {
        const draftTokens: PortableQueryEditorDraftToken[] = tokens.map(token => {
            if (token.kind === 'condition') {
                const result: Extract<PortableQueryEditorDraftToken, { kind: 'condition' }> = {
                    kind: 'condition',
                    id: token.rule.id,
                    fieldId: token.rule.fieldId,
                    operatorId: token.rule.operatorId,
                    ...(token.value !== undefined ? { value: this.cloneJsonValue(token.value) } : {}),
                    ...(token.rawInputs ? { rawInputs: { ...token.rawInputs } } : {})
                };
                return result;
            }
            if (token.kind === 'open') {
                return { kind: 'open', id: token.groupId };
            }
            if (token.kind === 'logic') {
                return { kind: 'logic', logic: token.logic };
            }
            return { kind: 'close' };
        });
        return {
            version: 1,
            tokens: draftTokens,
            caretPosition: this.caretPosition,
            inputText: this.queryInputText
        };
    }

    private cloneEditorTokens(tokens: readonly QueryEditorToken[]): readonly QueryEditorToken[] {
        return tokens.map(token => {
            if (token.kind === 'condition') {
                return {
                    ...token,
                    rule: { ...token.rule, operand: cloneOperand(token.rule.operand) },
                    ...(token.value !== undefined ? { value: this.cloneJsonValue(token.value) } : {}),
                    ...(token.rawInputs ? { rawInputs: { ...token.rawInputs } } : {})
                };
            }
            return { ...token };
        });
    }

    private createRule(field: QueryBuilderField): QueryBuilderRule {
        const operator = this.supportedOperators(field)[0];
        if (!operator) {
            throw new TypeError(`Field "${field.id}" does not have a supported operator.`);
        }
        return {
            id: uniqueId('query-rule'),
            revision: 0,
            fieldId: field.id,
            operatorId: operator.id,
            operand: createEmptyOperand(operator.operandKind)
        };
    }

    private getDefaultField(): QueryBuilderField | undefined {
        if (this.defaultField) {
            const configured = this.fields.find(field => field.id === this.defaultField);
            return configured && this.supportedOperators(configured).length > 0 ? configured : undefined;
        }
        return this.fields.find(field => this.supportedOperators(field).length > 0);
    }

    private handleDynamicOptionKeydown(event: KeyboardEvent): boolean {
        const options = this.activeDynamicOptions;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (options.length === 0) {
                return false;
            }
            event.preventDefault();
            this.dynamicOptionsDismissed = false;
            this.activeOptionIndex = event.key === 'ArrowDown'
                ? Math.min(this.activeOptionIndex + 1, options.length - 1)
                : Math.max(this.activeOptionIndex - 1, 0);
            return true;
        }
        if (event.key === 'Enter' && this.activeOptionIndex >= 0) {
            event.preventDefault();
            this.selectDynamicOption(this.activeOptionIndex);
            return true;
        }
        if (event.key === 'Escape' && !this.dynamicOptionsDismissed) {
            this.dynamicOptionsDismissed = true;
            this.activeOptionIndex = -1;
            this.syncDynamicOptionAccessibility();
            return true;
        }
        return false;
    }

    private selectDynamicOption(index: number): void {
        const option = this.activeDynamicOptions[index];
        if (!option || option.disabled) {
            return;
        }
        this.dynamicOptionsDismissed = true;
        this.activeOptionIndex = -1;
        this.updateScalarValue(option.value);
        DOM.queueUpdate(() => this.syncDynamicOptionAccessibility());
    }

    private selectSuggestion(index: number): void {
        const suggestion = this.suggestions[index];
        if (!suggestion) {
            return;
        }
        if (suggestion.kind === 'field') {
            const field = this.fields.find(candidate => candidate.id === suggestion.value);
            if (!field) {
                return;
            }
            const rule = this.createRule(field);
            const position = Math.min(this.caretPosition, this.editorTokens.length);
            const insertion = this.insertConditionAt(position, rule);
            this.caretPosition = insertion.position + 1;
            this.queryInputText = '';
            this.commitTokens(insertion.tokens);
            DOM.queueUpdate(() => this.openEditor(rule.id, this.getConditionElement(rule.id)));
            return;
        }
        this.insertLogic(suggestion.value);
    }

    private insertLogic(logic: QueryBuilderLogicalOperator): void {
        const position = Math.min(this.caretPosition, this.editorTokens.length);
        if (!this.expectsLogic(position)) {
            return;
        }
        this.logicSuggestionsDismissed = false;
        const next = [...this.editorTokens];
        const current = next[position];
        let logicPosition = position;
        if (current?.kind === 'logic') {
            this.setLogicScope(next, position, logic);
        } else {
            const groupId = this.getGroupIdAtPosition(position);
            const token: QueryEditorToken = groupId
                ? { kind: 'logic', logic, groupId }
                : { kind: 'logic', logic };
            next.splice(position, 0, token);
            this.setLogicScope(next, position, logic);
        }
        logicPosition += 1;
        this.caretPosition = logicPosition;
        this.queryInputText = '';
        this.commitTokens(next);
        this.focusQueryInput();
    }

    private setLogicScope(
        tokens: QueryEditorToken[],
        position: number,
        logic: QueryBuilderLogicalOperator
    ): void {
        const groupId = this.getGroupIdAtPosition(position, tokens);
        for (let index = 0; index < tokens.length; index += 1) {
            const token = tokens[index];
            if (token?.kind === 'logic' && this.getGroupIdAtPosition(index, tokens) === groupId) {
                tokens[index] = this.createLogicToken(logic, groupId);
            }
        }
    }

    private toggleLogic(tokenIndex: number): void {
        const token = this.editorTokens[tokenIndex];
        if (token?.kind !== 'logic') {
            return;
        }
        const nextLogic = token.logic === 'and' ? 'or' : 'and';
        const next = [...this.editorTokens];
        this.setLogicScope(next, tokenIndex, nextLogic);
        this.commitTokens(next);
    }

    private insertParenthesis(value: '(' | ')'): void {
        const position = Math.min(this.caretPosition, this.editorTokens.length);
        const next = [...this.editorTokens];
        const groupId = this.getGroupIdAtPosition(position);
        if (value === '(' && this.expectsCondition(position)) {
            next.splice(position, 0, { kind: 'open', groupId: uniqueId('query-group') });
        } else if (value === ')' && isTerm(next[position - 1]) && next[position]?.kind !== 'close') {
            if (groupId !== undefined) {
                const openIndex = this.findOpenGroupIndex(position);
                const openToken = next[openIndex];
                if (openToken?.kind === 'open') {
                    for (let index = openIndex + 1; index < position; index += 1) {
                        const token = next[index];
                        if (token?.kind === 'logic') {
                            next[index] = { ...token, groupId: openToken.groupId };
                        }
                    }
                }
            }
            next.splice(position, 0, { kind: 'close' });
        } else {
            return;
        }
        this.caretPosition = position + 1;
        this.queryInputText = '';
        this.commitTokens(next);
        this.focusQueryInput();
    }

    private syncActiveSuggestionId(): void {
        const suggestionCount = this.suggestions.length;
        if (suggestionCount === 0) {
            this.activeSuggestionId = '';
        } else {
            this.activeSuggestionIndex = Math.max(
                0,
                Math.min(this.activeSuggestionIndex, suggestionCount - 1)
            );
            this.activeSuggestionId = `${this.editorId}-suggestion-${this.activeSuggestionIndex}`;
        }
        DOM.queueUpdate(() => this.syncQueryInputAccessibility());
    }

    private syncQueryInputAccessibility(): void {
        const textField = this.shadowRoot?.querySelector<TextField>('.query-input');
        const input = textField?.shadowRoot?.querySelector<HTMLInputElement>('input') as
            (HTMLInputElement & { ariaControlsElements?: Element[] }) | null;
        if (!input) {
            return;
        }
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-haspopup', 'listbox');
        this.updateSuggestionsPopover();
        input.setAttribute('aria-expanded', String(this.shadowRoot?.querySelector('.suggestions')?.matches(':popover-open') ?? false));
        const list = this.shadowRoot?.getElementById(this.suggestionListId);
        if (list) {
            input.ariaControlsElements = [list];
            (textField as TextField & { ariaControlsElements?: Element[] }).ariaControlsElements = [list];
        }
        input.setAttribute('aria-controls', this.suggestionListId);
        input.setAttribute('aria-label', this.label);
        if (this.activeSuggestionId) {
            input.setAttribute('aria-activedescendant', this.activeSuggestionId);
            const active = this.shadowRoot?.getElementById(this.activeSuggestionId);
            (textField as TextField & { ariaActiveDescendantElement?: Element | null })
                .ariaActiveDescendantElement = active ?? null;
        } else {
            input.removeAttribute('aria-activedescendant');
            (textField as TextField & { ariaActiveDescendantElement?: Element | null })
                .ariaActiveDescendantElement = null;
        }
    }

    private updateSuggestionsPopover(): void {
        const list = this.shadowRoot?.querySelector<HTMLElement>('.suggestions');
        const input = this.shadowRoot?.querySelector<HTMLElement>('.query-input');
        if (!list || !input) {
            return;
        }
        const anchor = input.getBoundingClientRect();
        if (this.disabled || this.suggestions.length === 0 || !input.hasAttribute('data-focused') || anchor.width === 0 || anchor.height === 0) {
            list.hidePopover();
            return;
        }
        list.showPopover();
    }

    private syncQueryInputAccessibilityAfterRender(): void {
        DOM.queueUpdate(() => DOM.queueUpdate(() => this.syncActiveSuggestionId()));
    }

    private syncEditorControlAccessibilityAfterRender(): void {
        DOM.queueUpdate(() => DOM.queueUpdate(() => this.syncEditorControlAccessibility()));
    }

    private restoreDatePickerDrafts(): void {
        const pickers = this.shadowRoot?.querySelectorAll<FvDateTimePicker>('ok-fv-date-time-picker[data-control]') ?? [];
        for (const picker of pickers) {
            const raw = picker.dataset.control === 'scalar-text'
                ? this.getActiveScalarValue()
                : this.getActiveRangeValue(picker.dataset.control === 'range-start' ? 'start' : 'end');
            if (raw && !this.getDatePickerValue(raw)) {
                picker.control.value = raw;
                picker.handleTextInput();
            }
        }
    }

    private syncEditorControlAccessibility(): void {
        const collectionHint = this.shadowRoot?.querySelector<HTMLElement>('.collection-input-hint');
        const controls = this.shadowRoot?.querySelectorAll<HTMLElement>('.editor-panel [data-control]') ?? [];
        for (const control of controls) {
            const nativeErrorElement = control.shadowRoot?.querySelector<HTMLElement>('.error-text');
            const errorElement = nativeErrorElement ?? this.editorPanelErrorElement;
            const invalid = control.getAttribute('aria-invalid') === 'true';
            const input = control.shadowRoot?.querySelector<HTMLInputElement>('input');
            if (input) {
                input.ariaErrorMessageElements = invalid && errorElement ? [errorElement] : [];
            }
            if (control.dataset.control === 'collection-values' && collectionHint) {
                if (input) {
                    input.ariaDescribedByElements = [collectionHint];
                }
            }
            const controlWithErrorReference = control as HTMLElement & { ariaErrorMessageElements?: Element[] };
            controlWithErrorReference.ariaErrorMessageElements = invalid && errorElement && !nativeErrorElement
                ? [errorElement]
                : [];
            if (control.tagName.toLowerCase() === 'ok-fv-chip-selector') {
                const selector = control as HTMLElement & {
                    ariaErrormessageElements?: readonly Element[],
                    ariaDescribedbyElements?: readonly Element[]
                };
                selector.ariaErrormessageElements = invalid && errorElement ? [errorElement] : [];
                selector.ariaDescribedbyElements = [];
            }
            if (control.tagName.toLowerCase() === 'ok-fv-multi-select') {
                const button = control.shadowRoot?.querySelector<HTMLButtonElement>('.control');
                if (button) {
                    button.setAttribute('aria-invalid', String(invalid));
                    button.ariaErrorMessageElements = invalid && errorElement ? [errorElement] : [];
                }
            }
        }
    }

    private syncDynamicOptionAccessibility(): void {
        const host = this.shadowRoot?.querySelector<TextField>('.editor-panel [data-control="scalar-text"]');
        const input = host?.shadowRoot?.querySelector<HTMLInputElement>('input') as
            (HTMLInputElement & {
                ariaActiveDescendantElement?: Element | null,
                ariaControlsElements?: Element[]
            }) | null;
        const list = this.shadowRoot?.getElementById(this.dynamicOptionListId) as HTMLElement | null;
        const isOpen = Boolean(
            host
            && list
            && !this.disabled
            && !this.dynamicOptionsDismissed
            && this.activeDynamicOptions.length > 0
            && host.matches(':focus-within')
        );
        const activeOption = isOpen && this.activeOptionIndex >= 0
            ? this.shadowRoot?.getElementById(`${this.dynamicOptionListId}-option-${this.activeOptionIndex}`) ?? null
            : null;
        if (input) {
            input.setAttribute('role', 'combobox');
            input.setAttribute('aria-autocomplete', 'list');
            input.setAttribute('aria-haspopup', 'listbox');
            if (list) {
                (host as TextField & { ariaControlsElements?: Element[] }).ariaControlsElements = [list];
                input.ariaControlsElements = [list];
            }
            input.setAttribute('aria-expanded', String(isOpen));
            input.setAttribute('aria-controls', this.dynamicOptionListId);
            if (activeOption) {
                input.ariaActiveDescendantElement = activeOption;
                input.setAttribute('aria-activedescendant', `${this.dynamicOptionListId}-option-${this.activeOptionIndex}`);
            } else {
                input.removeAttribute('aria-activedescendant');
                input.ariaActiveDescendantElement = null;
                (host as TextField & { ariaActiveDescendantElement?: Element | null })
                    .ariaActiveDescendantElement = null;
            }
        }
        if (!list) {
            return;
        }
        if (!isOpen || !input) {
            if (host) {
                (host as TextField & { ariaActiveDescendantElement?: Element | null })
                    .ariaActiveDescendantElement = null;
            }
            list.hidePopover();
            return;
        }
        list.showPopover();
        const anchor = input.getBoundingClientRect();
        const bounds = list.getBoundingClientRect();
        list.style.left = `${Math.max(8, Math.min(anchor.left, document.documentElement.clientWidth - bounds.width - 8))}px`;
        list.style.top = `${anchor.bottom + 4}px`;
    }

    private findOpenGroupIndex(position: number): number {
        let depth = 0;
        for (let index = position - 1; index >= 0; index -= 1) {
            const token = this.editorTokens[index];
            if (token?.kind === 'close') {
                depth += 1;
            } else if (token?.kind === 'open') {
                if (depth === 0) {
                    return index;
                }
                depth -= 1;
            }
        }
        return -1;
    }

    private setCaret(position: number): void {
        this.caretPosition = Math.max(0, Math.min(position, this.editorTokens.length));
        this.logicSuggestionsDismissed = false;
        this.queryInputText = '';
        this.focusQueryInput();
        this.syncQueryInputAccessibilityAfterRender();
    }

    private getTrailingCaretPosition(event: Event, requestedPosition?: number): number | null {
        const tokens = this.shadowRoot?.querySelectorAll<HTMLElement>('[data-token-index]');
        const lastToken = tokens?.[tokens.length - 1];
        const point = event as MouseEvent;
        const lastTokenRect = lastToken?.getBoundingClientRect();
        if (
            !lastToken
            || !lastTokenRect
            || point.clientX <= lastTokenRect.right
            || point.clientY < lastTokenRect.top
            || point.clientY > lastTokenRect.bottom
        ) {
            return null;
        }

        const trailingSlotClicked = requestedPosition === this.editorTokens.length;
        const target = event.target instanceof HTMLElement ? event.target : null;
        const trailingSpaceClicked = requestedPosition === undefined
            && target?.classList.contains('editor-field');
        if (!trailingSlotClicked && !trailingSpaceClicked) {
            return null;
        }

        const tokenIndex = Number(lastToken.dataset.tokenIndex);
        return Number.isInteger(tokenIndex) ? tokenIndex + 1 : null;
    }

    private setCaretFromPointer(event: Event): void {
        const trailingPosition = this.getTrailingCaretPosition(event);
        if (trailingPosition !== null) {
            this.setCaret(trailingPosition);
            return;
        }

        const point = event as MouseEvent;
        const tokens = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>('[data-token-index]') ?? []);
        if (tokens.length === 0) {
            this.setCaret(this.editorTokens.length);
            return;
        }
        const nearest = tokens.reduce((best, item) => {
            const rect = item.getBoundingClientRect();
            const dx = Math.max(rect.left - point.clientX, 0, point.clientX - rect.right);
            const dy = Math.max(rect.top - point.clientY, 0, point.clientY - rect.bottom);
            const distance = dx * dx + dy * dy;
            return distance < best.distance ? { item, distance } : best;
        }, { item: tokens[0]!, distance: Number.POSITIVE_INFINITY });
        const index = Number(nearest.item.dataset.tokenIndex);
        const rect = nearest.item.getBoundingClientRect();
        this.setCaret(index + Number(point.clientX > rect.left + rect.width / 2));
    }

    private handleQueryInputKeydown(event: KeyboardEvent, input: TextField): void {
        if (this.shouldShowLogicChipPreviews) {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.logicSuggestionsDismissed = true;
                this.queryInputText = '';
                input.value = '';
                this.syncQueryInputAccessibilityAfterRender();
                return;
            }
        }

        if (this.shouldShowConditionChipPreview) {
            if (event.key === 'Enter' && !event.isComposing) {
                event.preventDefault();
                this.addFilter();
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                this.logicSuggestionsDismissed = true;
                return;
            }
        }

        const suggestions = this.suggestions;
        if (suggestions.length > 0) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                this.activeSuggestionIndex = event.key === 'ArrowDown'
                    ? Math.min(this.activeSuggestionIndex + 1, suggestions.length - 1)
                    : Math.max(this.activeSuggestionIndex - 1, 0);
                return;
            }
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                this.selectSuggestion(this.activeSuggestionIndex);
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                this.logicSuggestionsDismissed = true;
                this.queryInputText = '';
                input.value = '';
                this.syncQueryInputAccessibilityAfterRender();
                return;
            }
        }

        if (input.value.length === 0) {
            if (event.key === 'ArrowLeft' && this.caretPosition > 0) {
                event.preventDefault();
                this.setCaret(this.caretPosition - 1);
            } else if (event.key === 'ArrowRight' && this.caretPosition < this.editorTokens.length) {
                event.preventDefault();
                this.setCaret(this.caretPosition + 1);
            } else if (event.key === 'Backspace' && this.caretPosition > 0) {
                event.preventDefault();
                this.removeToken(this.caretPosition - 1);
            } else if (event.key === 'Delete' && this.caretPosition < this.editorTokens.length) {
                event.preventDefault();
                this.removeToken(this.caretPosition);
            }
        }
        if (event.key === '(' || event.key === ')') {
            event.preventDefault();
            this.insertParenthesis(event.key);
        }
    }

    private removeToken(index: number): void {
        if (index < 0 || index >= this.editorTokens.length) {
            return;
        }
        const next = [...this.editorTokens];
        const removed = next[index];
        let removeStart = index;
        next.splice(index, 1);
        if (removed?.kind === 'condition' && this.activeRuleId === removed.rule.id) {
            this.closeEditor(false);
        }
        if (removed?.kind === 'condition' && next[removeStart - 1]?.kind === 'open' && next[removeStart]?.kind === 'close') {
            next.splice(removeStart - 1, 2);
            removeStart -= 1;
        }
        this.caretPosition = removeStart;
        this.queryInputText = '';
        this.commitTokens(next);
        this.focusQueryInput();
    }

    private removeCondition(ruleId: string): void {
        const index = this.editorTokens.findIndex(
            token => token.kind === 'condition' && token.rule.id === ruleId
        );
        if (index >= 0) {
            this.removeToken(index);
        }
    }

    private updateField(fieldId: string): void {
        const rule = this.activeRule;
        const field = this.fields.find(candidate => candidate.id === fieldId);
        const operator = field && this.supportedOperators(field)[0];
        if (!rule || !field || !operator) {
            return;
        }
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            fieldId: field.id,
            operatorId: operator.id,
            operand: createEmptyOperand(operator.operandKind)
        });
    }

    private updateOperator(operatorId: string): void {
        const rule = this.activeRule;
        const operator = this.activeField && this.getEditorOperator(this.activeField.id, operatorId);
        if (!rule || !operator) {
            return;
        }
        const operand = rule.operand.kind === operator.operandKind
            ? rule.operand
            : createEmptyOperand(operator.operandKind);
        this.updateRule({ ...rule, revision: rule.revision + 1, operatorId: operator.id, operand });
    }

    private updateScalar(value: string | number | boolean | null): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'scalar') {
            return;
        }
        const typedValue = this.definition && typeof value === 'string' && !this.isActiveCombobox
            ? this.decodeOptionValue(rule.fieldId, rule.operatorId, value)
            : value;
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { kind: 'scalar', value: typedValue }
        });
    }

    private updateScalarValue(value: JsonPrimitive): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'scalar') {
            return;
        }
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { kind: 'scalar', value }
        });
    }

    private updateScalarInput(value: string): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'scalar') {
            return;
        }
        const schema = this.getEffectiveSchema(rule.fieldId, rule.operatorId);
        const parsedValue = this.parseRawInput(value, schema);
        const rawValuePath = '/value';
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { kind: 'scalar', value: parsedValue }
        }, { [rawValuePath]: value });
    }

    private updateCollection(value: string | readonly string[]): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'collection') {
            return;
        }
        let values: string[];
        let rawInput: Readonly<{ [key: string]: string }> | null | undefined;
        if (typeof value === 'string') {
            if (this.definition) {
                const parsed = this.parseCollectionInput(value);
                values = Array.isArray(parsed)
                    ? parsed.map(item => (isJsonPrimitive(item)
                        ? this.encodeOptionValue(rule.fieldId, rule.operatorId, item)
                        : JSON.stringify(item)))
                    : [];
                const rawValuePath = '/value';
                rawInput = { [rawValuePath]: value };
            } else {
                values = value.trim() === '' ? [] : value.split(',').map(item => item.trim());
            }
        } else {
            values = [...value];
            rawInput = this.definition ? null : undefined;
        }
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { kind: 'collection', values }
        }, rawInput);
    }

    private updateCollectionFromSelectorEvent(event: Event): void {
        if (!(event instanceof CustomEvent)) {
            throw new Error('Expected the collection selector to emit a CustomEvent.');
        }
        const selectorEvent = event as CustomEvent<{
            selectedValues?: unknown,
            selectedOptionValues?: unknown
        }>;
        const selectedOptionValues = selectorEvent.detail?.selectedOptionValues;
        if (this.definition && Array.isArray(selectedOptionValues)
            && selectedOptionValues.every(isJsonPrimitive)) {
            const rule = this.activeRule;
            if (!rule) {
                return;
            }
            this.updateCollection(selectedOptionValues.map(value => this.encodeOptionValue(rule.fieldId, rule.operatorId, value)));
            return;
        }
        const selectedValues = selectorEvent.detail?.selectedValues;
        if (
            !Array.isArray(selectedValues)
            || !selectedValues.every((value: unknown): value is string => typeof value === 'string')
        ) {
            throw new Error('Expected the collection selector to emit an array of selected values.');
        }
        const valuesByLabel = new Map(
            (this.activeField?.options ?? []).map(option => [option.label, option.value] as const)
        );
        this.updateCollection(selectedValues.map(label => valuesByLabel.get(label) ?? label));
    }

    private updateRange(part: 'start' | 'end', value: string): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'range') {
            return;
        }
        let parsedValue: string | number | null = value;
        const operator = this.portableOperator(rule.fieldId, rule.operatorId);
        const endpointSchema = operator?.operand.kind === 'range' ? operator.operand.endpointSchema : undefined;
        const endpointType = endpointSchema === undefined
            ? this.activeField?.type
            : getSimpleSchemaType(endpointSchema);
        if (value === '' && endpointType !== 'string' && endpointType !== 'date') {
            parsedValue = null;
        } else if (value === '') {
            parsedValue = '';
        } else if (endpointType === 'number' || endpointType === 'integer') {
            parsedValue = Number(value);
        }
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { ...rule.operand, [part]: parsedValue }
        }, { [`/value/${part}`]: value });
    }

    private updateKey(value: string): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'key' && rule?.operand.kind !== 'key-value') {
            return;
        }
        const rawKeyPath = '/value/key';
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { ...rule.operand, key: value }
        }, this.definition ? { [rawKeyPath]: value } : undefined);
    }

    private updatePropertyValue(value: string): void {
        const rule = this.activeRule;
        if (rule?.operand.kind !== 'key-value') {
            return;
        }
        const rawValuePath = '/value/value';
        this.updateRule({
            ...rule,
            revision: rule.revision + 1,
            operand: { ...rule.operand, value }
        }, this.definition ? { [rawValuePath]: value } : undefined);
    }

    private updateRule(rule: QueryBuilderRule, rawInput?: Readonly<{ [key: string]: string }> | null): void {
        const index = this.editorTokens.findIndex(
            token => token.kind === 'condition' && token.rule.id === rule.id
        );
        if (index < 0) {
            return;
        }
        const next = [...this.editorTokens];
        const token = next[index];
        if (token?.kind !== 'condition') {
            return;
        }
        const identityChanged = token.rule.fieldId !== rule.fieldId || token.rule.operatorId !== rule.operatorId;
        let rawInputs = token.rawInputs;
        if (identityChanged || rawInput === null) {
            rawInputs = undefined;
        } else if (rawInput !== undefined) {
            rawInputs = { ...token.rawInputs, ...rawInput };
        }
        let updated: Extract<QueryEditorToken, { kind: 'condition' }> = { ...token, rule };
        if (this.definition && identityChanged) {
            if (token.rule.fieldId === rule.fieldId && token.rule.operand.kind === rule.operand.kind) {
                const predicate = { ...this.createPredicate(token), operatorId: rule.operatorId };
                updated = { ...updated, rule: { ...rule, operand: this.createRuleForPredicate(predicate).operand } };
            } else {
                const { value: _value, rawInputs: _rawInputs, ...withoutInput } = updated;
                updated = withoutInput;
            }
        } else if (this.definition) {
            const value = rawInputs
                ? this.valueFromRawInputs(rule.fieldId, rule.operatorId, this.valueFromRule(rule), rawInputs)
                : this.valueFromRule(rule);
            if (value === undefined) {
                const { value: _currentValue, ...withoutValue } = updated;
                updated = withoutValue;
            } else {
                updated = { ...updated, value };
            }
            if (rawInputs) {
                updated = { ...updated, rawInputs: { ...rawInputs } };
            } else {
                const { rawInputs: _currentRawInputs, ...withoutRawInputs } = updated;
                updated = withoutRawInputs;
            }
        }
        next[index] = updated;
        if (identityChanged) {
            this.cancelOptionRequest();
        }
        this.commitTokens(next);
        if (identityChanged) {
            this.refreshOptions();
        }
    }

    private valueFromRule(rule: QueryBuilderRule): JsonValue | undefined {
        switch (rule.operand.kind) {
            case 'none':
                return undefined;
            case 'scalar':
                return rule.operand.value;
            case 'collection':
                return rule.operand.values.map(value => this.decodeOptionValue(rule.fieldId, rule.operatorId, value));
            case 'range':
                return { start: rule.operand.start, end: rule.operand.end };
            case 'key':
                return { key: rule.operand.key };
            case 'key-value':
                return { key: rule.operand.key, value: rule.operand.value };
            default:
                return undefined;
        }
    }

    private getEffectiveSchema(fieldId: string, operatorId: string): QueryBuilderDefinition['fields'][number]['valueSchema'] | undefined {
        const field = this.definition?.fields.find(candidate => candidate.id === fieldId);
        const operator = this.portableOperator(fieldId, operatorId);
        if (!field || !operator) {
            return undefined;
        }
        if (operator.operand.kind === 'schema') {
            return operator.operand.schema;
        }
        if (operator.operand.kind === 'range') {
            return operator.operand.endpointSchema;
        }
        return field.valueSchema;
    }

    private parseRawInput(
        value: string,
        schema: QueryBuilderDefinition['fields'][number]['valueSchema'] | undefined
    ): JsonPrimitive {
        if (value === '') {
            const type = schema === undefined ? undefined : getSimpleSchemaType(schema);
            return type === 'number' || type === 'integer' ? null : '';
        }
        const type = schema === undefined ? undefined : getSimpleSchemaType(schema);
        if (type === 'number' || type === 'integer') {
            const numberValue = Number(value);
            return Number.isFinite(numberValue) ? numberValue : null;
        }
        return value;
    }

    private valueFromRawInputs(
        fieldId: string,
        operatorId: string,
        currentValue: JsonValue | undefined,
        rawInputs: Readonly<{ [key: string]: string }>
    ): JsonValue | undefined {
        const operator = this.portableOperator(fieldId, operatorId);
        if (!operator) {
            return undefined;
        }
        if (Object.prototype.hasOwnProperty.call(rawInputs, '/value')) {
            if (operator.operand.kind === 'field-value-list') {
                return this.parseCollectionInput(rawInputs['/value']!);
            }
            return this.parseRawInput(rawInputs['/value']!, this.getEffectiveSchema(fieldId, operatorId));
        }
        if (operator.operand.kind === 'range') {
            const current = isRecord(currentValue) ? currentValue : {};
            return {
                start: rawInputs['/value/start'] !== undefined
                    ? this.parseRawInput(rawInputs['/value/start'], operator.operand.endpointSchema)
                    : (current.start) ?? null,
                end: rawInputs['/value/end'] !== undefined
                    ? this.parseRawInput(rawInputs['/value/end'], operator.operand.endpointSchema)
                    : (current.end) ?? null
            };
        }
        if (operator.operand.kind === 'schema'
            && (Object.prototype.hasOwnProperty.call(rawInputs, '/value/key')
                || Object.prototype.hasOwnProperty.call(rawInputs, '/value/value'))) {
            const current = isRecord(currentValue) ? currentValue : {};
            return {
                ...current,
                ...(rawInputs['/value/key'] !== undefined ? { key: rawInputs['/value/key'] } : {}),
                ...(rawInputs['/value/value'] !== undefined ? { value: rawInputs['/value/value'] } : {})
            };
        }
        return currentValue;
    }

    private parseCollectionInput(value: string): JsonValue {
        try {
            const parsed: unknown = JSON.parse(value);
            return this.isJsonValue(parsed) ? parsed : value;
        } catch (error) {
            if (error instanceof SyntaxError) {
                return value;
            }
            throw error;
        }
    }

    private staticChoiceValues(schema: QueryBuilderDefinition['fields'][number]['valueSchema']): readonly JsonPrimitive[] {
        if (typeof schema === 'boolean') {
            return [];
        }
        if (Array.isArray(schema.oneOf)) {
            const values: JsonPrimitive[] = [];
            for (const item of schema.oneOf) {
                if (isRecord(item) && isJsonPrimitive(item.const)) {
                    values.push(item.const);
                }
            }
            return values;
        }
        return Array.isArray(schema.enum) ? schema.enum.filter(isJsonPrimitive) : [];
    }

    private encodeOptionValue(fieldId: string, operatorId: string, value: JsonPrimitive): string {
        if (this.getOptionSource(fieldId, operatorId) !== undefined) {
            return this.encodeDynamicOption(value);
        }
        const schema = this.getEffectiveSchema(fieldId, operatorId);
        const choices = schema === undefined ? [] : this.staticChoiceValues(schema);
        const index = choices.findIndex(option => Object.is(option, value));
        return index >= 0 ? `option-${index}` : String(value);
    }

    private decodeOptionValue(fieldId: string, operatorId: string, encoded: string): JsonPrimitive {
        const dynamicValue = this.decodeDynamicOption(encoded);
        if (dynamicValue !== undefined) {
            return dynamicValue;
        }
        const match = /^option-(\d+)$/.exec(encoded);
        const schema = this.getEffectiveSchema(fieldId, operatorId);
        if (match && schema !== undefined) {
            const value = this.staticChoiceValues(schema)[Number(match[1])];
            if (value !== undefined || this.staticChoiceValues(schema)[Number(match[1])] === null) {
                return value!;
            }
        }
        return encoded;
    }

    private encodeDynamicOption(value: JsonPrimitive): string {
        return `dynamic:${encodeURIComponent(JSON.stringify(value))}`;
    }

    private decodeDynamicOption(encoded: string): JsonPrimitive | undefined {
        if (!encoded.startsWith('dynamic:')) {
            return undefined;
        }
        try {
            const value: unknown = JSON.parse(decodeURIComponent(encoded.slice('dynamic:'.length)));
            return isJsonPrimitive(value) ? value : undefined;
        } catch {
            return undefined;
        }
    }

    private getRuleState(rule: QueryBuilderRule): 'complete' | 'incomplete' | 'invalid' {
        if (this.hasDuplicateRuleId(rule.id)) {
            return 'invalid';
        }
        if (this.definition) {
            const token = this.editorTokens.find(
                candidate => candidate.kind === 'condition' && candidate.rule.id === rule.id
            );
            if (token?.kind === 'condition') {
                const result = validateQuery({
                    version: 1,
                    root: this.createPredicate(token)
                }, this.definition);
                if (result.valid) {
                    return 'complete';
                }
                return result.issues.some(issue => issue.code === 'incomplete-expression')
                    ? 'incomplete'
                    : 'invalid';
            }
        }
        const field = this.fields.find(candidate => candidate.id === rule.fieldId);
        if (!field) {
            return 'invalid';
        }
        const error = getOperandError(field, rule, this.labels);
        if (!error) {
            return 'complete';
        }
        return error === this.labels.errors.required || error === this.labels.errors.invalidCollection
            ? 'incomplete'
            : 'invalid';
    }

    private formatRuleSummary(rule: QueryBuilderRule): QueryEditorRuleSummary {
        const field = this.fields.find(candidate => candidate.id === rule.fieldId);
        const fieldLabel = field?.label ?? rule.fieldId;
        const operatorLabel = this.operatorSymbol(rule.operatorId);
        const operand = rule.operand;
        let valueLabel = '';
        if (operand.kind === 'none') {
            valueLabel = '';
        } else if (operand.kind === 'collection') {
            if (operand.values.length === 0) {
                valueLabel = this.labels.unset.toLocaleLowerCase();
            } else {
                const labels = operand.values.map(value => this.formatCollectionOptionForField(field, rule, value));
                const shown = labels.slice(0, 2).join(', ');
                const remainder = labels.length > 2 ? ` +${labels.length - 2}` : '';
                valueLabel = `${shown}${remainder}`;
            }
        } else if (operand.kind === 'range') {
            valueLabel = `${operand.start ?? this.labels.unset.toLocaleLowerCase()} - ${operand.end ?? this.labels.unset.toLocaleLowerCase()}`;
        } else if (operand.kind === 'key') {
            valueLabel = operand.key || this.labels.unset.toLocaleLowerCase();
        } else if (operand.kind === 'key-value') {
            valueLabel = `${operand.key || this.labels.unset.toLocaleLowerCase()}: ${operand.value || this.labels.unset.toLocaleLowerCase()}`;
        } else if ((operand.value === null || operand.value === '')
            && !(this.definition && this.editorTokens.some(token => token.kind === 'condition'
                && token.rule.id === rule.id && token.value === operand.value)
                && (this.getOptionSource(rule.fieldId, rule.operatorId)
                    || staticOptions(this.getEffectiveSchema(rule.fieldId, rule.operatorId) ?? true)))) {
            valueLabel = this.labels.unset.toLocaleLowerCase();
        } else if (this.definition && (
            this.getOptionSource(rule.fieldId, rule.operatorId)
            || staticOptions(this.getEffectiveSchema(rule.fieldId, rule.operatorId) ?? true)
        )) {
            valueLabel = this.formatCollectionOptionForField(field, rule, this.encodeOptionValue(rule.fieldId, rule.operatorId, operand.value));
        } else if (typeof operand.value === 'boolean') {
            valueLabel = operand.value ? this.labels.true : this.labels.false;
        } else {
            valueLabel = field?.type === 'enum'
                ? this.formatCollectionOptionForField(field, rule, String(operand.value))
                : String(operand.value);
        }
        const text = [fieldLabel, operatorLabel, valueLabel].filter(Boolean).join(' ');
        return { fieldLabel, operatorLabel, valueLabel, text };
    }

    private formatCollectionOptionForField(field: QueryBuilderField | undefined, rule: QueryBuilderRule, value: string): string {
        if (this.definition) {
            const dynamicValue = this.getOptionSource(rule.fieldId, rule.operatorId)
                ? this.decodeDynamicOption(value)
                : undefined;
            if (dynamicValue !== undefined) {
                const options = 'options' in this.optionState ? this.optionState.options : [];
                const active = this.activeRule?.fieldId === rule.fieldId
                    && this.activeRule.operatorId === rule.operatorId;
                const label = active
                    ? options.find(option => Object.is(option.value, dynamicValue))?.label
                        ?? this.optionLabelCache.get(JSON.stringify(dynamicValue))?.label
                    : undefined;
                return label ?? JSON.stringify(dynamicValue);
            }
            const schema = this.getEffectiveSchema(rule.fieldId, rule.operatorId);
            return (schema === undefined ? undefined : staticOptions(schema))
                ?.find(option => option.value === value)?.label ?? value;
        }
        return field?.options?.find(option => option.value === value)?.label ?? value;
    }

    private operatorSymbol(operatorId: QueryBuilderOperatorId): string {
        const portableLabel = this.definition?.operators.find(operator => operator.id === operatorId)?.label;
        if (portableLabel) {
            return portableLabel;
        }
        const symbols: { [operatorId: string]: string } = {
            'greater-than': '>',
            'greater-or-equal': '≥',
            'less-than': '<',
            'less-or-equal': '≤',
            'not-equals': '≠',
        };
        return symbols[operatorId] ?? this.labels.operators[operatorId] ?? operatorId;
    }

    private getLogicLabel(logic: QueryBuilderLogicalOperator): string {
        return logic === 'and' ? this.labels.and : this.labels.or;
    }

    private getConditionElement(ruleId: string): HTMLElement | null {
        return Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>('[data-rule-id]') ?? [])
            .find(element => element.dataset.ruleId === ruleId) ?? null;
    }

    private openEditor(ruleId: string, trigger: HTMLElement | null): void {
        if (this.disabled) {
            return;
        }
        this.activeEditorTrigger = trigger;
        this.editorPanelArrowOffset = null;
        if (this.activeRuleId !== ruleId) {
            const token = this.editorTokens.find(candidate => candidate.kind === 'condition' && candidate.rule.id === ruleId);
            this.activeRuleSummary = token?.kind === 'condition' ? this.formatRuleSummary(token.rule) : null;
        }
        this.activeRuleId = ruleId;
    }

    private handleEditorTabKeydown(event: KeyboardEvent): boolean {
        if (event.key !== 'Tab' || event.shiftKey || !this.activeRuleId) {
            return false;
        }
        const panel = this.shadowRoot?.querySelector<HTMLElement>('.editor-panel');
        if (!panel) {
            return false;
        }
        const controls = panel.querySelectorAll<HTMLElement>('[data-control]');
        const control = this.findPathElement<HTMLElement>(event, '[data-control]');
        if (controls.length === 0 || control !== controls.item(controls.length - 1)) {
            return false;
        }
        if (control.tagName.toLowerCase() === 'ok-fv-date-time-picker') {
            const picker = control as FvDateTimePicker;
            if (picker.open || event.composedPath()[0] === picker.control) {
                return false;
            }
        }
        if (control.tagName.toLowerCase() === 'ok-fv-multi-select' && (control as FvMultiSelect).open) {
            return false;
        }
        const conditionPosition = this.editorTokens.findIndex(
            token => token.kind === 'condition' && token.rule.id === this.activeRuleId
        );
        if (conditionPosition < 0) {
            return false;
        }

        event.preventDefault();
        this.caretPosition = conditionPosition + 1;
        this.queryInputText = '';
        this.activeSuggestionIndex = 0;
        this.closeEditor(false);
        this.focusQueryInput();
        return true;
    }

    private closeEditor(restoreFocus: boolean): void {
        if (!this.activeRuleId) {
            return;
        }
        this.cancelOptionRequest();
        const trigger = this.activeEditorTrigger;
        this.activeRuleId = null;
        this.activeEditorTrigger = null;
        this.editorPanelArrowOffset = null;
        if (restoreFocus) {
            DOM.queueUpdate(() => trigger?.focus());
        }
    }

    private updateEditorAnchor(): void {
        if (this.editorRegion) {
            const anchor = this.activeEditorTrigger?.isConnected
                ? this.activeEditorTrigger
                : null;
            this.updateEditorPanelAvailableWidth(anchor);
            this.editorRegion.anchorElement = anchor;
            this.editorRegion.update();
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.updateEditorPanelArrowOffset();
                this.focusFirstEditorFieldIfReady();
            });
        });
    }

    private focusFirstEditorFieldIfReady(): void {
        if (!this.shouldFocusFirstEditorField) {
            return;
        }
        const firstField = this.shadowRoot?.querySelector<HTMLElement>('.editor-panel [data-control="field"]');
        if (!firstField) {
            return;
        }
        firstField.focus();
        this.shouldFocusFirstEditorField = this.shadowRoot?.activeElement !== firstField;
    }

    private updateEditorPanelArrowOffset(): void {
        const trigger = this.activeEditorTrigger;
        if (!trigger?.isConnected) {
            this.editorPanelArrowOffset = null;
            return;
        }
        const triggerRect = trigger.getBoundingClientRect();
        this.editorPanelArrowOffset = `${triggerRect.width / 2}px`;
    }

    private updateEditorPanelAvailableWidth(anchor: HTMLElement | null): boolean {
        const container = this.shadowRoot?.querySelector<HTMLElement>('.editor-panel-container');
        if (!anchor?.isConnected || !container?.isConnected) {
            return false;
        }
        const documentWidth = document.documentElement.clientWidth;
        const viewportWidth = documentWidth > 0 ? documentWidth : window.innerWidth;
        const availableWidth = `${Math.max(0, viewportWidth - anchor.getBoundingClientRect().left - 16)}px`;
        if (container.style.getPropertyValue('--editor-panel-available-width') === availableWidth) {
            return false;
        }
        container.style.setProperty('--editor-panel-available-width', availableWidth);
        return true;
    }

    private insertConditionAt(
        position: number,
        rule: QueryBuilderRule
    ): { readonly tokens: QueryEditorToken[], readonly position: number } {
        const tokens = [...this.editorTokens];
        tokens.splice(position, 0, { kind: 'condition', rule, groupId: uniqueId('query-group') });
        let conditionPosition = position;
        const logic = this.defaultLogicAt(position);
        const groupId = this.getGroupIdAtPosition(position);
        if (isTerm(tokens[position - 1])) {
            tokens.splice(conditionPosition, 0, this.createLogicToken(logic, groupId));
            conditionPosition += 1;
        }
        const nextToken = tokens[conditionPosition + 1];
        if (nextToken?.kind === 'condition' || nextToken?.kind === 'open') {
            tokens.splice(conditionPosition + 1, 0, this.createLogicToken(logic, groupId));
        }
        return { tokens, position: conditionPosition };
    }

    private defaultLogicAt(position: number): QueryBuilderLogicalOperator {
        const groupId = this.getGroupIdAtPosition(position);
        for (let index = Math.min(position - 1, this.editorTokens.length - 1); index >= 0; index -= 1) {
            const token = this.editorTokens[index];
            if (token?.kind === 'logic' && this.getGroupIdAtPosition(index) === groupId) {
                return token.logic;
            }
        }
        for (let index = Math.max(0, position); index < this.editorTokens.length; index += 1) {
            const token = this.editorTokens[index];
            if (token?.kind === 'logic' && this.getGroupIdAtPosition(index) === groupId) {
                return token.logic;
            }
        }
        if (groupId) {
            return 'and';
        }
        const queryRoot = this.query?.root;
        if (this.definition && queryRoot?.kind === 'group') {
            return queryRoot.combinator;
        }
        return 'and';
    }

    private getGroupIdAtPosition(
        position: number,
        tokens: readonly QueryEditorToken[] = this.editorTokens
    ): string | undefined {
        const scopes: string[] = [];
        for (let index = 0; index < position; index += 1) {
            const token = tokens[index];
            if (token?.kind === 'open') {
                scopes.push(token.groupId);
            } else if (token?.kind === 'close') {
                scopes.pop();
            }
        }
        return scopes[scopes.length - 1];
    }

    private createLogicToken(logic: QueryBuilderLogicalOperator, groupId: string | undefined): QueryEditorToken {
        return groupId
            ? { kind: 'logic', logic, groupId }
            : { kind: 'logic', logic };
    }

    private focusQueryInput(): void {
        DOM.queueUpdate(() => this.shadowRoot?.querySelector<TextField>('.query-input')?.focus());
    }

    private findPathElement<T extends HTMLElement>(event: Event, selector: string): T | null {
        for (const item of event.composedPath()) {
            if (item instanceof HTMLElement && item.matches(selector)) {
                return item as T;
            }
        }
        return null;
    }

    private createEditorField(fieldDefinition: QueryBuilderDefinition['fields'][number]): QueryBuilderField {
        const operator = this.definition?.operators.find(candidate => fieldDefinition.operatorIds.includes(candidate.id));
        const editor = this.getEffectiveEditor(fieldDefinition.id, operator?.id ?? '');
        let schema = fieldDefinition.valueSchema;
        if (operator?.operand.kind === 'schema') {
            schema = operator.operand.schema;
        } else if (operator?.operand.kind === 'range') {
            schema = operator.operand.endpointSchema;
        }
        const options = staticOptions(schema);
        const effectiveEditor = editor ?? (options ? { kind: 'select' as const } : undefined);
        return {
            id: fieldDefinition.id,
            label: fieldDefinition.label,
            type: editorFieldType(schema, effectiveEditor),
            operators: fieldDefinition.operatorIds as readonly QueryBuilderOperatorId[],
            ...(options ? { options: options.map(option => ({ value: String(option.value), label: option.label })) } : {})
        };
    }

    private getEffectiveEditor(fieldId: string, operatorId: string): QueryBuilderEditorDefinition | undefined {
        const field = this.definition?.fields.find(candidate => candidate.id === fieldId);
        const operator = this.definition?.operators.find(candidate => candidate.id === operatorId);
        if (!field || !operator) {
            return undefined;
        }
        return operator.editor ?? field.editor;
    }

    private supportedOperators(field: QueryBuilderField): readonly QueryBuilderOperatorDefinition[] {
        return this.definition
            ? this.portableOperatorsForField(field.id).map(operator => ({
                id: operator.id as QueryBuilderOperatorId,
                operandKind: editorOperandKind(operator.operand)
            }))
            : getSupportedOperators(field);
    }

    private getEditorOperator(fieldId: string, operatorId: string): QueryBuilderOperatorDefinition | undefined {
        if (!this.definition) {
            return getOperatorDefinition(this.fields.find(field => field.id === fieldId), operatorId);
        }
        const operator = this.portableOperator(fieldId, operatorId);
        return operator
            ? { id: operator.id as QueryBuilderOperatorId, operandKind: editorOperandKind(operator.operand) }
            : undefined;
    }

    private portableOperatorsForField(fieldId: string): readonly QueryBuilderDefinition['operators'][number][] {
        const field = this.definition?.fields.find(candidate => candidate.id === fieldId);
        return this.definition?.operators.filter(operator => field?.operatorIds.includes(operator.id)) ?? [];
    }

    private portableOperator(fieldId: string, operatorId: string): QueryBuilderDefinition['operators'][number] | undefined {
        return this.portableOperatorsForField(fieldId).find(operator => operator.id === operatorId);
    }

    private createRuleForPredicate(predicate: QueryPredicate): QueryBuilderRule {
        const operator = this.portableOperator(predicate.fieldId, predicate.operatorId);
        const operandKind = operator ? editorOperandKind(operator.operand) : 'scalar';
        const operand = createEmptyOperand(operandKind);
        let mappedOperand = operand;
        if (predicate.value !== undefined) {
            if (operand.kind === 'scalar' && isJsonPrimitive(predicate.value)) {
                mappedOperand = { kind: 'scalar', value: predicate.value };
            } else if (operand.kind === 'collection' && Array.isArray(predicate.value)) {
                mappedOperand = {
                    kind: 'collection',
                    values: predicate.value.map(value => (isJsonPrimitive(value)
                        ? this.encodeOptionValue(predicate.fieldId, predicate.operatorId, value)
                        : JSON.stringify(value)))
                };
            } else if (operand.kind === 'range' && isRecord(predicate.value)) {
                const start = predicate.value.start;
                const end = predicate.value.end;
                if ((typeof start === 'string' || typeof start === 'number' || start === null)
                    && (typeof end === 'string' || typeof end === 'number' || end === null)) {
                    mappedOperand = { kind: 'range', start, end };
                }
            } else if ((operand.kind === 'key' || operand.kind === 'key-value') && isRecord(predicate.value)) {
                const key = typeof predicate.value.key === 'string' ? predicate.value.key : '';
                mappedOperand = operand.kind === 'key'
                    ? { kind: 'key', key }
                    : { kind: 'key-value', key, value: typeof predicate.value.value === 'string' ? predicate.value.value : '' };
            }
        }
        return {
            id: uniqueId('query-rule'),
            revision: 0,
            fieldId: predicate.fieldId,
            operatorId: predicate.operatorId as QueryBuilderOperatorId,
            operand: mappedOperand
        };
    }

    private createConditionToken(
        predicate: QueryPredicate,
        groupId: string
    ): Extract<QueryEditorToken, { kind: 'condition' }> {
        const rule = this.createRuleForPredicate(predicate);
        return {
            kind: 'condition',
            rule,
            groupId,
            ...(predicate.value !== undefined ? { value: this.cloneJsonValue(predicate.value) } : {})
        };
    }

    private createPredicate(token: Extract<QueryEditorToken, { kind: 'condition' }>): QueryPredicate {
        if (token.value !== undefined) {
            return {
                kind: 'predicate',
                fieldId: token.rule.fieldId,
                operatorId: token.rule.operatorId,
                value: this.cloneJsonValue(token.value)
            };
        }
        return {
            kind: 'predicate',
            fieldId: token.rule.fieldId,
            operatorId: token.rule.operatorId
        };
    }

    private tokensFromDraft(draft: QueryEditorDraft): readonly QueryEditorToken[] | undefined {
        if (isRecord(draft) && draft.version !== 1) {
            this.setIssues([{
                code: 'unsupported-version',
                target: 'draft',
                path: '/version',
                message: `Draft version "${String(draft.version)}" is not supported.`
            }]);
            return undefined;
        }
        if (!isRecord(draft) || !Array.isArray(draft.tokens)
            || !Number.isInteger(draft.caretPosition) || draft.caretPosition < 0
            || draft.caretPosition > draft.tokens.length || typeof draft.inputText !== 'string'
            || Object.keys(draft).some(key => !['version', 'tokens', 'caretPosition', 'inputText'].includes(key))) {
            this.setIssues([{
                code: 'invalid-draft',
                target: 'draft',
                path: '',
                message: 'The query editor draft shape is invalid.'
            }]);
            return undefined;
        }
        const tokens: QueryEditorToken[] = [];
        const ids = new Set<string>();
        const scopes: string[] = [];
        for (const [index, rawToken] of draft.tokens.entries()) {
            if (!isRecord(rawToken) || typeof rawToken.kind !== 'string') {
                this.setIssues([{
                    code: 'invalid-draft',
                    target: 'draft',
                    path: `/tokens/${index}`,
                    message: 'Draft tokens must be objects with a kind.'
                }]);
                return undefined;
            }
            if (rawToken.kind === 'condition') {
                if (Object.keys(rawToken).some(key => !['kind', 'id', 'fieldId', 'operatorId', 'value', 'rawInputs'].includes(key))
                    || typeof rawToken.id !== 'string' || rawToken.id.length === 0 || typeof rawToken.fieldId !== 'string'
                    || typeof rawToken.operatorId !== 'string'
                    || (rawToken.value !== undefined && !this.isJsonValue(rawToken.value))
                    || (rawToken.rawInputs !== undefined && (!isRecord(rawToken.rawInputs)
                        || Object.entries(rawToken.rawInputs).some(([key, value]) => !['/value', '/value/start', '/value/end', '/value/key', '/value/value'].includes(key)
                            || typeof value !== 'string')))) {
                    this.setIssues([{
                        code: 'invalid-draft',
                        target: 'draft',
                        path: `/tokens/${index}`,
                        message: 'Condition draft tokens require an ID, field, operator, and JSON value.'
                    }]);
                    return undefined;
                }
                if (ids.has(rawToken.id)) {
                    this.setIssues([{
                        code: 'duplicate-id',
                        target: 'draft',
                        path: `/tokens/${index}/id`,
                        message: `Duplicate draft ID "${rawToken.id}".`
                    }]);
                    return undefined;
                }
                ids.add(rawToken.id);
                const rawInputs = rawToken.rawInputs as Readonly<{ [key: string]: string }> | undefined;
                const operator = this.portableOperator(rawToken.fieldId, rawToken.operatorId);
                let allowedRawInputPaths = ['/value'];
                if (operator?.operand.kind === 'range') {
                    allowedRawInputPaths = ['/value/start', '/value/end'];
                } else if (
                    operator?.operand.kind === 'schema'
                    && typeof operator.operand.schema !== 'boolean'
                    && operator.operand.schema.type === 'object'
                ) {
                    allowedRawInputPaths = ['/value/key', '/value/value'];
                }
                if (rawInputs && Object.keys(rawInputs).some(path => !allowedRawInputPaths.includes(path))) {
                    this.setIssues([{
                        code: 'invalid-draft',
                        target: 'draft',
                        path: `/tokens/${index}/rawInputs`,
                        message: 'Raw input paths must match the condition operand.'
                    }]);
                    return undefined;
                }
                const value = rawInputs && Object.keys(rawInputs).length > 0
                    ? this.valueFromRawInputs(
                        rawToken.fieldId,
                        rawToken.operatorId,
                        rawToken.value,
                        rawInputs
                    )
                    : rawToken.value;
                const predicate: QueryPredicate = {
                    kind: 'predicate',
                    fieldId: rawToken.fieldId,
                    operatorId: rawToken.operatorId,
                    ...(value !== undefined ? { value } : {})
                };
                const created = this.createConditionToken(predicate, scopes[scopes.length - 1] ?? uniqueId('query-group'));
                tokens.push({
                    ...created,
                    rule: { ...created.rule, id: rawToken.id },
                    ...(rawInputs ? { rawInputs: { ...rawInputs } } : {})
                });
            } else if (rawToken.kind === 'logic') {
                if (Object.keys(rawToken).some(key => !['kind', 'logic'].includes(key))
                    || (rawToken.logic !== 'and' && rawToken.logic !== 'or')) {
                    this.setIssues([{
                        code: 'invalid-draft',
                        target: 'draft',
                        path: `/tokens/${index}/logic`,
                        message: 'Logical operators must be "and" or "or".'
                    }]);
                    return undefined;
                }
                tokens.push(this.createLogicToken(rawToken.logic, scopes[scopes.length - 1]));
            } else if (rawToken.kind === 'open') {
                if (Object.keys(rawToken).some(key => !['kind', 'id'].includes(key))
                    || typeof rawToken.id !== 'string' || rawToken.id.length === 0 || ids.has(rawToken.id)) {
                    this.setIssues([{
                        code: 'duplicate-id',
                        target: 'draft',
                        path: `/tokens/${index}/id`,
                        message: 'Opening groups require unique IDs.'
                    }]);
                    return undefined;
                }
                ids.add(rawToken.id);
                scopes.push(rawToken.id);
                tokens.push({ kind: 'open', groupId: rawToken.id });
            } else if (rawToken.kind === 'close') {
                if (Object.keys(rawToken).length !== 1) {
                    this.setIssues([{
                        code: 'invalid-draft',
                        target: 'draft',
                        path: `/tokens/${index}`,
                        message: 'Closing group tokens cannot contain additional properties.'
                    }]);
                    return undefined;
                }
                if (scopes.length > 0) {
                    scopes.pop();
                }
                tokens.push({ kind: 'close' });
            } else {
                this.setIssues([{
                    code: 'invalid-draft',
                    target: 'draft',
                    path: `/tokens/${index}/kind`,
                    message: 'Unknown draft token kind.'
                }]);
                return undefined;
            }
        }
        return tokens;
    }

    private cloneQueryDocument(query: QueryDocument): QueryDocument {
        if (query.root === null) {
            return { version: 1, root: null };
        }
        const cloneNode = (node: QueryNode): QueryNode => (node.kind === 'predicate'
            ? {
                ...node,
                ...(node.value !== undefined ? { value: this.cloneJsonValue(node.value) } : {})
            }
            : { ...node, children: node.children.map(cloneNode) });
        return { version: 1, root: cloneNode(query.root) };
    }

    private cloneJsonValue(value: JsonValue): JsonValue {
        if (Array.isArray(value)) {
            return value.map(item => this.cloneJsonValue(item));
        }
        if (isRecord(value)) {
            return Object.fromEntries(
                Object.entries(value).map(([key, item]) => [key, this.cloneJsonValue(item)])
            );
        }
        return value;
    }

    private isJsonValue(value: unknown, seen = new Set<object>()): value is JsonValue {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') {
            return true;
        }
        if (typeof value === 'number') {
            return Number.isFinite(value);
        }
        if (typeof value !== 'object' || seen.has(value)) {
            return false;
        }
        seen.add(value);
        const valid = Array.isArray(value)
            ? value.every(item => this.isJsonValue(item, seen))
            : Object.getPrototypeOf(value) === Object.prototype
                && Object.values(value).every(item => this.isJsonValue(item, seen));
        seen.delete(value);
        return valid;
    }

    private assignQuery(query: QueryDocument): void {
        const detached = this.cloneQueryDocument(query);
        this.internallyAssignedQuery = detached;
        this.query = detached;
    }

    private setIssues(issues: readonly QueryBuilderIssue[]): void {
        this.issues = [...issues];
    }

    private restorePendingInputs(): void {
        if (!this.definition) {
            return;
        }
        if (this.pendingQuery !== undefined) {
            const pendingQuery = this.pendingQuery;
            this.pendingQuery = undefined;
            const validation = validateQuery(pendingQuery, this.definition);
            if (validation.valid) {
                this.externalInputIssues = [];
                this.assignQuery(validation.value);
                this.editorTokens = this.createTokens(validation.value);
                this.assignDraft(this.editorTokens);
                this.caretPosition = this.editorTokens.length;
                this.queryInputText = '';
            } else {
                this.externalInputIssues = validation.issues;
            }
        }
        if (this.pendingDraft !== undefined) {
            const pendingDraft = this.pendingDraft;
            this.pendingDraft = undefined;
            let converted: readonly QueryEditorToken[] | undefined;
            try {
                converted = this.tokensFromDraft(pendingDraft);
            } catch {
                this.setIssues([{
                    code: 'invalid-draft',
                    target: 'draft',
                    path: '',
                    message: 'The query editor draft shape is invalid.'
                }]);
            }
            if (converted) {
                this.externalInputIssues = [];
                this.editorTokens = converted;
                this.assignDraft(converted);
                this.caretPosition = pendingDraft.caretPosition;
                this.queryInputText = pendingDraft.inputText;
                const query = this.createQueryFromTokens();
                if (query && validateQuery(query, this.definition).valid) {
                    this.assignQuery(query);
                }
            } else {
                this.externalInputIssues = [...this.issues];
            }
        }
    }

    private updateValidationState(notify = false): void {
        if (!this.definition) {
            this.setIssues([]);
            return;
        }
        if (this.definitionIssues.length > 0) {
            this.setIssues(this.definitionIssues);
        } else if (this.externalInputIssues.length > 0) {
            this.setIssues(this.externalInputIssues);
        } else if (this.queryInputText.length > 0) {
            this.setIssues([{
                code: 'incomplete-expression',
                target: 'draft',
                path: '/inputText',
                message: this.labels.completeFilterExpression
            }]);
        } else {
            const query = this.createQueryFromTokens();
            const result = query ? validateQuery(query, this.definition) : undefined;
            if (result?.valid) {
                this.setIssues([]);
            } else if (result !== undefined) {
                this.setIssues(result.issues);
            } else {
                this.setIssues([{
                    code: 'incomplete-expression',
                    target: 'draft',
                    path: '/tokens',
                    message: this.labels.completeFilterExpression
                }]);
            }
        }
        const valid = this.valid;
        const issuesChanged = JSON.stringify(this.lastValidityIssues ?? []) !== JSON.stringify(this.issues);
        const shouldNotify = notify && (this.lastValidity !== valid || issuesChanged);
        const detachedIssues = this.issues.map(issue => ({ ...issue }));
        this.lastValidity = valid;
        this.lastValidityIssues = detachedIssues;
        DOM.queueUpdate(() => this.syncEditorControlAccessibility());
        if (shouldNotify) {
            this.dispatchEvent(new CustomEvent('validity-change', {
                bubbles: true,
                composed: true,
                detail: { valid, issues: detachedIssues }
            }));
        }
    }

    private getOptionSource(fieldId: string, operatorId: string): NonNullable<Extract<
        QueryBuilderEditorDefinition,
        { kind: 'select' | 'combobox' }
    >['optionsSource']> | undefined {
        const editor = this.getEffectiveEditor(fieldId, operatorId);
        return editor?.kind === 'select' || editor?.kind === 'combobox'
            ? editor.optionsSource
            : undefined;
    }

    private isDynamicCombobox(fieldId: string, operatorId: string): boolean {
        return this.getEffectiveEditor(fieldId, operatorId)?.kind === 'combobox';
    }

    private refreshOptions(): void {
        const rule = this.activeRule;
        if (this.disabled || !rule || !this.definition) {
            this.cancelOptionRequest();
            return;
        }
        const source = this.getOptionSource(rule.fieldId, rule.operatorId);
        if (!source) {
            this.cancelOptionRequest();
            return;
        }
        if (!isRecord(this.optionContext)
            || Object.values(this.optionContext).some(value => !this.isJsonValue(value))) {
            this.cancelOptionRequest(false);
            this.setOptionState({
                status: 'blocked',
                issues: [{
                    code: 'options-load-failed',
                    target: 'options',
                    path: '/optionContext',
                    message: 'Option context values must be JSON values.'
                }]
            });
            return;
        }
        const contextKey = JSON.stringify([
            rule.fieldId,
            rule.operatorId,
            source.sourceId,
            (source.dependsOn ?? []).map(key => [key, this.optionContext[key]])
        ]);
        if (contextKey !== this.optionContextKey) {
            this.cancelOptionRequest();
            this.optionContextKey = contextKey;
        }
        void this.resolveOptions('', undefined, false);
    }

    private async resolveOptions(searchText: string, cursor?: string, append = false): Promise<void> {
        const rule = this.activeRule;
        if (this.disabled || !rule || !this.definition) {
            return;
        }
        const source = this.getOptionSource(rule.fieldId, rule.operatorId);
        if (!source) {
            this.cancelOptionRequest();
            return;
        }
        if (!isRecord(this.optionContext)
            || Object.values(this.optionContext).some(value => !this.isJsonValue(value))) {
            this.cancelOptionRequest(false);
            this.setOptionState({
                status: 'blocked',
                issues: [{
                    code: 'options-load-failed',
                    target: 'options',
                    path: '/optionContext',
                    message: 'Option context values must be JSON values.'
                }]
            });
            return;
        }
        const dependentValues: { [key: string]: JsonValue } = {};
        const missing = (source.dependsOn ?? []).filter(key => !Object.prototype.hasOwnProperty.call(this.optionContext, key));
        if (missing.length > 0) {
            this.cancelOptionRequest(false);
            this.setOptionState({
                status: 'blocked',
                issues: missing.map(key => ({
                    code: 'missing-option-context',
                    target: 'options',
                    path: `/optionContext/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`,
                    message: `Option context value "${key}" is required.`
                }))
            });
            return;
        }
        (source.dependsOn ?? []).forEach(key => {
            dependentValues[key] = this.cloneJsonValue(this.optionContext[key]!);
        });
        if (!this.optionResolver) {
            this.cancelOptionRequest(false);
            this.setOptionState({
                status: 'blocked',
                issues: [{
                    code: 'missing-option-resolver',
                    target: 'options',
                    path: `/fields/${rule.fieldId}/editor/optionsSource`,
                    message: `No resolver is configured for option source "${source.sourceId}".`
                }]
            });
            return;
        }

        this.optionRequest?.abort();
        const controller = new AbortController();
        this.optionRequestVersion += 1;
        const version = this.optionRequestVersion;
        this.optionRequest = controller;
        const effectiveSearchText = source.searchable === false ? '' : searchText;
        this.optionSearchText = effectiveSearchText;
        if (!append) {
            this.optionPages = [];
            this.optionCursor = undefined;
            this.optionFailedCursor = undefined;
        }
        this.setOptionState({ status: 'loading', options: [...this.optionPages] });
        const request: QueryOptionRequest = {
            sourceId: source.sourceId,
            fieldId: rule.fieldId,
            operatorId: rule.operatorId,
            dependentValues,
            ...(effectiveSearchText.length > 0 ? { searchText: effectiveSearchText } : {}),
            ...(cursor ? { cursor } : {}),
            ...(source.pageSize !== undefined ? { pageSize: source.pageSize } : {})
        };
        try {
            const page = await this.optionResolver.resolve(request, controller.signal);
            if (controller.signal.aborted || version !== this.optionRequestVersion) {
                return;
            }
            if (!this.isOptionPage(page, rule.fieldId, rule.operatorId)) {
                throw new Error('The option resolver returned an invalid option page.');
            }
            for (const option of page.options) {
                this.optionLabelCache.set(JSON.stringify(option.value), { ...option });
            }
            const merged = append ? [...this.optionPages, ...page.options] : [...page.options];
            const unique = new Map<string, QueryOption>();
            for (const option of merged) {
                const key = JSON.stringify(option.value);
                unique.set(key, option);
            }
            this.optionPages = [...unique.values()];
            this.optionCursor = page.nextCursor;
            this.optionFailedCursor = undefined;
            this.setOptionState({
                status: 'ready',
                options: [...this.optionPages],
                ...(page.nextCursor ? { nextCursor: page.nextCursor } : {})
            });
        } catch (error) {
            if (controller.signal.aborted || version !== this.optionRequestVersion) {
                return;
            }
            const failure = isRecord(error) ? error as Partial<QueryOptionFailure> : undefined;
            const code = failure?.code === 'unknown-option-source' ? 'unknown-option-source' : 'options-load-failed';
            let message = 'Option loading failed.';
            if (typeof failure?.message === 'string') {
                message = failure.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            const issues: QueryBuilderIssue[] = [{
                code,
                target: 'options',
                path: `/fields/${rule.fieldId}/editor/optionsSource`,
                message
            }];
            this.setOptionState({
                status: 'error',
                options: this.optionPages.map(option => ({ ...option, disabled: true })),
                issues
            });
            this.optionFailedCursor = cursor;
            this.dispatchEvent(new CustomEvent('options-error', {
                bubbles: true,
                composed: true,
                detail: { issues: issues.map(issue => ({ ...issue })) }
            }));
        }
    }

    private isOptionPage(value: unknown, fieldId: string, operatorId: string): value is QueryOptionPage {
        if (!isRecord(value) || !Array.isArray(value.options)
            || (value.nextCursor !== undefined && typeof value.nextCursor !== 'string')) {
            return false;
        }
        return value.options.every(option => {
            if (!isRecord(option) || !isJsonPrimitive(option.value) || typeof option.label !== 'string'
                || (option.disabled !== undefined && typeof option.disabled !== 'boolean')) {
                return false;
            }
            if (option.disabled) {
                return true;
            }
            const operator = this.portableOperator(fieldId, operatorId);
            if (operator?.operand.kind === 'field-value-list') {
                const schema = this.getEffectiveSchema(fieldId, operatorId);
                return schema !== undefined && isValidSchemaValue(option.value, schema);
            }
            return validateQuery({
                version: 1,
                root: {
                    kind: 'predicate',
                    fieldId,
                    operatorId,
                    value: option.value
                }
            }, this.definition).valid;
        });
    }

    private setOptionState(state: QueryOptionState): void {
        this.optionState = state;
        this.dispatchEvent(new CustomEvent('options-state-change', {
            bubbles: true,
            composed: true,
            detail: { state: this.cloneOptionState(state) }
        }));
    }

    private cloneOptionState(state: QueryOptionState): QueryOptionState {
        if (state.status === 'blocked') {
            return { status: state.status, issues: state.issues.map(issue => ({ ...issue })) };
        }
        if (state.status === 'error') {
            return {
                status: state.status,
                options: state.options.map(option => ({ ...option })),
                issues: state.issues.map(issue => ({ ...issue }))
            };
        }
        if (state.status === 'ready') {
            return {
                status: state.status,
                options: state.options.map(option => ({ ...option })),
                ...(state.nextCursor ? { nextCursor: state.nextCursor } : {})
            };
        }
        if (state.status === 'loading') {
            return { status: state.status, options: state.options.map(option => ({ ...option })) };
        }
        return { status: 'idle' };
    }

    private cancelOptionRequest(clearPages = true): void {
        this.optionRequest?.abort();
        this.optionRequest = undefined;
        this.optionRequestVersion += 1;
        if (clearPages) {
            this.optionPages = [];
            this.optionCursor = undefined;
            this.optionFailedCursor = undefined;
            this.optionLabelCache?.clear();
            this.optionContextKey = '';
            if (this.optionState.status !== 'idle') {
                this.setOptionState({ status: 'idle' });
            }
        }
    }
}

const okFvQueryEditor = FvQueryEditor.compose({
    baseName: 'fv-query-editor',
    template,
    styles,
    shadowOptions: { delegatesFocus: true }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvQueryEditor());
export const fvQueryEditorTag = 'ok-fv-query-editor';
