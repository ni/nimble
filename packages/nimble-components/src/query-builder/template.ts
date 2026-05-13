/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import type { QueryBuilder } from '.';
import { type Field, FieldType, type Rule, type RuleSet, type Option } from './types';
import { Checkbox, checkboxTag } from '../checkbox';
import { Select, selectTag } from '../select';
import { TextField, textFieldTag } from '../text-field';
import { NumberField, numberFieldTag } from '../number-field';
import { buttonTag } from '../button';
import { iconXmarkTag } from '../icons/xmark';
import { Switch, switchTag } from '../switch';
import { listOptionTag } from '../list-option';

const booleanRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <${checkboxTag}
        ?disabled="${() => queryBuilder.disabled}"
        ?checked="${rule => rule.value === true}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput((c.event.target as Checkbox).checked, rule)}"
    ></${checkboxTag}>
`;

const stringRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <${textFieldTag}
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput((c.event.target as TextField).value, rule)}"
        :value="${rule => (typeof (rule.value) === 'string' ? rule.value : undefined)}"
    >
    </${textFieldTag}>
`;

const numberRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <${numberFieldTag}
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput((c.event.target as NumberField).value, rule)}"
        :value="${rule => (typeof (rule.value) === 'number' ? rule.value : undefined)}"
    >
    </${numberFieldTag}>
`;

const categoryRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <${selectTag}
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput((c.event.target as Select).value, rule)}"
        :value="${rule => (typeof (rule.value) === 'string' ? rule.value : undefined)}"
    >
        ${repeat(rule => queryBuilder.getOptions(rule.field), html<Option>`
            <${listOptionTag} value="${o => o.value}">${o => o.displayName}</${listOptionTag}>`)}
    </${selectTag}>
`;

const ruleTemplate: (queryBuilder: QueryBuilder, parentRuleSet: RuleSet) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder, parentRuleSet: RuleSet) => html<Rule>`
    <div class="rule-row">
        <${selectTag} ?disabled="${() => queryBuilder.disabled}" class="field-select" current-value="${x => x.field}" @change="${(rule, c) => queryBuilder.changeField((c.event.target as Select).value, rule)}">
            ${repeat(() => queryBuilder.fields, html`<${listOptionTag} value="${(f: Field) => f.propertyKey}">${(f: Field) => f.displayName}</${listOptionTag}>`)}
        </${selectTag}>
        <${selectTag} ?disabled="${() => queryBuilder.disabled}" class="field-operator" current-value="${x => x.operator}" @change="${(rule, c) => queryBuilder.changeOperator((c.event.target as Select).value, rule)}">
            ${repeat(rule => queryBuilder.getOperators(rule.field), html`<${listOptionTag} value="${o => o}">${o => o}</${listOptionTag}>`)}
        </${selectTag}>

        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator!) === FieldType.boolean), booleanRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator!) === FieldType.string), stringRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator!) === FieldType.number), numberRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator!) === FieldType.category), categoryRuleTemplate(queryBuilder))}

        <div class="button-container">
            <${buttonTag} ?disabled="${() => queryBuilder.disabled}" @click="${rule => (queryBuilder.removeRule(rule, parentRuleSet))}" content-hidden>
                <${iconXmarkTag} slot="start"></${iconXmarkTag}>
                Remove Rule
            <${buttonTag}>
        </div>
    </div>
`;

const ruleSetTemplate: (queryBuilder: QueryBuilder, parentRuleSet: RuleSet | undefined) => ViewTemplate<RuleSet> = (queryBuilder: QueryBuilder, parentRuleSet: RuleSet | undefined) => html<RuleSet>`
    <div class="${() => (parentRuleSet ? 'nested-rule-set' : '')}">
        <div class="switch-group">
            <${switchTag} ?disabled="${() => queryBuilder.disabled}" ?checked="${ruleSet => ruleSet.condition === 'or'}" @change="${(ruleSet, c) => queryBuilder.changeCondition((c.event.target as Switch).checked, ruleSet)}">
                <span slot="checked-message">Or</span>
                <span slot="unchecked-message">And</span>
            </${switchTag}>
            <div class="button-container">
                <${buttonTag} ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.addRule(ruleSet)}">Add rule</${buttonTag}>
                ${when(() => queryBuilder.allowRuleset, html<RuleSet>`<${buttonTag} ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.addRuleSet(ruleSet)}">Add ruleset</${buttonTag}>`)}
                ${when(() => !!parentRuleSet && queryBuilder.allowRuleset, html<RuleSet>`<${buttonTag} ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.removeRuleSet(ruleSet, parentRuleSet!)}">Remove</${buttonTag}>`)}
            </div>
        </div>
        <div>
            ${repeat(ruleSet => ruleSet.rules, html<RuleSet | Rule>`
                ${when(r => !queryBuilder.isRuleSet(r), (_, c) => ruleTemplate(queryBuilder, c.parent))}
                ${when(r => queryBuilder.isRuleSet(r), (_, c) => ruleSetTemplate(queryBuilder, c.parent))}
            `)}
        </div>
        ${when(ruleSet => ruleSet.rules.length === 0, html`Error: You must specify at least one condition.`)}
    </div>
`;

export const template = html<QueryBuilder>`
    <template>
        <div class="switch-group">
            <${switchTag} ?checked="${qb => qb.data.condition === 'or'}" ?disabled="${qb => qb.disabled}" @change="${(qb, c) => qb.changeCondition((c.event.target as Switch).checked, qb.data)}">
                <span slot="checked-message">Or</span>
                <span slot="unchecked-message">And</span>
            </${switchTag}>
            <div class="button-container">
                <${buttonTag} ?disabled="${qb => qb.disabled}" @click="${qb => qb.addRule(qb.data)}">Add rule</${buttonTag}>
                ${when(qb => qb.allowRuleset, html`<${buttonTag} ?disabled="${qb => qb.disabled}" @click="${qb => qb.addRuleSet()}">Add ruleset</${buttonTag}>`)}
            </div>
        </div>
        <div>
            ${repeat(qb => qb.data.rules, html`
                ${when((r, c) => c.parent.isRuleSet(r), (_, c) => ruleSetTemplate(c.parent, c.parent.data))}
                ${when((r, c) => !c.parent.isRuleSet(r), (_, c) => ruleTemplate(c.parent, c.parent.data))}
            `)}
        </div>
    </template
`;