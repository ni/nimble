export const EditorType = {
    string: 'string',
    number: 'number',
    // dropdown: 'dropdown',
    boolean: 'boolean',
    none: 'none'
} as const;
export type EditorType = typeof EditorType[keyof typeof EditorType];

export interface RuleSet {
    condition: string;
    rules: (RuleSet | Rule)[];
    isChild?: boolean;
}

export interface Rule {
    field: string;
    value: unknown;
    operator: Operator;
}

export interface Option {
    displayName: string;
    value: string;
}

export interface Field {
    displayName: string;
    fieldName: string;
    options?: Option[];
    operators: Operator[];
}

export interface QueryBuilderConfig {
    fields: Field[];
}

export interface Operator {
    displayName: string;
    value: string;
    linqString: string;
    editorType: EditorType;
}

export const linqFieldNamePlaceholder = '{field}' as const;
export const linqValuePlaceholder = '{value}' as const;

export const stringEqualsOperator: Operator = {
    displayName: 'Equals',
    value: '===',
    linqString: `${linqFieldNamePlaceholder} == "${linqValuePlaceholder}"`,
    editorType: EditorType.string
};

export const stringNotEqualsOperator: Operator = {
    displayName: 'Not equals',
    value: '!==',
    linqString: `${linqFieldNamePlaceholder} != "${linqValuePlaceholder}"`,
    editorType: EditorType.string
};

export const stringContainsOperator: Operator = {
    displayName: 'Contains',
    value: 'strincludes',
    linqString: `${linqFieldNamePlaceholder}.Contains("${linqValuePlaceholder}")`,
    editorType: EditorType.string
};

export const stringDoesNotContainOperator: Operator = {
    displayName: 'Does not contain',
    value: 'strnotincludes',
    linqString: `!${linqFieldNamePlaceholder}.Contains("${linqValuePlaceholder}")`,
    editorType: EditorType.string
};

export const stringStartsWithOperator: Operator = {
    displayName: 'Starts with',
    value: 'startswith',
    linqString: `${linqFieldNamePlaceholder}.StartsWith("${linqValuePlaceholder}")`,
    editorType: EditorType.string
};

export const stringIsBlankOperator: Operator = {
    displayName: 'Is empty',
    value: 'isblank',
    linqString: `string.IsNullOrEmpty(${linqFieldNamePlaceholder})`,
    editorType: EditorType.none
};

export const stringIsNotBlankOperator: Operator = {
    displayName: 'Is not empty',
    value: 'isnotblank',
    linqString: `!string.IsNullOrEmpty(${linqFieldNamePlaceholder})`,
    editorType: EditorType.none
};

export const numberEqualsOperator: Operator = {
    displayName: 'Equals',
    value: '===',
    linqString: `${linqFieldNamePlaceholder} == ${linqValuePlaceholder}`,
    editorType: EditorType.number
};

export const numberNotEqualsOperator: Operator = {
    displayName: 'Not equals',
    value: '!==',
    linqString: `${linqFieldNamePlaceholder} != ${linqValuePlaceholder}`,
    editorType: EditorType.number
};

export const numberGreaterThanOperator: Operator = {
    displayName: 'Greater than',
    value: '>',
    linqString: `${linqFieldNamePlaceholder} > ${linqValuePlaceholder}`,
    editorType: EditorType.number
};

export const numberLessThanOperator: Operator = {
    displayName: 'Less than',
    value: '<',
    linqString: `${linqFieldNamePlaceholder} < ${linqValuePlaceholder}`,
    editorType: EditorType.number
};

export const booleanEqualsOperator: Operator = {
    displayName: 'Equals',
    value: '===',
    linqString: `${linqFieldNamePlaceholder} == ${linqValuePlaceholder}`,
    editorType: EditorType.boolean
};

export const booleanNotEqualsOperator: Operator = {
    displayName: 'Not equals',
    value: '!==',
    linqString: `${linqFieldNamePlaceholder} != ${linqValuePlaceholder}`,
    editorType: EditorType.boolean
};