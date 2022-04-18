import { html, repeat, when } from '@microsoft/fast-element';
import type { QueryBuilder } from '.';
import { Field, FieldType, Rule } from './interfaces';

const ruleTemplate = html<Rule>`
    <div class="rule-row">
        <nimble-select class="field-select" current-value="${x => x.field}" @change="${(rule, c) => c.parent.changeField(c.event.target.value, rule)}">
            ${repeat((_, c) => c.parent.fields, html`<nimble-list-option value="${(f: Field) => f.value}">${(f: Field) => f.name}</nimble-list-option>`)}
        </nimble-select>
        <nimble-select class="field-operator" current-value="${x => x.operator}" @change="${(rule, c) => c.parent.changeOperator(c.event.target.value, rule)}">
            ${repeat((rule, c) => c.parent.getOperators(rule.field), html`<nimble-list-option value="${o => o}">${o => o}</nimble-list-option>`)}
        </nimble-select>

        ${when((rule, c) => (c.parent.getInputType(rule.field, rule.operator) === FieldType.Boolean), html`<nimble-checkbox @change="${(rule: Rule, c) => c.parent.changeInput(c.event.target.checked, rule)}"></nimble-checkbox>`)}
        ${when((rule, c) => (c.parent.getInputType(rule.field, rule.operator) === FieldType.String), html`<nimble-text-field @change="${(rule: Rule, c) => c.parent.changeInput(c.event.target.value, rule)}"></nimble-text-field>`)}

        <div class="button-container">
            <nimble-button @click="${(rule, c) => (c.parent.removeRule(rule))}" content-hidden>
                <nimble-xmark-icon slot="start"></nimble-xmark-icon>
                Remove Rule
            <nimble-button>
        </div>
    </div>
`;

export const template = html<QueryBuilder>`
    <template>
        <div class="switch-group">
            <nimble-switch ?checked="${qb => qb.data.condition === 'or'}" @change="${(qb, c) => qb.changeCondition(c.event.target.checked, qb.data)}">
                <span slot="checked-message">Or</span>
                <span slot="unchecked-message">And</span>
            </nimble-switch>
            <div class="button-container">
                <nimble-button @click="${qb => qb.addRule()}">Add rule</nimble-button>
                <nimble-button @click="${qb => qb.addRuleSet()}">Add ruleset</nimble-button>
                ${when(qb => (!!qb.parentValue && qb.allowRuleset), html`<nimble-button @click="${qb => qb.removeRuleSet()}">Remove</nimble-button>`)}
            </div>
        </div>
        <div>
            ${repeat(qb => qb.data.rules, ruleTemplate)}
        </div>
    
    ${/* <div #treeContainer (transitionend)="transitionEnd($event)" [ngClass]="getClassNames('treeContainer', data.collapsed ? 'collapsed' : null)">
        <ul [ngClass]="getClassNames('tree')" *ngIf="data && data.rules">
        <ng-container *ngFor="let rule of data.rules;let i=index">

            <ng-container *ngIf="{ruleset: !!rule.rules, invalid: !config.allowEmptyRulesets && rule.rules && rule.rules.length === 0} as local">
            <li [ngClass]="getQueryItemClassName(local)">
                <ng-container *ngIf="!local.ruleset">

                <ng-container *ngIf="getRemoveButtonTemplate() as template; else defaultRemoveButton">
                    <div [ngClass]="getClassNames('buttonGroup', 'rightAlign')">
                    <ng-container *ngTemplateOutlet="template; context: getRemoveButtonContext(rule)"></ng-container>
                    </div>
                </ng-container>

                <ng-template #defaultRemoveButton>
                    <div [ngClass]="getClassNames('removeButtonSize', 'rightAlign')">
                    <button type="button" [ngClass]="getClassNames('button', 'removeButton')" (click)="removeRule(rule, data)" [disabled]=disabled>
                        <i [ngClass]="getClassNames('removeIcon')"></i>
                    </button>
                    </div>
                </ng-template>

                <div *ngIf="entities?.length > 0" class="q-inline-block-display">
                    <ng-container *ngIf="getEntityTemplate() as template; else defaultEntity">
                    <ng-container *ngTemplateOutlet="template; context: getEntityContext(rule)"></ng-container>
                    </ng-container>
                </div>

                <ng-template #defaultEntity>
                    <div [ngClass]="getClassNames('entityControlSize')">
                    <select [ngClass]="getClassNames('entityControl')" [(ngModel)]="rule.entity" (ngModelChange)="changeEntity($event, rule,i,data)"
                        [disabled]="disabled">
                        <option *ngFor="let entity of entities" [ngValue]="entity.value">
                        {{entity.name}}
                        </option>
                    </select>
                    </div>
                </ng-template>

                <ng-container *ngIf="getFieldTemplate() as template; else defaultField">
                    <ng-container *ngTemplateOutlet="template; context: getFieldContext(rule)"></ng-container>
                </ng-container>

                <ng-template #defaultField>
                    <div [ngClass]="getClassNames('fieldControlSize')">
                    <select [ngClass]="getClassNames('fieldControl')" [(ngModel)]="rule.field" (ngModelChange)="changeField($event, rule)"
                        [disabled]="disabled">
                        <option *ngFor="let field of getFields(rule.entity)" [ngValue]="field.value">
                        {{field.name}}
                        </option>
                    </select>
                    </div>
                </ng-template>

                <ng-container *ngIf="getOperatorTemplate() as template; else defaultOperator">
                    <ng-container *ngTemplateOutlet="template; context: getOperatorContext(rule)"></ng-container>
                </ng-container>

                <ng-template #defaultOperator>
                    <div [ngClass]="getClassNames('operatorControlSize')">
                    <select [ngClass]="getClassNames('operatorControl')" [(ngModel)]="rule.operator" (ngModelChange)="changeOperator(rule)"
                        [disabled]="disabled">
                        <option *ngFor="let operator of getOperators(rule.field)" [ngValue]="operator">
                        {{operator}}
                        </option>
                    </select>
                    </div>
                </ng-template>

                <ng-container *ngIf="findTemplateForRule(rule) as template; else defaultInput">
                    <ng-container *ngTemplateOutlet="template; context: getInputContext(rule)"></ng-container>
                </ng-container>

                <ng-template #defaultInput>
                    <div [ngClass]="getClassNames('inputControlSize')" [ngSwitch]="getInputType(rule.field, rule.operator)">
                    <input [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'string'" type="text">
                    <input [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'number'" type="number">
                    <input [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'date'" type="date">
                    <input [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'time'" type="time">
                    <select [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'category'">
                        <option *ngFor="let opt of getOptions(rule.field)" [ngValue]="opt.value">
                        {{opt.name}}
                        </option>
                    </select>
                    <ng-container *ngSwitchCase="'multiselect'">
                        <select [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" multiple>
                        <option *ngFor="let opt of getOptions(rule.field)" [ngValue]="opt.value">
                            {{opt.name}}
                        </option>
                        </select>
                    </ng-container>
                    <input [ngClass]="getClassNames('inputControl')" [(ngModel)]="rule.value" (ngModelChange)="changeInput()"
                        [disabled]="disabled" *ngSwitchCase="'boolean'" type="checkbox">
                    </div>
                </ng-template>

                </ng-container>
                <query-builder *ngIf="local.ruleset" [data]="rule" [disabled]="disabled" [parentTouchedCallback]="parentTouchedCallback || onTouchedCallback"
                [parentChangeCallback]="parentChangeCallback || onChangeCallback" [parentInputTemplates]="parentInputTemplates || inputTemplates"
                [parentOperatorTemplate]="parentOperatorTemplate || operatorTemplate" [parentFieldTemplate]="parentFieldTemplate || fieldTemplate"
                [parentEntityTemplate]="parentEntityTemplate || entityTemplate" [parentSwitchGroupTemplate]="parentSwitchGroupTemplate || switchGroupTemplate"
                [parentButtonGroupTemplate]="parentButtonGroupTemplate || buttonGroupTemplate" [parentRemoveButtonTemplate]="parentRemoveButtonTemplate || removeButtonTemplate"
                [parentEmptyWarningTemplate]="parentEmptyWarningTemplate || emptyWarningTemplate" [parentArrowIconTemplate]="parentArrowIconTemplate || arrowIconTemplate"
                [parentValue]="data" [classNames]="classNames" [config]="config" [allowRuleset]="allowRuleset"
                [allowCollapse]="allowCollapse" [emptyMessage]="emptyMessage" [operatorMap]="operatorMap">
                </query-builder>

                <ng-container *ngIf="getEmptyWarningTemplate() as template; else defaultEmptyWarning">
                <ng-container *ngIf="local.invalid">
                    <ng-container *ngTemplateOutlet="template; context: getEmptyWarningContext()"></ng-container>
                </ng-container>
                </ng-container>

                <ng-template #defaultEmptyWarning>
                <p [ngClass]="getClassNames('emptyWarning')" *ngIf="local.invalid">
                    {{emptyMessage}}
                </p>
                </ng-template>
            </li>
            </ng-container>
        </ng-container>
        </ul>
</div> */ ''}
    </template
`;
