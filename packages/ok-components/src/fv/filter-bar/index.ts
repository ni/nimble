import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type {
    FvFilterBarDefinition,
    FvFilterBarEventDetail,
    FvFilterBarQueryDocument,
    FvFilterBarQueryNode,
    FvFilterBarToken
} from './types';

function isRecord(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && value !== null;
}

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-filter-bar': FvFilterBar;
    }
}

/** Displays an active query and dispatches edit and clear actions. */
export class FvFilterBar extends FoundationElement {
    /** Text shown before the active query expression. */
    @attr
    public label = 'Filters';

    /** Prevents editing and clearing the displayed query. */
    @attr({ mode: 'boolean' })
    public disabled = false;

    /** Controls visibility of the clear button when a query is active. */
    @attr({ attribute: 'show-clear-button', mode: 'boolean' })
    public showClearButton = true;

    /** Query document shared with FvQueryBuilder. */
    @observable
    public query: FvFilterBarQueryDocument = { version: 1, root: null };

    /** Field and operator labels used to display the query. */
    @observable
    public definition?: FvFilterBarDefinition;

    public get expression(): string {
        return this.queryTokens.map(token => (token.kind === 'predicate'
            ? `${token.field} ${token.operator}${token.value}`
            : token.text)).join('');
    }

    /** @internal */
    public get queryTokens(): readonly FvFilterBarToken[] {
        return this.query.root ? this.formatNode(this.query.root, true) : [];
    }

    public handleEditClick(): void {
        this.dispatchEvent(new CustomEvent<FvFilterBarEventDetail>('edit-filter', {
            bubbles: true,
            composed: true,
            detail: { query: this.query }
        }));
    }

    public handleClearClick(): void {
        this.dispatchEvent(new CustomEvent<FvFilterBarEventDetail>('clear-filter', {
            bubbles: true,
            composed: true,
            detail: { query: this.query }
        }));
    }

    private formatNode(node: FvFilterBarQueryNode, isRoot = false): FvFilterBarToken[] {
        if (node.kind === 'predicate') {
            const field = this.definition?.fields.find(candidate => candidate.id === node.fieldId);
            const operator = this.definition?.operators.find(candidate => candidate.id === node.operatorId);
            return [{
                kind: 'predicate',
                field: field?.label ?? node.fieldId,
                operator: operator?.label ?? node.operatorId,
                value: node.value === undefined ? '' : ` ${this.formatValue(node.value, field?.valueSchema)}`
            }];
        }

        const tokens: FvFilterBarToken[] = [];
        for (const child of node.children) {
            const childTokens = this.formatNode(child);
            if (childTokens.length > 0) {
                if (tokens.length > 0) {
                    tokens.push({ kind: 'logic', text: ` ${node.combinator.toUpperCase()} ` });
                }
                tokens.push(...childTokens);
            }
        }
        return tokens.length > 0 && !isRoot
            ? [{ kind: 'group', text: '(' }, ...tokens, { kind: 'group', text: ')' }]
            : tokens;
    }

    private formatValue(value: unknown, schema: unknown): string {
        if (Array.isArray(value)) {
            return value.map(item => this.formatValue(item, schema)).join(', ');
        }

        if (isRecord(schema) && Array.isArray(schema.oneOf)) {
            for (const option of schema.oneOf) {
                if (isRecord(option) && option.const === value && typeof option.title === 'string') {
                    return option.title;
                }
            }
        }

        if (value !== null && typeof value === 'object') {
            return JSON.stringify(value) ?? '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return value.toString();
        }
        return 'null';
    }
}

const okFvFilterBar = FvFilterBar.compose({
    baseName: 'fv-filter-bar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvFilterBar());
export const fvFilterBarTag = 'ok-fv-filter-bar';
