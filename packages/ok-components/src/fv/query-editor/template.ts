import { html, ref, repeat, when } from '@ni/fast-element';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconAddTag } from '@ni/nimble-components/dist/esm/icons/add';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { fvChipSelectorTag } from '../chip-selector';
import { fvExpandableChipTag } from '../expandable-chip';
import type {
    FvQueryEditor,
    QueryEditorLineView,
    QueryEditorOptionView,
    QueryEditorPartView,
    QueryEditorSuggestion
} from '.';
import type {
    QueryBuilderField,
    QueryBuilderLogicalOperator,
    QueryBuilderOperatorDefinition
} from '../query-builder/types';

const fieldOptionTemplate = html<QueryBuilderField, FvQueryEditor>`
    <${listOptionTag} value="${x => x.id}">${x => x.label}</${listOptionTag}>
`;

const operatorOptionTemplate = html<QueryBuilderOperatorDefinition, FvQueryEditor>`
    <${listOptionTag} value="${x => x.id}">${(x, c) => c.parent.getOperatorLabel(x.id)}</${listOptionTag}>
`;

const enumOptionTemplate = html<QueryEditorOptionView, FvQueryEditor>`
    <${listOptionTag} value="${x => x.value}" ?disabled="${x => x.disabled ?? false}">${x => x.label}</${listOptionTag}>
`;

const conditionValueTemplate = html<QueryEditorPartView>`<span class="condition-value"> ${x => x.valueLabel}</span>`;

const suggestionTemplate = html<QueryEditorSuggestion, QueryEditorPartView>`
    <div
        class="suggestion"
        role="option"
        id="${(_, c) => `${c.parent.owner.editorId}-suggestion-${c.index}`}"
        data-action="select-suggestion"
        data-suggestion-index="${(_, c) => c.index}"
        aria-selected="${(_, c) => String(c.parent.owner.activeSuggestionIndex === c.index)}"
        @pointermove="${(_, c) => {
            c.parent.owner.activeSuggestionIndex = c.index;
        }}"
    >
        <span class="suggestion-label">${x => x.label}</span>
        <span class="suggestion-detail">${x => x.detail}</span>
    </div>
`;

const suggestionListTemplate = html<QueryEditorPartView, FvQueryEditor>`
    <div
        class="suggestions"
        id="${x => x.owner.suggestionListId}"
        data-suggestion-kind="${x => x.owner.suggestions[0]?.kind ?? ''}"
        role="listbox"
        aria-label="${x => {
            return x.owner.suggestions[0]?.kind === 'logic'
                ? x.owner.labels.logicalOperator
                : x.owner.labels.matchingFields;
        }}"
        ?hidden="${x => x.owner.suggestions.length === 0}"
        @click="${(x, c) => x.owner.handleSuggestionChange(c.event)}"
    >
        ${repeat(
            x => x.owner.suggestions,
            suggestionTemplate,
            { positioning: true }
        )}
    </div>
`;

const logicChipPreviewTemplate = html<QueryBuilderLogicalOperator, QueryEditorPartView>`
    <${buttonTag}
        class="logic-chip logic-chip-preview"
        appearance="outline"
        appearance-variant="${x => (x === 'or' ? 'accent' : 'primary')}"
        data-action="complete-logic"
        data-logic="${x => x}"
        ?disabled="${(_, c) => c.parent.owner.disabled}"
    >${(x, c) => (x === 'and' ? c.parent.owner.labels.and : c.parent.owner.labels.or)}</${buttonTag}>
`;

const logicChipPreviewsTemplate = html<QueryEditorPartView, FvQueryEditor>`
    <div
        class="logic-chip-previews"
        data-layout-role="operator"
        data-indent-level="${x => x.indentLevel}"
        role="group"
        aria-label="${x => x.owner.labels.logicalOperator}"
    >
        ${repeat(x => x.owner.logicChipPreviewOptions, logicChipPreviewTemplate, { positioning: true })}
    </div>
`;

const insertionTemplate = html<QueryEditorPartView, FvQueryEditor>`
    <span
        class="insertion-slot"
        data-layout-role="${x => x.layoutRole}"
        data-indent-level="${x => x.indentLevel}"
        data-indent="${x => String(x.indented)}"
        data-before-group="${x => String(x.owner.editorTokens[x.position]?.kind === 'open')}"
        data-after-group-open="${x => String(x.position > 0 && x.owner.editorTokens[x.position - 1]?.kind === 'open')}"
    >
        ${when(
            x => x.owner.caretPosition === x.position,
            html<QueryEditorPartView, FvQueryEditor>`
                <${textFieldTag}
                    class="query-input"
                    appearance="frameless"
                    full-bleed
                    data-control="query-input"
                    aria-label="${x => x.owner.label}"
                    placeholder="${x => (x.owner.editorTokens.length === 0 ? x.owner.labels.queryHelperText : '')}"
                    autocomplete="off"
                    :value="${x => x.owner.queryInputText}"
                    data-empty="${x => String(x.owner.queryInputText.length === 0)}"
                    data-placeholder="${x => String(x.owner.editorTokens.length === 0 && x.owner.queryInputText.length === 0)}"
                    style="${x => `--query-input-width: ${x.owner.queryInputWidth}`}"
                    ?disabled="${x => x.owner.disabled}"
                ></${textFieldTag}>
            `
        )}
        ${when(
            x => x.owner.caretPosition !== x.position,
            html<QueryEditorPartView, FvQueryEditor>`
                <span
                    class="caret-target"
                    data-action="set-caret"
                    data-position="${x => x.position}"
                    aria-hidden="true"
                ></span>
            `
        )}
        ${when(x => x.owner.caretPosition === x.position, suggestionListTemplate)}
    </span>
`;

const partTemplate = html<QueryEditorPartView, FvQueryEditor>`
    ${when(x => x.kind === 'insertion', insertionTemplate)}
    ${when(
        x => x.kind === 'insertion' && x.position === x.owner.caretPosition && x.owner.shouldShowLogicChipPreviews,
        logicChipPreviewsTemplate
    )}
    ${when(
        x => x.kind === 'condition' && x.rule !== null,
        html<QueryEditorPartView, FvQueryEditor>`
            <${fvExpandableChipTag}
                class="condition-chip"
                data-rule-id="${x => x.rule?.id ?? ''}"
                data-token-index="${x => x.tokenIndex}"
                data-state="${x => x.state}"
                data-layout-role="${x => x.layoutRole}"
                data-indent-level="${x => x.indentLevel}"
                data-indent="${x => String(x.indented)}"
                accessible-label="${x => `${x.owner.labels.editRule}: ${x.text}${x.stateLabel ? `, ${x.stateLabel}` : ''}`}"
                controls="${x => x.owner.editorPanelId}"
                ?expanded="${x => x.owner.activeRuleId === x.rule?.id}"
                ?disabled="${x => x.owner.disabled}"
            ><span class="condition-summary">${x => x.fieldLabel} <strong class="condition-operator">${x => x.operatorLabel}</strong>${when(x => x.valueLabel.length > 0, conditionValueTemplate)}</span></${fvExpandableChipTag}>
        `
    )}
    ${when(
        x => x.kind === 'logic',
        html<QueryEditorPartView, FvQueryEditor>`
            <${buttonTag}
                class="logic-chip"
                appearance="block"
                appearance-variant="${x => (x.logic === 'or' ? 'accent' : 'primary')}"
                data-action="toggle-logic"
                data-token-index="${x => x.tokenIndex}"
                data-logic="${x => x.logic ?? ''}"
                data-layout-role="${x => x.layoutRole}"
                data-indent-level="${x => x.indentLevel}"
                data-indent="${x => String(x.indented)}"
                aria-label="${x => x.owner.getLogicAccessibleLabel(x.logic ?? 'and')}"
                ?disabled="${x => x.owner.disabled}"
            >${x => x.text}</${buttonTag}>
        `
    )}
    ${when(
        x => x.kind === 'open' || x.kind === 'close',
        html<QueryEditorPartView, FvQueryEditor>`
            <span
                class="group-parenthesis"
                data-token-index="${x => x.tokenIndex}"
                data-layout-role="${x => x.layoutRole}"
                data-indent-level="${x => x.indentLevel}"
                data-indent="${x => String(x.indented)}"
                role="img"
                aria-label="${x => x.owner.getPartAccessibleLabel(x.kind)}"
            >${x => x.text}</span>
        `
    )}
`;

const formattedLineTemplate = html<QueryEditorLineView, FvQueryEditor>`
    <div
        class="formatted-row"
        data-indent-level="${x => x.indentLevel}"
    >
        ${repeat(x => x.parts, partTemplate, { positioning: true })}
    </div>
`;

export const template = html<FvQueryEditor>`
    <div
        class="query-editor"
        role="group"
        aria-label="${x => x.label}"
        aria-disabled="${x => String(x.disabled)}"
        @click="${(x, c) => x.handleClick(c.event)}"
        @input="${(x, c) => x.handleInput(c.event)}"
        @change="${(x, c) => x.handleChange(c.event)}"
        @focusin="${(x, c) => x.handleEditorFocusIn(c.event)}"
        @focusout="${(x, c) => x.handleEditorFocusOut(c.event)}"
        @keydown="${(x, c) => {
            x.handleKeydown(c.event as KeyboardEvent);
            return true;
        }}"
    >
        <div class="conditions-heading" part="conditions-heading">
            <strong>${x => x.label}</strong>
        </div>
        ${when(
            x => x.layout === 'formatted',
            html<FvQueryEditor>`
                <div class="editor-field" data-layout="formatted" aria-label="${x => x.label}">
                    ${repeat(x => x.formattedRows, formattedLineTemplate, { positioning: true })}
                </div>
            `
        )}
        ${when(
            x => x.layout !== 'formatted',
            html<FvQueryEditor>`
                <div class="editor-field" data-layout="inline" aria-label="${x => x.label}">
                    ${repeat(x => x.parts, partTemplate, { positioning: true })}
                </div>
            `
        )}
        ${when(
            x => x.structureError.length > 0,
            html<FvQueryEditor>`
                <div class="structure-error" role="status">${x => x.structureError}</div>
            `
        )}
        <div class="editor-actions">
            <${buttonTag}
                class="add-filter-button"
                appearance="ghost"
                data-action="add-filter"
                ?disabled="${x => !x.canAddFilter}"
            >
                <${iconAddTag} slot="start"></${iconAddTag}>
                ${x => x.labels.addFilter}
            </${buttonTag}>
            ${when(
                x => !x.canAddFilter,
                html<FvQueryEditor>`<span class="no-fields">${x => x.labels.noAvailableFields}</span>`
            )}
        </div>
        ${when(
            x => Boolean(x.activeRule),
            html<FvQueryEditor>`
                <${anchoredRegionTag}
                    class="editor-region"
                    ${ref('editorRegion')}
                    fixed-placement
                    auto-update-mode="auto"
                    vertical-default-position="bottom"
                    vertical-positioning-mode="locktodefault"
                    horizontal-default-position="right"
                    horizontal-positioning-mode="locktodefault"
                    horizontal-inset
                    horizontal-viewport-lock
                    @loaded="${x => x.handleEditorRegionLayout()}"
                    @positionchange="${x => x.handleEditorRegionLayout()}"
                >
                    <div
                        class="editor-panel-container"
                        data-has-arrow="${x => String(x.editorPanelArrowOffset !== null)}"
                        style="${x => `--editor-panel-arrow-offset: ${x.editorPanelArrowOffset ?? '0px'}`}"
                    >
                        ${when(
                            x => x.editorPanelArrowOffset !== null,
                            html<FvQueryEditor>`
                                <span
                                    class="editor-panel-arrow"
                                    aria-hidden="true"
                                ></span>
                            `
                        )}
                        <section
                            class="editor-panel"
                            id="${x => x.editorPanelId}"
                            role="dialog"
                            aria-label="${x => x.labels.editRule}"
                        >
                        <${selectTag}
                            class="editor-control"
                            data-control="field"
                            :value="${x => x.activeField?.id ?? ''}"
                        >
                            ${x => x.labels.field}
                            ${repeat(x => x.availableFields, fieldOptionTemplate, { positioning: true })}
                        </${selectTag}>
                        <${selectTag}
                            class="editor-control"
                            data-control="operator"
                            :value="${x => x.activeRule?.operatorId ?? ''}"
                        >
                            ${x => x.labels.operator}
                            ${repeat(x => x.activeOperators, operatorOptionTemplate, { positioning: true })}
                        </${selectTag}>
                        ${when(
                            x => x.activeOperandKind === 'none',
                            html<FvQueryEditor>`<div class="no-value">${x => x.activeOperatorLabel}</div>`
                        )}
                        ${when(
                            x => x.activeOperandKind === 'scalar',
                            html<FvQueryEditor>`
                                ${when(
                                    x => x.activeField?.type === 'boolean',
                                    html<FvQueryEditor>`
                                        <${selectTag}
                                            class="editor-control"
                                            data-control="boolean-value"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveScalarValue()}"
                                        >
                                            ${x => x.labels.value}
                                            <${listOptionTag} value="">${x => x.labels.unset}</${listOptionTag}>
                                            <${listOptionTag} value="true">${x => x.labels.true}</${listOptionTag}>
                                            <${listOptionTag} value="false">${x => x.labels.false}</${listOptionTag}>
                                        </${selectTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type === 'enum' && !x.isActiveCombobox,
                                    html<FvQueryEditor>`
                                        <${selectTag}
                                            class="editor-control"
                                            data-control="scalar-select"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveScalarValue()}"
                                        >
                                            ${x => x.labels.value}
                                            <${listOptionTag} value="">${x => x.labels.unset}</${listOptionTag}>
                                            ${repeat(x => x.activeOptions, enumOptionTemplate, { positioning: true })}
                                        </${selectTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type === 'enum' && x.isActiveCombobox,
                                    html<FvQueryEditor>`
                                        <${textFieldTag}
                                            class="editor-control"
                                            data-control="scalar-text"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveScalarValue()}"
                                        >
                                            ${x => x.labels.value}
                                        </${textFieldTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type === 'number' || x.activeField?.type === 'date' || x.activeField?.type === 'string' || x.activeField?.type === 'array',
                                    html<FvQueryEditor>`
                                        ${when(
                                            x => x.activeField?.type === 'number',
                                            html<FvQueryEditor>`
                                                <${numberFieldTag}
                                                    class="editor-control"
                                                    data-control="scalar-number"
                                                    aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                                    aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                                    :value="${x => x.getActiveScalarValue()}"
                                                >
                                                    ${x => x.labels.value}
                                                </${numberFieldTag}>
                                            `
                                        )}
                                        ${when(
                                            x => x.activeField?.type !== 'number',
                                            html<FvQueryEditor>`
                                                <${textFieldTag}
                                                    class="editor-control"
                                                    type="${x => x.getActiveScalarInputType()}"
                                                    data-control="scalar-text"
                                                    aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                                    aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                                    :value="${x => x.getActiveScalarValue()}"
                                                >
                                                    ${x => x.labels.value}
                                                </${textFieldTag}>
                                            `
                                        )}
                                    `
                                )}
                            `
                        )}
                        ${when(
                            x => x.activeOperandKind === 'collection',
                            html<FvQueryEditor>`
                                ${when(
                                    x => x.activeField?.type === 'enum' && Boolean(x.definition),
                                    html<FvQueryEditor>`
                                        <${fvChipSelectorTag}
                                            class="editor-control collection-selector"
                                            data-control="collection-selector"
                                            label="${x => x.labels.value}"
                                            placeholder="${x => x.labels.value}"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :optionItems="${x => x.activeCollectionOptions}"
                                            :selectedOptionValues="${x => x.activeCollectionOptionValues}"
                                        ></${fvChipSelectorTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type === 'enum' && !x.definition,
                                    html<FvQueryEditor>`
                                        <${fvChipSelectorTag}
                                            class="editor-control collection-selector"
                                            data-control="collection-selector"
                                            label="${x => x.labels.value}"
                                            placeholder="${x => x.labels.value}"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            options="${x => x.activeCollectionOptionLabels}"
                                            :selectedValues="${x => x.getActiveCollectionSelectorValues()}"
                                        ></${fvChipSelectorTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type !== 'enum',
                                    html<FvQueryEditor>`
                                        <${textFieldTag}
                                            class="editor-control"
                                            data-control="collection-values"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveCollectionInput()}"
                                        >
                                            ${x => x.labels.value}
                                        </${textFieldTag}>
                                    `
                                )}
                            `
                        )}
                        ${when(
                            x => x.activeOperandKind === 'range',
                            html<FvQueryEditor>`
                                ${when(
                                    x => x.activeField?.type === 'number',
                                    html<FvQueryEditor>`
                                        <${numberFieldTag}
                                            class="editor-control"
                                            data-control="range-start"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveRangeValue('start')}"
                                        >
                                            ${x => x.labels.rangeStart}
                                        </${numberFieldTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type !== 'number',
                                    html<FvQueryEditor>`
                                        <${textFieldTag}
                                            class="editor-control"
                                            type="${x => x.getActiveScalarInputType()}"
                                            data-control="range-start"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveRangeValue('start')}"
                                        >
                                            ${x => x.labels.rangeStart}
                                        </${textFieldTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type === 'number',
                                    html<FvQueryEditor>`
                                        <${numberFieldTag}
                                            class="editor-control"
                                            data-control="range-end"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveRangeValue('end')}"
                                        >
                                            ${x => x.labels.rangeEnd}
                                        </${numberFieldTag}>
                                    `
                                )}
                                ${when(
                                    x => x.activeField?.type !== 'number',
                                    html<FvQueryEditor>`
                                        <${textFieldTag}
                                            class="editor-control"
                                            type="${x => x.getActiveScalarInputType()}"
                                            data-control="range-end"
                                            aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                            aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                            :value="${x => x.getActiveRangeValue('end')}"
                                        >
                                            ${x => x.labels.rangeEnd}
                                        </${textFieldTag}>
                                    `
                                )}
                            `
                        )}
                        ${when(
                            x => x.activeOperandKind === 'key' || x.activeOperandKind === 'key-value',
                            html<FvQueryEditor>`
                                <${textFieldTag}
                                    class="editor-control"
                                    data-control="property-key"
                                    aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                    aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                    :value="${x => x.getActivePropertyKey()}"
                                >
                                    ${x => x.labels.key}
                                </${textFieldTag}>
                            `
                        )}
                        ${when(
                            x => x.activeOperandKind === 'key-value',
                            html<FvQueryEditor>`
                                <${textFieldTag}
                                    class="editor-control"
                                    data-control="property-value"
                                    aria-invalid="${x => String(Boolean(x.activeRuleError))}"
                                    aria-errormessage="${x => (x.activeRuleError ? x.editorPanelErrorId : '')}"
                                    :value="${x => x.getActivePropertyValue()}"
                                >
                                    ${x => x.labels.comparisonValue}
                                </${textFieldTag}>
                            `
                        )}
                        ${when(
                            x => x.activeRuleError.length > 0,
                            html<FvQueryEditor>`
                                <div class="editor-error" id="${x => x.editorPanelErrorId}" role="alert">${x => x.activeRuleError}</div>
                            `
                        )}
                        ${when(
                            x => x.optionState.status === 'loading',
                            html<FvQueryEditor>`<div class="option-status" role="status">${x => x.labels.loadingOptions}</div>`
                        )}
                        ${when(
                            x => x.optionStateMessage.length > 0,
                            html<FvQueryEditor>`<div class="option-status" role="alert">${x => x.optionStateMessage}</div>`
                        )}
                        ${when(
                            x => x.optionState.status === 'ready' && Boolean(x.optionState.nextCursor),
                            html<FvQueryEditor>`
                                <${buttonTag}
                                    class="load-more-options"
                                    appearance="outline"
                                    data-action="load-more-options"
                                >${x => x.labels.loadMoreOptions ?? 'Load more options'}</${buttonTag}>
                            `
                        )}
                        ${when(
                            x => x.optionState.status === 'error',
                            html<FvQueryEditor>`
                                <${buttonTag}
                                    class="retry-options"
                                    appearance="outline"
                                    data-action="retry-options"
                                >${x => x.labels.retryOptions ?? 'Retry'}</${buttonTag}>
                            `
                        )}
                        </section>
                    </div>
                </${anchoredRegionTag}>
            `
        )}
    </div>
`;
