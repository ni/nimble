import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import type { QueryBuilder } from '.';
import { Field, FieldType, Rule, RuleSet, Option } from './interfaces';

const booleanRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <nimble-checkbox
        ?disabled="${() => queryBuilder.disabled}"
        ?checked="${rule => rule.value}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput(c.event.target.checked, rule)}"
    ></nimble-checkbox>
`;

const stringRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <nimble-text-field
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput(c.event.target.value, rule)}"
        current-value="${rule => rule.value}"
    >
    </nimble-text-field>
`;

const numberRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <nimble-number-field
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput(c.event.target.value, rule)}"
        current-value="${rule => rule.value}"
    >
    </nimble-number-field>
`;

const categoryRuleTemplate: (queryBuilder: QueryBuilder) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder) => html<Rule>`
    <nimble-select
        ?disabled="${() => queryBuilder.disabled}"
        @change="${(rule: Rule, c) => queryBuilder.changeInput(c.event.target.value, rule)}"
        current-value="${rule => rule.value}"
    >
        ${repeat(rule => queryBuilder.getOptions(rule.field), html<Option>`
            <nimble-list-option value="${o => o.value}">${o => o.name}</nimble-list-option>`)}
    </nimble-select>
`;

const ruleTemplate: (queryBuilder: QueryBuilder, parentRuleSet: RuleSet) => ViewTemplate<Rule> = (queryBuilder: QueryBuilder, parentRuleSet: RuleSet) => html<Rule>`
    <div class="rule-row">
        <nimble-select ?disabled="${() => queryBuilder.disabled}" class="field-select" current-value="${x => x.field}" @change="${(rule, c) => queryBuilder.changeField(c.event.target.value, rule)}">
            ${repeat(() => queryBuilder.fields, html`<nimble-list-option value="${(f: Field) => f.value}">${(f: Field) => f.name}</nimble-list-option>`)}
        </nimble-select>
        <nimble-select ?disabled="${() => queryBuilder.disabled}" class="field-operator" current-value="${x => x.operator}" @change="${(rule, c) => queryBuilder.changeOperator(c.event.target.value, rule)}">
            ${repeat(rule => queryBuilder.getOperators(rule.field), html`<nimble-list-option value="${o => o}">${o => o}</nimble-list-option>`)}
        </nimble-select>

        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator) === FieldType.Boolean), booleanRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator) === FieldType.String), stringRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator) === FieldType.Number), numberRuleTemplate(queryBuilder))}
        ${when(rule => (queryBuilder.getInputType(rule.field, rule.operator) === FieldType.Category), categoryRuleTemplate(queryBuilder))}

        <div class="button-container">
            <nimble-button ?disabled="${() => queryBuilder.disabled}" @click="${rule => (queryBuilder.removeRule(rule, parentRuleSet))}" content-hidden>
                <nimble-xmark-icon slot="start"></nimble-xmark-icon>
                Remove Rule
            <nimble-button>
        </div>
    </div>
`;

const ruleSetTemplate: (queryBuilder: QueryBuilder, parentRuleSet: RuleSet | undefined) => ViewTemplate<RuleSet> = (queryBuilder: QueryBuilder, parentRuleSet: RuleSet | undefined) => html<RuleSet>`
    <div class="${() => (parentRuleSet ? 'nested-rule-set' : '')}">
        <div class="switch-group">
            <nimble-switch ?disabled="${() => queryBuilder.disabled}" ?checked="${ruleSet => ruleSet.condition === 'or'}" @change="${(ruleSet, c) => queryBuilder.changeCondition(c.event.target.checked, ruleSet)}">
                <span slot="checked-message">Or</span>
                <span slot="unchecked-message">And</span>
            </nimble-switch>
            <div class="button-container">
                <nimble-button ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.addRule(ruleSet)}">Add rule</nimble-button>
                ${when(() => queryBuilder.allowRuleset, html<RuleSet>`<nimble-button ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.addRuleSet(ruleSet)}">Add ruleset</nimble-button>`)}
                ${when(() => !!parentRuleSet && queryBuilder.allowRuleset, html<RuleSet>`<nimble-button ?disabled="${() => queryBuilder.disabled}" @click="${ruleSet => queryBuilder.removeRuleSet(ruleSet, parentRuleSet)}">Remove</nimble-button>`)}
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

// export const template = html<QueryBuilder>`
//     ${qb => ruleSetTemplate(qb, undefined)}
// `;

export const template = html<QueryBuilder>`
    <template>
        <div class="switch-group">
            <nimble-switch ?checked="${qb => qb.data.condition === 'or'}" ?disabled="${qb => qb.disabled}" @change="${(qb, c) => qb.changeCondition(c.event.target.checked, qb.data)}">
                <span slot="checked-message">Or</span>
                <span slot="unchecked-message">And</span>
            </nimble-switch>
            <div class="button-container">
                <nimble-button ?disabled="${qb => qb.disabled}" @click="${qb => qb.addRule(qb.data)}">Add rule</nimble-button>
                ${when(qb => qb.allowRuleset, html`<nimble-button ?disabled="${qb => qb.disabled}" @click="${qb => qb.addRuleSet()}">Add ruleset</nimble-button>`)}
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
