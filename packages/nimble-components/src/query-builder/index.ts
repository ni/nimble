/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/member-ordering */
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { template } from './template';
import { styles } from './styles';
import { type Option, type Field, type RuleSet, type QueryBuilderConfig, FieldType, type Rule } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-query-builder': QueryBuilder;
    }
}

/**
 * A nimble-styled HTML query builder
 */
export class QueryBuilder extends FoundationElement {
    public fields: Field[] = [];

    private readonly defaultOperatorMap: { [key: string]: string[] } = {
        string: ['=', '!=', 'contains', 'like'],
        number: ['=', '!=', '>', '>=', '<', '<='],
        time: ['=', '!=', '>', '>=', '<', '<='],
        date: ['=', '!=', '>', '>=', '<', '<='],
        category: ['=', '!=', 'in', 'not in'],
        boolean: ['=']
    };

    @attr({ mode: 'boolean' })
    public disabled = false;

    @observable
    public data: RuleSet = { condition: 'and', rules: [] };

    public allowRuleset = true;
    public operatorMap: { [key: string]: string[] } = {};
    public config: QueryBuilderConfig = { fields: [] };

    private operatorsCache: { [key: string]: string[] } = {};

    public constructor() {
        super();
        // temp init //
        this.setConfig({
            fields: [
                {
                    displayName: 'First field displayName',
                    type: FieldType.boolean,
                    propertyKey: 'myFirstBool',
                    defaultValue: false,
                    operators: ['==', '!=']
                },
                {
                    displayName: 'Second field displayName',
                    type: FieldType.boolean,
                    propertyKey: 'mySecondBool',
                    defaultValue: false,
                    operators: ['==', '!='],
                    defaultOperator: '!='
                },
                {
                    displayName: 'String property',
                    type: FieldType.string,
                    propertyKey: 'stringValue',
                    defaultValue: '',
                    operators: ['==', '!=', 'contains', 'does not contain', 'is null', 'is not null'],
                },
                {
                    displayName: 'Number property',
                    type: FieldType.number,
                    propertyKey: 'numericValue',
                    defaultValue: 0,
                    operators: ['==', '!=', '>', '<']
                },
                {
                    displayName: 'Enum property',
                    type: FieldType.category,
                    propertyKey: 'categoryValue',
                    defaultValue: '',
                    operators: ['==', '!='],
                    options: [{
                        displayName: 'First option',
                        value: 'option1'
                    }, {
                        displayName: 'Second option',
                        value: 'option2'
                    }, {
                        displayName: 'Third option',
                        value: 'option3'
                    }]
                }
            ]
        });
        //
    }

    private setConfig(config: QueryBuilderConfig): void {
        // TODO: deep copy?
        this.config = config;

        this.fields = config.fields;
    }

    public changeCondition(isOrCondition: boolean, ruleSet: RuleSet): void {
        ruleSet.condition = isOrCondition ? 'or' : 'and';
    }

    public isRuleSet(ruleOrRuleSet: RuleSet | Rule): boolean {
        // eslint-disable-next-line no-prototype-builtins
        return ruleOrRuleSet.hasOwnProperty('rules');
    }

    public validate(): boolean {
        return this.isRuleSetValid(this.data);
    }

    public get value(): RuleSet {
        return this.data;
    }

    public get linqString(): string {
        const isValid = this.validate();
        if (!isValid) {
            return 'Invalid value -- cannot generate LINQ string';
        }
        return this.getLinqStringForRuleSet(this.data);
    }

    private getLinqStringForRuleSet(ruleSet: RuleSet): string {
        const operator = ruleSet.condition === 'and' ? ' && ' : ' || ';
        const childrenLinqArray = ruleSet.rules.map(child => {
            let linqString: string;
            if (this.isRuleSet(child)) {
                linqString = this.getLinqStringForRuleSet(child as RuleSet);
            } else {
                linqString = this.getLinqStringForRule(child as Rule);
            }
            return `(${linqString})`;
        });

        return childrenLinqArray.join(operator);
    }

    private getLinqStringForRule(rule: Rule): string {
        const fieldObject = this.config.fields.find(f => f.propertyKey === rule.field)!;

        switch (fieldObject.type) {
            case FieldType.string:
                return this.getLinqStringForStringProperty(rule.field, rule.operator!, rule.value);
            case FieldType.boolean:
                return this.getLinqStringForBooleanProperty(rule.field, rule.operator!, rule.value);
            case FieldType.category:
                return this.getLinqStringForStringProperty(rule.field, rule.operator!, rule.value);
            case FieldType.number:
                return this.getLinqStringForNumberProperty(rule.field, rule.operator!, rule.value);
            default:
                return 'true';
        }
    }

    private getLinqStringForStringProperty(fieldName: string, operator: string, value: string): string {
        switch (operator) {
            case '==':
                return `${fieldName} = ${value}`;
            case '!=':
                return `${fieldName} != ${value}`;
            case 'contains':
                return `${fieldName}.Contains(${value})`;
            case 'does not contain':
                return `!${fieldName}.Contains(${value})`;
            case 'is null':
                return `string.IsNullOrEmpty(${fieldName})`;
            case 'is not null':
                return `!string.IsNullOrEmpty(${fieldName})`;
            default:
                return 'true';
        }
    }

    private getLinqStringForBooleanProperty(fieldName: string, operator: string, value: boolean): string {
        const stringValue = value ? 'true' : 'false';

        switch (operator) {
            case '==':
                return `${fieldName} = ${stringValue}`;
            case '!=':
                return `${fieldName} != ${stringValue}`;
            default:
                return 'true';
        }
    }

    private getLinqStringForNumberProperty(fieldName: string, operator: string, value: number): string {
        switch (operator) {
            case '==':
                return `${fieldName} = ${value}`;
            case '!=':
                return `${fieldName} != ${value}`;
            case '<':
                return `${fieldName} < ${value}`;
            case '>':
                return `${fieldName} > ${value}`;
            default:
                return 'true';
        }
    }

    public getOptions(field: string): Option[] {
        const fieldObject = this.config.fields.find(f => f.propertyKey === field);
        if (fieldObject) {
            return fieldObject.options!;
        }

        return [];
    }

    public getOperators(field: string): string[] {
        if (this.operatorsCache[field]) {
            return this.operatorsCache[field];
        }
        let operators: string[] = [];
        const fieldObject = this.config.fields.find(f => f.propertyKey === field);

        if (this.config.getOperators && fieldObject) {
            return this.config.getOperators(field, fieldObject);
        }

        const type = fieldObject?.type;

        if (fieldObject?.operators) {
            operators = fieldObject.operators;
        } else if (type) {
            operators = this.operatorMap?.[type] || this.defaultOperatorMap[type] || [];
            if (operators.length === 0) {
                // eslint-disable-next-line no-console
                console.warn(
                    `No operators found for field '${field}' with type ${fieldObject.type}. `
          + 'Please define an \'operators\' property on the field or use the \'operatorMap\' binding to fix this.'
                );
            }
        } else {
            // eslint-disable-next-line no-console
            console.warn(`No 'type' property found on field: '${field}'`);
        }

        // Cache reference to array object, so it won't be computed next time and trigger a rerender.
        this.operatorsCache[field] = operators;
        return operators;
    }

    public getInputType(field: string, operator: string): string {
        if (this.config.getInputType) {
            return this.config.getInputType(field, operator);
        }

        const fieldObject = this.config.fields.find(f => f.propertyKey === field);
        if (!fieldObject) {
            throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
        }

        const type = fieldObject?.type;
        if (!type) {
            return '';
        }

        switch (operator) {
            case 'is null':
            case 'is not null':
                return ''; // No displayed component
            case 'in':
            case 'not in':
                return type === 'category' || type === 'boolean' ? 'multiselect' : type;
            default:
                return type;
        }
    }

    private getDefaultOperator(field: Field): string {
        if (field?.defaultOperator !== undefined) {
            return this.getDefaultValue(field.defaultOperator);
        }
        const operators = this.getOperators(field.propertyKey);
        if ((operators?.length) !== 0) {
            return operators[0]!;
        }
        // eslint-disable-next-line no-console
        console.warn(`No operators found for field '${field.propertyKey}'. `
          + 'A \'defaultOperator\' is also not specified on the field config. Operator value will default to null.');
        return '';
    }

    public addRule(parent: RuleSet): void {
        const field = this.fields[0]!;
        parent.rules = parent.rules.concat([{
            field: field.propertyKey,
            operator: this.getDefaultOperator(field),
            // TODO hacky 'as'
            value: this.getDefaultValue(field.defaultValue as string)
        }]);
        this.forceRefresh();
    }

    private forceRefresh(): void {
        // TODO -- very hacky
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.data = JSON.parse(JSON.stringify(this.data));
    }

    public removeRule(rule: Rule, parent: RuleSet): void {
        parent.rules = parent.rules.filter(r => r !== rule);
        this.forceRefresh();
    }

    public addRuleSet(passedParent?: RuleSet): void {
        const parent = passedParent || this.data;
        parent.rules = parent.rules.concat([{ condition: 'and', rules: [] }]);
        this.forceRefresh();
    }

    public removeRuleSet(ruleset: RuleSet, parent: RuleSet): void {
        parent.rules = parent.rules.filter(r => r !== ruleset);
        this.forceRefresh();
    }

    public changeOperator(operator: string, rule: Rule): void {
        rule.operator = operator;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rule.value = this.coerceValueForOperator(operator, rule.value, rule);
        this.forceRefresh();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private coerceValueForOperator(operator: string, value: any, rule: Rule): any | any[] {
        const inputType: string = this.getInputType(rule.field, operator);
        if (inputType === 'multiselect' && !Array.isArray(value)) {
            return [value];
        }
        return value;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public changeInput(value: any, rule: Rule): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rule.value = value;
    }

    public changeField(fieldValue: string, rule: Rule): void {
        rule.field = fieldValue;
        const field = this.config.fields.find(f => f.propertyKey === fieldValue)!;
        rule.operator = this.getDefaultOperator(field);
        this.forceRefresh();
    }

    private getDefaultValue(defaultValue: (() => string) | string): string {
        switch (typeof defaultValue) {
            case 'function':
                return defaultValue();
            default:
                return defaultValue;
        }
    }

    private isRuleSetValid(ruleset: RuleSet): boolean {
        if (ruleset.rules.length === 0) {
            return this.config.allowEmptyRulesets === true;
        }

        return ruleset.rules.every(item => {
            if (this.isRuleSet(item)) {
                const childRuleset = item as RuleSet;
                if (!this.isRuleSetValid(childRuleset)) {
                    return false;
                }
            } else {
                const childRule = item as Rule;
                const field = this.config.fields.find(f => f.propertyKey === childRule.field);
                if (field?.validator?.apply) {
                    if (field.validator(childRule, ruleset) != null) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}

const nimbleQueryBuilder = QueryBuilder.compose({
    baseName: 'query-builder',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleQueryBuilder());
export const queryBuilderTag = 'nimble-query-builder';