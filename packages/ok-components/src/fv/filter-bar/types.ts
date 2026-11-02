/** Query document shape shared with FvQueryBuilder. */
export interface FvFilterBarPredicate {
    readonly kind: 'predicate';
    readonly fieldId: string;
    readonly operatorId: string;
    readonly value?: unknown;
}

export interface FvFilterBarGroup {
    readonly kind: 'group';
    readonly combinator: 'and' | 'or';
    readonly children: readonly FvFilterBarQueryNode[];
}

export type FvFilterBarQueryNode = FvFilterBarPredicate | FvFilterBarGroup;

export interface FvFilterBarQueryDocument {
    readonly version: 1;
    readonly root: FvFilterBarQueryNode | null;
}

export interface FvFilterBarDefinition {
    readonly fields: readonly {
        readonly id: string,
        readonly label: string,
        readonly valueSchema?: unknown
    }[];
    readonly operators: readonly {
        readonly id: string,
        readonly label: string,
        readonly operand?: | { readonly kind: 'none' | 'field-value' }
            | { readonly kind: 'field-value-list', readonly minItems?: number }
            | { readonly kind: 'range', readonly endpointSchema: unknown }
            | { readonly kind: 'schema', readonly schema: unknown }
    }[];
}

export interface FvFilterBarEventDetail {
    readonly query: FvFilterBarQueryDocument;
}

/** @internal */
export type FvFilterBarToken = | {
    readonly kind: 'predicate',
    readonly field: string,
    readonly operator: string,
    readonly value: string
} | {
    readonly kind: 'logic' | 'group',
    readonly text: string
};
