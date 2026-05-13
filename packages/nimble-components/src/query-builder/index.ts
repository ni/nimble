/* eslint-disable @typescript-eslint/member-ordering */
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { template } from './template';
import { styles } from './styles';
import { type Option, type Field, type RuleSet, type QueryBuilderConfig, type Rule, EditorType, type Operator, booleanEqualsOperator, stringEqualsOperator, stringNotEqualsOperator, stringContainsOperator, stringDoesNotContainOperator, stringStartsWithOperator, stringIsBlankOperator, stringIsNotBlankOperator, numberEqualsOperator, numberNotEqualsOperator, numberGreaterThanOperator, numberLessThanOperator, booleanNotEqualsOperator } from './types';

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

    @attr({ mode: 'boolean' })
    public disabled = false;

    @observable
    public data: RuleSet = { condition: 'and', rules: [] };

    public allowRuleset = true;
    public operatorMap: { [key: string]: string[] } = {};
    public config: QueryBuilderConfig = { fields: [] };

    public constructor() {
        super();
        // temp init //
        this.setConfig({
            fields: [
                {
                    displayName: 'First field displayName',
                    fieldName: 'myFirstBool',
                    operators: [
                        booleanEqualsOperator,
                        booleanNotEqualsOperator
                    ]
                },
                {
                    displayName: 'Second field displayName',
                    fieldName: 'mySecondBool',
                    operators: [
                        booleanEqualsOperator,
                        booleanNotEqualsOperator
                    ]
                },
                {
                    displayName: 'String property',
                    fieldName: 'stringValue',
                    operators: [
                        stringEqualsOperator,
                        stringNotEqualsOperator,
                        stringContainsOperator,
                        stringDoesNotContainOperator,
                        stringStartsWithOperator,
                        stringIsBlankOperator,
                        stringIsNotBlankOperator
                    ]
                },
                {
                    displayName: 'Number property',
                    fieldName: 'numericValue',
                    operators: [
                        numberEqualsOperator,
                        numberNotEqualsOperator,
                        numberLessThanOperator,
                        numberGreaterThanOperator
                    ]
                }
                /* ,
                {
                    displayName: 'Enum property',
                    type: FieldType.category,
                    fieldName: 'categoryValue',
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
                } */
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
        const fieldObject = this.config.fields.find(f => f.fieldName === rule.field);

        if (!fieldObject) {
            throw new Error(`No configuration for field '${rule.field}' could be found! Please add it to config.fields.`);
        }

        const operatorObject = fieldObject.operators.find(o => o.value === rule.operator.value);

        if (!operatorObject) {
            throw new Error(`No configuration for operator '${rule.operator.value}' could be found on field '${rule.field}'! Please add it to config.fields[].operators.`);
        }

        if (operatorObject.editorType === EditorType.none) {
            return operatorObject.linqString.replace('{field}', rule.field);
        }
        return operatorObject.linqString.replace('{field}', rule.field).replace('{value}', String(rule.value));
    }

    public getOptions(field: string): Option[] {
        const fieldObject = this.config.fields.find(f => f.fieldName === field);
        if (fieldObject) {
            return fieldObject.options!;
        }

        return [];
    }

    public getOperators(field: string): Operator[] {
        const fieldObject = this.config.fields.find(f => f.fieldName === field)!;
        return fieldObject.operators;
    }

    private getDefaultOperator(field: Field): Operator {
        return this.getOperators(field.fieldName)[0]!;
    }

    public addRule(parent: RuleSet): void {
        const field = this.fields[0]!;
        parent.rules = parent.rules.concat([{
            field: field.fieldName,
            operator: this.getDefaultOperator(field),
            value: undefined
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
        rule.operator = this.getOperators(rule.field).find(o => o.value === operator)!;
        this.forceRefresh();
    }

    public changeInput(value: unknown, rule: Rule): void {
        rule.value = value;
    }

    public changeField(fieldValue: string, rule: Rule): void {
        rule.field = fieldValue;
        const field = this.config.fields.find(f => f.fieldName === fieldValue)!;
        rule.operator = this.getDefaultOperator(field);
        this.forceRefresh();
    }

    private isRuleSetValid(ruleset: RuleSet): boolean {
        if (ruleset.rules.length === 0) {
            return false;
        }

        return ruleset.rules.every(item => {
            if (this.isRuleSet(item)) {
                const childRuleset = item as RuleSet;
                if (!this.isRuleSetValid(childRuleset)) {
                    return false;
                }
            } else {
                return true;
                /*
                const childRule = item as Rule;
                const field = this.config.fields.find(f => f.fieldName === childRule.field);
                if (field?.validator?.apply) {
                    if (field.validator(childRule, ruleset) != null) {
                        return false;
                    }
                }
                    */
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