/* eslint-disable @typescript-eslint/no-explicit-any */
export const FieldType = {
    string: 'string',
    number: 'number',
    time: 'time',
    date: 'date',
    category: 'category',
    boolean: 'boolean',
    multiselect: 'multiselect'
} as const;
export type FieldType = typeof FieldType[keyof typeof FieldType];

export interface RuleSet {
    condition: string;
    rules: (RuleSet | Rule)[];
    isChild?: boolean;
}

export interface Rule {
    field: string;
    value?: any;
    operator?: string;
}

export interface Option {
    displayName: string;
    value: string;
}

export interface FieldMap {
    [key: string]: Field;
}

export interface Field {
    displayName: string;
    propertyKey: string;
    type: FieldType;
    options?: Option[];
    operators?: string[];
    defaultValue?: any;
    defaultOperator?: (() => string) | string;
    validator?: (rule: Rule, parent: RuleSet) => any | null;
}

export interface QueryBuilderConfig {
    fields: FieldMap;
    allowEmptyRulesets?: boolean;
    getOperators?: (fieldName: string, field: Field) => string[];
    getInputType?: (field: string, operator: string) => string;
    getOptions?: (field: string) => Option[];
    coerceValueForOperator?: (operator: string, value: any, rule: Rule) => any;
}