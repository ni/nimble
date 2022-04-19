/* eslint-disable @typescript-eslint/no-explicit-any */
export enum FieldType {
    String = 'string',
    Number = 'number',
    Time = 'time',
    Date = 'date',
    Category = 'category',
    Boolean = 'boolean',
    Multiselect = 'multiselect'
}

export interface RuleSet {
    condition: string;
    rules: (RuleSet | Rule)[];
    collapsed?: boolean;
    isChild?: boolean;
}

export interface Rule {
    field: string;
    value?: any;
    operator?: string;
    entity?: string;
}

export interface Option {
    name: string;
    value: any;
}

export interface FieldMap {
    [key: string]: Field;
}

export interface Field {
    name: string;
    value: string;
    type: FieldType;
    nullable?: boolean;
    options?: Option[];
    operators?: string[];
    defaultValue?: any;
    defaultOperator?: (() => string) | string;
    entity?: string;
    validator?: (rule: Rule, parent: RuleSet) => any | null;
}

export interface LocalRuleMeta {
    ruleset: boolean;
    invalid: boolean;
}

export interface QueryBuilderConfig {
    fields: FieldMap;
    allowEmptyRulesets?: boolean;
    getOperators?: (fieldName: string, field: Field) => string[];
    getInputType?: (field: string, operator: string) => string;
    getOptions?: (field: string) => Option[];
    coerceValueForOperator?: (operator: string, value: any, rule: Rule) => any;
    calculateFieldChangeValue?: (currentField: Field,
        nextField: Field,
        currentValue: any) => any;
}