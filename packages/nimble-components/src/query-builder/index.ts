/* eslint-disable @typescript-eslint/member-ordering */
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr, observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { Field, Entity, RuleSet, QueryBuilderConfig, FieldType, Rule } from './interfaces';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-query-builder': QueryBuilder;
    }
}

/**
 * A nimble-styled HTML query builder
 */
export class QueryBuilder extends FoundationElement {
    private fields: Field[] = [];
    public filterFields: Field[] = [];
    public entities: Entity[] = [];

    public defaultOperatorMap: { [key: string]: string[] } = {
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

    // For ControlValueAccessor interface
    // public onChangeCallback: () => void;
    // public onTouchedCallback: () => any;

    public allowRuleset = true;
    // public allowCollapse = false;
    public emptyMessage = 'A ruleset cannot be empty. Please add a rule or remove it all together.';
    public operatorMap: { [key: string]: string[] } = {};
    public parentValue: RuleSet | undefined = undefined;
    public config: QueryBuilderConfig = { fields: {} };
    // public parentArrowIconTemplate: QueryArrowIconDirective;
    // public parentInputTemplates: QueryList<QueryInputDirective>;
    // public parentOperatorTemplate: QueryOperatorDirective;
    // public parentFieldTemplate: QueryFieldDirective;
    // public parentEntityTemplate: QueryEntityDirective;
    // public parentSwitchGroupTemplate: QuerySwitchGroupDirective;
    // public parentButtonGroupTemplate: QueryButtonGroupDirective;
    // public parentRemoveButtonTemplate: QueryRemoveButtonDirective;
    // public parentEmptyWarningTemplate: QueryEmptyWarningDirective;
    // public parentChangeCallback: () => void;
    // public parentTouchedCallback: () => void;
    public persistValueOnFieldChange = false;

    // @ViewChild('treeContainer', { static: true }) treeContainer: ElementRef;

    // private readonly defaultTemplateTypes: string[] = [
    //     'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];

    // private readonly defaultPersistValueTypes: string[] = [
    //     'string', 'number', 'time', 'date', 'boolean'];

    private operatorsCache: { [key: string]: string[] } = {};
    // private readonly inputContextCache = new Map<Rule, InputContext>();
    // private readonly operatorContextCache = new Map<Rule, OperatorContext>();
    // private readonly fieldContextCache = new Map<Rule, FieldContext>();
    // private readonly entityContextCache = new Map<Rule, EntityContext>();
    // private readonly removeButtonContextCache = new Map<Rule, RemoveButtonContext>();
    // private buttonGroupContext: ButtonGroupContext;

    private constructor() {
        super();
        // temp init //
        this.setConfig({
            fields: {
                myFirstBool: {
                    name: 'First field name',
                    type: FieldType.Boolean,
                    value: 'myFirstBool',
                    defaultValue: 'false',
                    operators: ['==', '!=']
                },
                mySecondBool: {
                    name: 'Second field name',
                    type: FieldType.Boolean,
                    value: 'mySecondBool',
                    defaultValue: 'false',
                    operators: ['==', '!='],
                    defaultOperator: '!='
                },
                stringValue: {
                    name: 'String property',
                    type: FieldType.String,
                    value: 'stringValue',
                    defaultValue: 'abc',
                    operators: ['==', '!=', 'contains', 'does not contain', 'is null', 'is not null'],
                    nullable: true
                }
            }
        });
        //
    }

    /// //////////////////////////////////////////////////
    private setConfig(config: QueryBuilderConfig): void {
        // TODO: deep copy?
        this.config = config;

        this.fields = Object.keys(config.fields).map(value => {
            const field = config.fields[value]!;
            field.value = field.value || value;
            return field;
        });
    }

    /// /////////////////////////////////////////////////

    public changeCondition(isOrCondition: boolean, ruleSet: RuleSet): void {
        ruleSet.condition = isOrCondition ? 'or' : 'and';
    }

    // ----------OnChanges Implementation----------

    // ngOnChanges(changes: SimpleChanges) {
    //     const config = this.config;
    //     const type = typeof config;
    //     if (type === 'object') {
    //         this.fields = Object.keys(config.fields).map(value => {
    //             const field = config.fields[value];
    //             field.value = field.value || value;
    //             return field;
    //         });
    //         if (config.entities) {
    //             this.entities = Object.keys(config.entities).map(value => {
    //                 const entity = config.entities[value];
    //                 entity.value = entity.value || value;
    //                 return entity;
    //             });
    //         } else {
    //             this.entities = null;
    //         }
    //         this.operatorsCache = {};
    //     } else {
    //         throw new Error(`Expected 'config' must be a valid object, got ${type} instead.`);
    //     }
    // }

    // ----------Validator Implementation----------

    // validate(control: AbstractControl): ValidationErrors | null {
    //     const errors: { [key: string]: any } = {};
    //     const ruleErrorStore = [];
    //     let hasErrors = false;

    //     if (!this.config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(this.data)) {
    //         errors.empty = 'Empty rulesets are not allowed.';
    //         hasErrors = true;
    //     }

    //     this.validateRulesInRuleset(this.data, ruleErrorStore);

    //     if (ruleErrorStore.length) {
    //         errors.rules = ruleErrorStore;
    //         hasErrors = true;
    //     }
    //     return hasErrors ? errors : null;
    // }

    // ----------ControlValueAccessor Implementation----------

    public get value(): RuleSet {
        return this.data;
    }

    // set value(value: RuleSet) {
    // // When component is initialized without a formControl, null is passed to value
    //     this.data = value || { condition: 'and', rules: [] };
    //     this.handleDataChange();
    // }

    // writeValue(obj: any): void {
    //     this.value = obj;
    // }

    // registerOnChange(fn: any): void {
    //     this.onChangeCallback = () => fn(this.data);
    // }

    // registerOnTouched(fn: any): void {
    //     this.onTouchedCallback = () => fn(this.data);
    // }

    // setDisabledState(isDisabled: boolean): void {
    //     this.disabled = isDisabled;
    //     this.changeDetectorRef.detectChanges();
    // }

    // // ----------END----------

    // getDisabledState = (): boolean => {
    //     return this.disabled;
    // };

    // findTemplateForRule(rule: Rule): TemplateRef<any> {
    //     const type = this.getInputType(rule.field, rule.operator);
    //     if (type) {
    //         const queryInput = this.findQueryInput(type);
    //         if (queryInput) {
    //             return queryInput.template;
    //         }
    //         if (!this.defaultTemplateTypes.includes(type)) {
    //             console.warn(`Could not find template for field with type: ${type}`);
    //         }
    //         return null;
    //     }
    // }

    // findQueryInput(type: string): QueryInputDirective {
    //     const templates = this.parentInputTemplates || this.inputTemplates;
    //     return templates.find(item => item.queryInputType === type);
    // }

    public getOperators(field: string): string[] {
        if (this.operatorsCache[field]) {
            return this.operatorsCache[field]!;
        }
        let operators: string[] = [];
        const fieldObject = this.config.fields[field];

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
            if (fieldObject.nullable) {
                operators = operators.concat(['is null', 'is not null']);
            }
        } else {
            // eslint-disable-next-line no-console
            console.warn(`No 'type' property found on field: '${field}'`);
        }

        // Cache reference to array object, so it won't be computed next time and trigger a rerender.
        this.operatorsCache[field] = operators;
        return operators;
    }

    // getFields(entity: string): Field[] {
    //     if (this.entities && entity) {
    //         return this.fields.filter(field => {
    //             return field && field.entity === entity;
    //         });
    //     }
    //     return this.fields;
    // }

    public getInputType(field: string, operator: string): string {
        if (this.config.getInputType) {
            return this.config.getInputType(field, operator);
        }

        if (!this.config.fields[field]) {
            throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
        }

        const type = this.config.fields[field]?.type;
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

    // getOptions(field: string): Option[] {
    //     if (this.config.getOptions) {
    //         return this.config.getOptions(field);
    //     }
    //     return this.config.fields[field].options || this.defaultEmptyList;
    // }

    // getDefaultField(entity: Entity): Field {
    //     if (!entity) {
    //         return null;
    //     } if (entity.defaultField !== undefined) {
    //         return this.getDefaultValue(entity.defaultField);
    //     }
    //     const entityFields = this.fields.filter(field => {
    //         return field && field.entity === entity.value;
    //     });
    //     if (entityFields && entityFields.length) {
    //         return entityFields[0];
    //     }
    //     console.warn(`No fields found for entity '${entity.name}'. `
    //       + 'A \'defaultOperator\' is also not specified on the field config. Operator value will default to null.');
    //     return null;
    // }

    private getDefaultOperator(field: Field): string {
        if (field?.defaultOperator !== undefined) {
            return this.getDefaultValue(field.defaultOperator);
        }
        const operators = this.getOperators(field.value);
        if (operators?.length) {
            return operators[0]!;
        }
        // eslint-disable-next-line no-console
        console.warn(`No operators found for field '${field.value}'. `
          + 'A \'defaultOperator\' is also not specified on the field config. Operator value will default to null.');
        return '';
    }

    public addRule(passedParent?: RuleSet): void {
        if (this.disabled) {
            return;
        }

        const parent = passedParent || this.data;
        const field = this.fields[0]!;
        parent.rules = parent.rules.concat([{
            field: field.value,
            operator: this.getDefaultOperator(field),
            // TODO hacky 'as'
            value: this.getDefaultValue(field.defaultValue as string),
            entity: field.entity
        }]);
        this.forceRefresh();

        // this.handleTouched();
        // this.handleDataChange();
    }

    private forceRefresh(): void {
        // TODO -- very hacky
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.data = JSON.parse(JSON.stringify(this.data));
    }

    public removeRule(rule: Rule, passedParent?: RuleSet): void {
        if (this.disabled) {
            return;
        }

        const parent = passedParent || this.data;
        parent.rules = parent.rules.filter(r => r !== rule);
        this.forceRefresh();

        // this.inputContextCache.delete(rule);
        // this.operatorContextCache.delete(rule);
        // this.fieldContextCache.delete(rule);
        // this.entityContextCache.delete(rule);
        // this.removeButtonContextCache.delete(rule);

        // this.handleTouched();
        // this.handleDataChange();
    }

    public addRuleSet(passedParent?: RuleSet): void {
        if (this.disabled) {
            return;
        }

        const parent = passedParent || this.data;
        parent.rules = parent.rules.concat([{ condition: 'and', rules: [] }]);
        this.forceRefresh();

        // this.handleTouched();
        // this.handleDataChange();
    }

    public removeRuleSet(passedRuleset?: RuleSet, passedParent?: RuleSet): void {
        if (this.disabled) {
            return;
        }

        const ruleset = passedRuleset || this.data;
        const parent = passedParent || this.parentValue;
        if (!parent) {
            // Shouldn't happen because 'Remove' button is hidden when there isn't a parent
            return;
        }

        parent.rules = parent.rules.filter(r => r !== ruleset);
        this.forceRefresh();

        // this.handleTouched();
        // this.handleDataChange();
    }

    // transitionEnd(e: Event): void {
    //     this.treeContainer.nativeElement.style.maxHeight = null;
    // }

    // toggleCollapse(): void {
    //     this.computedTreeContainerHeight();
    //     setTimeout(() => {
    //         this.data.collapsed = !this.data.collapsed;
    //     }, 100);
    // }

    // computedTreeContainerHeight(): void {
    //     const nativeElement: HTMLElement = this.treeContainer.nativeElement;
    //     if (nativeElement && nativeElement.firstElementChild) {
    //         nativeElement.style.maxHeight = `${nativeElement.firstElementChild.clientHeight + 8}px`;
    //     }
    // }

    // changeCondition(value: string): void {
    //     if (this.disabled) {
    //         return;
    //     }

    //     this.data.condition = value;
    //     this.handleTouched();
    //     this.handleDataChange();
    // }

    public changeOperator(operator: string, rule: Rule): void {
        if (this.disabled) {
            return;
        }

        rule.operator = operator;
        rule.value = this.coerceValueForOperator(operator, rule.value, rule);
        this.forceRefresh();

        // this.handleTouched();
        // this.handleDataChange();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private coerceValueForOperator(operator: string, value: any, rule: Rule): any | any[] {
        const inputType: string = this.getInputType(rule.field, operator);
        if (inputType === 'multiselect' && !Array.isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return [value];
        }
        return value;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public changeInput(value: any, rule: Rule): void {
        if (this.disabled) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rule.value = value;

        // this.handleTouched();
        // this.handleDataChange();
    }

    public changeField(fieldValue: string, rule: Rule): void {
        if (this.disabled) {
            return;
        }

        rule.field = fieldValue;
        const field = this.config.fields[fieldValue]!;
        rule.operator = this.getDefaultOperator(field);
        this.forceRefresh();

        // Create new context objects so templates will automatically update
        // this.inputContextCache.delete(rule);
        // this.operatorContextCache.delete(rule);
        // this.fieldContextCache.delete(rule);
        // this.entityContextCache.delete(rule);
        // this.getInputContext(rule);
        // this.getFieldContext(rule);
        // this.getOperatorContext(rule);
        // this.getEntityContext(rule);

        // this.handleTouched();
        // this.handleDataChange();
    }

    // changeEntity(entityValue: string, rule: Rule, index: number, data: RuleSet): void {
    //     if (this.disabled) {
    //         return;
    //     }
    //     let i = index;
    //     let rs = data;
    //     const entity: Entity = this.entities.find(e => e.value === entityValue);
    //     const defaultField: Field = this.getDefaultField(entity);
    //     if (!rs) {
    //         rs = this.data;
    //         i = rs.rules.findIndex(x => x === rule);
    //     }
    //     rule.field = defaultField.value;
    //     rs.rules[i] = rule;
    //     if (defaultField) {
    //         this.changeField(defaultField.value, rule);
    //     } else {
    //         this.handleTouched();
    //         this.handleDataChange();
    //     }
    // }

    private getDefaultValue(defaultValue: (() => string) | string): string {
        switch (typeof defaultValue) {
            case 'function':
                return defaultValue();
            default:
                return defaultValue;
        }
    }

    // getQueryItemClassName(local: LocalRuleMeta): string {
    //     let cls = this.getClassNames('row', 'connector', 'transition');
    //     cls += ` ${this.getClassNames(local.ruleset ? 'ruleSet' : 'rule')}`;
    //     if (local.invalid) {
    //         cls += ` ${this.getClassNames('invalidRuleSet')}`;
    //     }
    //     return cls;
    // }

    // getButtonGroupContext(): ButtonGroupContext {
    //     if (!this.buttonGroupContext) {
    //         this.buttonGroupContext = {
    //             addRule: this.addRule.bind(this),
    //             addRuleSet: this.allowRuleset && this.addRuleSet.bind(this),
    //             removeRuleSet: this.allowRuleset && this.parentValue && this.removeRuleSet.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             $implicit: this.data
    //         };
    //     }
    //     return this.buttonGroupContext;
    // }

    // getRemoveButtonContext(rule: Rule): RemoveButtonContext {
    //     if (!this.removeButtonContextCache.has(rule)) {
    //         this.removeButtonContextCache.set(rule, {
    //             removeRule: this.removeRule.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             $implicit: rule
    //         });
    //     }
    //     return this.removeButtonContextCache.get(rule);
    // }

    // getFieldContext(rule: Rule): FieldContext {
    //     if (!this.fieldContextCache.has(rule)) {
    //         this.fieldContextCache.set(rule, {
    //             onChange: this.changeField.bind(this),
    //             getFields: this.getFields.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             fields: this.fields,
    //             $implicit: rule
    //         });
    //     }
    //     return this.fieldContextCache.get(rule);
    // }

    // getEntityContext(rule: Rule): EntityContext {
    //     if (!this.entityContextCache.has(rule)) {
    //         this.entityContextCache.set(rule, {
    //             onChange: this.changeEntity.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             entities: this.entities,
    //             $implicit: rule
    //         });
    //     }
    //     return this.entityContextCache.get(rule);
    // }

    // getSwitchGroupContext(): SwitchGroupContext {
    //     return {
    //         onChange: this.changeCondition.bind(this),
    //         getDisabledState: this.getDisabledState,
    //         $implicit: this.data
    //     };
    // }

    // getArrowIconContext(): ArrowIconContext {
    //     return {
    //         getDisabledState: this.getDisabledState,
    //         $implicit: this.data
    //     };
    // }

    // getEmptyWarningContext(): EmptyWarningContext {
    //     return {
    //         getDisabledState: this.getDisabledState,
    //         message: this.emptyMessage,
    //         $implicit: this.data
    //     };
    // }

    // getOperatorContext(rule: Rule): OperatorContext {
    //     if (!this.operatorContextCache.has(rule)) {
    //         this.operatorContextCache.set(rule, {
    //             onChange: this.changeOperator.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             operators: this.getOperators(rule.field),
    //             $implicit: rule
    //         });
    //     }
    //     return this.operatorContextCache.get(rule);
    // }

    // getInputContext(rule: Rule): InputContext {
    //     if (!this.inputContextCache.has(rule)) {
    //         this.inputContextCache.set(rule, {
    //             onChange: this.changeInput.bind(this),
    //             getDisabledState: this.getDisabledState,
    //             options: this.getOptions(rule.field),
    //             field: this.config.fields[rule.field],
    //             $implicit: rule
    //         });
    //     }
    //     return this.inputContextCache.get(rule);
    // }

    // private calculateFieldChangeValue(
    //     currentField: Field,
    //     nextField: Field,
    //     currentValue: any
    // ): any {
    //     if (this.config.calculateFieldChangeValue != null) {
    //         return this.config.calculateFieldChangeValue(
    //             currentField, nextField, currentValue
    //         );
    //     }

    //     const canKeepValue = () => {
    //         if (currentField == null || nextField == null) {
    //             return false;
    //         }
    //         return currentField.type === nextField.type
    //     && this.defaultPersistValueTypes.includes(currentField.type);
    //     };

    //     if (this.persistValueOnFieldChange && canKeepValue()) {
    //         return currentValue;
    //     }

    //     if (nextField && nextField.defaultValue !== undefined) {
    //         return this.getDefaultValue(nextField.defaultValue);
    //     }

    //     return undefined;
    // }

    // private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
    //     if (!ruleset || !ruleset.rules || ruleset.rules.length === 0) {
    //         return true;
    //     }
    //     return ruleset.rules.some((item: RuleSet) => {
    //         if (item.rules) {
    //             return this.checkEmptyRuleInRuleset(item);
    //         }
    //         return false;
    //     });
    // }

    // private validateRulesInRuleset(ruleset: RuleSet, errorStore: any[]) {
    //     if (ruleset && ruleset.rules && ruleset.rules.length > 0) {
    //         ruleset.rules.forEach(item => {
    //             if ((item as RuleSet).rules) {
    //                 this.validateRulesInRuleset(item as RuleSet, errorStore);
    //             } else if ((item as Rule).field) {
    //                 const field = this.config.fields[(item as Rule).field];
    //                 if (field && field.validator && field.validator.apply) {
    //                     const error = field.validator(item as Rule, ruleset);
    //                     if (error != null) {
    //                         errorStore.push(error);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // }

    // private handleDataChange(): void {
    //     this.changeDetectorRef.markForCheck();
    //     if (this.onChangeCallback) {
    //         this.onChangeCallback();
    //     }
    //     if (this.parentChangeCallback) {
    //         this.parentChangeCallback();
    //     }
    // }

    // private handleTouched(): void {
    //     if (this.onTouchedCallback) {
    //         this.onTouchedCallback();
    //     }
    //     if (this.parentTouchedCallback) {
    //         this.parentTouchedCallback();
    //     }
    // }
}

const nimbleQueryBuilder = QueryBuilder.compose({
    baseName: 'query-builder',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleQueryBuilder());
