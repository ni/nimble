import { html, ref, repeat, when } from '@ni/fast-element';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconBookMagnifyingGlassTag } from '@ni/nimble-components/dist/esm/icons/book-magnifying-glass';
import { iconSparklesTag } from '@ni/nimble-components/dist/esm/icons/sparkles';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { fvQueryEditorTag } from '../query-editor';
import { fvSplitButtonTag } from '../split-button';
import type { FvQueryBuilder } from '.';

interface SavedQueryTemplateView {
    readonly id: string;
    readonly name: string;
    readonly dirty: boolean;
    readonly selected: boolean;
    readonly unsaved: boolean;
    readonly unsavedChangesLabel: string;
}

export const template = html<FvQueryBuilder>`
    <div
        class="query-builder"
        role="group"
        aria-label="${x => x.label}"
        aria-disabled="${x => String(x.disabled)}"
        @click="${(x, c) => x.handleClick(c.event)}"
        @input="${(x, c) => x.handleInput(c.event)}"
        @change="${(x, c) => x.handleClick(c.event)}"
        @query-change="${(x, c) => x.handleEditorChange(c.event)}"
        @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}"
    >
            <${fvSplitButtonTag}
                class="queries-menu-button"
                appearance="ghost"
                data-control="saved-query-menu-button"
                ${ref('savedQueryMenuButton')}
                ?disabled="${x => x.isEditorDisabled}"
                ?open="${x => x.isSavedMenuOpen}"
                label="${x => x.queryButtonLabel}"
                @trigger="${x => x.openQuickEditor()}"
                @toggle="${(x, c) => x.handleSavedMenuToggle(c.event)}"
            >
                <span class="query-trigger-content">
                    <${iconBookMagnifyingGlassTag}></${iconBookMagnifyingGlassTag}>
                    <span class="menu-button-label">${x => x.queryButtonLabel}</span>
                    ${when(x => x.selectedQueryIsDirty, html<FvQueryBuilder>`
                        <span class="dirty-indicator" aria-hidden="true">●</span>
                        <span class="visually-hidden">${x => x.labels.unsavedChanges}</span>
                    `)}
                </span>
                <${menuTag}
                    slot="menu"
                    class="saved-query-menu"
                    id="${x => x.savedMenuId}"
                    aria-label="${x => x.labels.selectSavedQuery}"
                >
                    <${menuItemTag}
                        class="saved-query-option"
                        role="menuitem"
                        aria-current="${x => (x.selectedSavedQueryId === null && x.selectedUnsavedDraftId === null ? 'true' : null)}"
                        data-action="select-current-query"
                    >
                        <span slot="start" aria-hidden="true">${x => (x.selectedSavedQueryId === null && x.selectedUnsavedDraftId === null ? '✓' : '')}</span>
                        ${x => x.labels.currentQuery}
                    </${menuItemTag}>
                    ${repeat(x => x.savedQueryViews, html<SavedQueryTemplateView, FvQueryBuilder>`
                        <${menuItemTag}
                            class="saved-query-option"
                            role="menuitem"
                            aria-current="${x => (x.selected ? 'true' : null)}"
                            data-action="${x => (x.unsaved ? 'select-unsaved-draft' : 'select-saved-query')}"
                            data-saved-query-id="${x => x.id}"
                        >
                            <span slot="start" aria-hidden="true">${x => (x.selected ? '✓' : '')}</span>
                            ${x => x.name}
                            ${when(x => x.dirty, html<SavedQueryTemplateView, FvQueryBuilder>`
                                <span class="dirty-indicator" aria-hidden="true">●</span>
                                <span class="visually-hidden">${x => x.unsavedChangesLabel}</span>
                            `)}
                        </${menuItemTag}>
                    `)}
                    ${when(x => x.savedQueryViews.length === 0, html<FvQueryBuilder>`
                        <${menuItemTag} disabled>${x => x.labels.noSavedQueries}</${menuItemTag}>
                    `)}
                    <hr role="separator">
                    ${when(x => x.savedQueryCreationEnabled, html<FvQueryBuilder>`
                        <${menuItemTag}
                            role="menuitem"
                            data-action="save-as-new"
                            ?disabled="${x => x.isEditorDisabled || !x.saveHandler}"
                        >${x => x.labels.saveAsNew}</${menuItemTag}>
                    `)}
                    ${when(x => x.savedQueryEditingEnabled && x.selectedSavedQueryId !== null && x.selectedQueryIsDirty, html<FvQueryBuilder>`
                        <${menuItemTag}
                            role="menuitem"
                            data-action="update-saved-query"
                            ?disabled="${x => !x.canSaveChanges}"
                        >${x => x.labels.updateSavedQuery}</${menuItemTag}>
                    `)}
                    ${when(
                        x => (
                            x.selectedSavedQueryId === null
                                ? x.savedQueryCreationEnabled
                                : x.savedQueryEditingEnabled || x.savedQueryDeletionEnabled
                        ),
                        html<FvQueryBuilder>`
                            <${menuItemTag}
                                role="menuitem"
                                data-action="edit-saved-queries"
                                ?disabled="${x => x.isEditorDisabled}"
                            >${x => (
                                x.selectedSavedQueryId !== null
                                    && !x.savedQueryEditingEnabled
                                    && x.savedQueryDeletionEnabled
                                    ? x.labels.manageSavedQueries
                                    : x.labels.editSavedQueries
                            )}</${menuItemTag}>
                        `
                    )}
                </${menuTag}>
            </${fvSplitButtonTag}>
        <div
            class="query-viewport"
            style="position: fixed; inset: 0; pointer-events: none; opacity: 0;"
            aria-hidden="true"
            ${ref('queryViewport')}
        ></div>
        <${anchoredRegionTag}
            class="query-popover-region"
            ${ref('queryPopoverRegion')}
            :anchorElement="${x => (x.isManagerOpen ? x.savedQueryMenuButton ?? null : null)}"
            :viewportElement="${x => x.queryViewport ?? null}"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="bottom"
            vertical-positioning-mode="dynamic"
            vertical-viewport-lock
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-inset
            horizontal-viewport-lock
            @loaded="${x => x.handleQueryPopoverLoaded()}"
        >
            <section
                class="query-popover saved-query-manager"
                id="${x => x.queryDialogId}"
                role="dialog"
                aria-labelledby="${x => `${x.queryDialogId}-title`}"
                ?hidden="${x => !x.isManagerOpen}"
                @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}"
            >
                <header
                    class="popover-header"
                    @pointerdown="${(x, c) => x.handlePopoverDragStart(c.event as PointerEvent)}"
                    @pointermove="${(x, c) => x.handlePopoverDragMove(c.event as PointerEvent)}"
                    @pointerup="${(x, c) => x.handlePopoverDragEnd(c.event as PointerEvent)}"
                    @pointercancel="${(x, c) => x.handlePopoverDragEnd(c.event as PointerEvent)}"
                    @dblclick="${x => x.resetPopoverDrag()}"
                >
                    <h2 id="${x => `${x.queryDialogId}-title`}">
                        ${x => {
                            if (x.isQuickEdit) {
                                return x.labels.configureQuery;
                            }
                            if (x.isCreatingSavedQuery) {
                                return x.labels.createSavedQuery;
                            }
                            return x.selectedSavedQueryId !== null
                                && !x.savedQueryEditingEnabled
                                && x.savedQueryDeletionEnabled
                                ? x.labels.manageSavedQueries
                                : x.labels.editSavedQueries;
                        }}
                    </h2>
                    <div
                        class="popover-move-controls"
                        style="position: absolute; top: 8px; right: 24px; display: flex; align-items: center; gap: 4px;"
                    >
                        <${buttonTag}
                            appearance="ghost"
                            data-action="toggle-popover-move-mode"
                            aria-pressed="${x => String(x.isPopoverMoveMode)}"
                            aria-label="${x => (x.isPopoverMoveMode ? x.labels.finishMovingPopover : x.labels.movePopover)}"
                            title="${x => x.labels.movePopoverHint}"
                        >${x => (x.isPopoverMoveMode ? x.labels.finishMovingPopover : x.labels.movePopover)}</${buttonTag}>
                        ${when(x => x.isPopoverMoveMode, html<FvQueryBuilder>`
                            <span class="visually-hidden" role="status">${x => x.labels.movePopoverHint}</span>
                            <${buttonTag} appearance="ghost" data-action="move-popover-up" aria-label="${x => x.labels.movePopoverUp}">↑</${buttonTag}>
                            <${buttonTag} appearance="ghost" data-action="move-popover-down" aria-label="${x => x.labels.movePopoverDown}">↓</${buttonTag}>
                            <${buttonTag} appearance="ghost" data-action="move-popover-left" aria-label="${x => x.labels.movePopoverLeft}">←</${buttonTag}>
                            <${buttonTag} appearance="ghost" data-action="move-popover-right" aria-label="${x => x.labels.movePopoverRight}">→</${buttonTag}>
                        `)}
                    </div>
                </header>
                <div class="popover-content">
                    <div class="query-controls-header">
                        ${when(x => !x.isQuickEdit && (x.isCreatingSavedQuery || x.savedQueryEditingEnabled), html<FvQueryBuilder>`
                            <div class="query-name-control">
                                <${textFieldTag}
                                    class="query-name-input"
                                    appearance="outline"
                                    data-control="saved-query-name"
                                    ${ref('queryNameInput')}
                                    aria-invalid="${x => String(Boolean(x.operationError))}"
                                    aria-errormessage="${x => (x.operationError ? `${x.queryDialogId}-error` : '')}"
                                    placeholder="${x => x.labels.queryName}"
                                    :value="${x => x.savedQueryName}"
                                    :disabled="${x => x.isEditorDisabled}"
                                >${x => x.labels.queryName}</${textFieldTag}>
                                ${when(x => x.operationError, html<FvQueryBuilder>`
                                    <span class="operation-error" id="${x => `${x.queryDialogId}-error`}" role="alert">
                                        ${x => x.operationError}
                                    </span>
                                `)}
                            </div>
                        `)}
                        ${when(x => x.isNigelPromptEnabled, html<FvQueryBuilder>`
                            <div class="ai-prompt-toggle-row">
                                <${buttonTag}
                                    class="ai-prompt-toggle"
                                    appearance="ghost"
                                    data-action="toggle-ai-prompt"
                                    ${ref('aiPromptTrigger')}
                                    ?disabled="${x => x.isEditorDisabled}"
                                    aria-expanded="${x => String(x.isAiPromptOpen)}"
                                    aria-controls="${x => x.aiDialogId}"
                                >
                                    <${iconSparklesTag} slot="start"></${iconSparklesTag}>${x => x.labels.askAi}
                                </${buttonTag}>
                            </div>
                            <section
                                class="ai-prompt-content"
                                id="${x => x.aiDialogId}"
                                aria-label="${x => x.labels.askAi}"
                                ?hidden="${x => !x.isAiPromptOpen}"
                            >
                                <${chatInputTag}
                                    class="ai-prompt-input"
                                    data-control="ai-prompt"
                                    aria-label="${x => x.labels.aiPromptDescription}"
                                    placeholder="${x => x.labels.aiPromptPlaceholder}"
                                    ?inert="${x => x.isEditorDisabled}"
                                    @send="${(x, c) => x.handleAiPromptSend(c.event)}"
                                ></${chatInputTag}>
                            </section>
                        `)}
                    </div>

                    ${when(x => x.isNigelPromptEnabled && Boolean(x.aiQueryPreview), html<FvQueryBuilder>`
                        <div class="ai-preview-notice" role="status">
                            <span>${x => x.labels.aiPreviewReady}</span>
                            <${buttonTag} appearance="outline" data-action="use-ai-preview" ?disabled="${x => x.isEditorDisabled}">
                                ${x => x.labels.reviewGeneratedQuery}
                            </${buttonTag}>
                        </div>
                    `)}

                    <${fvQueryEditorTag}
                        class="query-conditions"
                        ${ref('queryEditor')}
                        label="${x => x.labels.queryConditions}"
                        :disabled="${x => x.isEditorDisabled}"
                        :definition="${x => x.definition}"
                        :query="${x => x.editorQuery}"
                        :draft="${x => x.activeDraft}"
                        :optionResolver="${x => x.optionResolver}"
                        :optionContext="${x => x.optionContext}"
                        :labels="${x => x.labels}"
                    ></${fvQueryEditorTag}>
                </div>

                <footer class="builder-footer">
                    <div class="footer-secondary-actions">
                    <${buttonTag} appearance="ghost" data-action="clear-query" ?disabled="${x => x.isEditorDisabled}">
                        ${x => x.labels.clearAll}
                    </${buttonTag}>
                        ${when(x => x.savedQueryDeletionEnabled && !x.isQuickEdit && x.selectedSavedQueryId !== null && !x.isCreatingSavedQuery, html<FvQueryBuilder>`
                            ${when(x => !x.confirmingDelete, html<FvQueryBuilder>`
                                <${buttonTag}
                                    appearance="ghost"
                                    data-action="request-delete"
                                    ?disabled="${x => x.isEditorDisabled || !x.deleteHandler}"
                                >${x => x.labels.delete}</${buttonTag}>
                            `)}
                            ${when(x => x.confirmingDelete, html<FvQueryBuilder>`
                                <span class="delete-confirmation">${x => x.labels.deleteConfirmation}</span>
                                <${buttonTag} appearance="ghost" data-action="cancel-delete" ?disabled="${x => x.isOperationPending}">
                                    ${x => x.labels.cancelDelete}
                                </${buttonTag}>
                                <${buttonTag} appearance="outline" data-action="confirm-delete" ?disabled="${x => x.isEditorDisabled || !x.deleteHandler}">
                                    ${x => x.labels.confirmDelete}
                                </${buttonTag}>
                            `)}
                        `)}
                    </div>
                    <div class="footer-actions">
                        ${when(x => x.isCreatingSavedQuery, html<FvQueryBuilder>`
                            <${buttonTag} appearance="ghost" data-action="cancel-create" ?disabled="${x => x.isOperationPending}">
                                ${x => x.labels.cancel}
                            </${buttonTag}>
                        `)}
                        ${when(x => !x.isCreatingSavedQuery, html<FvQueryBuilder>`
                            <${buttonTag} appearance="ghost" data-action="cancel-query" ?disabled="${x => x.isEditorDisabled}">
                                ${x => x.labels.cancel}
                            </${buttonTag}>
                        `)}
                        ${when(
        x => !x.isCreatingSavedQuery && (x.isQuickEdit || x.selectedSavedQueryId === null),
        html<FvQueryBuilder>`
                            <${buttonTag} appearance="ghost" data-action="done-manager" ?disabled="${x => x.isOperationPending}">
                                ${x => x.labels.done}
                            </${buttonTag}>
                        `
    )}
                        ${when(x => !x.isQuickEdit && (x.isCreatingSavedQuery || x.savedQueryEditingEnabled), html<FvQueryBuilder>`
                        <${buttonTag}
                            appearance="outline"
                            data-action="save-query"
                            ?disabled="${x => (x.isCreatingSavedQuery ? !x.canSave : !x.canSaveChanges)}"
                        >${x => (x.isCreatingSavedQuery ? x.labels.save : x.labels.saveChanges)}</${buttonTag}>
                        `)}
                        <${buttonTag}
                            class="apply-button"
                            appearance="block"
                            appearance-variant="accent"
                            data-action="apply-query"
                            ?disabled="${x => x.isEditorDisabled || !x.valid}"
                        >${x => x.labels.apply}</${buttonTag}>
                    </div>
                </footer>
            </section>
        </${anchoredRegionTag}>

        <div class="builder-status" role="status" aria-live="polite">${x => x.actionStatus}</div>
    </div>
`;
