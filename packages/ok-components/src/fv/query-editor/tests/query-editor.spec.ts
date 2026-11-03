import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import {
    FvQueryEditor,
    fvQueryEditorTag,
    MAX_QUERY_GROUP_DEPTH,
    type QueryBuilderDefinition,
    type QueryBuilderOperand,
    type JsonValue,
    type QueryDocument,
    type QueryNode,
    type QueryOptionPage,
    type QueryOptionRequest,
    type QueryEditorDraft,
    type QueryEditorDraftToken,
    type QueryEditorEventDetail
} from '..';
import { validateDefinition, validateQuery } from '../../query-builder/portable-interface';

type ValueControl = HTMLElement & { value: string };

const portableDefinition: QueryBuilderDefinition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            valueSchema: {
                oneOf: [
                    { const: 'failed', title: 'Failed' },
                    { const: 'passed', title: 'Passed' },
                    { const: 'error', title: 'Error' }
                ]
            },
            operatorIds: ['in', 'is', 'is-any-of'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration',
            valueSchema: { type: 'number', minimum: 0 },
            operatorIds: ['gt', 'greater-than', 'between']
        },
        {
            id: 'date',
            path: '/date',
            label: 'Date',
            valueSchema: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
            operatorIds: ['eq']
        },
        {
            id: 'started-at',
            path: '/startedAt',
            label: 'Started at',
            valueSchema: { type: 'string', format: 'date' },
            operatorIds: ['before'],
            editor: { kind: 'date' }
        },
        {
            id: 'workspace',
            path: '/workspace',
            label: 'Workspace',
            valueSchema: { type: ['string', 'number'] },
            operatorIds: ['eq'],
            editor: {
                kind: 'select',
                optionsSource: { sourceId: 'workspaces', dependsOn: ['tenantId'], pageSize: 1 }
            }
        }
    ],
    operators: [
        { id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } },
        { id: 'is', label: 'Is', operand: { kind: 'field-value' } },
        { id: 'is-any-of', label: 'Is any of', operand: { kind: 'field-value-list' } },
        { id: 'gt', label: 'Greater than', operand: { kind: 'field-value' } },
        { id: 'greater-than', label: 'Greater than', operand: { kind: 'field-value' } },
        {
            id: 'between',
            label: 'Between',
            operand: { kind: 'range', endpointSchema: { type: 'number', minimum: 0 } }
        },
        { id: 'before', label: 'Before', operand: { kind: 'field-value' } },
        { id: 'eq', label: 'Equals', operand: { kind: 'field-value' } }
    ]
};

function portableQueryWithNestedGroups(depth: number): QueryDocument {
    const predicate: QueryNode = {
        kind: 'predicate',
        fieldId: 'duration',
        operatorId: 'gt',
        value: 10
    };
    let node: QueryNode = predicate;
    for (let level = 0; level < depth; level += 1) {
        node = { kind: 'group', combinator: 'and', children: [predicate, node] };
    }
    return {
        version: 1,
        root: {
            kind: 'group',
            combinator: 'and',
            children: [predicate, node]
        }
    };
}

interface TestRule {
    readonly id: string;
    readonly fieldId: string;
    readonly operatorId: string;
    readonly operand: QueryBuilderOperand;
}

const testDrafts = new WeakMap<QueryDocument, QueryEditorDraft>();

function rule(id: string, fieldId: string, operatorId: string, operand: QueryBuilderOperand): TestRule {
    return { id, fieldId, operatorId, operand };
}

function valueForOperand(operand: QueryBuilderOperand): JsonValue | undefined {
    switch (operand.kind) {
        case 'none':
            return undefined;
        case 'scalar':
            return operand.value;
        case 'collection':
            return [...operand.values];
        case 'range':
            return { start: operand.start, end: operand.end };
        case 'key':
            return { key: operand.key };
        case 'key-value':
            return { key: operand.key, value: operand.value };
        default:
            return undefined;
    }
}

function queryWithLogic(logic: 'and' | 'or', ...rules: TestRule[]): QueryDocument {
    const tokens: QueryEditorDraftToken[] = [];
    rules.forEach((condition, index) => {
        if (index > 0) {
            tokens.push({ kind: 'logic', logic });
        }
        const value = valueForOperand(condition.operand);
        tokens.push({
            kind: 'condition',
            id: condition.id,
            fieldId: condition.fieldId,
            operatorId: condition.operatorId,
            ...(value === undefined ? {} : { value })
        });
    });

    const predicates: QueryNode[] = rules.map(condition => {
        const value = valueForOperand(condition.operand);
        return {
            kind: 'predicate',
            fieldId: condition.fieldId,
            operatorId: condition.operatorId,
            ...(value === undefined ? {} : { value })
        };
    });
    let root: QueryNode | null = null;
    if (predicates.length === 1) {
        root = predicates[0]!;
    } else if (predicates.length > 1) {
        root = { kind: 'group', combinator: logic, children: predicates };
    }
    const document: QueryDocument = { version: 1, root };
    testDrafts.set(document, { version: 1, tokens, caretPosition: tokens.length, inputText: '' });
    return document;
}

function queryWithGroups(
    logic: 'and' | 'or',
    ...groups: { readonly id: string, readonly logic: 'and' | 'or', readonly rules: TestRule[] }[]
): QueryDocument {
    const tokens: QueryEditorDraftToken[] = [];
    const nodes: QueryNode[] = [];
    groups.forEach((group, groupIndex) => {
        if (groupIndex > 0) {
            tokens.push({ kind: 'logic', logic });
        }
        const predicates = group.rules.map(condition => {
            const value = valueForOperand(condition.operand);
            return {
                kind: 'predicate' as const,
                fieldId: condition.fieldId,
                operatorId: condition.operatorId,
                ...(value === undefined ? {} : { value })
            };
        });
        nodes.push(predicates.length > 1
            ? { kind: 'group', combinator: group.logic, children: predicates }
            : predicates[0]!);
        if (group.rules.length > 1) {
            tokens.push({ kind: 'open', id: group.id });
        }
        group.rules.forEach((condition, ruleIndex) => {
            if (ruleIndex > 0) {
                tokens.push({ kind: 'logic', logic: group.logic });
            }
            const value = valueForOperand(condition.operand);
            tokens.push({
                kind: 'condition',
                id: condition.id,
                fieldId: condition.fieldId,
                operatorId: condition.operatorId,
                ...(value === undefined ? {} : { value })
            });
        });
        if (group.rules.length > 1) {
            tokens.push({ kind: 'close' });
        }
    });
    let root: QueryNode | null = null;
    if (nodes.length === 1) {
        root = nodes[0]!;
    } else if (nodes.length > 1) {
        root = { kind: 'group', combinator: logic, children: nodes };
    }
    const document: QueryDocument = { version: 1, root };
    testDrafts.set(document, { version: 1, tokens, caretPosition: tokens.length, inputText: '' });
    return document;
}

function query(...rules: TestRule[]): QueryDocument {
    return queryWithLogic('and', ...rules);
}

interface TestQueryGroup {
    readonly id: string;
    logic: 'and' | 'or';
    readonly rules: TestRule[];
}

interface TestQueryView {
    readonly logic: 'and' | 'or';
    readonly groups: TestQueryGroup[];
}

function operandFromValue(value: JsonValue | undefined): QueryBuilderOperand {
    if (value === undefined) {
        return { kind: 'none' };
    }
    if (Array.isArray(value)) {
        return value.every(item => typeof item === 'string')
            ? { kind: 'collection', values: value }
            : { kind: 'none' };
    }
    if (typeof value === 'object' && value !== null) {
        const start = value.start;
        const end = value.end;
        if ((typeof start === 'string' || typeof start === 'number' || start === null || start === undefined)
            && (typeof end === 'string' || typeof end === 'number' || end === null || end === undefined)
            && ('start' in value || 'end' in value)) {
            return {
                kind: 'range',
                start: start ?? null,
                end: end ?? null
            };
        }
        if (typeof value.key === 'string' && typeof value.value === 'string') {
            return { kind: 'key-value', key: value.key, value: value.value };
        }
        if (typeof value.key === 'string') {
            return { kind: 'key', key: value.key };
        }
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
        return { kind: 'scalar', value };
    }
    return { kind: 'none' };
}

function queryView(editor: FvQueryEditor): TestQueryView {
    const groups: TestQueryGroup[] = [];
    const stack: TestQueryGroup[] = [];
    let logic: 'and' | 'or' = editor.query?.root?.kind === 'group'
        ? editor.query.root.combinator
        : 'and';
    let nextGroup = 0;
    const addRule = (token: Extract<QueryEditorDraftToken, { kind: 'condition' }>): TestRule => ({
        id: token.id,
        fieldId: token.fieldId,
        operatorId: token.operatorId,
        operand: operandFromValue(token.value)
    });
    const flush = (group: TestQueryGroup): void => {
        if (stack.length > 0) {
            stack[stack.length - 1]!.rules.push(...group.rules);
        } else {
            groups.push(group);
        }
    };

    for (const token of editor.draft.tokens) {
        if (token.kind === 'open') {
            stack.push({ id: token.id, logic: 'and', rules: [] });
        } else if (token.kind === 'close') {
            const group = stack.pop();
            if (group) {
                flush(group);
            }
        } else if (token.kind === 'condition') {
            if (stack.length > 0) {
                stack[stack.length - 1]!.rules.push(addRule(token));
            } else {
                groups.push({ id: `test-group-${nextGroup}`, logic: 'and', rules: [addRule(token)] });
                nextGroup += 1;
            }
        } else if (stack.length > 0) {
            stack[stack.length - 1]!.logic = token.logic;
        } else {
            logic = token.logic;
        }
    }

    while (stack.length > 0) {
        flush(stack.pop()!);
    }
    return { logic, groups };
}

async function setup(
    initialQuery: QueryDocument = { version: 1, root: null },
    definition: QueryBuilderDefinition = portableDefinition
): Promise<Fixture<FvQueryEditor>> {
    const result = await fixture<FvQueryEditor>(html`
        <${fvQueryEditorTag} label="Query conditions"></${fvQueryEditorTag}>
    `);
    result.element.definition = definition;
    result.element.query = initialQuery;
    await result.connect();
    await waitForUpdatesAsync();
    const initialDraft = testDrafts.get(initialQuery);
    if (initialDraft) {
        result.element.draft = initialDraft;
        await waitForUpdatesAsync();
    }
    return result;
}

async function setupPortable(initialQuery: QueryDocument = { version: 1, root: null }): Promise<Fixture<FvQueryEditor>> {
    return await setup(initialQuery);
}

function getOptionState(editor: FvQueryEditor): FvQueryEditor['optionState'] {
    return editor.optionState;
}

async function waitForCalloutAlignment(root: ShadowRoot, chip: HTMLElement, frame = 0): Promise<void> {
    await new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
    });
    await waitForUpdatesAsync();

    const panel = root.querySelector<HTMLElement>('.editor-panel-container');
    const arrow = root.querySelector<HTMLElement>('.editor-panel-arrow');
    if (panel && arrow) {
        const chipRect = chip.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const arrowRect = arrow.getBoundingClientRect();
        if (
            Math.abs(panelRect.left - chipRect.left) <= 1
            && Math.abs(arrowRect.left + arrowRect.width / 2 - chipRect.left - chipRect.width / 2) <= 1
        ) {
            return;
        }
    }
    if (frame === 19) {
        throw new Error('The editor callout did not align with its condition chip');
    }
    await waitForCalloutAlignment(root, chip, frame + 1);
}

async function waitForFieldFocus(root: ShadowRoot, field: HTMLElement, frame = 0): Promise<void> {
    if (root.activeElement === field) {
        return;
    }
    if (frame === 19) {
        throw new Error('The first editor field did not receive focus');
    }
    await new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
    });
    await waitForUpdatesAsync();
    await waitForFieldFocus(root, field, frame + 1);
}

describe('FvQueryEditor', () => {
    let element: FvQueryEditor;
    let disconnect: (() => Promise<void>) | undefined;

    function getRequiredElement<T extends HTMLElement>(selector: string): T {
        const found = element.shadowRoot?.querySelector<T>(selector);
        if (!found) {
            throw new Error(`Expected element matching selector ${selector}`);
        }
        return found;
    }

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('renders an empty, focused-editable field without a separate Add filter action', async () => {
        ({ element, disconnect } = await setup());

        expect(element.valid).toBeTrue();
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const placeholder = 'Type to add a condition · Tab to complete · Delete to remove';
        expect(queryInput.getAttribute('placeholder')).toBe(placeholder);
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        expect(nativeInput?.placeholder).toBe(placeholder);
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        const canvasContext = document.createElement('canvas').getContext('2d');
        if (!canvasContext) {
            throw new Error('Expected a canvas context to measure the placeholder');
        }
        canvasContext.font = getComputedStyle(nativeInput).font;
        expect(nativeInput.clientWidth).toBeGreaterThanOrEqual(canvasContext.measureText(placeholder).width);
        expect(getComputedStyle(nativeInput).textAlign).toBe('left');
        expect(parseFloat(getComputedStyle(nativeInput).textIndent)).toBeGreaterThan(0);
        expect(queryInput.tagName.toLowerCase()).toBe('nimble-text-field');
        expect(element.shadowRoot?.querySelector('.conditions-heading span')).toBeNull();
        expect(element.shadowRoot?.querySelector('.condition-chip')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="add-filter"]')).toBeNull();
    });

    it('shows one Add condition preview after the focused caret and hides it while typing or blurred', async () => {
        ({ element, disconnect } = await setup());
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).toBeNull();
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the query input.');
        }
        nativeInput.focus();
        await waitForUpdatesAsync();
        let preview = getRequiredElement<HTMLElement>('.condition-chip-preview');
        expect(preview.textContent?.trim()).toBe('Add condition');
        expect(queryInput.parentElement?.nextElementSibling).toBe(preview);
        expect(element.shadowRoot?.querySelectorAll('.condition-chip-preview, .logic-chip-preview').length).toBe(1);
        expect(preview.shadowRoot?.querySelector('button')?.getAttribute('aria-haspopup')).toBe('dialog');

        nativeInput.value = 's';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.condition-chip-preview, .logic-chip-preview')).toBeNull();
        nativeInput.value = '';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        preview = getRequiredElement<HTMLElement>('.condition-chip-preview');
        preview.focus();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).toBe(preview);
        const previewButton = preview.shadowRoot?.querySelector<HTMLButtonElement>('button');
        if (!previewButton) {
            throw new Error('Expected the condition preview button.');
        }
        previewButton.blur();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).toBeNull();
    });

    (['inline', 'formatted'] as const).forEach(layout => {
        it(`keeps the ${layout} condition preview through Safari pointer focus loss until click`, async () => {
            ({ element, disconnect } = await setup());
            element.layout = layout;
            await waitForUpdatesAsync();
            const queryInput = getRequiredElement<ValueControl>('.query-input');
            const input = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
            if (!input) {
                throw new Error('Expected the query input.');
            }
            input.focus();
            await waitForUpdatesAsync();
            const preview = getRequiredElement<HTMLElement>('.condition-chip-preview');
            const button = preview.shadowRoot?.querySelector<HTMLButtonElement>('button');
            if (!button) {
                throw new Error('Expected the condition preview button.');
            }
            const pointerdown = new PointerEvent('pointerdown', {
                bubbles: true, composed: true, cancelable: true, pointerType: 'mouse', button: 0
            });
            button.dispatchEvent(pointerdown);
            // Safari blurs the input without focusing the button unless pointerdown is canceled.
            if (!pointerdown.defaultPrevented) {
                input.blur();
            }
            await waitForUpdatesAsync();
            expect(element.shadowRoot?.querySelector('.condition-chip-preview')).toBe(preview);
            expect(element.ruleCount).toBe(0);
            button.click();
            await waitForUpdatesAsync();
            expect(element.ruleCount).toBe(1);
            expect(element.activeRuleId).not.toBeNull();
            const condition = getRequiredElement<HTMLElement>(`[data-rule-id="${element.activeRuleId}"]`);
            expect(element.editorRegion?.anchorElement).toBe(condition);
            expect(element.shadowRoot?.querySelector('.editor-panel')).not.toBeNull();
        });
    });

    it('keeps focus in the query input when clicking the logic preview before adding a condition', async () => {
        ({ element, disconnect } = await setup(query(
            rule('existing', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const input = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the query input.');
        }
        input.focus();
        await waitForUpdatesAsync();
        const logic = getRequiredElement<HTMLElement>('.logic-chip-preview');
        const pointerdown = new PointerEvent('pointerdown', {
            bubbles: true, composed: true, cancelable: true, pointerType: 'mouse', button: 0
        });
        logic.dispatchEvent(pointerdown);
        if (!pointerdown.defaultPrevented) {
            input.blur();
        }
        await waitForUpdatesAsync();
        logic.click();
        await waitForUpdatesAsync();
        expect(element.editorTokens.map(token => token.kind)).toEqual(['condition', 'logic']);
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).not.toBeNull();
    });

    (['inline', 'formatted'] as const).forEach(layout => {
        it(`hides insertion previews away from the end of ${layout} expressions`, async () => {
            ({ element, disconnect } = await setup(query(
                rule('first', 'status', 'is', { kind: 'scalar', value: 'failed' }),
                rule('second', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
            )));
            element.layout = layout;
            await waitForUpdatesAsync();
            getRequiredElement<HTMLElement>('.query-input').focus();
            await waitForUpdatesAsync();
            expect(element.shadowRoot?.querySelector('.logic-chip-preview')).not.toBeNull();
            const moveLeft = async (): Promise<void> => {
                const input = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
                if (!input) {
                    throw new Error('Expected the query input.');
                }
                input.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowLeft', bubbles: true, composed: true, cancelable: true
                }));
                await waitForUpdatesAsync();
            };
            await moveLeft();
            expect(element.caretPosition).toBe(2);
            expect(element.shadowRoot?.querySelector('.condition-chip-preview, .logic-chip-preview')).toBeNull();
            await moveLeft();
            expect(element.caretPosition).toBe(1);
            expect(element.shadowRoot?.querySelector('.condition-chip-preview, .logic-chip-preview')).toBeNull();
            await moveLeft();
            expect(element.caretPosition).toBe(0);
            expect(element.shadowRoot?.querySelector('.condition-chip-preview, .logic-chip-preview')).toBeNull();
            element.caretPosition = element.editorTokens.length;
            await waitForUpdatesAsync();
            getRequiredElement<HTMLElement>('.query-input').focus();
            await waitForUpdatesAsync();
            expect(element.shadowRoot?.querySelector('.logic-chip-preview')).not.toBeNull();
            element.caretPosition = 0;
            await waitForUpdatesAsync();
            const input = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
            if (!input) {
                throw new Error('Expected the query input.');
            }
            input.focus();
            await waitForUpdatesAsync();
            input.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', bubbles: true, composed: true, cancelable: true
            }));
            await waitForUpdatesAsync();
            expect(element.ruleCount).toBe(3);
            expect(element.activeRuleId).not.toBeNull();
        });
    });

    it('opens a new condition from its localized preview at the end', async () => {
        ({ element, disconnect } = await setup(query(
            rule('existing', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        element.labels = { ...element.labels, addCondition: 'Create condition' };
        element.defaultField = 'duration';
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('.query-input').focus();
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('.logic-chip-preview').click();
        await waitForUpdatesAsync();
        const preview = getRequiredElement<HTMLElement>('.condition-chip-preview');
        expect(preview.textContent?.trim()).toBe('Create condition');
        expect(preview.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('Create condition');
        preview.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click();
        await waitForUpdatesAsync();

        expect(element.editorTokens.map(token => token.kind)).toEqual(['condition', 'logic', 'condition']);
        expect(element.ruleCount).toBe(2);
        expect(element.activeRule?.fieldId).toBe('duration');
        expect(element.shadowRoot?.querySelector('.editor-panel')).not.toBeNull();
        const newChip = getRequiredElement<HTMLElement>(`[data-rule-id="${element.activeRuleId}"]`);
        expect(element.editorRegion?.anchorElement).toBe(newChip);
        expect(element.shadowRoot?.querySelector('.condition-chip-preview, .logic-chip-preview')).toBeNull();
    });

    it('moves from a logic preview to a condition preview and supports Enter from the input', async () => {
        ({ element, disconnect } = await setup(query(
            rule('existing', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        getRequiredElement<HTMLElement>('.query-input').focus();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelectorAll('.condition-chip-preview, .logic-chip-preview').length).toBe(1);
        getRequiredElement<HTMLElement>('.logic-chip-preview').click();
        await waitForUpdatesAsync();
        expect(element.editorTokens.map(token => token.kind)).toEqual(['condition', 'logic']);
        expect(element.shadowRoot?.querySelectorAll('.condition-chip-preview, .logic-chip-preview').length).toBe(1);
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).not.toBeNull();

        const input = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the query input.');
        }
        const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true });
        input.dispatchEvent(enter);
        await waitForUpdatesAsync();
        expect(enter.defaultPrevented).toBeTrue();
        expect(element.editorTokens.map(token => token.kind)).toEqual(['condition', 'logic', 'condition']);
        expect(element.activeRuleId).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.editor-panel')).not.toBeNull();
    });

    it('does not offer a condition preview when no default field is available', async () => {
        ({ element, disconnect } = await setup());
        element.defaultField = 'unavailable';
        getRequiredElement<HTMLElement>('.query-input').focus();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.condition-chip-preview')).toBeNull();
        expect(element.shadowRoot?.querySelector('.no-fields')?.textContent).toBe(element.labels.noAvailableFields);
    });

    it('shows the insertion caret when clicking anywhere in the empty conditions field', async () => {
        ({ element, disconnect } = await setup());

        const editorField = getRequiredElement<HTMLElement>('.editor-field');
        const fieldRect = editorField.getBoundingClientRect();
        editorField.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: fieldRect.right - 8,
            clientY: fieldRect.top + fieldRect.height / 2
        }));
        await waitForUpdatesAsync();

        const queryInput = getRequiredElement<ValueControl>('.query-input');
        await waitForFieldFocus(element.shadowRoot!, queryInput);
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        expect(element.caretPosition).toBe(0);
        expect(queryInput.getAttribute('data-focused')).toBe('true');
        expect(queryInput.parentElement?.getBoundingClientRect().width).toBe(8);
        expect(getComputedStyle(nativeInput).textAlign).toBe('center');
        expect(parseFloat(getComputedStyle(nativeInput, '::placeholder').opacity)).toBe(0);
    });

    it('uses 8px insertion slots and centers the empty text caret', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        const slots = Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>('.insertion-slot') ?? []);
        expect(slots.map(slot => slot.getBoundingClientRect().width)).toEqual([8, 8]);

        const nativeInput = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        expect(getComputedStyle(nativeInput).textAlign).toBe('center');
    });

    it('keeps the first typed character visible when leaving the centered insertion slot', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        const emptyLeftPadding = parseFloat(getComputedStyle(nativeInput).paddingLeft);
        nativeInput.value = 'W';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

        expect(queryInput.getAttribute('data-empty')).toBe('false');
        expect(getComputedStyle(nativeInput).textAlign).not.toBe('center');
        const typedLeftPadding = parseFloat(getComputedStyle(nativeInput).paddingLeft);
        expect(typedLeftPadding).toBe(emptyLeftPadding + 2);

        const canvasContext = document.createElement('canvas').getContext('2d');
        if (!canvasContext) {
            throw new Error('Expected a canvas context to measure the input character');
        }
        canvasContext.font = getComputedStyle(nativeInput).font;
        expect(nativeInput.clientWidth).toBeGreaterThanOrEqual(canvasContext.measureText(nativeInput.value).width);
        expect(nativeInput.scrollWidth).toBeLessThanOrEqual(nativeInput.clientWidth);
        nativeInput.setSelectionRange(0, 0);
        expect(parseFloat(getComputedStyle(nativeInput).paddingLeft)).toBe(typedLeftPadding);
    });

    it('allows typing into the query field and autocompletes matching fields', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        let nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        const openGroup = new KeyboardEvent('keydown', {
            key: '(',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(openGroup);
        await waitForUpdatesAsync();
        expect(openGroup.defaultPrevented).toBeTrue();
        expect(element.shadowRoot?.querySelectorAll('.group-parenthesis')).toHaveSize(1);

        nativeInput = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input') ?? null;
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input after opening a group');
        }
        const keydown = new KeyboardEvent('keydown', {
            key: 's',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(keydown);
        expect(keydown.defaultPrevented).toBeFalse();

        nativeInput.value = 'sta';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(Array.from(element.shadowRoot?.querySelectorAll('.suggestion-label') ?? [])
            .map(suggestion => suggestion.textContent?.trim())).toEqual(['Status', 'Started at']);
    });

    it('opens autocomplete in the top layer while the query input has focus', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        nativeInput.focus();
        nativeInput.value = 'sta';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const listbox = getRequiredElement<HTMLElement>('.suggestions');
        expect(listbox.matches(':popover-open')).toBeTrue();
        nativeInput.blur();
        await waitForUpdatesAsync();
        expect(listbox.matches(':popover-open')).toBeFalse();
    });

    it('uses an accessible listbox for autocomplete with keyboard navigation and selection', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        nativeInput.focus();
        nativeInput.value = 'sta';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const menu = getRequiredElement<HTMLElement>('.suggestions');
        const suggestions = Array.from(menu.querySelectorAll<HTMLElement>('.suggestion'));
        expect(menu.getAttribute('role')).toBe('listbox');
        expect(suggestions.map(suggestion => suggestion.getAttribute('role'))).toEqual(['option', 'option']);
        expect(suggestions.map(suggestion => suggestion.querySelector('.suggestion-label')?.textContent?.trim()))
            .toEqual(['Status', 'Started at']);
        expect(element.activeSuggestionIndex).toBe(0);
        expect(suggestions[0]?.getAttribute('aria-selected')).toBe('true');
        expect(nativeInput.getAttribute('role')).toBe('combobox');
        expect(nativeInput.getAttribute('aria-haspopup')).toBe('listbox');
        expect(nativeInput.getAttribute('aria-expanded')).toBe('true');
        expect(nativeInput.getAttribute('aria-controls')).toBe(menu.id);
        expect((queryInput as ValueControl & { ariaControlsElements?: Element[] }).ariaControlsElements).toEqual([menu]);

        nativeInput.focus();
        const openMenu = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(openMenu);
        await waitForUpdatesAsync();

        expect(openMenu.defaultPrevented).toBeTrue();
        expect(element.activeSuggestionIndex).toBe(1);
        expect(suggestions[1]?.getAttribute('aria-selected')).toBe('true');
        expect(nativeInput.getAttribute('aria-activedescendant')).toBe(suggestions[1]?.id ?? null);
        const activeSuggestion = suggestions[1];
        if (!activeSuggestion) {
            throw new Error('Expected the active suggestion to exist');
        }
        expect(queryInput.ariaActiveDescendantElement).toBe(activeSuggestion);
        expect(suggestions[0]?.matches(':focus')).toBeFalse();
        expect(element.shadowRoot?.activeElement).toBe(queryInput);

        const moveToPrevious = new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(moveToPrevious);
        await waitForUpdatesAsync();

        expect(moveToPrevious.defaultPrevented).toBeTrue();
        expect(element.activeSuggestionIndex).toBe(0);
        expect(suggestions[0]?.getAttribute('aria-selected')).toBe('true');
        expect(nativeInput.getAttribute('aria-activedescendant')).toBe(suggestions[0]?.id ?? null);
        expect(element.shadowRoot?.activeElement).toBe(queryInput);

        const moveToNext = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(moveToNext);
        await waitForUpdatesAsync();

        expect(moveToNext.defaultPrevented).toBeTrue();
        expect(element.activeSuggestionIndex).toBe(1);

        const selectSuggestion = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(selectSuggestion);
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();

        expect(selectSuggestion.defaultPrevented).toBeTrue();
        expect(queryView(element).groups[0]?.rules[0]?.fieldId).toBe('started-at');
        expect(element.activeRuleId).toBe(queryView(element).groups[0]?.rules[0]?.id ?? null);
        expect(element.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();
    });

    it('selects autocomplete suggestions with pointer activation', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        queryInput.value = 'sta';
        queryInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        getRequiredElement<HTMLElement>('.suggestion').click();
        await waitForUpdatesAsync();

        expect(queryView(element).groups[0]?.rules[0]?.fieldId).toBe('status');
        expect(element.activeRuleId).toBe(queryView(element).groups[0]?.rules[0]?.id ?? null);
    });

    it('closes autocomplete and restores query focus when Escape is pressed in the menu', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        nativeInput.value = 'sta';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const openMenu = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(openMenu);
        await waitForUpdatesAsync();

        const firstSuggestion = getRequiredElement<HTMLElement>('.suggestion');
        const escape = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        firstSuggestion.dispatchEvent(escape);
        await waitForUpdatesAsync();

        expect(escape.defaultPrevented).toBeTrue();
        expect(element.queryInputText).toBe('');
        expect(getRequiredElement<HTMLElement>('.suggestions').hidden).toBeTrue();
        expect(element.shadowRoot?.activeElement).toBe(queryInput);
    });

    it('applies combobox semantics to the focused native input', async () => {
        ({ element, disconnect } = await setup());
        const input = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble text field to contain an input');
        }

        expect(input.getAttribute('role')).toBe('combobox');
        expect(input.getAttribute('aria-autocomplete')).toBe('list');
        expect(input.getAttribute('aria-haspopup')).toBe('listbox');
        expect(input.getAttribute('aria-expanded')).toBe('false');
        expect(input.getAttribute('aria-controls')).toBe(element.suggestionListId);
    });

    it('keeps condition-chip spacing stable when the insertion cursor moves', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        element.caretPosition = 0;
        await waitForUpdatesAsync();

        const chips = element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip');
        if (chips?.length !== 2) {
            throw new Error('Expected two condition chips');
        }
        const first = chips[0]!.getBoundingClientRect();
        const second = chips[1]!.getBoundingClientRect();
        const initialGap = second.left - first.right;
        expect(second.top).toBe(first.top);

        element.caretPosition = 1;
        await waitForUpdatesAsync();
        const movedFirst = chips[0]!.getBoundingClientRect();
        const movedSecond = chips[1]!.getBoundingClientRect();
        expect(movedSecond.top).toBe(movedFirst.top);
        expect(movedSecond.left - movedFirst.right).toBeCloseTo(initialGap, 1);
    });

    it('shows a text cursor in trailing editor space', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        await waitForUpdatesAsync();

        const editorField = getRequiredElement<HTMLElement>('.editor-field');
        expect(getComputedStyle(editorField).cursor).toBe('text');
    });

    it('places the insertion cursor after the last condition when trailing space is clicked', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        await waitForUpdatesAsync();

        const editorField = getRequiredElement<HTMLElement>('.editor-field');
        const chips = element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip');
        if (chips?.length !== 2) {
            throw new Error('Expected two condition chips');
        }
        const lastChip = chips[chips.length - 1]!;

        const fieldRect = editorField.getBoundingClientRect();
        editorField.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: fieldRect.right - 8,
            clientY: fieldRect.top + 8
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(Number(lastChip.dataset.tokenIndex) + 1);
    });

    it('places the insertion cursor after the last condition when its trailing slot is clicked', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        await waitForUpdatesAsync();

        const chips = element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip');
        if (chips?.length !== 2) {
            throw new Error('Expected two condition chips');
        }
        const lastChip = chips[chips.length - 1]!;
        const lastPosition = Number(lastChip.dataset.tokenIndex);
        element.caretPosition = 0;
        await waitForUpdatesAsync();

        const trailingSlot = getRequiredElement<HTMLElement>(
            `[data-action="set-caret"][data-position="${lastPosition + 1}"]`
        );
        const slotRect = trailingSlot.getBoundingClientRect();
        trailingSlot.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: slotRect.left + slotRect.width / 2,
            clientY: slotRect.top + slotRect.height / 2
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(lastPosition + 1);
    });

    it('aligns formatted conditions and indents grouped rows without changing the query', async () => {
        const initialQuery = queryWithGroups(
            'or',
            {
                id: 'grouped-rules',
                logic: 'and',
                rules: [
                    rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: ['failed', 'error'] }),
                    rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
                ]
            },
            {
                id: 'standalone-rule-group',
                logic: 'and',
                rules: [rule('standalone-status-rule', 'status', 'is', { kind: 'scalar', value: 'error' })]
            }
        );
        ({ element, disconnect } = await setup(initialQuery));
        const queryChange = jasmine.createSpy('query-change');
        element.addEventListener('query-change', queryChange);
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        const conditionChips = Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip') ?? []);
        const parentheses = Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>('.group-parenthesis') ?? []);
        if (conditionChips.length !== 3 || parentheses.length !== 2) {
            throw new Error('Expected three conditions and one parenthesized group');
        }
        const [firstGroupedChip, secondGroupedChip, standaloneChip] = conditionChips;
        const firstGroupedRect = firstGroupedChip!.getBoundingClientRect();
        const secondGroupedRect = secondGroupedChip!.getBoundingClientRect();
        const standaloneRect = standaloneChip!.getBoundingClientRect();
        expect(Math.abs(firstGroupedRect.left - secondGroupedRect.left)).toBeLessThanOrEqual(1);
        expect(firstGroupedRect.left).toBeGreaterThan(standaloneRect.left);
        expect(parentheses[0]!.getBoundingClientRect().left).toBeLessThan(firstGroupedRect.left);
        expect(parentheses[1]!.getBoundingClientRect().left).toBeGreaterThan(secondGroupedRect.right);
        expect(
            getRequiredElement<HTMLElement>('.logic-chip[data-layout-role="operator"][data-indent="true"]').getBoundingClientRect().left
        ).toBeGreaterThan(firstGroupedRect.right);
        expect(firstGroupedRect.top).toBeLessThan(secondGroupedRect.top);
        expect(secondGroupedRect.top).toBeLessThan(standaloneRect.top);
        expect(element.query).toEqual(initialQuery);
        expect(queryChange).not.toHaveBeenCalled();
    });

    it('keeps incomplete draft structure visible in formatted layout', async () => {
        ({ element, disconnect } = await setup());
        element.draft = {
            version: 1,
            tokens: [
                { kind: 'open', id: 'draft-group' },
                {
                    kind: 'condition',
                    id: 'draft-status-rule',
                    fieldId: 'status',
                    operatorId: 'is',
                    value: 'failed'
                },
                { kind: 'logic', logic: 'and' }
            ],
            caretPosition: 3,
            inputText: ''
        };
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        expect(element.shadowRoot?.querySelectorAll('.group-parenthesis')).toHaveSize(1);
        expect(element.shadowRoot?.querySelector('.condition-chip[data-layout-role="condition"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.logic-chip[data-layout-role="operator"][data-indent="true"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.query-input')).not.toBeNull();
    });

    it('formats four nested group levels and rejects queries nested beyond the limit', async () => {
        const validQuery = portableQueryWithNestedGroups(MAX_QUERY_GROUP_DEPTH);
        ({ element, disconnect } = await setupPortable(validQuery));
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        expect(element.valid).toBeTrue();
        const conditionIndents = element.parts
            .filter(part => part.kind === 'condition')
            .map(part => part.indentLevel);
        expect(conditionIndents).toContain(MAX_QUERY_GROUP_DEPTH);
        expect(element.shadowRoot?.querySelector(
            `.condition-chip[data-indent-level="${MAX_QUERY_GROUP_DEPTH}"]`
        )).not.toBeNull();
        const conditionLeftByDepth = Array.from({ length: MAX_QUERY_GROUP_DEPTH + 1 }, (_, depth) => {
            const chip = element.shadowRoot?.querySelector<HTMLElement>(`.condition-chip[data-indent-level="${depth}"]`);
            if (!chip) {
                throw new Error(`Expected a condition at indentation depth ${depth}`);
            }
            return chip.getBoundingClientRect().left;
        });
        for (let depth = 1; depth < conditionLeftByDepth.length; depth += 1) {
            expect(conditionLeftByDepth[depth]).toBeGreaterThan(conditionLeftByDepth[depth - 1]!);
        }

        element.query = portableQueryWithNestedGroups(MAX_QUERY_GROUP_DEPTH + 1);
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();
        expect(element.issues[0]?.message).toContain(`${MAX_QUERY_GROUP_DEPTH} levels`);
        expect(element.query).toEqual(validQuery);
    });

    it('moves and indents immediately after typing opening parentheses', async () => {
        ({ element, disconnect } = await setupPortable());
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        const typeOpeningParenthesis = async (): Promise<void> => {
            const nativeInput = getRequiredElement<ValueControl>('.query-input')
                .shadowRoot?.querySelector<HTMLInputElement>('input');
            if (!nativeInput) {
                throw new Error('Expected the query field to contain an input');
            }
            nativeInput.focus();
            const keydown = new KeyboardEvent('keydown', {
                key: '(',
                bubbles: true,
                composed: true,
                cancelable: true
            });
            nativeInput.dispatchEvent(keydown);
            await waitForUpdatesAsync();
            expect(keydown.defaultPrevented).toBeTrue();
            const currentQueryInput = getRequiredElement<ValueControl>('.query-input');
            expect(element.shadowRoot?.activeElement).toBe(currentQueryInput);
            expect(currentQueryInput.shadowRoot?.activeElement).not.toBeNull();
            expect(currentQueryInput.closest<HTMLElement>('.formatted-row')?.dataset.indentLevel)
                .toBe(String(element.caretPosition));
            const groupOpenings = Array.from(
                element.shadowRoot?.querySelectorAll<HTMLElement>('.group-parenthesis[data-layout-role="group-open"]') ?? []
            );
            const opening = groupOpenings[groupOpenings.length - 1];
            if (!opening) {
                throw new Error('Expected the typed opening parenthesis to be rendered');
            }
            expect(currentQueryInput.getBoundingClientRect().left)
                .toBeGreaterThanOrEqual(opening.getBoundingClientRect().right);
        };

        await typeOpeningParenthesis();
        expect(element.caretPosition).toBe(1);
        await typeOpeningParenthesis();
        expect(element.caretPosition).toBe(2);

        const queryInput = getRequiredElement<ValueControl>('.query-input');
        queryInput.value = 'status';
        queryInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const groupOpenings = Array.from(
            element.shadowRoot?.querySelectorAll<HTMLElement>('.group-parenthesis[data-layout-role="group-open"]') ?? []
        );
        expect(groupOpenings.map(group => group.closest<HTMLElement>('.formatted-row')?.dataset.indentLevel))
            .toEqual(['1', '2']);
        const currentQueryInput = getRequiredElement<ValueControl>('.query-input');
        expect(element.queryInputText).toBe('status');
        expect(currentQueryInput.getBoundingClientRect().left)
            .toBeGreaterThanOrEqual(groupOpenings[1]!.getBoundingClientRect().right);
    });

    it('indents opening parentheses for each nested group level', async () => {
        ({ element, disconnect } = await setupPortable(portableQueryWithNestedGroups(MAX_QUERY_GROUP_DEPTH)));
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        const groupOpeningLeftByDepth = Array.from(
            element.shadowRoot?.querySelectorAll<HTMLElement>('.group-parenthesis[data-layout-role="group-open"]') ?? [],
            group => group.getBoundingClientRect().left
        );
        expect(groupOpeningLeftByDepth.length).toBe(MAX_QUERY_GROUP_DEPTH);
        for (let depth = 1; depth < groupOpeningLeftByDepth.length; depth += 1) {
            expect(groupOpeningLeftByDepth[depth]).toBeGreaterThan(groupOpeningLeftByDepth[depth - 1]!);
        }
    });

    it('uses the clicked row for formatted trailing-space caret placement', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: ['failed', 'error'] }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        element.layout = 'formatted';
        await waitForUpdatesAsync();

        const editorField = getRequiredElement<HTMLElement>('.editor-field');
        const chips = Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip') ?? []);
        const firstChip = chips[0];
        const lastChip = chips[chips.length - 1];
        if (!firstChip || !lastChip) {
            throw new Error('Expected two condition chips');
        }
        const fieldRect = editorField.getBoundingClientRect();
        const firstRect = firstChip.getBoundingClientRect();
        const lastRect = lastChip.getBoundingClientRect();
        const trailingX = fieldRect.right - 8;
        expect(trailingX).toBeGreaterThan(lastRect.right);

        editorField.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: trailingX,
            clientY: firstRect.top + firstRect.height / 2
        }));
        await waitForUpdatesAsync();
        expect(element.caretPosition).toBe(Number(firstChip.dataset.tokenIndex) + 2);

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        editorField.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: trailingX,
            clientY: lastRect.top + lastRect.height / 2
        }));
        await waitForUpdatesAsync();
        expect(element.caretPosition).toBe(Number(lastChip.dataset.tokenIndex) + 1);
    });

    it('keeps the insertion cursor after the last condition when the trailing query input is clicked', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        element.style.width = '1000px';
        await waitForUpdatesAsync();

        const chips = element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip');
        if (chips?.length !== 2) {
            throw new Error('Expected two condition chips');
        }
        const lastChip = chips[chips.length - 1]!;
        const lastPosition = Number(lastChip.dataset.tokenIndex);
        element.caretPosition = lastPosition + 1;
        await waitForUpdatesAsync();

        const input = getRequiredElement<HTMLElement>('.query-input');
        const inputRect = input.getBoundingClientRect();
        input.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: inputRect.left + inputRect.width / 2,
            clientY: inputRect.top + inputRect.height / 2
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(lastPosition + 1);
    });

    it('preserves wrapped insertion slots and places trailing clicks after the last condition', async () => {
        ({ element, disconnect } = await setup(queryWithGroups(
            'or',
            {
                id: 'group-1',
                logic: 'and',
                rules: [
                    rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
                    rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
                ]
            },
            {
                id: 'group-2',
                logic: 'and',
                rules: [rule('second-status-rule', 'status', 'is', { kind: 'scalar', value: 'error' })]
            }
        )));
        element.style.width = '668px';
        element.caretPosition = 0;
        await waitForUpdatesAsync();

        const editorField = getRequiredElement<HTMLElement>('.editor-field');
        const lastChip = element.shadowRoot?.querySelectorAll<HTMLElement>('.condition-chip').item(2);
        const wrappedSlot = getRequiredElement<HTMLElement>('[data-action="set-caret"][data-position="4"]');
        if (!lastChip) {
            throw new Error('Expected a final condition chip');
        }
        const chipRect = lastChip.getBoundingClientRect();
        const slotRect = wrappedSlot.getBoundingClientRect();
        expect(slotRect.top).toBeLessThan(chipRect.top);
        expect(slotRect.left).toBeGreaterThan(chipRect.right);

        wrappedSlot.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: slotRect.left + slotRect.width / 2,
            clientY: slotRect.top + slotRect.height / 2
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(4);

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        const fieldRect = editorField.getBoundingClientRect();
        const lastChipRect = lastChip.getBoundingClientRect();
        editorField.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: fieldRect.right - 8,
            clientY: lastChipRect.top + lastChipRect.height / 2
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(Number(lastChip.dataset.tokenIndex) + 1);
    });

    it('autocompletes a field and opens the new condition editor', async () => {
        ({ element, disconnect } = await setup());
        const input = getRequiredElement<ValueControl>('.query-input');
        input.value = 'stat';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.suggestion')?.textContent).toContain('Status');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(element.ruleCount).toBe(1);
        expect(queryView(element).groups[0]?.rules[0]?.fieldId).toBe('status');
        expect(element.activeRuleId).toBe(queryView(element).groups[0]?.rules[0]?.id ?? null);
        expect(element.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();
    });

    it('shows the AND chip preview whenever the caret moves to the query end', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        const expectLogicChipPreview = (): void => {
            expect(element.shadowRoot?.querySelectorAll('.logic-chip-preview').length).toBe(1);
            const preview = getRequiredElement<HTMLElement>('.logic-chip-preview');
            expect(preview.dataset.logic).toBe('and');
            const button = preview.shadowRoot?.querySelector('button');
            expect(button && getComputedStyle(button).borderStyle).toBe('dashed');
            expect(getRequiredElement<HTMLElement>('.suggestions').hidden).toBeTrue();
        };
        expect(element.caretPosition).toBe(element.editorTokens.length);
        expectLogicChipPreview();

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.logic-chip-preview')).toBeNull();

        const input = getRequiredElement<ValueControl>('.query-input').shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        input.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true,
            composed: true,
            cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.caretPosition).toBe(element.editorTokens.length);
        expectLogicChipPreview();

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="set-caret"][data-position="1"]').click();
        await waitForUpdatesAsync();
        expect(element.caretPosition).toBe(element.editorTokens.length);
        expectLogicChipPreview();
    });

    it('shows AND in the autocomplete list and inserts it only when selected', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        const input = getRequiredElement<ValueControl>('.query-input');
        input.value = 'a';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const menu = getRequiredElement<HTMLElement>('.suggestions');
        expect(menu.hidden).toBeFalse();
        expect(Array.from(menu.querySelectorAll('.suggestion-label'))
            .map(suggestion => suggestion.textContent?.trim())).toEqual(['AND']);
        expect(element.shadowRoot?.querySelector('.logic-chip-preview')).toBeNull();
        expect(element.shadowRoot?.querySelector('.logic-chip')).toBeNull();

        const nativeInput = input.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        const selectSuggestion = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        nativeInput.dispatchEvent(selectSuggestion);
        await waitForUpdatesAsync();

        expect(selectSuggestion.defaultPrevented).toBeTrue();
        expect(element.queryInputText).toBe('');
        expect(element.shadowRoot?.querySelectorAll('.logic-chip').length).toBe(1);
        expect(getRequiredElement<HTMLElement>('.logic-chip').dataset.logic).toBe('and');
        expect(element.shadowRoot?.querySelector('.logic-chip')?.textContent?.trim()).toBe('AND');
        expect(getRequiredElement<HTMLElement>('.logic-chip').getBoundingClientRect().height).toBe(24);
    });

    it('inserts AND when the end logic-chip preview is clicked', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        getRequiredElement<HTMLElement>('.logic-chip-preview').click();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelectorAll('.logic-chip').length).toBe(1);
        expect(getRequiredElement<HTMLElement>('.logic-chip').dataset.logic).toBe('and');
    });

    it('previews the existing query-level logic operator at the end', async () => {
        const initialQuery = queryWithLogic(
            'or',
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        );
        ({ element, disconnect } = await setup(initialQuery));

        const preview = getRequiredElement<HTMLElement>('.logic-chip-preview');
        expect(preview.dataset.logic).toBe('or');
        expect(preview.textContent?.trim()).toBe('OR');

        preview.click();
        await waitForUpdatesAsync();

        expect(queryView(element).logic).toBe('or');
        expect(Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>('.logic-chip') ?? [])
            .every(chip => chip.dataset.logic === 'or')).toBeTrue();
    });

    it('previews the most recent logic operator at the same level', async () => {
        ({ element, disconnect } = await setup(query(
            rule('first-status', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('middle-duration', 'duration', 'greater-than', { kind: 'scalar', value: 500 }),
            rule('last-started', 'started-at', 'before', { kind: 'scalar', value: '2026-10-22' })
        )));
        let logicIndex = 0;
        const mixedDraft = element.draft.tokens.map(token => {
            if (token.kind !== 'logic') {
                return token;
            }
            const logic = logicIndex === 0 ? 'and' as const : 'or' as const;
            logicIndex += 1;
            return { ...token, logic };
        });
        element.draft = { ...element.draft, tokens: mixedDraft };
        await waitForUpdatesAsync();

        expect(getRequiredElement<HTMLElement>('.logic-chip-preview').dataset.logic).toBe('or');
    });

    it('places the insertion cursor after the last logic chip when that area is clicked', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        getRequiredElement<HTMLElement>('.logic-chip-preview').click();
        await waitForUpdatesAsync();
        element.caretPosition = 0;
        await waitForUpdatesAsync();

        const lastLogicChip = getRequiredElement<HTMLElement>('.logic-chip');
        const chipRect = lastLogicChip.getBoundingClientRect();
        getRequiredElement<HTMLElement>('.editor-field').dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            clientX: chipRect.right + 2,
            clientY: chipRect.top + chipRect.height / 2
        }));
        await waitForUpdatesAsync();

        expect(element.caretPosition).toBe(element.editorTokens.length);
        expect(element.shadowRoot?.activeElement).toBe(getRequiredElement<ValueControl>('.query-input'));
    });

    it('shows OR in the autocomplete list and replaces the existing separator on selection', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        getRequiredElement<HTMLElement>('[data-action="set-caret"][data-position="1"]').click();
        await waitForUpdatesAsync();

        const queryInput = getRequiredElement<ValueControl>('.query-input');
        queryInput.value = 'o';
        queryInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const menu = getRequiredElement<HTMLElement>('.suggestions');
        expect(menu.hidden).toBeFalse();
        expect(Array.from(menu.querySelectorAll('.suggestion-label'))
            .map(suggestion => suggestion.textContent?.trim())).toEqual(['OR']);
        expect(element.shadowRoot?.querySelector('.logic-chip-preview')).toBeNull();
        expect(element.shadowRoot?.querySelectorAll('.logic-chip').length).toBe(1);
        expect(getRequiredElement<HTMLElement>('.logic-chip').dataset.logic).toBe('and');

        getRequiredElement<HTMLElement>('.suggestion').click();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelectorAll('.logic-chip').length).toBe(1);
        expect(getRequiredElement<HTMLElement>('.logic-chip').dataset.logic).toBe('or');
        expect(getRequiredElement<HTMLElement>('.logic-chip').textContent?.trim()).toBe('OR');
        expect(element.queryInputText).toBe('');
    });

    it('supports a parenthesized group and exposes unmatched grouping as invalid', async () => {
        ({ element, disconnect } = await setup());
        let input = getRequiredElement<ValueControl>('.query-input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: '(', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        expect(element.structureError).not.toBe('');

        input = getRequiredElement<ValueControl>('.query-input');
        input.value = 'duration';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        input = getRequiredElement<ValueControl>('.query-input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: ')', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(element.structureError).toBe('');
        expect(queryView(element).groups).toHaveSize(1);
        expect(queryView(element).groups[0]?.rules[0]?.fieldId).toBe('duration');
        expect(element.valid).toBeFalse();
    });

    it('allows typing a closing parenthesis before its opening parenthesis', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        element.caretPosition = element.editorTokens.length;
        await waitForUpdatesAsync();

        let input = getRequiredElement<ValueControl>('.query-input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: ')', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        expect(element.shadowRoot?.querySelector('.group-parenthesis')?.textContent).toBe(')');

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        input = getRequiredElement<ValueControl>('.query-input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: '(', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(element.structureError).toBe('');
        expect(element.valid).toBeTrue();
        expect(queryView(element).groups[0]?.rules[0]?.fieldId).toBe('status');
    });

    it('emits and restores the exact draft for an unfinished expression', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        const initialQuery = element.query;
        let detail: QueryEditorEventDetail | undefined;
        element.addEventListener('query-change', event => {
            detail = (event as CustomEvent<QueryEditorEventDetail>).detail;
        }, { once: true });

        element.caretPosition = 0;
        await waitForUpdatesAsync();
        const input = getRequiredElement<ValueControl>('.query-input')
            .shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        input.dispatchEvent(new KeyboardEvent('keydown', {
            key: '(',
            bubbles: true,
            composed: true,
            cancelable: true
        }));
        await waitForUpdatesAsync();

        expect(detail?.valid).toBeFalse();
        expect(detail?.query).toBeNull();
        expect(detail?.draft.tokens.map(token => token.kind)).toEqual(['open', 'condition']);
        expect(detail?.ruleCount).toBe(1);

        element.draft = detail!.draft;
        await waitForUpdatesAsync();
        expect(element.draft.tokens.map(token => token.kind)).toEqual(['open', 'condition']);
        expect(element.query).toEqual(initialQuery);
    });

    it('inserts a condition before a group close without adding a trailing operator', async () => {
        const initialQuery = queryWithGroups('and', {
            id: 'grouped-rules',
            logic: 'and',
            rules: [
                rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
                rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
            ]
        });
        ({ element, disconnect } = await setup(initialQuery));
        element.caretPosition = element.editorTokens.length - 1;
        await waitForUpdatesAsync();
        element.addFilter();
        await waitForUpdatesAsync();

        expect(element.structureError).toBe('');
        expect(queryView(element).groups[0]?.rules).toHaveSize(3);
        expect(element.editorTokens[element.editorTokens.length - 1]?.kind).toBe('close');
    });

    it('rejects duplicate rule identifiers', async () => {
        const duplicate = rule('duplicate-rule', 'status', 'is', { kind: 'scalar', value: 'failed' });
        ({ element, disconnect } = await setup(query(duplicate, duplicate)));

        expect(element.valid).toBeFalse();
        expect(element.issues.some(issue => issue.code === 'duplicate-id')).toBeTrue();
        expect(element.shadowRoot?.querySelector('[data-rule-id="duplicate-rule"]')).toBeNull();
    });

    it('shows error styling only when invalid condition callouts are closed', async () => {
        ({ element, disconnect } = await setup(query(
            rule('missing-value-rule', 'status', 'is', { kind: 'none' }),
            rule('invalid-value-rule', 'status', 'is', { kind: 'scalar', value: 'unknown' }),
            rule('complete-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));

        const completeButton = getRequiredElement<HTMLElement>('[data-rule-id="complete-rule"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.expandable-chip');
        if (!completeButton) {
            throw new Error('Expected a complete condition chip to contain its button');
        }
        const completeBackground = getComputedStyle(completeButton).backgroundColor;

        for (const [id, state] of [
            ['missing-value-rule', 'incomplete'],
            ['invalid-value-rule', 'invalid']
        ] as const) {
            const chip = getRequiredElement<HTMLElement>(`[data-rule-id="${id}"]`);
            expect(chip.getAttribute('data-state')).toBe(state);

            const button = chip.shadowRoot?.querySelector<HTMLButtonElement>('.expandable-chip');
            if (!button) {
                throw new Error('Expected an incomplete condition chip to contain its button');
            }
            const styles = getComputedStyle(button);
            const channels = styles.color.match(/\d+/g)?.map(Number);
            if (!channels || channels.length < 3) {
                throw new Error('Expected the invalid condition-chip color to use RGB');
            }
            const red = channels[0] ?? 0;
            const green = channels[1] ?? 0;
            const blue = channels[2] ?? 0;
            expect(red).toBeGreaterThan(green);
            expect(red).toBeGreaterThan(blue);
            expect(styles.borderColor).toBe(styles.color);
            expect(styles.backgroundColor).not.toBe(completeBackground);
        }

        const incompleteChip = getRequiredElement<HTMLElement>('[data-rule-id="missing-value-rule"]');
        const incompleteButton = incompleteChip.shadowRoot?.querySelector<HTMLButtonElement>('.expandable-chip');
        if (!incompleteButton) {
            throw new Error('Expected the incomplete condition chip to contain its button');
        }
        const errorColor = getComputedStyle(incompleteButton).color;
        incompleteButton.click();
        await waitForUpdatesAsync();

        expect(element.activeRuleId).toBe('missing-value-rule');
        expect(incompleteChip.hasAttribute('expanded')).toBeTrue();
        expect(getComputedStyle(incompleteButton).color).toBe(getComputedStyle(completeButton).color);
        expect(getComputedStyle(incompleteButton).backgroundColor).toBe(completeBackground);

        getRequiredElement<HTMLElement>('.query-input').focus();
        await waitForUpdatesAsync();

        expect(element.activeRuleId).toBeNull();
        expect(incompleteChip.hasAttribute('expanded')).toBeFalse();
        expect(getComputedStyle(incompleteButton).color).toBe(errorColor);
    });

    it('lets an open child select handle Escape before dismissing the rule editor', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]').click();
        await waitForUpdatesAsync();
        const operatorSelect = getRequiredElement<HTMLElement & { open: boolean }>('[data-control="operator"]');
        operatorSelect.open = true;

        const escape = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        operatorSelect.dispatchEvent(escape);
        await waitForUpdatesAsync();

        expect(escape.defaultPrevented).toBeTrue();
        expect(operatorSelect.open).toBeFalse();
        expect(element.activeRuleId).toBe('status-rule');
    });

    it('supports multiple independent parenthesized groups with separate group logic', async () => {
        ({ element, disconnect } = await setup(query(
            rule('first-status', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('first-duration', 'duration', 'greater-than', { kind: 'scalar', value: 500 }),
            rule('second-started', 'started-at', 'before', { kind: 'scalar', value: '2026-10-22' }),
            rule('second-status', 'status', 'is', { kind: 'scalar', value: 'error' })
        )));

        const enterParenthesis = async (key: '(' | ')', position: number): Promise<void> => {
            element.caretPosition = position;
            await waitForUpdatesAsync();
            const input = getRequiredElement<ValueControl>('.query-input');
            input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
        };

        await enterParenthesis('(', 0);
        await enterParenthesis(')', 4);
        await enterParenthesis('(', 6);
        await enterParenthesis(')', 10);

        expect(queryView(element).groups).toHaveSize(2);
        expect(queryView(element).groups.map(group => group.rules.map(condition => condition.id))).toEqual([
            ['first-status', 'first-duration'],
            ['second-started', 'second-status']
        ]);
        expect(queryView(element).logic).toBe('and');
        expect(queryView(element).groups[0]?.logic).toBe('and');
        expect(queryView(element).groups[1]?.logic).toBe('and');

        getRequiredElement<HTMLElement>('[data-action="toggle-logic"][data-token-index="2"]').click();
        await waitForUpdatesAsync();

        expect(queryView(element).groups[0]?.logic).toBe('or');
        expect(queryView(element).groups[1]?.logic).toBe('and');
        expect(queryView(element).logic).toBe('and');
    });

    it('renders compact block conditions and deletes the focused condition', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: ['failed', 'error'] })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        expect(chip.textContent).toContain('Status Is any of Failed, Error');
        expect(chip.getAttribute('data-state')).toBe('complete');
        expect(chip.querySelector('.condition-operator')?.textContent).toBe('Is any of');
        expect(getComputedStyle(getRequiredElement<HTMLElement>('.condition-operator')).fontWeight).toBe('700');

        const button = chip.shadowRoot?.querySelector<HTMLButtonElement>('button');
        expect(button?.getBoundingClientRect().height).toBe(24);
        button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.ruleCount).toBe(0);
        expect(queryView(element).groups).toHaveSize(0);
    });

    it('includes and bolds the operator in every condition summary', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-is', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('status-is-any-of', 'status', 'is-any-of', { kind: 'collection', values: ['failed', 'error'] }),
            rule('duration-greater-than', 'duration', 'greater-than', { kind: 'scalar', value: 500 }),
            rule('duration-between', 'duration', 'between', { kind: 'range', start: 100, end: 500 }),
            rule('started-before', 'started-at', 'before', { kind: 'scalar', value: '2026-10-22' })
        )));

        const summaries = [
            { id: 'status-is', text: 'Status Is Failed', operator: 'Is' },
            { id: 'status-is-any-of', text: 'Status Is any of Failed, Error', operator: 'Is any of' },
            { id: 'duration-greater-than', text: 'Duration Greater than 500', operator: 'Greater than' },
            { id: 'duration-between', text: 'Duration Between 100 - 500', operator: 'Between' },
            { id: 'started-before', text: 'Started at Before 2026-10-22', operator: 'Before' }
        ];
        for (const summary of summaries) {
            const chip = getRequiredElement<HTMLElement>(`[data-rule-id="${summary.id}"]`);
            const operator = chip.querySelector<HTMLElement>('.condition-operator');
            if (!operator) {
                throw new Error(`Expected an operator in condition chip ${summary.id}`);
            }
            expect(chip.textContent).toContain(summary.text);
            expect(operator.textContent).toBe(summary.operator);
            expect(getComputedStyle(operator).fontWeight).toBe('700');
            expect(chip.getAttribute('accessible-label')).toContain(summary.text);
        }
    });

    it('deletes only the condition chip and preserves adjacent logic for a separate deletion', async () => {
        const groupedQuery = queryWithGroups('and', {
            id: 'grouped-rules',
            logic: 'and',
            rules: [
                rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
                rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
            ]
        });
        ({ element, disconnect } = await setup(groupedQuery));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]');
        chip.shadowRoot?.querySelector<HTMLButtonElement>('button')?.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, composed: true })
        );
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        expect(element.ruleCount).toBe(1);
        expect(element.editorTokens.map(token => token.kind)).toEqual(['open', 'condition', 'logic', 'close']);
        expect(element.shadowRoot?.querySelector('[data-rule-id="duration-rule"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-rule-id="status-rule"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.logic-chip')).not.toBeNull();

        const nativeInput = getRequiredElement<ValueControl>('.query-input')
            .shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        nativeInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Backspace',
            bubbles: true,
            composed: true,
            cancelable: true
        }));
        await waitForUpdatesAsync();

        expect(element.valid).toBeTrue();
        expect(element.editorTokens.map(token => token.kind)).toEqual(['open', 'condition', 'close']);
        expect(queryView(element).groups[0]?.rules.map(condition => condition.id)).toEqual(['status-rule']);
    });

    it('opens and closes a condition popover with focus returned to its chip', async () => {
        ({ element, disconnect } = await setup(query(
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        expect(element.activeRuleId).toBe('duration-rule');
        expect(getRequiredElement<HTMLElement>('[data-control="field"]').tagName.toLowerCase()).toBe('nimble-select');
        expect(getRequiredElement<HTMLElement>('[data-control="operator"]').tagName.toLowerCase()).toBe('nimble-select');
        const editorPanel = getRequiredElement<HTMLElement>('.editor-panel');
        const fieldControl = getRequiredElement<HTMLElement>('[data-control="field"]');
        const operatorControl = getRequiredElement<HTMLElement>('[data-control="operator"]');
        const valueControl = getRequiredElement<ValueControl>('[data-control="scalar-number"]');
        await waitForFieldFocus(element.shadowRoot!, fieldControl);
        expect(element.shadowRoot?.activeElement).toBe(fieldControl);
        expect(valueControl.value).toBe('500');
        expect(valueControl.tagName.toLowerCase()).toBe('nimble-number-field');
        expect(editorPanel.querySelector('label.control-label')).toBeNull();
        expect(fieldControl.textContent?.trim().startsWith(element.labels.field)).toBeTrue();
        expect(operatorControl.textContent?.trim().startsWith(element.labels.operator)).toBeTrue();
        expect(valueControl.textContent?.trim()).toBe(element.labels.value);

        const escape = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        valueControl.dispatchEvent(escape);
        await waitForUpdatesAsync();
        expect(escape.defaultPrevented).toBeTrue();
        expect(element.activeRuleId).toBeNull();
        expect(element.shadowRoot?.activeElement?.tagName.toLowerCase()).toBe('ok-fv-expandable-chip');
    });

    it('shows a localizable close hint in place of the editor error when the condition is valid', async () => {
        ({ element, disconnect } = await setup(query(
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]').click();
        await waitForUpdatesAsync();

        expect(getRequiredElement<HTMLElement>('.editor-hint').textContent?.trim()).toBe('Press Tab to close the editor.');
        expect(element.shadowRoot?.querySelector('.editor-error')).toBeNull();

        element.labels = { ...element.labels, closeEditorHint: 'Tab closes this condition.' };
        await waitForUpdatesAsync();
        expect(getRequiredElement<HTMLElement>('.editor-hint').textContent?.trim()).toBe('Tab closes this condition.');

        const control = getRequiredElement<ValueControl>('[data-control="scalar-number"]');
        control.value = '';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.editor-hint')).toBeNull();
        expect(getRequiredElement<HTMLElement>('.editor-error').textContent?.trim()).toBe(element.activeRuleError);
        expect(element.activeRuleError.length).toBeGreaterThan(0);

        control.value = '500';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.editor-error')).toBeNull();
        expect(getRequiredElement<HTMLElement>('.editor-hint').textContent?.trim()).toBe('Tab closes this condition.');
    });

    it('associates an invalid value with the active editor error message', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'name',
                path: '/name',
                label: 'Name',
                valueSchema: { type: 'string', minLength: 1 },
                operatorIds: ['is'],
                editor: { kind: 'text' }
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        ({ element, disconnect } = await setup(query(
            rule('name-rule', 'name', 'is', { kind: 'none' })
        ), definition));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="name-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const control = getRequiredElement<HTMLElement>('[data-control="scalar-text"]');
        const error = getRequiredElement<HTMLElement>('.editor-error');
        expect(control.getAttribute('aria-invalid')).toBe('true');
        expect(error.id).toBe(element.editorPanelErrorId);
        expect((control as HTMLElement & { ariaErrorMessageElements?: Element[] }).ariaErrorMessageElements).toEqual([error]);
    });

    it('associates a collection error with the chip selector input', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: [] })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const selector = getRequiredElement<HTMLElement>('[data-control="collection-selector"]');
        const input = selector.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input') as
            (HTMLInputElement & { ariaErrorMessageElements?: Element[] }) | null;
        const error = getRequiredElement<HTMLElement>('.editor-error');
        expect(input?.getAttribute('aria-invalid')).toBe('true');
        expect((selector as HTMLElement & { ariaErrorMessageElements?: Element[] }).ariaErrorMessageElements).toEqual([error]);
        expect(input?.ariaErrorMessageElements).toEqual([error]);
    });

    it('uses a numeric editor and numeric values for a numeric oneOf schema', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'value',
                path: '/value',
                label: 'Value',
                valueSchema: { oneOf: [{ type: 'number', maximum: 0 }, { type: 'number', minimum: 1 }] },
                operatorIds: ['is']
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        expect(validateDefinition(definition).valid).toBeTrue();
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'value', operatorId: 'is', value: 5 }
        }, definition).valid).toBeTrue();
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'value', operatorId: 'is', value: -1 }
        }, definition));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();

        const input = getRequiredElement<ValueControl>('[data-control="scalar-number"]');
        input.value = '5';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.draft.tokens[0])).toContain('"value":5');
        expect(JSON.stringify(element.issues)).toBe('[]');
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({ kind: 'predicate', fieldId: 'value', operatorId: 'is', value: 5 }));
        expect(element.valid).toBeTrue();
    });

    it('round-trips free-text lists with commas, quotes, and operator changes', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'name',
                path: '/name',
                label: 'Name',
                valueSchema: { type: 'string' },
                operatorIds: ['in', 'not-in']
            }],
            operators: [
                { id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } },
                { id: 'not-in', label: 'Is not one of', operand: { kind: 'field-value-list' } }
            ]
        };
        const original = ['Test, nightly', 'Integration'];
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'in', value: original }
        }, definition));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();

        let input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        expect(input.value).toBe(JSON.stringify(original));
        expect(input.textContent).toContain('JSON array');
        const nativeInput = input.shadowRoot?.querySelector<HTMLInputElement>('input');
        expect(nativeInput?.ariaDescribedByElements).toEqual([
            getRequiredElement<HTMLElement>('.collection-input-hint')
        ]);
        const nextValues = ['Test, nightly', 'Quote "inside"', ''];
        input.value = JSON.stringify(nextValues);
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.valid).toBeTrue();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate', fieldId: 'name', operatorId: 'in', value: nextValues
        }));

        const operator = getRequiredElement<ValueControl>('[data-control="operator"]');
        operator.value = 'not-in';
        operator.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        expect(input.value).toBe(JSON.stringify(nextValues));
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate', fieldId: 'name', operatorId: 'not-in', value: nextValues
        }));

        const restoredDraft = JSON.parse(JSON.stringify(element.draft)) as QueryEditorDraft;
        element.draft = restoredDraft;
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        expect(getRequiredElement<ValueControl>('[data-control="collection-values"]').value).toBe(JSON.stringify(nextValues));
        expect(element.valid).toBeTrue();
    });

    it('preserves numeric and boolean types in free-entry lists', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [
                { id: 'number', path: '/number', label: 'Number', valueSchema: { type: 'number' }, operatorIds: ['in'] },
                { id: 'boolean', path: '/boolean', label: 'Boolean', valueSchema: { type: 'boolean' }, operatorIds: ['in'] }
            ],
            operators: [{ id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'number', operatorId: 'in', value: [1, 2] }
        }, definition));
        const checkList = async (
            fieldId: string,
            initialValue: readonly (number | boolean)[],
            nextValue: readonly (number | boolean)[]
        ): Promise<void> => {
            element.query = { version: 1, root: { kind: 'predicate', fieldId, operatorId: 'in', value: [...initialValue] } };
            await waitForUpdatesAsync();
            getRequiredElement<HTMLElement>('[data-rule-id]').click();
            await waitForUpdatesAsync();
            const input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
            expect(input.value).toBe(JSON.stringify(initialValue));
            input.value = JSON.stringify(nextValue);
            input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();
            expect(element.valid).toBeTrue();
            expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
                kind: 'predicate', fieldId, operatorId: 'in', value: nextValue
            }));
        };
        await checkList('number', [1, 2], [1, 2.5, -3]);
        const numberInput = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        numberInput.value = '[1,"2"]';
        numberInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();
        expect(element.issues[0]?.code).toBe('invalid-value');
        await checkList('boolean', [true], [true, false]);
    });

    it('preserves invalid collection input in the draft and reports it until corrected', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{ id: 'name', path: '/name', label: 'Name', valueSchema: { type: 'string' }, operatorIds: ['in'] }],
            operators: [{ id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } }]
        };
        const initialQuery: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'in', value: ['first'] }
        };
        ({ element, disconnect } = await setup(initialQuery, definition));
        element.labels = {
            ...element.labels,
            collectionValueLabel: 'Custom JSON array label',
            collectionValueHint: 'Custom JSON array hint',
            errors: { ...element.labels.errors, invalidJsonArray: 'Custom JSON array error' }
        };
        const changes: QueryEditorEventDetail[] = [];
        element.addEventListener('query-change', event => changes.push((event as CustomEvent<QueryEditorEventDetail>).detail));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        let input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        expect(input.textContent).toContain('Custom JSON array label');
        expect(getRequiredElement<HTMLElement>('.collection-input-hint').textContent).toContain('Custom JSON array hint');
        const checkInvalid = async (invalid: string): Promise<void> => {
            input.value = invalid;
            input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();
            expect(element.valid).toBeFalse();
            expect(changes[changes.length - 1]?.query).toBeNull();
            expect(element.activeRuleError).toBe('Custom JSON array error');
            expect(input.shadowRoot?.querySelector<HTMLInputElement>('input')?.ariaErrorMessageElements).toEqual([
                getRequiredElement<HTMLElement>('.editor-error')
            ]);
            expect(JSON.stringify(element.query)).toBe(JSON.stringify(initialQuery));
        };
        await checkInvalid('["first",');
        await checkInvalid('42');
        await checkInvalid('{"value":"first"}');
        input.value = '["first",';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const draft = JSON.parse(JSON.stringify(element.draft)) as QueryEditorDraft;
        expect(draft.tokens[0]?.kind === 'condition' && draft.tokens[0].rawInputs?.['/value']).toBe('["first",');
        element.draft = draft;
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        expect(input.value).toBe('["first",');
        expect(element.valid).toBeFalse();
        input.value = '["first","second"]';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.valid).toBeTrue();
        expect(JSON.stringify(element.query.root)).toContain('"value":["first","second"]');
        expect(input.shadowRoot?.querySelector<HTMLInputElement>('input')?.ariaErrorMessageElements).toEqual([]);
    });

    it('uses the chip selector for multiselect values while retaining option values', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: ['failed'] })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        const selector = getRequiredElement<HTMLElement & {
            optionItems: readonly { value: unknown, label: string }[],
            selectedOptionValues: readonly unknown[]
        }>('[data-control="collection-selector"]');
        expect(selector.tagName.toLowerCase()).toBe('ok-fv-chip-selector');
        expect(selector.optionItems.map(option => option.label)).toEqual(['Failed', 'Passed', 'Error']);
        expect(selector.optionItems.map(option => option.value)).toEqual(['failed', 'passed', 'error']);
        expect(selector.selectedOptionValues).toEqual(['failed']);

        selector.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { selectedOptionValues: ['error'] }
        }));
        await waitForUpdatesAsync();

        expect(queryView(element).groups[0]?.rules[0]?.operand).toEqual({ kind: 'collection', values: ['error'] });
    });

    it('keeps scalar static choices typed and displays their labels instead of encoded values', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'priority',
                path: '/priority',
                label: 'Priority',
                valueSchema: {
                    oneOf: [
                        { const: 1, title: 'Low' },
                        { const: 2, title: 'High' }
                    ]
                },
                operatorIds: ['is'],
                editor: { kind: 'select' }
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'priority', operatorId: 'is', value: 2 }
        }, definition));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();

        const select = getRequiredElement<ValueControl>('[data-control="scalar-select"]');
        expect(select.textContent).toContain('High');
        expect(select.textContent).not.toContain('option-');
        expect(JSON.stringify(element.query.root)).toContain('"value":2');

        select.value = 'option-0';
        select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'priority',
            operatorId: 'is',
            value: 1
        }));
    });

    it('uses the active range endpoint schema to render and parse date controls', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'date-range',
                path: '/date',
                label: 'Date range',
                valueSchema: { type: 'number' },
                operatorIds: ['between-dates']
            }],
            operators: [{
                id: 'between-dates',
                label: 'Between dates',
                operand: { kind: 'range', endpointSchema: { type: 'string', format: 'date' } },
                editor: { kind: 'range' }
            }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: {
                kind: 'predicate',
                fieldId: 'date-range',
                operatorId: 'between-dates',
                value: { start: '2025-01-01', end: '2025-01-31' }
            }
        }, definition));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('[data-control="range-start"]')?.tagName.toLowerCase())
            .toBe('nimble-text-field');
        expect((getRequiredElement<HTMLElement>('[data-control="range-start"]') as HTMLElement & { type: string }).type).toBe('date');
        expect(element.shadowRoot?.querySelector('[data-control="range-start"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('[data-control="scalar-number"]')).toBeNull();
    });

    it('preserves empty string input and validates it against the string schema', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'name',
                path: '/name',
                label: 'Name',
                valueSchema: { type: 'string', minLength: 1 },
                operatorIds: ['is'],
                editor: { kind: 'text' }
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'is', value: 'ready' }
        }, definition));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();

        const input = getRequiredElement<ValueControl>('[data-control="scalar-text"]');
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.draft.tokens[0]).toEqual(jasmine.objectContaining({
            kind: 'condition',
            value: ''
        }));
        expect(element.valid).toBeFalse();
        expect(element.issues[0]?.code).toBe('invalid-value');
    });

    it('shows selectable accessible suggestions for dynamic combobox options', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'workspace',
                path: '/workspace',
                label: 'Workspace',
                valueSchema: { type: 'string' },
                operatorIds: ['is'],
                editor: {
                    kind: 'combobox',
                    optionsSource: { sourceId: 'workspaces', searchable: true }
                }
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'production' }
        }, definition));
        element.optionResolver = {
            resolve: async () => await Promise.resolve({
                options: [
                    { value: 'production', label: 'Production' },
                    { value: 'production-test', label: 'Production test' }
                ]
            })
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();

        const field = getRequiredElement<HTMLElement & { shadowRoot: ShadowRoot, ariaControlsElements?: Element[] }>(
            '[data-control="scalar-text"]'
        );
        const input = field.shadowRoot.querySelector<HTMLInputElement>('input') as
            (HTMLInputElement & { ariaControlsElements?: Element[] });
        input.focus();
        await waitForUpdatesAsync();
        const list = getRequiredElement<HTMLElement>('.dynamic-option-suggestions');
        expect(list.getAttribute('role')).toBe('listbox');
        expect(list.textContent).toContain('Production');
        expect(list.textContent).not.toContain('dynamic:');
        expect(input.getAttribute('role')).toBe('combobox');
        expect(input.getAttribute('aria-controls')).toBe(list.id);
        expect(field.ariaControlsElements).toEqual([list]);

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true }));
        await waitForUpdatesAsync();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'workspace',
            operatorId: 'is',
            value: 'production-test'
        }));
    });

    it('forwards collection searches, cancels stale requests, and shows server-matched options', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'workspace',
                path: '/workspace',
                label: 'Workspace',
                valueSchema: { type: 'string' },
                operatorIds: ['in'],
                editor: { kind: 'combobox', optionsSource: { sourceId: 'workspaces', searchable: true } }
            }],
            operators: [{ id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'in', value: ['existing'] }
        }, definition));
        const pending: {
            readonly request: QueryOptionRequest,
            readonly signal: AbortSignal,
            readonly resolve: (page: QueryOptionPage) => void
        }[] = [];
        element.optionResolver = {
            resolve: async (request, signal) => await new Promise(resolve => {
                pending.push({ request, signal, resolve });
            })
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        const selector = getRequiredElement<HTMLElement>('[data-control="collection-selector"]');
        const input = selector.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input');
        if (!input) {
            throw new Error('Expected the collection selector input.');
        }
        expect(pending.length).toBe(1);
        input.value = 'first';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.value = 'alias';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(pending.map(item => item.request.searchText)).toEqual([undefined, 'first', 'alias']);
        expect(pending[0]?.signal.aborted).toBeTrue();
        expect(pending[1]?.signal.aborted).toBeTrue();
        pending[2]?.resolve({ options: [{ value: 'match', label: 'Assembly' }] });
        pending[1]?.resolve({ options: [{ value: 'stale', label: 'Stale' }] });
        await Promise.resolve();
        await waitForUpdatesAsync();
        expect(element.activeOptions.map(option => option.label)).toEqual(['Assembly']);
        const match = selector.shadowRoot?.querySelector<HTMLElement>('.chip-selector-option');
        expect(match?.textContent?.trim()).toBe('Assembly');
        match?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate', fieldId: 'workspace', operatorId: 'in', value: ['existing', 'match']
        }));
        expect(pending[3]?.request.searchText).toBeUndefined();

        input.value = 'new search';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(pending[4]?.request.searchText).toBe('new search');
        expect(pending[4]?.signal.aborted).toBeTrue();
        expect(pending[5]?.request.searchText).toBeUndefined();
        pending[0]?.resolve({ options: [] });
        pending[3]?.resolve({ options: [] });
        pending[4]?.resolve({ options: [{ value: 'stale', label: 'Stale again' }] });
        pending[5]?.resolve({ options: [{ value: 'current', label: 'Current' }] });
        await Promise.resolve();
        await waitForUpdatesAsync();
        expect(element.activeOptions.map(option => option.label)).toEqual(['Current']);
    });

    it('keeps local filtering for nonsearchable collection options', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'workspace',
                path: '/workspace',
                label: 'Workspace',
                valueSchema: { type: 'string' },
                operatorIds: ['in'],
                editor: { kind: 'combobox', optionsSource: { sourceId: 'workspaces', searchable: false } }
            }],
            operators: [{ id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'in', value: ['existing'] }
        }, definition));
        const requests: QueryOptionRequest[] = [];
        element.optionResolver = {
            resolve: async request => {
                requests.push(request);
                return await Promise.resolve({ options: [{ value: 'production', label: 'Production' }] });
            }
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        const selector = getRequiredElement<HTMLElement>('[data-control="collection-selector"]');
        const input = selector.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input');
        if (!input) {
            throw new Error('Expected the collection selector input.');
        }
        input.value = 'alias';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(selector.shadowRoot?.querySelector('.chip-selector-option')).toBeNull();
        input.value = 'prod';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(selector.shadowRoot?.querySelector('.chip-selector-option')?.textContent?.trim()).toBe('Production');
        expect(requests.length).toBe(1);
    });

    it('forwards collection search text for searchable dynamic selects', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'priority',
                path: '/priority',
                label: 'Priority',
                valueSchema: { type: 'number' },
                operatorIds: ['in'],
                editor: { kind: 'select', optionsSource: { sourceId: 'priorities', searchable: true } }
            }],
            operators: [{ id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'priority', operatorId: 'in', value: [1] }
        }, definition));
        const searches: (string | undefined)[] = [];
        element.optionResolver = {
            resolve: async request => {
                searches.push(request.searchText);
                return await Promise.resolve({ options: [{ value: 2, label: 'High' }] });
            }
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        const selector = getRequiredElement<HTMLElement>('[data-control="collection-selector"]');
        const input = selector.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input');
        if (!input) {
            throw new Error('Expected the collection selector input.');
        }
        input.value = 'important';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        expect(searches).toEqual([undefined, 'important']);
        expect(selector.shadowRoot?.querySelector('.chip-selector-option')?.textContent?.trim()).toBe('High');
    });

    it('uses the selected values after changing from a free-entry list to a dynamic list', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'name', path: '/name', label: 'Name', valueSchema: { type: 'string' }, operatorIds: ['in', 'choose']
            }],
            operators: [
                { id: 'in', label: 'Is one of', operand: { kind: 'field-value-list' } },
                {
                    id: 'choose',
                    label: 'Choose from options',
                    operand: { kind: 'field-value-list' },
                    editor: { kind: 'combobox', optionsSource: { sourceId: 'names', searchable: true } }
                }
            ]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'in', value: ['first'] }
        }, definition));
        element.optionResolver = {
            resolve: async () => await Promise.resolve({ options: [{ value: 'third', label: 'Third' }] })
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        const input = getRequiredElement<ValueControl>('[data-control="collection-values"]');
        input.value = '["first","second"]';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const operator = getRequiredElement<ValueControl>('[data-control="operator"]');
        operator.value = 'choose';
        operator.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        const selector = getRequiredElement<HTMLElement & { open: boolean }>('[data-control="collection-selector"]');
        selector.open = true;
        await waitForUpdatesAsync();
        const option = selector.shadowRoot?.querySelector<HTMLElement>('.chip-selector-option');
        expect(option?.textContent?.trim()).toBe('Third');
        option?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate', fieldId: 'name', operatorId: 'choose', value: ['first', 'second', 'third']
        }));
    });

    it('omits searchText for a nonsearchable dynamic option source', async () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'workspace',
                path: '/workspace',
                label: 'Workspace',
                valueSchema: { type: 'string' },
                operatorIds: ['is'],
                editor: {
                    kind: 'combobox',
                    optionsSource: { sourceId: 'workspaces', searchable: false }
                }
            }],
            operators: [{ id: 'is', label: 'Is', operand: { kind: 'field-value' } }]
        };
        ({ element, disconnect } = await setup({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'production' }
        }, definition));
        const requests: { searchText?: string }[] = [];
        element.optionResolver = {
            resolve: async request => {
                requests.push({ ...(request.searchText !== undefined ? { searchText: request.searchText } : {}) });
                return await Promise.resolve({ options: [{ value: 'production', label: 'Production' }] });
            }
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        const field = getRequiredElement<HTMLElement>('[data-control="scalar-text"]');
        const input = field.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the dynamic combobox to contain an input');
        }
        input.value = 'prod';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await Promise.resolve();

        expect(requests.length).toBeGreaterThan(1);
        expect(requests.every(request => request.searchText === undefined)).toBeTrue();
    });

    it('toggles root and nested group logic independently', async () => {
        ({ element, disconnect } = await setup({
            version: 1,
            root: {
                kind: 'group',
                combinator: 'or',
                children: [
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [
                            { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 1 },
                            { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 2 }
                        ]
                    },
                    { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 3 }
                ]
            }
        }));
        const logicTokenIndices = element.editorTokens.flatMap((token, index) => {
            return token.kind === 'logic' ? [index] : [];
        });
        const nestedLogic = getRequiredElement<HTMLElement>(
            `[data-action="toggle-logic"][data-token-index="${logicTokenIndices[0]}"]`
        );
        const rootLogic = getRequiredElement<HTMLElement>(
            `[data-action="toggle-logic"][data-token-index="${logicTokenIndices[logicTokenIndices.length - 1]}"]`
        );
        rootLogic.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const toggledRoot = element.query.root;
        if (toggledRoot?.kind !== 'group' || toggledRoot.children[0]?.kind !== 'group') {
            throw new Error('Expected root and nested query groups.');
        }
        expect(toggledRoot.combinator).toBe('and');
        expect(toggledRoot.children[0].combinator).toBe('and');

        nestedLogic.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const nested = element.query.root;
        if (nested?.kind !== 'group' || nested.children[0]?.kind !== 'group') {
            throw new Error('Expected a nested group to remain in the query.');
        }
        expect(nested.combinator).toBe('and');
        expect(nested.children[0].combinator).toBe('or');
    });

    it('preserves unfinished query text when disabled and re-enabled', async () => {
        ({ element, disconnect } = await setup());
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        queryInput.value = 'sta';
        queryInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        element.disabled = true;
        await waitForUpdatesAsync();
        element.disabled = false;
        await waitForUpdatesAsync();

        expect(element.queryInputText).toBe('sta');
        expect(element.draft.inputText).toBe('sta');
    });

    it('validates range endpoint references from their own schema root', () => {
        const definition: QueryBuilderDefinition = {
            version: 1,
            fields: [{
                id: 'duration',
                path: '/duration',
                label: 'Duration',
                valueSchema: { type: 'number' },
                operatorIds: ['between']
            }],
            operators: [{
                id: 'between',
                label: 'Between',
                operand: {
                    kind: 'range',
                    endpointSchema: {
                        $defs: { nonnegative: { minimum: 0 } },
                        $ref: '#/$defs/nonnegative',
                        type: 'integer'
                    }
                },
                editor: { kind: 'range' }
            }]
        };
        expect(validateDefinition(definition).valid).toBeTrue();
        expect(validateQuery({
            version: 1,
            root: {
                kind: 'predicate',
                fieldId: 'duration',
                operatorId: 'between',
                value: { start: 1, end: 5 }
            }
        }, definition).valid).toBeTrue();
        expect(validateQuery({
            version: 1,
            root: {
                kind: 'predicate',
                fieldId: 'duration',
                operatorId: 'between',
                value: { start: -1, end: 5 }
            }
        }, definition).valid).toBeFalse();
    });

    it('reports an unsupported key-value editor for malformed property schemas without throwing', () => {
        const definition = {
            version: 1,
            fields: [{
                id: 'metadata',
                path: '/metadata',
                label: 'Metadata',
                valueSchema: { type: 'string' },
                operatorIds: ['has-property']
            }],
            operators: [{
                id: 'has-property',
                label: 'Has property',
                operand: {
                    kind: 'schema',
                    schema: {
                        type: 'object',
                        properties: { first: { type: 'string' }, second: { type: 'string' } },
                        required: ['key', 'value'],
                        additionalProperties: false
                    }
                },
                editor: { kind: 'key-value' }
            }]
        };
        expect(() => validateDefinition(definition)).not.toThrow();
        const result = validateDefinition(definition);
        expect(result.valid).toBeFalse();
        expect(result.valid ? [] : result.issues.map(issue => issue.code)).toContain('unsupported-editor');
    });

    it('enforces multiselect minimum item counts', () => {
        const definition: QueryBuilderDefinition = {
            ...portableDefinition,
            operators: portableDefinition.operators.map(operator => {
                if (operator.id === 'is-any-of') {
                    return { ...operator, operand: { kind: 'field-value-list' as const, minItems: 2 } };
                }
                return operator;
            })
        };
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'status', operatorId: 'is-any-of', value: ['failed'] }
        }, definition).valid).toBeFalse();
        expect(validateQuery({
            version: 1,
            root: { kind: 'predicate', fieldId: 'status', operatorId: 'is-any-of', value: ['failed', 'passed'] }
        }, definition).valid).toBeTrue();
    });

    it('applies a query assigned before its definition', async () => {
        const result = await fixture<FvQueryEditor>(html`<${fvQueryEditorTag}></${fvQueryEditorTag}>`);
        const assignedQuery: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 10 }
        };
        result.element.query = assignedQuery;
        result.element.definition = portableDefinition;
        expect(result.element.query).toEqual(assignedQuery);
        ({ element, disconnect } = result);
        await result.connect();
        await waitForUpdatesAsync();

        expect(element.valid).toBeTrue();
        expect(element.query).toEqual(assignedQuery);
        expect(element.draft.tokens).toHaveSize(1);
    });

    it('rejects malformed runtime query and draft values without throwing', async () => {
        ({ element, disconnect } = await setup());
        expect(() => {
            element.query = null as unknown as QueryDocument;
        }).not.toThrow();
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();

        const cyclicValue: { [key: string]: unknown } = {};
        cyclicValue.self = cyclicValue;
        const malformedDraft = {
            version: 1,
            tokens: [{ kind: 'condition', id: 'bad', fieldId: 'status', operatorId: 'is', value: cyclicValue }],
            caretPosition: 0,
            inputText: ''
        };
        expect(() => {
            element.draft = malformedDraft as unknown as QueryEditorDraft;
        }).not.toThrow();
        await waitForUpdatesAsync();
        expect(element.issues.some(issue => issue.code === 'invalid-draft')).toBeTrue();
    });

    it('blocks malformed dynamic option context without throwing', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
        }));
        const cyclicContext: { [key: string]: unknown } = {};
        cyclicContext.self = cyclicContext;
        element.optionContext = cyclicContext as unknown as { [key: string]: JsonValue };
        element.optionResolver = {
            resolve: async () => await Promise.resolve({ options: [] })
        };

        expect(() => getRequiredElement<HTMLElement>('[data-rule-id]').click()).not.toThrow();
        await waitForUpdatesAsync();
        expect(element.optionState.status).toBe('blocked');
    });

    it('disables stale choices after paging failure and retries the failed page', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
        }));
        const cursors: (string | undefined)[] = [];
        let failedPageAttempts = 0;
        element.optionContext = { tenantId: 'tenant-a' };
        element.optionResolver = {
            resolve: async request => {
                cursors.push(request.cursor);
                if (!request.cursor) {
                    return await Promise.resolve({
                        options: [{ value: 'production', label: 'Production' }],
                        nextCursor: 'page-2'
                    });
                }
                failedPageAttempts += 1;
                if (failedPageAttempts === 1) {
                    throw new Error('Page unavailable');
                }
                return await Promise.resolve({ options: [{ value: 'staging', label: 'Staging' }] });
            }
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();
        element.loadMoreOptions();
        await Promise.resolve();
        await waitForUpdatesAsync();

        expect(element.optionState.status).toBe('error');
        expect(element.activeOptions[0]?.disabled).toBeTrue();
        getRequiredElement<HTMLElement>('.retry-options').click();
        await Promise.resolve();
        await waitForUpdatesAsync();

        expect(cursors).toEqual([undefined, 'page-2', 'page-2']);
        expect(element.optionState.status).toBe('ready');
        expect(element.activeOptions.map(option => option.label)).toEqual(['Production', 'Staging']);
        expect(element.activeOptions[0]?.disabled ?? false).toBeFalse();
    });

    it('closes an open collection selector when the rule editor is dismissed', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is-any-of', { kind: 'collection', values: ['failed'] })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const selector = getRequiredElement<HTMLElement & { open: boolean }>('[data-control="collection-selector"]');
        const input = selector.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input');
        if (!input) {
            throw new Error('Expected the collection selector to contain an input');
        }
        selector.open = true;
        await waitForUpdatesAsync();
        expect(selector.open).toBeTrue();

        const tabFromSelector = new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        input.dispatchEvent(tabFromSelector);
        await waitForUpdatesAsync();
        expect(tabFromSelector.defaultPrevented).toBeTrue();
        expect(element.activeRuleId).toBeNull();

        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const reopenedSelector = getRequiredElement<HTMLElement & { open: boolean }>(
            '[data-control="collection-selector"]'
        );
        expect(reopenedSelector.open).toBeFalse();
    });

    it('aligns the editor panel with the left edge of its condition chip', async () => {
        ({ element, disconnect } = await setup(query(
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        const chipRect = chip.getBoundingClientRect();
        const panel = getRequiredElement<HTMLElement>('.editor-panel');
        const panelContainer = getRequiredElement<HTMLElement>('.editor-panel-container');
        const panelRect = panel.getBoundingClientRect();
        const arrowRect = getRequiredElement<HTMLElement>('.editor-panel-arrow').getBoundingClientRect();
        const panelStyles = getComputedStyle(panel);
        const arrowStyles = getComputedStyle(getRequiredElement<HTMLElement>('.editor-panel-arrow'));

        expect(element.editorRegion?.horizontalDefaultPosition).toBe('right');
        expect(element.editorRegion?.horizontalInset).toBeTrue();
        expect(element.editorRegion?.horizontalPositioningMode).toBe('locktodefault');
        expect(panelRect.left).toBeCloseTo(chipRect.left, 1);
        expect(arrowRect.left + arrowRect.width / 2).toBeCloseTo(chipRect.left + chipRect.width / 2, 1);
        expect(arrowRect.width).toBe(30);
        expect(arrowRect.height).toBe(15);
        expect(arrowRect.top).toBeCloseTo(chipRect.bottom, 1);
        expect(arrowRect.bottom).toBeCloseTo(panelRect.top, 1);
        expect(panelStyles.borderTopStyle).toBe('solid');
        expect(panelStyles.borderRadius).toBe('0px');
        expect(panelStyles.boxShadow).not.toBe('none');
        expect(arrowStyles.zIndex).toBe(panelStyles.zIndex);
        expect(panelStyles.borderTopColor).toBe('rgba(0, 0, 0, 0)');
        expect(panelStyles.backgroundImage).not.toBe('none');
        expect(getComputedStyle(panelContainer, '::before').content).toBe('none');
    });

    it('keeps the scrollable editor panel out of a stacking context for value dropdowns', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        const panel = getRequiredElement<HTMLElement>('.editor-panel');
        const valueSelect = getRequiredElement<HTMLElement & { open: boolean }>('[data-control="scalar-select"]');
        valueSelect.open = true;
        await waitForUpdatesAsync();

        const anchoredRegion = valueSelect.shadowRoot?.querySelector<HTMLElement>('.anchored-region');
        if (!anchoredRegion) {
            throw new Error('Expected the value select to contain an anchored region');
        }

        expect(valueSelect.open).toBeTrue();
        expect(getComputedStyle(panel).backgroundImage).not.toBe('none');
        expect(getComputedStyle(panel).overflow).toBe('auto');
        expect(getComputedStyle(panel).zIndex).toBe('auto');
        expect(Number.parseInt(getComputedStyle(anchoredRegion).zIndex, 10))
            .toBeGreaterThan(0);

        valueSelect.open = false;
        await waitForUpdatesAsync();
    });

    it('opens the value list above its control when the callout is near the viewport bottom', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        element.style.position = 'fixed';
        element.style.left = '16px';
        element.style.top = `${Math.max(0, window.innerHeight - 300)}px`;
        element.style.width = '600px';

        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        const valueSelect = getRequiredElement<HTMLElement & { open: boolean, position: string }>(
            '[data-control="scalar-select"]'
        );
        valueSelect.open = true;
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();

        const listbox = valueSelect.shadowRoot?.querySelector<HTMLElement>('[part="listbox"]');
        const anchoredRegion = valueSelect.shadowRoot?.querySelector<HTMLElement & {
            verticalDefaultPosition: string,
            verticalPositioningMode: string
        }>('.anchored-region');
        if (!listbox || !anchoredRegion) {
            throw new Error('Expected the value select to render an anchored listbox');
        }
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        const selectRect = valueSelect.getBoundingClientRect();
        const listboxRect = listbox.getBoundingClientRect();
        const regionRect = anchoredRegion.getBoundingClientRect();
        expect(valueSelect.position).toBe('above');
        expect(anchoredRegion.verticalDefaultPosition).toBe('top');
        expect(anchoredRegion.verticalPositioningMode).toBe('locktodefault');
        expect(regionRect.bottom).toBeLessThanOrEqual(selectRect.bottom + 1);
        expect(listboxRect.top).toBeLessThan(selectRect.top);
        expect(listboxRect.bottom).toBeLessThanOrEqual(selectRect.bottom + 1);
    });

    it('points the editor callout at each condition chip as it is opened', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        const openRuleAndMeasure = async (ruleId: string): Promise<{
            activeRuleId: string | null,
            pointerError: number | null
        }> => {
            const chip = getRequiredElement<HTMLElement>(`[data-rule-id="${ruleId}"]`);
            const trigger = chip.shadowRoot?.querySelector<HTMLButtonElement>('button');
            if (!trigger) {
                throw new Error(`Expected the ${ruleId} condition chip to expose its button`);
            }
            trigger.click();
            await waitForUpdatesAsync();
            await waitForCalloutAlignment(element.shadowRoot!, chip);

            const chipRect = chip.getBoundingClientRect();
            const arrow = element.shadowRoot?.querySelector<HTMLElement>('.editor-panel-arrow');
            const arrowRect = arrow?.getBoundingClientRect();
            return {
                activeRuleId: element.activeRuleId,
                pointerError: arrowRect
                    ? arrowRect.left + arrowRect.width / 2 - chipRect.left - chipRect.width / 2
                    : null
            };
        };
        const outcomes = [
            await openRuleAndMeasure('status-rule'),
            await openRuleAndMeasure('duration-rule')
        ];

        expect(outcomes.map(outcome => outcome.activeRuleId)).toEqual(['status-rule', 'duration-rule']);
        expect(outcomes.every(outcome => outcome.pointerError !== null && Math.abs(outcome.pointerError) <= 1)).toBeTrue();
    });

    it('keeps the callout pointer on the chip when the panel shifts to fit the viewport', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' }),
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        const viewportWidth = document.documentElement.clientWidth;
        element.style.position = 'fixed';
        element.style.left = `${viewportWidth - 480}px`;
        element.style.top = '0';
        element.style.width = '480px';

        const chip = getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]');
        const trigger = chip.shadowRoot?.querySelector<HTMLButtonElement>('button');
        if (!trigger) {
            throw new Error('Expected the duration condition chip to expose its edit button');
        }
        trigger.click();
        await waitForUpdatesAsync();
        await waitForCalloutAlignment(element.shadowRoot!, chip);

        const chipRect = chip.getBoundingClientRect();
        const panelRect = getRequiredElement<HTMLElement>('.editor-panel').getBoundingClientRect();
        const arrowRect = getRequiredElement<HTMLElement>('.editor-panel-arrow').getBoundingClientRect();
        expect(panelRect.left).toBeCloseTo(chipRect.left, 1);
        expect(arrowRect.left + arrowRect.width / 2).toBeCloseTo(chipRect.left + chipRect.width / 2, 1);
        expect(panelRect.left).toBeGreaterThanOrEqual(0);
        expect(panelRect.right).toBeLessThanOrEqual(viewportWidth);
    });

    it('keeps the condition editor open between controls and closes it when focus leaves', async () => {
        ({ element, disconnect } = await setup(query(
            rule('duration-rule', 'duration', 'greater-than', { kind: 'scalar', value: 500 })
        )));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="duration-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const editorPanel = getRequiredElement<HTMLElement>('.editor-panel');
        const fieldControl = getRequiredElement<HTMLElement>('[data-control="field"]');
        const operatorControl = getRequiredElement<HTMLElement>('[data-control="operator"]');
        expect(editorPanel.querySelector('[data-action="done"]')).toBeNull();
        const triggerButton = chip.shadowRoot?.querySelector<HTMLButtonElement>('button') as
            (HTMLButtonElement & { ariaControlsElements?: Element[] }) | null;
        expect(triggerButton?.ariaControlsElements).toEqual([editorPanel]);

        operatorControl.focus();
        await waitForUpdatesAsync();
        expect(element.activeRuleId).toBe('duration-rule');

        fieldControl.focus();
        await waitForUpdatesAsync();
        expect(element.activeRuleId).toBe('duration-rule');

        getRequiredElement<HTMLElement>('.query-input').focus();
        await waitForUpdatesAsync();

        expect(element.activeRuleId).toBeNull();
        expect(element.shadowRoot?.querySelector('.editor-panel')).toBeNull();
    });

    it('offers an AND chip preview after tabbing past the condition editor', async () => {
        ({ element, disconnect } = await setup(query(
            rule('status-rule', 'status', 'is', { kind: 'scalar', value: 'failed' })
        )));
        element.caretPosition = 0;
        await waitForUpdatesAsync();
        const chip = getRequiredElement<HTMLElement>('[data-rule-id="status-rule"]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const fieldControl = getRequiredElement<HTMLElement>('[data-control="field"]');
        const operatorControl = getRequiredElement<HTMLElement>('[data-control="operator"]');
        const valueControl = getRequiredElement<HTMLElement>('[data-control="scalar-select"]');
        const pressTab = (control: HTMLElement): KeyboardEvent => {
            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                composed: true,
                cancelable: true
            });
            control.dispatchEvent(event);
            return event;
        };

        fieldControl.focus();
        expect(pressTab(fieldControl).defaultPrevented).toBeFalse();
        operatorControl.focus();
        expect(pressTab(operatorControl).defaultPrevented).toBeFalse();
        valueControl.focus();
        const tabFromValue = pressTab(valueControl);
        await waitForUpdatesAsync();

        expect(tabFromValue.defaultPrevented).toBeTrue();
        expect(element.activeRuleId).toBeNull();
        expect(element.caretPosition).toBe(element.editorTokens.length);
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        expect(element.shadowRoot?.activeElement).toBe(queryInput);

        const preview = getRequiredElement<HTMLElement>('.logic-chip-preview');
        expect(preview.dataset.logic).toBe('and');
        expect(getRequiredElement<HTMLElement>('.suggestions').hidden).toBeTrue();

        const nativeInput = queryInput.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!nativeInput) {
            throw new Error('Expected the Nimble text field to contain an input');
        }
        const draftBeforeTab = JSON.stringify(element.draft);
        for (const altKey of [false, true]) {
            for (const control of [nativeInput, preview]) {
                const tab = new KeyboardEvent('keydown', {
                    key: 'Tab',
                    altKey,
                    bubbles: true,
                    composed: true,
                    cancelable: true
                });
                control.dispatchEvent(tab);
                expect(tab.defaultPrevented).toBeFalse();
            }
        }
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.draft)).toBe(draftBeforeTab);
        expect(element.shadowRoot?.querySelector('.logic-chip-preview')).toBe(preview);
    });

    it('round-trips recursive portable queries and indents nested formatted groups', async () => {
        const initialQuery: QueryDocument = {
            version: 1,
            root: {
                kind: 'group',
                combinator: 'or',
                children: [
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [
                            { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 500 },
                            {
                                kind: 'group',
                                combinator: 'or',
                                children: [
                                    { kind: 'predicate', fieldId: 'status', operatorId: 'in', value: ['failed'] },
                                    { kind: 'predicate', fieldId: 'date', operatorId: 'eq', value: '2025-01-01' }
                                ]
                            }
                        ]
                    },
                    { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
                ]
            }
        };
        ({ element, disconnect } = await setupPortable(initialQuery));
        const initialDraft = JSON.parse(JSON.stringify(element.draft)) as QueryEditorDraft;
        const logicTokens = initialDraft.tokens.filter(token => token.kind === 'logic');
        const queryChange = jasmine.createSpy('layout-query-change');
        element.addEventListener('query-change', queryChange);

        expect(element.valid).toBeTrue();
        expect(element.query).toEqual(initialQuery);
        expect(element.draft.tokens.filter(token => token.kind === 'open').length).toBe(2);
        expect(element.draft.tokens.filter(token => token.kind === 'close').length).toBe(2);
        expect(logicTokens.length).toBeGreaterThan(0);
        expect(logicTokens.every(token => Object.keys(token).sort().join(',') === 'kind,logic')).toBeTrue();

        element.layout = 'formatted';
        await waitForUpdatesAsync();
        const groupedConditions = element.parts.filter(part => part.kind === 'condition' && part.indented);
        expect(groupedConditions.length).toBe(3);
        expect(groupedConditions.every(part => part.layoutRow > 0)).toBeTrue();
        expect(element.query).toEqual(initialQuery);
        expect(element.draft).toEqual(initialDraft);

        element.layout = 'inline';
        await waitForUpdatesAsync();
        expect(element.query).toEqual(initialQuery);
        expect(element.draft).toEqual(initialDraft);
        expect(queryChange).not.toHaveBeenCalled();
    });

    it('emits incomplete portable query snapshots and restores invalid scalar text from drafts', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'date', operatorId: 'eq', value: '2025-01-01' }
        }));
        const queryChanges: QueryEditorEventDetail[] = [];
        element.addEventListener('query-change', event => {
            queryChanges.push((event as CustomEvent<QueryEditorEventDetail>).detail);
        });

        const chip = getRequiredElement<HTMLElement>('[data-rule-id]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const dateInput = getRequiredElement<ValueControl>('[data-control="scalar-text"]');
        dateInput.value = 'not-a-date';
        dateInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const invalidDraft = JSON.parse(JSON.stringify(element.draft)) as QueryEditorDraft;
        const conditionToken = invalidDraft.tokens.find(token => token.kind === 'condition');
        expect(conditionToken?.kind).toBe('condition');
        if (conditionToken?.kind !== 'condition') {
            throw new Error('Expected the date condition to remain in the draft.');
        }
        const rawValuePath = '/value';
        expect(conditionToken.rawInputs).toEqual({ [rawValuePath]: 'not-a-date' });
        expect(queryChanges[queryChanges.length - 1]?.query).toBeNull();
        expect(queryChanges[queryChanges.length - 1]?.valid).toBeFalse();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'date',
            operatorId: 'eq',
            value: '2025-01-01'
        }));

        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'date', operatorId: 'eq', value: '2026-03-04' }
        };
        await waitForUpdatesAsync();
        element.draft = invalidDraft;
        await waitForUpdatesAsync();

        getRequiredElement<HTMLElement>('[data-rule-id]').dispatchEvent(
            new MouseEvent('click', { bubbles: true, composed: true })
        );
        await waitForUpdatesAsync();
        const restoredInput = getRequiredElement<ValueControl>('[data-control="scalar-text"]');
        expect(restoredInput.value).toBe('not-a-date');
        expect(element.draft.tokens).toEqual(invalidDraft.tokens);
        expect(element.valid).toBeFalse();
    });

    [
        { fieldId: 'duration', from: 'gt', to: 'greater-than', value: 0 },
        { fieldId: 'status', from: 'in', to: 'is-any-of', value: ['failed', 'error'] }
    ].forEach(testCase => {
        it(`preserves the portable ${testCase.fieldId} value when switching compatible operators`, async () => {
            ({ element, disconnect } = await setupPortable({
                version: 1,
                root: { kind: 'predicate', fieldId: testCase.fieldId, operatorId: testCase.from, value: testCase.value }
            }));
            getRequiredElement<HTMLElement>('[data-rule-id]').click();
            await waitForUpdatesAsync();
            const operator = getRequiredElement<ValueControl>('[data-control="operator"]');
            operator.value = testCase.to;
            operator.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();

            expect(element.valid).toBeTrue();
            expect(element.activeRuleError).toBe('');
            expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
                kind: 'predicate', fieldId: testCase.fieldId, operatorId: testCase.to, value: testCase.value
            }));
            const token = element.draft.tokens.find(candidate => candidate.kind === 'condition');
            expect(JSON.stringify(token?.kind === 'condition' ? token.value : undefined)).toBe(JSON.stringify(testCase.value));
        });
    });

    it('clears incompatible portable values when switching operand kinds', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 500 }
        }));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        const operator = getRequiredElement<ValueControl>('[data-control="operator"]');
        operator.value = 'between';
        operator.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        const token = element.draft.tokens.find(candidate => candidate.kind === 'condition');
        expect(token?.kind === 'condition' ? token.value : undefined).toBeUndefined();
        expect(element.activeRule?.operand).toEqual({ kind: 'range', start: null, end: null });
    });

    it('preserves invalid raw input when switching compatible operators', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 500 }
        }));
        getRequiredElement<HTMLElement>('[data-rule-id]').click();
        await waitForUpdatesAsync();
        const input = getRequiredElement<ValueControl>('[data-control="scalar-number"]');
        input.value = '-1';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        const operator = getRequiredElement<ValueControl>('[data-control="operator"]');
        operator.value = 'greater-than';
        operator.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.valid).toBeFalse();
        expect(element.getActiveScalarValue()).toBe('-1');
        const token = element.draft.tokens.find(candidate => candidate.kind === 'condition');
        expect(token?.kind === 'condition' ? token.rawInputs?.['/value'] : undefined).toBe('-1');
    });

    it('updates the portable draft and emits null query while query text is incomplete', async () => {
        ({ element, disconnect } = await setupPortable());
        const queryChanges: QueryEditorEventDetail[] = [];
        element.addEventListener('query-change', event => {
            queryChanges.push((event as CustomEvent<QueryEditorEventDetail>).detail);
        });
        const queryInput = getRequiredElement<ValueControl>('.query-input');
        queryInput.value = 'stat';
        queryInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.draft.inputText).toBe('stat');
        expect(queryChanges[queryChanges.length - 1]?.query).toBeNull();
        expect(queryChanges[queryChanges.length - 1]?.issues[0]?.code).toBe('incomplete-expression');
    });

    it('reports invalid external queries and preserves drafts across definition changes', async () => {
        const validQuery: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'gt', value: 10 }
        };
        ({ element, disconnect } = await setupPortable(validQuery));
        const validityChanges: { valid: boolean, issues: readonly { code: string }[] }[] = [];
        const configurationErrors: CustomEvent[] = [];
        element.addEventListener('validity-change', event => {
            validityChanges.push((event as CustomEvent<{
                valid: boolean,
                issues: readonly { code: string }[]
            }>).detail);
        });
        element.addEventListener('configuration-error', event => {
            configurationErrors.push(event as CustomEvent);
        });

        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'unknown', operatorId: 'gt', value: 10 }
        };
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();
        expect(element.issues[0]?.code).toBe('unknown-field');
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify(validQuery.root));
        expect(validityChanges[validityChanges.length - 1]?.valid).toBeFalse();

        const savedTokens = JSON.stringify(element.draft.tokens);
        element.definition = {
            ...portableDefinition,
            fields: portableDefinition.fields.map((field, index) => (index === 1
                ? { ...field, operatorIds: ['missing'] }
                : field))
        };
        await waitForUpdatesAsync();
        expect(configurationErrors.length).toBeGreaterThan(0);
        expect(JSON.stringify(element.draft.tokens)).toBe(savedTokens);
        expect(element.issues[0]?.code).toBe('unknown-operator');

        element.definition = portableDefinition;
        await waitForUpdatesAsync();
        element.query = validQuery;
        await waitForUpdatesAsync();
        expect(element.valid).toBeTrue();
        expect(element.issues).toEqual([]);
        expect(validityChanges[validityChanges.length - 1]?.valid).toBeTrue();
    });

    it('resolves typed dynamic options with dependencies and appends later pages', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
        }));
        element.optionContext = { tenantId: 'tenant-a' };
        const requests: { sourceId: string, dependentValues: Readonly<{ [key: string]: unknown }>, cursor?: string }[] = [];
        element.optionResolver = {
            resolve: async request => {
                requests.push({
                    sourceId: request.sourceId,
                    dependentValues: request.dependentValues,
                    ...(request.cursor ? { cursor: request.cursor } : {})
                });
                const page = request.cursor
                    ? { options: [{ value: 2, label: 'Test' }] }
                    : { options: [{ value: 'production', label: 'Production' }], nextCursor: 'next-page' };
                return await Promise.resolve(page);
            }
        };
        const chip = getRequiredElement<HTMLElement>('[data-rule-id]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await Promise.resolve();
        await waitForUpdatesAsync();

        expect(element.optionState.status).toBe('ready');
        expect(requests[0]).toEqual({
            sourceId: 'workspaces',
            dependentValues: { tenantId: 'tenant-a' }
        });
        expect(element.activeOptions.map(option => option.label)).toEqual(['Production']);
        expect(element.activeOptions[0]?.value.startsWith('dynamic:')).toBeTrue();

        element.loadMoreOptions();
        await Promise.resolve();
        await waitForUpdatesAsync();
        expect(requests[1]?.cursor).toBe('next-page');
        expect(element.activeOptions.map(option => option.label)).toEqual(['Production', 'Test']);
        const numericOption = element.activeOptions.find(option => option.label === 'Test');
        if (!numericOption) {
            throw new Error('Expected the numeric dynamic option to be loaded.');
        }
        const select = getRequiredElement<ValueControl>('[data-control="scalar-select"]');
        select.value = numericOption.value;
        select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(JSON.stringify(element.query.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'workspace',
            operatorId: 'eq',
            value: 2
        }));
    });

    it('blocks missing option context and retries typed resolver failures without invalidating the query', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
        }));
        const chip = getRequiredElement<HTMLElement>('[data-rule-id]');
        chip.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.optionState.status).toBe('blocked');
        if (element.optionState.status !== 'blocked') {
            throw new Error('Expected missing dynamic option context to block resolution.');
        }
        expect(element.optionState.issues[0]?.code).toBe('missing-option-context');

        element.optionContext = { tenantId: null };
        await waitForUpdatesAsync();
        expect(element.optionState.status).toBe('blocked');
        if (element.optionState.status !== 'blocked') {
            throw new Error('Expected a missing resolver to block option loading.');
        }
        expect(element.optionState.issues[0]?.code).toBe('missing-option-resolver');

        const optionErrors: CustomEvent[] = [];
        element.addEventListener('options-error', event => optionErrors.push(event as CustomEvent));
        let attempts = 0;
        element.optionResolver = {
            resolve: async request => {
                attempts += 1;
                expect(JSON.stringify(request.dependentValues)).toBe(JSON.stringify({ tenantId: null }));
                if (attempts === 1) {
                    throw Object.assign(new Error('No matching source.'), { code: 'unknown-option-source' });
                }
                return await Promise.resolve({ options: [{ value: 'production', label: 'Production' }] });
            }
        };
        await Promise.resolve();
        await waitForUpdatesAsync();
        const failedOptionState = getOptionState(element);
        expect(failedOptionState.status).toBe('error');
        expect(optionErrors.length).toBe(1);
        expect(failedOptionState.status === 'error' && failedOptionState.issues[0]?.code)
            .toBe('unknown-option-source');
        expect(element.valid).toBeTrue();
        expect(element.issues).toEqual([]);

        element.loadMoreOptions();
        await Promise.resolve();
        await waitForUpdatesAsync();
        expect(attempts).toBe(2);
        expect(element.optionState.status).toBe('ready');
    });

    it('ignores a late option page after its dependency context changes', async () => {
        ({ element, disconnect } = await setupPortable({
            version: 1,
            root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'eq', value: 'production' }
        }));
        element.optionContext = { tenantId: 'tenant-a' };
        const pending: {
            readonly resolve: (page: { options: { value: string, label: string }[] }) => void,
            readonly signal: AbortSignal
        }[] = [];
        element.optionResolver = {
            resolve: async (_request, signal) => {
                const page = await new Promise<{ options: { value: string, label: string }[] }>(resolve => {
                    pending.push({ resolve, signal });
                });
                return page;
            }
        };
        getRequiredElement<HTMLElement>('[data-rule-id]').dispatchEvent(
            new MouseEvent('click', { bubbles: true, composed: true })
        );
        await waitForUpdatesAsync();
        expect(pending.length).toBe(1);

        element.optionContext = { tenantId: 'tenant-b' };
        await waitForUpdatesAsync();
        expect(pending.length).toBe(2);
        expect(pending[0]?.signal.aborted).toBeTrue();
        pending[0]?.resolve({ options: [{ value: 'production', label: 'Stale' }] });
        pending[1]?.resolve({ options: [{ value: 'production', label: 'Current' }] });
        await Promise.resolve();
        await waitForUpdatesAsync();

        expect(element.optionState.status).toBe('ready');
        expect(element.activeOptions.map(option => option.label)).toEqual(['Current']);
    });
});
