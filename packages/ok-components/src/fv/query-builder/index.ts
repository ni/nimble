import { attr, DOM, observable, volatile } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import type { ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';
import type { FvSplitButton } from '../split-button';
import type { FvQueryEditor, QueryEditorEventDetail } from '../query-editor';
import type {
    QueryBuilderDefinition,
    QueryDocument,
    QueryEditorDraft,
    QueryEditorDraftToken,
    QueryOptionContext,
    QueryOptionResolver
} from './portable-interface';
import { styles } from './styles';
import { template } from './template';
import {
    defaultQueryBuilderLabels,
    type QueryBuilderAIRequestDetail,
    type QueryBuilderEventDetail,
    type QueryBuilderLabels,
    type QueryBuilderSaveRequest,
    type QueryBuilderSavedQuery
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-query-builder': FvQueryBuilder;
    }
}

export type QueryBuilderSaveHandler = (request: QueryBuilderSaveRequest) => Promise<QueryBuilderSavedQuery>;
export type QueryBuilderDeleteHandler = (id: string) => Promise<void>;

interface SavedQueryWorkingDraft {
    readonly name: string;
    readonly draft: QueryEditorDraft;
    readonly committedName: string;
    readonly committedDraft: QueryEditorDraft;
    readonly document: QueryDocument;
}

interface SavedQueryView {
    readonly id: string;
    readonly name: string;
    readonly dirty: boolean;
    readonly selected: boolean;
    readonly unsavedChangesLabel: string;
}

const emptyDocument: QueryDocument = { version: 1, root: null };
const emptyDraft: QueryEditorDraft = { version: 1, tokens: [], caretPosition: 0, inputText: '' };

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

const cloneDocument = clone;
const cloneDraft = clone;

function draftForDocument(document: QueryDocument): QueryEditorDraft {
    const tokens: QueryEditorDraftToken[] = [];
    let tokenId = 0;
    const appendNode = (node: NonNullable<QueryDocument['root']>, nested = false): void => {
        if (node.kind === 'predicate') {
            const id = uniqueId(`saved-condition-${tokenId}`);
            tokenId += 1;
            tokens.push({
                kind: 'condition',
                id,
                fieldId: node.fieldId,
                operatorId: node.operatorId,
                ...(node.value === undefined ? {} : { value: node.value })
            });
            return;
        }
        if (nested) {
            const id = uniqueId(`saved-group-${tokenId}`);
            tokenId += 1;
            tokens.push({ kind: 'open', id });
        }
        node.children.forEach((child, index) => {
            if (index > 0) {
                tokens.push({ kind: 'logic', logic: node.combinator });
            }
            appendNode(child, child.kind === 'group');
        });
        if (nested) {
            tokens.push({ kind: 'close' });
        }
    };

    if (document.root) {
        appendNode(document.root);
    }
    return { version: 1, tokens, caretPosition: tokens.length, inputText: '' };
}

function draftFingerprint(draft: QueryEditorDraft): string {
    return JSON.stringify({
        inputText: draft.inputText,
        tokens: draft.tokens.map(token => {
            if (token.kind === 'condition') {
                return {
                    kind: token.kind,
                    fieldId: token.fieldId,
                    operatorId: token.operatorId,
                    value: token.value,
                    rawInputs: token.rawInputs
                };
            }
            if (token.kind === 'open') {
                return { kind: token.kind };
            }
            if (token.kind === 'logic') {
                return { kind: token.kind, logic: token.logic };
            }
            return token;
        })
    });
}

function isDirty(draft: SavedQueryWorkingDraft): boolean {
    return draft.name !== draft.committedName
        || draftFingerprint(draft.draft) !== draftFingerprint(draft.committedDraft);
}

/** Portable query editor with saved-query, AI, and apply/cancel workflows. */
export class FvQueryBuilder extends FoundationElement {
    @attr({ mode: 'boolean' })
    public disabled = false;

    /** Controls whether the Nigel prompt and generated-query preview are shown. */
    @attr({ attribute: 'show-nigel-prompt', mode: 'boolean' })
    public showNigelPrompt = true;

    /** Controls whether new saved queries can be created. */
    @attr({ attribute: 'allow-saved-query-creation', mode: 'boolean' })
    public allowSavedQueryCreation = true;

    /** Controls editing and updating existing saved queries. */
    @attr({ attribute: 'allow-saved-query-editing', mode: 'boolean' })
    public allowSavedQueryEditing = true;

    /** Controls whether saved queries can be deleted. */
    @attr({ attribute: 'allow-saved-query-deletion', mode: 'boolean' })
    public allowSavedQueryDeletion = true;

    @attr
    public label = 'Filters';

    @observable
    public definition?: QueryBuilderDefinition;

    /** Current query owned by the host; saved-query selection never replaces it. */
    @observable
    public query: QueryDocument = cloneDocument(emptyDocument);

    @observable
    public savedQueries: readonly QueryBuilderSavedQuery[] = [];

    @observable
    public saveHandler?: QueryBuilderSaveHandler;

    @observable
    public deleteHandler?: QueryBuilderDeleteHandler;

    @observable
    public optionResolver?: QueryOptionResolver;

    @observable
    public optionContext: QueryOptionContext = {};

    @observable
    public labels: QueryBuilderLabels = defaultQueryBuilderLabels;

    @observable
    public aiQueryPreview: QueryDocument | null = null;

    @observable
    public isAiPromptOpen = false;

    @observable
    public isSavedMenuOpen = false;

    @observable
    public isManagerOpen = false;

    @observable
    public isQuickEdit = false;

    @observable
    public isCreatingSavedQuery = false;

    @observable
    public confirmingDelete = false;

    @observable
    public selectedSavedQueryId: string | null = null;

    @observable
    public activeDraft: QueryEditorDraft = cloneDraft(emptyDraft);

    @observable
    public editorQuery: QueryDocument = cloneDocument(emptyDocument);

    @observable
    public currentDraft: QueryEditorDraft = cloneDraft(emptyDraft);

    @observable
    public savedDrafts = new Map<string, SavedQueryWorkingDraft>();

    @observable
    public savedQueryName = '';

    @observable
    public operationError = '';

    @observable
    public actionStatus = '';

    @observable
    public isOperationPending = false;

    @observable
    public queryPopoverRegion?: AnchoredRegion;

    @observable
    public queryEditor?: FvQueryEditor;

    @observable
    public savedQueryMenuButton?: FvSplitButton;

    @observable
    public aiPromptTrigger?: HTMLElement;

    @observable
    public queryNameInput?: TextField;

    public readonly savedMenuId = uniqueId('ok-fv-query-builder-saved-menu');
    public readonly aiDialogId = uniqueId('ok-fv-query-builder-ai-dialog');
    public readonly queryDialogId = uniqueId('ok-fv-query-builder-dialog');

    private popoverDragOffset = { x: 0, y: 0 };
    private popoverDrag?: { pointerId: number, startX: number, startY: number };
    private appliedDocument: QueryDocument = cloneDocument(emptyDocument);
    private appliedSelectionId: string | undefined;
    private internallyAssignedQuery?: QueryDocument;

    public get ruleCount(): number {
        return this.queryEditor?.ruleCount ?? 0;
    }

    public get valid(): boolean {
        return this.queryEditor?.valid ?? false;
    }

    @volatile
    public get selectedName(): string {
        if (this.selectedSavedQueryId === null) {
            return this.labels.saved;
        }
        return this.savedQueries.find(query => query.id === this.selectedSavedQueryId)?.name
            ?? this.savedDrafts.get(this.selectedSavedQueryId)?.committedName
            ?? this.labels.saved;
    }

    @volatile
    public get queryButtonLabel(): string {
        return this.selectedSavedQueryId === null ? this.labels.configureQuery : this.selectedName;
    }

    public get selectedQueryIsDirty(): boolean {
        const draft = this.selectedSavedQueryId === null
            ? undefined
            : this.savedDrafts.get(this.selectedSavedQueryId);
        return draft ? isDirty(draft) : false;
    }

    public get savedQueryViews(): readonly SavedQueryView[] {
        return this.savedQueries.map(query => {
            const draft = this.savedDrafts.get(query.id);
            return {
                id: query.id,
                name: query.name,
                dirty: draft ? isDirty(draft) : false,
                selected: query.id === this.selectedSavedQueryId,
                unsavedChangesLabel: this.labels.unsavedChanges
            };
        });
    }

    public get canSave(): boolean {
        return !this.isEditorDisabled
            && (!this.isCreatingSavedQuery || this.allowSavedQueryCreation)
            && Boolean(this.saveHandler)
            && this.savedQueryName.trim().length > 0
            && this.valid;
    }

    public get canSaveChanges(): boolean {
        return this.allowSavedQueryEditing
            && this.canSave
            && !this.isCreatingSavedQuery
            && this.selectedQueryIsDirty;
    }

    public get isEditorDisabled(): boolean {
        return this.disabled || this.isOperationPending;
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.appliedDocument = cloneDocument(this.query);
        this.currentDraft = draftForDocument(this.query);
        this.loadSelection(null);
        document.addEventListener('pointerdown', this.documentPointerDownHandler, true);
        document.addEventListener('focusin', this.documentFocusInHandler, true);
        document.addEventListener('scroll', this.queryViewportChangeHandler, true);
        window.addEventListener('resize', this.queryViewportChangeHandler);
    }

    public override disconnectedCallback(): void {
        document.removeEventListener('pointerdown', this.documentPointerDownHandler, true);
        document.removeEventListener('focusin', this.documentFocusInHandler, true);
        document.removeEventListener('scroll', this.queryViewportChangeHandler, true);
        window.removeEventListener('resize', this.queryViewportChangeHandler);
        super.disconnectedCallback();
    }

    /** @internal */
    public queryChanged(_previous: QueryDocument, next: QueryDocument): void {
        if (next === this.internallyAssignedQuery || !this.isConnected) {
            return;
        }
        const document = cloneDocument(next);
        this.currentDraft = draftForDocument(document);
        if (this.selectedSavedQueryId === null) {
            this.setEditorState(document, this.currentDraft);
        }
        this.appliedDocument = document;
        this.appliedSelectionId = undefined;
    }

    /** @internal */
    public savedQueriesChanged(): void {
        const drafts = new Map(this.savedDrafts);
        for (const [id, draft] of drafts) {
            const record = this.savedQueries.find(candidate => candidate.id === id);
            if (!record || !isDirty(draft)) {
                drafts.delete(id);
            }
        }
        this.savedDrafts = drafts;
    }

    /** @internal */
    public disabledChanged(): void {
        if (this.disabled) {
            this.closeSavedMenu(false);
            this.closeManager(false);
            this.closeAiPrompt(false);
        }
    }

    /** @internal */
    public showNigelPromptChanged(): void {
        if (!this.showNigelPrompt) {
            this.closeAiPrompt(false);
        }
    }

    /** @internal */
    public allowSavedQueryCreationChanged(): void {
        if (!this.allowSavedQueryCreation && this.isCreatingSavedQuery && !this.isQuickEdit) {
            this.closeManager(false);
        }
    }

    /** @internal */
    public allowSavedQueryEditingChanged(): void {
        if (
            !this.allowSavedQueryEditing
            && this.selectedSavedQueryId !== null
            && this.isManagerOpen
            && !this.isQuickEdit
            && !this.isCreatingSavedQuery
        ) {
            this.closeManager(false);
        }
    }

    /** @internal */
    public allowSavedQueryDeletionChanged(): void {
        if (!this.allowSavedQueryDeletion) {
            this.confirmingDelete = false;
        }
    }

    /** @internal */
    public isManagerOpenChanged(): void {
        if (!this.isManagerOpen) {
            this.resetPopoverDrag();
        }
    }

    /** @internal */
    public handleInput(event: Event): void {
        const control = this.findControl(event);
        if (control?.dataset.control === 'saved-query-name') {
            this.savedQueryName = control.value;
            this.operationError = '';
            this.updateSelectedName();
        }
    }

    /** @internal */
    public handleAiPromptSend(event: Event): void {
        if (!this.showNigelPrompt) {
            return;
        }
        this.requestAiQuery((event as CustomEvent<ChatInputSendEventDetail>).detail.text);
    }

    /** @internal */
    public handleClick(event: Event): void {
        const actionElement = this.findAction(event);
        const action = actionElement?.dataset.action;
        if (!actionElement || !action || this.disabled) {
            return;
        }
        if (event.type === 'click' && actionElement.getAttribute('role')?.startsWith('menuitem')) {
            this.closeSavedMenu(false);
            return;
        }
        switch (action) {
            case 'toggle-ai-prompt':
                if (!this.showNigelPrompt) {
                    break;
                }
                this.closeSavedMenu(false);
                if (this.isAiPromptOpen) {
                    this.closeAiPrompt(true);
                } else {
                    this.isAiPromptOpen = true;
                }
                break;
            case 'use-ai-preview':
                this.useAiQueryPreview();
                break;
            case 'select-current-query':
                this.selectSavedQuery(null);
                this.closeSavedMenu(false);
                break;
            case 'select-saved-query':
                this.selectSavedQuery(actionElement.dataset.savedQueryId ?? null);
                this.closeSavedMenu(false);
                break;
            case 'save-as-new':
                this.openCreateForm();
                break;
            case 'update-saved-query':
                if (this.allowSavedQueryEditing) {
                    void this.saveQuery();
                }
                break;
            case 'edit-saved-queries':
                if (this.selectedSavedQueryId === null ? this.allowSavedQueryCreation : this.allowSavedQueryEditing) {
                    this.openManager();
                }
                break;
            case 'save-query':
                void this.saveQuery();
                break;
            case 'cancel-create':
                this.cancelCreate();
                break;
            case 'done-manager':
                this.closeManager(true);
                break;
            case 'request-delete':
                if (this.allowSavedQueryDeletion) {
                    this.confirmingDelete = true;
                    this.operationError = '';
                }
                break;
            case 'cancel-delete':
                this.confirmingDelete = false;
                break;
            case 'confirm-delete':
                if (this.allowSavedQueryDeletion) {
                    void this.deleteSelectedQuery();
                }
                break;
            case 'apply-query':
                this.applyQuery();
                break;
            case 'cancel-query':
                this.cancelQuery();
                break;
            case 'clear-query':
                this.clear();
                break;
            default:
                break;
        }
    }

    /** @internal */
    public handleSavedMenuToggle(event: Event): void {
        this.isSavedMenuOpen = (event as CustomEvent<{ open: boolean }>).detail.open;
        if (this.isSavedMenuOpen) {
            this.closeManager(false);
            this.closeAiPrompt(false);
        }
    }

    /** @internal */
    public openQuickEditor(): void {
        if (this.isEditorDisabled) {
            return;
        }
        this.openManager();
        this.isQuickEdit = true;
        this.isCreatingSavedQuery = false;
        DOM.queueUpdate(() => this.focusQuickEditor());
    }

    /** @internal */
    public handleQueryPopoverLoaded(): void {
        this.queryViewportChangeHandler();
        if (this.isManagerOpen && this.isQuickEdit) {
            this.focusQuickEditor();
        }
    }

    /** @internal */
    public handlePopoverDragStart(event: PointerEvent): void {
        if (event.button !== 0 || !event.isPrimary) {
            return;
        }
        (event.currentTarget as Element).setPointerCapture(event.pointerId);
        this.popoverDrag = {
            pointerId: event.pointerId,
            startX: event.clientX - this.popoverDragOffset.x,
            startY: event.clientY - this.popoverDragOffset.y
        };
        event.preventDefault();
    }

    /** @internal */
    public handlePopoverDragMove(event: PointerEvent): void {
        const drag = this.popoverDrag;
        if (drag?.pointerId !== event.pointerId) {
            return;
        }
        this.setPopoverDragOffset(event.clientX - drag.startX, event.clientY - drag.startY);
    }

    /** @internal */
    public handlePopoverDragEnd(event: PointerEvent): void {
        if (this.popoverDrag?.pointerId === event.pointerId) {
            this.popoverDrag = undefined;
        }
    }

    /** @internal */
    public resetPopoverDrag(): void {
        this.popoverDrag = undefined;
        this.popoverDragOffset = { x: 0, y: 0 };
        this.queryPopoverRegion?.style.removeProperty('--query-popover-drag-x');
        this.queryPopoverRegion?.style.removeProperty('--query-popover-drag-y');
    }

    /** @internal */
    public handleEditorChange(event: Event): void {
        event.stopPropagation();
        const detail = (event as CustomEvent<QueryEditorEventDetail>).detail;
        this.activeDraft = cloneDraft(detail.draft);
        if (this.selectedSavedQueryId === null) {
            this.currentDraft = cloneDraft(detail.draft);
            if (detail.query) {
                this.assignCurrentQuery(detail.query);
            }
        } else {
            this.updateSavedDraft(this.selectedSavedQueryId, { draft: detail.draft });
        }
        this.dispatchEvent(new CustomEvent<QueryBuilderEventDetail>('query-change', {
            bubbles: true,
            composed: true,
            detail: {
                selectedId: this.selectedSavedQueryId ?? undefined,
                draft: cloneDraft(detail.draft),
                query: detail.query ? cloneDocument(detail.query) : null,
                ruleCount: detail.ruleCount,
                valid: detail.valid
            }
        }));
    }

    /** @internal */
    public handleKeydown(event: KeyboardEvent): boolean {
        if (event.defaultPrevented) {
            return true;
        }
        if (event.key === 'Escape') {
            if (this.confirmingDelete) {
                this.confirmingDelete = false;
                event.preventDefault();
            } else if (this.isAiPromptOpen) {
                this.closeAiPrompt(true);
                event.preventDefault();
            } else if (this.isCreatingSavedQuery) {
                this.cancelCreate();
                event.preventDefault();
            } else if (this.isManagerOpen) {
                this.closeManager(true);
                event.preventDefault();
            } else if (this.isSavedMenuOpen) {
                this.closeSavedMenu(true);
                event.preventDefault();
            }
        }
        return true;
    }

    public clear(): void {
        if (this.isEditorDisabled) {
            return;
        }
        this.setActiveDocument(emptyDocument, emptyDraft);
        this.actionStatus = this.labels.queryCleared;
        this.queryEditor?.focus();
    }

    public validate(): boolean {
        return this.queryEditor?.validate() ?? false;
    }

    private selectSavedQuery(id: string | null): void {
        if (id === this.selectedSavedQueryId) {
            return;
        }
        this.storeActiveDraft();
        this.selectedSavedQueryId = id;
        this.confirmingDelete = false;
        this.operationError = '';
        this.loadSelection(id);
        this.closeEditorCallout();
        DOM.queueUpdate(() => {
            if (this.selectedSavedQueryId === id && this.validate()) {
                this.applyQuery();
            }
        });
    }

    private loadSelection(id: string | null): void {
        if (id === null) {
            this.setEditorState(this.query, this.currentDraft);
            return;
        }
        const record = this.savedQueries.find(query => query.id === id);
        if (!record) {
            this.selectedSavedQueryId = null;
            this.setEditorState(this.query, this.currentDraft);
            return;
        }
        let working = this.savedDrafts.get(id);
        if (!working) {
            const document = cloneDocument(record.document);
            const draft = draftForDocument(document);
            working = {
                name: record.name,
                draft,
                committedName: record.name,
                committedDraft: cloneDraft(draft),
                document
            };
            this.savedDrafts = new Map(this.savedDrafts).set(id, working);
        }
        this.savedQueryName = working.name;
        this.setEditorState(record.document, working.draft);
    }

    private setEditorState(document: QueryDocument, draft: QueryEditorDraft): void {
        this.editorQuery = cloneDocument(document);
        this.activeDraft = cloneDraft(draft);
    }

    private setActiveDocument(document: QueryDocument, draft: QueryEditorDraft): void {
        this.setEditorState(document, draft);
        if (this.selectedSavedQueryId === null) {
            this.currentDraft = cloneDraft(draft);
            this.assignCurrentQuery(document);
        } else {
            this.updateSavedDraft(this.selectedSavedQueryId, { draft });
        }
    }

    private assignCurrentQuery(document: QueryDocument): void {
        const detached = cloneDocument(document);
        this.internallyAssignedQuery = detached;
        this.query = detached;
        this.internallyAssignedQuery = undefined;
    }

    private storeActiveDraft(): void {
        if (this.selectedSavedQueryId === null) {
            this.currentDraft = cloneDraft(this.activeDraft);
        } else {
            this.updateSavedDraft(this.selectedSavedQueryId, this.isCreatingSavedQuery
                ? { draft: this.activeDraft }
                : { draft: this.activeDraft, name: this.savedQueryName });
        }
    }

    private updateSavedDraft(id: string, update: { readonly name?: string, readonly draft?: QueryEditorDraft }): void {
        const record = this.savedQueries.find(query => query.id === id);
        const previous = this.savedDrafts.get(id);
        if (!record && !previous) {
            return;
        }
        const committedDocument = previous?.document ?? cloneDocument(record!.document);
        const committedDraft = previous?.committedDraft ?? draftForDocument(committedDocument);
        const working: SavedQueryWorkingDraft = {
            name: update.name ?? previous?.name ?? record!.name,
            draft: cloneDraft(update.draft ?? previous?.draft ?? committedDraft),
            committedName: previous?.committedName ?? record!.name,
            committedDraft,
            document: committedDocument
        };
        this.savedDrafts = new Map(this.savedDrafts).set(id, working);
    }

    private updateSelectedName(): void {
        if (!this.isCreatingSavedQuery && this.selectedSavedQueryId !== null) {
            this.updateSavedDraft(this.selectedSavedQueryId, { name: this.savedQueryName });
        }
    }

    private openCreateForm(): void {
        if (!this.allowSavedQueryCreation || !this.saveHandler || this.isEditorDisabled) {
            return;
        }
        this.closeSavedMenu(false);
        this.closeAiPrompt(false);
        this.storeActiveDraft();
        this.isQuickEdit = false;
        this.isManagerOpen = true;
        this.isCreatingSavedQuery = true;
        this.queryViewportChangeHandler();
        this.savedQueryName = '';
        this.confirmingDelete = false;
        this.operationError = '';
        DOM.queueUpdate(() => this.queryNameInput?.focus());
    }

    private openManager(): void {
        this.closeSavedMenu(false);
        this.isQuickEdit = false;
        this.isManagerOpen = true;
        this.queryViewportChangeHandler();
        const selectedId = this.selectedSavedQueryId;
        this.isCreatingSavedQuery = selectedId === null;
        this.confirmingDelete = false;
        this.savedQueryName = selectedId === null
            ? ''
            : this.savedDrafts.get(selectedId)?.name ?? this.selectedName;
        this.operationError = '';
        this.closeAiPrompt(false);
        DOM.queueUpdate(() => {
            if (!this.isQuickEdit) {
                this.queryNameInput?.focus();
            }
        });
    }

    private cancelCreate(): void {
        if (!this.isCreatingSavedQuery) {
            return;
        }
        this.isCreatingSavedQuery = false;
        this.isManagerOpen = false;
        this.savedQueryName = '';
        this.operationError = '';
        this.confirmingDelete = false;
        DOM.queueUpdate(() => this.focusQueryTrigger());
    }

    private setPopoverDragOffset(x: number, y: number): void {
        const region = this.queryPopoverRegion;
        const popover = region?.querySelector<HTMLElement>('.query-popover');
        if (!this.isManagerOpen || !region || !popover) {
            return;
        }
        // Clamp against the undragged rect so the popover stays fully in view.
        const rect = popover.getBoundingClientRect();
        const left = rect.left - this.popoverDragOffset.x;
        const top = rect.top - this.popoverDragOffset.y;
        const margin = 8;
        const { clientWidth, clientHeight } = document.documentElement;
        const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));
        this.popoverDragOffset = {
            x: clamp(x, margin - left, clientWidth - margin - rect.width - left),
            y: clamp(y, margin - top, clientHeight - margin - rect.height - top)
        };
        region.style.setProperty('--query-popover-drag-x', `${this.popoverDragOffset.x}px`);
        region.style.setProperty('--query-popover-drag-y', `${this.popoverDragOffset.y}px`);
    }

    private readonly queryViewportChangeHandler = (): void => {
        const anchor = this.savedQueryMenuButton;
        const region = this.queryPopoverRegion;
        if (!this.isManagerOpen || !anchor || !region) {
            return;
        }
        const bounds = anchor.getBoundingClientRect();
        const viewportHeight = document.documentElement.clientHeight;
        const availableHeight = `${Math.max(0, Math.max(bounds.top, viewportHeight - bounds.bottom) - 16)}px`;
        if (region.style.getPropertyValue('--query-popover-available-height') !== availableHeight) {
            region.style.setProperty('--query-popover-available-height', availableHeight);
        }
        region.update();
        DOM.queueUpdate(() => {
            if (this.isManagerOpen && (this.popoverDragOffset.x !== 0 || this.popoverDragOffset.y !== 0)) {
                this.setPopoverDragOffset(this.popoverDragOffset.x, this.popoverDragOffset.y);
            }
        });
    };

    private closeManager(restoreFocus: boolean): void {
        if (this.isManagerOpen) {
            this.storeActiveDraft();
        }
        this.isManagerOpen = false;
        this.isQuickEdit = false;
        this.isCreatingSavedQuery = false;
        this.confirmingDelete = false;
        this.operationError = '';
        this.closeAiPrompt(false);
        if (restoreFocus) {
            DOM.queueUpdate(() => this.focusQueryTrigger());
        }
    }

    private async saveQuery(): Promise<void> {
        const handler = this.saveHandler;
        const document = this.queryEditor?.query;
        const name = this.savedQueryName.trim();
        if (
            !handler
            || this.isOperationPending
            || (this.isCreatingSavedQuery && !this.allowSavedQueryCreation)
            || (!this.isCreatingSavedQuery && !this.allowSavedQueryEditing)
            || name.length === 0
            || !document
            || !this.validate()
        ) {
            this.operationError = name.length === 0 ? this.labels.nameRequired : '';
            return;
        }

        const selectedId = this.selectedSavedQueryId;
        const request: QueryBuilderSaveRequest = this.isCreatingSavedQuery
            ? { kind: 'create', name, document: cloneDocument(document) }
            : { kind: 'update', id: selectedId ?? undefined, name, document: cloneDocument(document) };
        if (request.kind === 'update' && !request.id) {
            return;
        }
        this.isOperationPending = true;
        this.operationError = '';
        try {
            const saved = await handler(request);
            if (!saved.id || saved.name.trim().length === 0) {
                throw new TypeError('The save handler must return a saved query with an ID and name.');
            }
            if (request.kind === 'update' && saved.id !== request.id) {
                throw new TypeError('The save handler must preserve the ID when updating a saved query.');
            }
            const records = this.savedQueries.filter(query => query.id !== saved.id);
            this.savedQueries = [...records, {
                id: saved.id,
                name: saved.name,
                document: cloneDocument(saved.document)
            }];
            const committedDraft = draftForDocument(saved.document);
            this.savedDrafts = new Map(this.savedDrafts).set(saved.id, {
                name: saved.name,
                draft: cloneDraft(committedDraft),
                committedName: saved.name,
                committedDraft: cloneDraft(committedDraft),
                document: cloneDocument(saved.document)
            });
            this.isCreatingSavedQuery = false;
            this.selectedSavedQueryId = saved.id;
            this.savedQueryName = saved.name;
            this.setEditorState(saved.document, committedDraft);
            this.actionStatus = this.labels.savedQuerySaved;
        } catch {
            this.operationError = this.labels.saveFailed;
            this.actionStatus = this.labels.saveFailed;
        } finally {
            this.isOperationPending = false;
        }
    }

    private async deleteSelectedQuery(): Promise<void> {
        const id = this.selectedSavedQueryId;
        const handler = this.deleteHandler;
        if (!this.allowSavedQueryDeletion || !id || !handler || this.isOperationPending) {
            return;
        }
        this.isOperationPending = true;
        this.operationError = '';
        try {
            await handler(id);
            this.savedQueries = this.savedQueries.filter(query => query.id !== id);
            const drafts = new Map(this.savedDrafts);
            drafts.delete(id);
            this.savedDrafts = drafts;
            this.selectedSavedQueryId = null;
            if (this.appliedSelectionId === id) {
                this.appliedSelectionId = undefined;
            }
            this.confirmingDelete = false;
            this.savedQueryName = '';
            this.setEditorState(this.query, this.currentDraft);
            this.actionStatus = this.labels.savedQueryDeleted;
            this.closeManager(true);
        } catch {
            this.operationError = this.labels.deleteFailed;
            this.actionStatus = this.labels.deleteFailed;
        } finally {
            this.isOperationPending = false;
        }
    }

    private applyQuery(): void {
        if (this.isEditorDisabled || !this.validate()) {
            this.queryEditor?.focus();
            return;
        }
        const query = this.queryEditor?.query;
        if (!query) {
            return;
        }
        const document = cloneDocument(query);
        this.appliedDocument = document;
        this.appliedSelectionId = this.selectedSavedQueryId ?? undefined;
        this.actionStatus = this.labels.queryApplied;
        this.closeEditorCallout();
        this.dispatchEvent(new CustomEvent('query-apply', {
            bubbles: true,
            composed: true,
            detail: {
                query: document,
                selectedId: this.selectedSavedQueryId ?? undefined
            }
        }));
    }

    private cancelQuery(): void {
        if (this.isEditorDisabled) {
            return;
        }
        const selectedId = this.appliedSelectionId ?? null;
        this.selectedSavedQueryId = selectedId;
        const draft = draftForDocument(this.appliedDocument);
        const savedDraft = selectedId === null
            ? undefined
            : this.savedDrafts.get(selectedId);
        if (savedDraft && selectedId !== null) {
            this.savedQueryName = savedDraft.committedName;
            this.updateSavedDraft(selectedId, {
                name: savedDraft.committedName,
                draft
            });
        }
        this.setActiveDocument(this.appliedDocument, draft);
        this.isSavedMenuOpen = false;
        this.closeManager(true);
        this.actionStatus = this.labels.queryCanceled;
        this.dispatchEvent(new CustomEvent('query-cancel', {
            bubbles: true,
            composed: true,
            detail: {
                query: cloneDocument(this.appliedDocument),
                selectedId: this.appliedSelectionId
            }
        }));
    }

    private requestAiQuery(promptText: string): void {
        const prompt = promptText.trim();
        if (!this.showNigelPrompt || this.isEditorDisabled || prompt.length === 0) {
            return;
        }
        const query = this.queryEditor?.valid ? cloneDocument(this.queryEditor.query) : null;
        const detail: QueryBuilderAIRequestDetail = {
            prompt,
            draft: cloneDraft(this.activeDraft),
            query
        };
        this.dispatchEvent(new CustomEvent<QueryBuilderAIRequestDetail>('query-ai-request', {
            bubbles: true,
            composed: true,
            detail
        }));
        this.closeAiPrompt(true);
    }

    private useAiQueryPreview(): void {
        if (!this.showNigelPrompt || !this.aiQueryPreview || this.isEditorDisabled) {
            return;
        }
        const document = cloneDocument(this.aiQueryPreview);
        this.aiQueryPreview = null;
        this.setActiveDocument(document, draftForDocument(document));
    }

    private closeAiPrompt(restoreFocus: boolean): void {
        this.isAiPromptOpen = false;
        if (restoreFocus) {
            DOM.queueUpdate(() => this.aiPromptTrigger?.focus());
        }
    }

    private closeSavedMenu(restoreFocus: boolean): void {
        this.isSavedMenuOpen = false;
        if (restoreFocus) {
            DOM.queueUpdate(() => this.focusQueryTrigger(false));
        }
    }

    private focusQueryTrigger(primary = true): void {
        this.savedQueryMenuButton?.shadowRoot
            ?.querySelector<HTMLButtonElement>(primary ? '.split-button-primary' : '.split-button-toggle')?.focus();
    }

    private focusQuickEditor(): void {
        this.queryEditor?.shadowRoot?.querySelector<TextField>('.query-input')?.focus();
    }

    private closeEditorCallout(): void {
        if (this.queryEditor) {
            this.queryEditor.activeRuleId = null;
        }
    }

    private findAction(event: Event): HTMLElement | undefined {
        return event.composedPath().find(
            item => item instanceof HTMLElement && item.hasAttribute('data-action')
        ) as HTMLElement | undefined;
    }

    private findControl(event: Event): TextField | undefined {
        return event.composedPath().find(
            item => item instanceof HTMLElement && item.hasAttribute('data-control')
        ) as TextField | undefined;
    }

    private readonly documentPointerDownHandler = (event: Event): void => {
        const path = event.composedPath();
        if (this.isSavedMenuOpen && !path.includes(this)) {
            this.closeSavedMenu(false);
        }
        const popover = this.queryPopoverRegion;
        if (this.isManagerOpen && (!popover || !path.includes(popover))) {
            this.closeManager(false);
        }
        if (this.isAiPromptOpen && (!popover || !path.includes(popover))) {
            this.closeAiPrompt(false);
        }
    };

    private readonly documentFocusInHandler = (event: Event): void => {
        const path = event.composedPath();
        if (this.isSavedMenuOpen && !path.includes(this)) {
            this.closeSavedMenu(false);
        }
        const popover = this.queryPopoverRegion;
        if (this.isManagerOpen && (!popover || !path.includes(popover))) {
            this.closeManager(false);
        }
        if (this.isAiPromptOpen && (!popover || !path.includes(popover))) {
            this.closeAiPrompt(false);
        }
    };
}

const okFvQueryBuilder = FvQueryBuilder.compose({
    baseName: 'fv-query-builder',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvQueryBuilder());
export const fvQueryBuilderTag = 'ok-fv-query-builder';

export type {
    QueryBuilderAIRequestDetail,
    QueryBuilderEventDetail,
    QueryBuilderLabels,
    QueryBuilderSaveRequest,
    QueryBuilderSavedQuery,
} from './types';
export type {
    QueryBuilderDefinition,
    JsonValue,
    QueryDocument,
    QueryNode,
    QueryEditorDraft,
    QueryEditorDraftToken,
    QueryOptionContext,
    QueryOptionResolver
} from './portable-interface';
