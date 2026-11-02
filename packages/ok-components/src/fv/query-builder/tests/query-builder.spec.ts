import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { ChatInputPageObject } from '@ni/spright-components/dist/esm/chat/input/testing/chat-input.pageobject';
import type { ChatInput } from '@ni/spright-components/dist/esm/chat/input';
import type { FvSplitButton } from '../../split-button';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import {
    FvQueryBuilder,
    fvQueryBuilderTag,
    type QueryBuilderDefinition,
    type QueryBuilderSavedQuery,
    type QueryBuilderSaveRequest,
    type QueryDocument
} from '..';

const definition: QueryBuilderDefinition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            valueSchema: { enum: ['passed', 'failed'] },
            operatorIds: ['is', 'is-any-of'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration',
            valueSchema: { type: 'number' },
            operatorIds: ['greater-than', 'between']
        },
        {
            id: 'name',
            path: '/name',
            label: 'Name',
            valueSchema: { type: 'string' },
            operatorIds: ['is']
        }
    ],
    operators: [
        { id: 'is', label: 'Is', operand: { kind: 'field-value' } },
        { id: 'is-any-of', label: 'Is any of', operand: { kind: 'field-value-list' } },
        { id: 'greater-than', label: 'Greater than', operand: { kind: 'field-value' } },
        {
            id: 'between',
            label: 'Between',
            operand: { kind: 'range', endpointSchema: { type: 'number' } }
        }
    ]
};

const currentDocument: QueryDocument = {
    version: 1,
    root: { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'passed' }
};
const savedDocument: QueryDocument = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'and',
        children: [
            { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' },
            { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 500 }
        ]
    }
};
const secondSavedDocument: QueryDocument = {
    version: 1,
    root: { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 1000 }
};
const textDocument: QueryDocument = {
    version: 1,
    root: { kind: 'predicate', fieldId: 'name', operatorId: 'is', value: 'Alpha' }
};
const collectionDocument: QueryDocument = {
    version: 1,
    root: { kind: 'predicate', fieldId: 'status', operatorId: 'is-any-of', value: ['passed'] }
};

const savedRecords: readonly QueryBuilderSavedQuery[] = [
    { id: 'saved-a', name: 'Failed queries', document: savedDocument },
    { id: 'saved-b', name: 'Long duration', document: secondSavedDocument }
];

async function setup(openPopover = true): Promise<Fixture<FvQueryBuilder>> {
    const result = await fixture<FvQueryBuilder>(html`<${fvQueryBuilderTag}></${fvQueryBuilderTag}>`);
    result.element.definition = definition;
    result.element.query = currentDocument;
    result.element.savedQueries = savedRecords;
    await result.connect();
    await waitForUpdatesAsync();
    if (openPopover) {
        const menuButton = result.element.shadowRoot?.querySelector<FvSplitButton>('[data-control="saved-query-menu-button"]');
        if (!menuButton) {
            throw new Error('Expected the Queries menu button.');
        }
        menuButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle')?.click();
        await waitForUpdatesAsync();
        const editItem = result.element.shadowRoot?.querySelector<HTMLElement>('[data-action="edit-saved-queries"]');
        if (!editItem) {
            throw new Error('Expected the Edit menu item.');
        }
        editItem.click();
        await waitForUpdatesAsync();
    }
    return result;
}

describe('FvQueryBuilder', () => {
    let element: FvQueryBuilder;
    let disconnect: (() => Promise<void>) | undefined;

    function getRequiredElement<T extends HTMLElement>(selector: string): T {
        const found = element.shadowRoot?.querySelector<T>(selector);
        if (!found) {
            throw new Error(`Expected builder element matching selector ${selector}`);
        }
        return found;
    }

    async function openSavedMenu(): Promise<void> {
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        menuButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle')?.click();
        await waitForUpdatesAsync();
        expect(menuButton.open).toBeTrue();
    }

    async function activateSavedMenuItem(selector: string): Promise<void> {
        getRequiredElement<HTMLElement>(selector).click();
        await waitForUpdatesAsync();
    }

    async function selectSavedQuery(id: string): Promise<void> {
        await openSavedMenu();
        await activateSavedMenuItem(`[data-action="select-saved-query"][data-saved-query-id="${id}"]`);
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
    }

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('registers and renders a portable query editor', async () => {
        ({ element, disconnect } = await setup(false));

        expect(document.createElement(fvQueryBuilderTag)).toBeInstanceOf(FvQueryBuilder);
        expect(element.queryEditor?.definition).toEqual(definition);
        expect(element.queryEditor?.query).toEqual(currentDocument);
        expect(element.queryEditor?.valid).toBeTrue();
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        expect(menuButton.tagName.toLowerCase()).toBe('ok-fv-split-button');
        expect(menuButton.querySelector('.menu-button-label')?.textContent).toBe('Configure query');
        expect(menuButton.querySelector('nimble-icon-arrow-down')).toBeNull();
        expect(menuButton.querySelector('nimble-menu')?.querySelectorAll('nimble-menu-item')).toHaveSize(5);
        expect(menuButton.querySelector('[data-action="select-current-query"]')?.getAttribute('aria-current')).toBe('true');
        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeTrue();
        expect(element.queryPopoverRegion?.horizontalDefaultPosition).toBe('right');
        expect(element.queryPopoverRegion?.horizontalInset).toBeTrue();
    });

    it('does not prevent printable keyboard input in the embedded query editor', async () => {
        ({ element, disconnect } = await setup());
        const input = element.queryEditor?.shadowRoot
            ?.querySelector<HTMLElement>('.query-input')
            ?.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble query input.');
        }

        const keydown = new KeyboardEvent('keydown', {
            key: 's',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        input.dispatchEvent(keydown);

        expect(keydown.defaultPrevented).toBeFalse();
    });

    it('opens a query-only popover from the primary action and restores focus on Escape', async () => {
        ({ element, disconnect } = await setup(false));
        const region = element.queryPopoverRegion;
        if (!region) {
            throw new Error('Expected the query popover region.');
        }
        const loaded = region.initialLayoutComplete ? Promise.resolve() : new Promise<void>(resolve => {
            region.addEventListener('loaded', () => resolve(), { once: true });
        });
        const trigger = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!trigger) {
            throw new Error('Expected the Queries primary button.');
        }
        trigger.click();
        await loaded;
        await waitForUpdatesAsync();

        expect(element.isManagerOpen).toBeTrue();
        expect(element.isQuickEdit).toBeTrue();
        expect(element.isSavedMenuOpen).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-query"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="request-delete"]')).toBeNull();
        const applyButton = getRequiredElement<HTMLElement>('[data-action="apply-query"]');
        expect(applyButton.hasAttribute('disabled')).toBeFalse();
        expect(applyButton.textContent?.trim()).toBe('Apply');
        expect(element.shadowRoot?.querySelector('[data-action="done-manager"]')).not.toBeNull();
        expect(element.queryEditor?.shadowRoot?.activeElement?.classList.contains('query-input')).toBeTrue();

        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
        expect(element.savedQueryMenuButton?.shadowRoot?.activeElement).toBe(trigger);
    });

    it('preserves saved-query drafts between the primary popover and the full menu editor', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        element.saveHandler = async request => {
            await Promise.resolve();
            return { id: request.id ?? 'created', name: request.name, document: request.document };
        };
        const trigger = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!trigger) {
            throw new Error('Expected the Queries primary button.');
        }
        trigger.click();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="request-delete"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-query"]')).toBeNull();
        element.clear();
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();

        await openSavedMenu();
        expect(element.isManagerOpen).toBeFalse();
        expect(getRequiredElement<HTMLElement>('[data-action="update-saved-query"]').hasAttribute('disabled')).toBeFalse();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        expect(element.isQuickEdit).toBeFalse();
        expect(getRequiredElement<HTMLElement>('[data-control="saved-query-name"]').getAttribute('appearance')).toBe('outline');
        expect(getRequiredElement<HTMLElement>('[data-action="save-query"]').hasAttribute('disabled')).toBeFalse();
        expect(element.queryEditor?.ruleCount).toBe(0);

        await openSavedMenu();
        await activateSavedMenuItem('[data-action="save-as-new"]');
        expect(element.isCreatingSavedQuery).toBeTrue();
        expect(element.isQuickEdit).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).not.toBeNull();
    });

    it('applies the active query without closing the popover or saving', async () => {
        ({ element, disconnect } = await setup(false));
        const applySpy = jasmine.createSpy('query-apply');
        const saveSpy = jasmine.createSpy('save');
        element.addEventListener('query-apply', applySpy);
        element.saveHandler = saveSpy;
        const trigger = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!trigger) {
            throw new Error('Expected the Queries primary button.');
        }
        trigger.click();
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="apply-query"]').click();
        await waitForUpdatesAsync();

        expect(applySpy).toHaveBeenCalledTimes(1);
        expect((applySpy.calls.mostRecent().args[0] as CustomEvent<{ query: QueryDocument }>).detail.query).toEqual(currentDocument);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(element.isManagerOpen).toBeTrue();
        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeFalse();
        getRequiredElement<HTMLElement>('[data-action="done-manager"]').click();
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
    });

    it('anchors the editing popover and spaces its main controls consistently', async () => {
        ({ element, disconnect } = await setup());
        const region = element.queryPopoverRegion;
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        const dialogTitle = getRequiredElement<HTMLElement>('.popover-header h2');
        const nameControl = getRequiredElement<HTMLElement>('.query-name-control');
        const queryControlsHeader = getRequiredElement<HTMLElement>('.query-controls-header');
        const queryConditions = getRequiredElement<HTMLElement>('.query-conditions');
        if (!region) {
            throw new Error('Expected the query popover region.');
        }

        expect(region.getBoundingClientRect().left).toBeCloseTo(menuButton.getBoundingClientRect().left, 0);
        expect(nameControl.getBoundingClientRect().height).toBeLessThan(100);
        expect(nameControl.getBoundingClientRect().top - dialogTitle.getBoundingClientRect().bottom).toBe(8);
        expect(queryConditions.getBoundingClientRect().top - queryControlsHeader.getBoundingClientRect().bottom).toBe(16);
        const editorLabel = queryConditions.shadowRoot?.querySelector<HTMLElement>('.conditions-heading strong');
        expect(editorLabel?.textContent).toBe(element.labels.queryConditions);
        expect(editorLabel?.getBoundingClientRect().height).toBeGreaterThan(0);
        expect(element.shadowRoot?.querySelector('.conditions-label')).toBeNull();
        const editorField = queryConditions.shadowRoot?.querySelector<HTMLElement>('.editor-field');
        const addFilter = queryConditions.shadowRoot?.querySelector<HTMLElement>('.add-filter-button');
        const askNigelButton = getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]');
        if (!editorField || !addFilter || !editorLabel) {
            throw new Error('Expected the editor field, its label, and Add filter button.');
        }
        expect(editorField.getBoundingClientRect().top - editorLabel.getBoundingClientRect().bottom).toBe(8);
        expect(askNigelButton.getBoundingClientRect().bottom).toBe(nameControl.getBoundingClientRect().bottom);
        expect(addFilter.getBoundingClientRect().top - editorField.getBoundingClientRect().bottom).toBe(8);
        expect(addFilter.getAttribute('appearance')).toBe('ghost');
        const nameInput = getRequiredElement<HTMLElement>('.query-name-input');
        expect(nameInput.textContent).toBe('Name');
        expect(element.shadowRoot?.querySelector('.query-name-label')).toBeNull();
    });

    it('uses descriptive query titles and matching saved-query menu labels', async () => {
        ({ element, disconnect } = await setup(false));
        expect(getRequiredElement<HTMLElement>('.menu-button-label').textContent).toBe('Configure query');
        element.saveHandler = async request => {
            await Promise.resolve();
            return {
                id: request.id ?? 'saved-new',
                name: request.name,
                document: request.document
            };
        };
        await waitForUpdatesAsync();
        const splitButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        const primaryAction = splitButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!primaryAction) {
            throw new Error('Expected the Queries primary button.');
        }
        primaryAction.click();
        await waitForUpdatesAsync();
        expect(getRequiredElement<HTMLElement>('.popover-header h2').textContent?.trim()).toBe('Configure query');
        getRequiredElement<HTMLElement>('[data-action="done-manager"]').click();
        await waitForUpdatesAsync();

        await selectSavedQuery('saved-a');
        expect(getRequiredElement<HTMLElement>('.menu-button-label').textContent).toBe('Failed queries');
        expect(getRequiredElement<HTMLElement>('.popover-header h2').textContent?.trim()).toBe('Edit saved query');
        expect(element.shadowRoot?.querySelector('[data-action="done-manager"]')).toBeNull();

        await openSavedMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="edit-saved-queries"]').textContent?.trim())
            .toBe('Edit saved query');
        expect(getRequiredElement<HTMLElement>('[data-action="save-as-new"]').textContent?.trim())
            .toBe('Create saved query');
        await activateSavedMenuItem('[data-action="save-as-new"]');
        expect(getRequiredElement<HTMLElement>('.popover-header h2').textContent?.trim()).toBe('Create saved query');
    });

    it('reserves accent-filled appearance for Apply and separates destructive actions', async () => {
        ({ element, disconnect } = await setup());

        expect(getRequiredElement<HTMLElement>('.queries-menu-button').getAttribute('appearance')).toBe('ghost');
        expect(getRequiredElement<HTMLElement>('[data-action="save-query"]').getAttribute('appearance')).toBe('outline');
        expect(getRequiredElement<HTMLElement>('[data-control="ai-prompt"]').tagName.toLowerCase()).toBe('spright-chat-input');
        expect(getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]')).toBeDefined();
        expect(element.shadowRoot?.querySelectorAll('[appearance="block"][appearance-variant="accent"]')).toHaveSize(1);
        expect(getRequiredElement<HTMLElement>('.footer-actions').lastElementChild?.getAttribute('data-action')).toBe('apply-query');

        await selectSavedQuery('saved-a');
        expect(getRequiredElement<HTMLElement>('.footer-secondary-actions [data-action="request-delete"]')).toBeDefined();
        expect(element.shadowRoot?.querySelector('.footer-actions [data-action="request-delete"]')).toBeNull();
    });

    it('keeps Nigel assistance and generated previews inside the query popover', async () => {
        ({ element, disconnect } = await setup());
        const popover = getRequiredElement<HTMLElement>('.query-popover');
        const toggle = getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]');
        toggle.click();
        await waitForUpdatesAsync();

        const promptContent = getRequiredElement<HTMLElement>('.ai-prompt-content');
        expect(promptContent.hasAttribute('hidden')).toBeFalse();
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(promptContent.querySelector('p')).toBeNull();
        const prompt = getRequiredElement<ChatInput>('[data-control="ai-prompt"]');
        expect(prompt.getBoundingClientRect().top - toggle.getBoundingClientRect().bottom).toBe(8);
        const editorLabel = element.queryEditor?.shadowRoot?.querySelector<HTMLElement>('.conditions-heading strong');
        expect(promptContent.getBoundingClientRect().width)
            .toBe(getRequiredElement<HTMLElement>('.query-conditions').getBoundingClientRect().width);
        expect(promptContent.getBoundingClientRect().bottom)
            .toBeLessThan(editorLabel?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY);
        const promptPageObject = new ChatInputPageObject(prompt);
        promptPageObject.setText('  Failed tests  ');
        let requestPrompt = '';
        element.addEventListener('query-ai-request', event => {
            requestPrompt = (event as CustomEvent<{ prompt: string }>).detail.prompt;
        });
        promptPageObject.clickSendButton();
        await waitForUpdatesAsync();

        expect(requestPrompt).toBe('Failed tests');
        expect(promptPageObject.getRenderedText()).toBe('');
        expect(popover.hasAttribute('hidden')).toBeFalse();
        expect(promptContent.hasAttribute('hidden')).toBeTrue();

        element.aiQueryPreview = secondSavedDocument;
        await waitForUpdatesAsync();
        expect(popover.querySelector('.ai-preview-notice')).not.toBeNull();
        getRequiredElement<HTMLElement>('[data-action="use-ai-preview"]').click();
        await waitForUpdatesAsync();
        expect(element.queryEditor?.query).toEqual(secondSavedDocument);
        expect(popover.querySelector('.ai-preview-notice')).toBeNull();
        expect(popover.hasAttribute('hidden')).toBeFalse();
    });

    it('hides Nigel prompt and generated preview when disabled', async () => {
        ({ element, disconnect } = await setup());
        expect(element.showNigelPrompt).toBeTrue();
        const toggle = getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]');
        toggle.click();
        await waitForUpdatesAsync();
        element.aiQueryPreview = secondSavedDocument;
        let requestFired = false;
        element.addEventListener('query-ai-request', () => {
            requestFired = true;
        });
        element.showNigelPrompt = false;
        await waitForUpdatesAsync();
        element.handleAiPromptSend(new CustomEvent('send', { detail: { text: 'ignored prompt' } }));

        expect(element.shadowRoot?.querySelector('[data-action="toggle-ai-prompt"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('.ai-prompt-content')).toBeNull();
        expect(element.shadowRoot?.querySelector('.ai-preview-notice')).toBeNull();
        expect(element.isAiPromptOpen).toBeFalse();
        expect(requestFired).toBeFalse();
    });

    it('keeps saved-query creation available while existing-query editing is disabled', async () => {
        ({ element, disconnect } = await setup());
        expect(element.allowSavedQueryEditing).toBeTrue();
        expect(element.allowSavedQueryDeletion).toBeTrue();
        await selectSavedQuery('saved-a');
        element.allowSavedQueryEditing = false;
        await waitForUpdatesAsync();
        await openSavedMenu();

        expect(element.shadowRoot?.querySelector('[data-action="update-saved-query"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="edit-saved-queries"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-as-new"]')).not.toBeNull();
    });

    it('hides creation actions without disabling the quick query editor', async () => {
        ({ element, disconnect } = await setup(false));
        expect(element.allowSavedQueryCreation).toBeTrue();
        element.allowSavedQueryCreation = false;
        await waitForUpdatesAsync();
        await openSavedMenu();

        expect(element.shadowRoot?.querySelector('[data-action="save-as-new"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="edit-saved-queries"]')).toBeNull();
        element.openQuickEditor();
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeTrue();
        expect(element.isQuickEdit).toBeTrue();
        expect(element.queryEditor?.query).toEqual(currentDocument);
    });

    it('preserves the query draft when creation is disabled with the create form open', async () => {
        ({ element, disconnect } = await setup());
        element.allowSavedQueryCreation = false;
        await waitForUpdatesAsync();

        expect(element.isManagerOpen).toBeFalse();
        element.openQuickEditor();
        await waitForUpdatesAsync();
        expect(element.queryEditor?.query).toEqual(currentDocument);
    });

    it('keeps existing-query updates available when creation is disabled', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        element.allowSavedQueryCreation = false;
        const saveHandler = jasmine.createSpy('saveHandler').and.callFake(async (request: QueryBuilderSaveRequest) => {
            await Promise.resolve();
            return { id: request.id!, name: request.name, document: request.document };
        });
        element.saveHandler = saveHandler;
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Updated saved query';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.canSaveChanges).toBeTrue();
        getRequiredElement<HTMLElement>('[data-action="save-query"]').click();
        await waitForUpdatesAsync();

        expect(saveHandler).toHaveBeenCalledTimes(1);
        expect(saveHandler.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ kind: 'update' }));
    });

    it('blocks create actions and save requests when creation is disabled', async () => {
        ({ element, disconnect } = await setup(false));
        const saveHandler = jasmine.createSpy('saveHandler');
        element.saveHandler = saveHandler;
        element.allowSavedQueryCreation = false;
        await waitForUpdatesAsync();
        const action = document.createElement('button');
        getRequiredElement<HTMLElement>('.query-builder').append(action);
        action.dataset.action = 'save-as-new';
        action.click();
        expect(element.isManagerOpen).toBeFalse();
        action.dataset.action = 'edit-saved-queries';
        action.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        expect(element.isManagerOpen).toBeFalse();

        element.isCreatingSavedQuery = true;
        element.savedQueryName = 'Blocked query';
        action.dataset.action = 'save-query';
        action.click();
        await waitForUpdatesAsync();
        expect(element.canSave).toBeFalse();
        expect(saveHandler).not.toHaveBeenCalled();
    });

    it('closes the saved-query editor when editing is disabled at runtime', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        element.allowSavedQueryEditing = false;
        await waitForUpdatesAsync();

        expect(element.isManagerOpen).toBeFalse();
    });

    it('hides saved-query deletion when disabled', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        element.confirmingDelete = true;
        element.allowSavedQueryDeletion = false;
        await waitForUpdatesAsync();

        expect(element.confirmingDelete).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-action="request-delete"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="confirm-delete"]')).toBeNull();
    });

    it('closes the query popover on Escape without discarding saved-query edits', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Edited name';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const keydown = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            composed: true,
            cancelable: true
        });
        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(keydown);
        await waitForUpdatesAsync();

        expect(keydown.defaultPrevented).toBeTrue();
        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeTrue();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.savedDrafts.get('saved-a')?.name).toBe('Edited name');
    });

    it('closes the query popover on outside pointer input without discarding its draft', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Outside click edit';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        document.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeTrue();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.savedDrafts.get('saved-a')?.name).toBe('Outside click edit');
    });

    it('keeps a scalar text condition editor open while its value changes', async () => {
        ({ element, disconnect } = await setup());
        element.query = textDocument;
        await waitForUpdatesAsync();

        const editor = element.queryEditor;
        const chip = editor?.shadowRoot?.querySelector<HTMLElement>('[data-rule-id]');
        if (!editor || !chip) {
            throw new Error('Expected the name condition chip.');
        }
        chip.click();
        await waitForUpdatesAsync();
        const activeRuleId = editor.activeRuleId;
        expect(activeRuleId).not.toBeNull();

        const valueControl = editor.shadowRoot?.querySelector<HTMLElement & { value: string }>(
            '[data-control="scalar-text"]'
        );
        if (!valueControl) {
            throw new Error('Expected the scalar text value control.');
        }
        valueControl.value = 'Alpha x';
        valueControl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(JSON.stringify(element.query?.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'name',
            operatorId: 'is',
            value: 'Alpha x'
        }));
        expect(editor.activeRuleId).toBe(activeRuleId);
    });

    it('keeps a collection condition editor open after selecting a value', async () => {
        ({ element, disconnect } = await setup());
        element.query = collectionDocument;
        await waitForUpdatesAsync();

        const editor = element.queryEditor;
        const chip = editor?.shadowRoot?.querySelector<HTMLElement>('[data-rule-id]');
        if (!editor || !chip) {
            throw new Error('Expected the status condition chip.');
        }
        chip.click();
        await waitForUpdatesAsync();
        const activeRuleId = editor.activeRuleId;
        expect(activeRuleId).not.toBeNull();

        const valueControl = editor.shadowRoot?.querySelector<HTMLElement & {
            selectedOptionValues: readonly unknown[]
        }>('[data-control="collection-selector"]');
        if (!valueControl) {
            throw new Error('Expected the collection selector value control.');
        }
        valueControl.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { selectedOptionValues: ['failed'] }
        }));
        await waitForUpdatesAsync();

        expect(JSON.stringify(element.query?.root)).toBe(JSON.stringify({
            kind: 'predicate',
            fieldId: 'status',
            operatorId: 'is-any-of',
            value: ['failed']
        }));
        expect(editor.activeRuleId).toBe(activeRuleId);
    });

    it('round-trips the current and saved drafts independently, including unfinished input', async () => {
        ({ element, disconnect } = await setup());
        const input = element.queryEditor?.shadowRoot
            ?.querySelector<HTMLElement>('.query-input')
            ?.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble query input.');
        }
        input.value = 'dur';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        await selectSavedQuery('saved-a');
        expect(element.queryEditor?.query).toEqual(savedDocument);
        const savedInput = element.queryEditor?.shadowRoot
            ?.querySelector<HTMLElement>('.query-input')
            ?.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!savedInput) {
            throw new Error('Expected the Nimble query input.');
        }
        savedInput.value = 'sta';
        savedInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        await selectSavedQuery('saved-b');
        expect(element.queryEditor?.query).toEqual(secondSavedDocument);
        await selectSavedQuery('saved-a');
        expect(element.queryEditor?.draft.inputText).toBe('sta');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="select-current-query"]');
        expect(element.queryEditor?.draft.inputText).toBe('dur');
        expect(element.queryEditor?.query).toEqual(currentDocument);
    });

    it('does not count caret or generated group IDs as saved-query edits', async () => {
        ({ element, disconnect } = await setup());
        const nestedDocument: QueryDocument = {
            version: 1,
            root: {
                kind: 'group',
                combinator: 'and',
                children: [
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [
                            { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' },
                            { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 500 }
                        ]
                    },
                    { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'passed' }
                ]
            }
        };
        element.savedQueries = [...savedRecords, { id: 'nested', name: 'Nested', document: nestedDocument }];
        await waitForUpdatesAsync();
        await selectSavedQuery('nested');

        const editor = element.queryEditor;
        if (!editor) {
            throw new Error('Expected the query editor.');
        }
        const changedDraft = {
            ...editor.draft,
            caretPosition: 0,
            tokens: editor.draft.tokens.map(token => (token.kind === 'open'
                ? { kind: 'open' as const, id: 'regenerated-group-id' }
                : token))
        };
        editor.draft = changedDraft;
        editor.dispatchEvent(new CustomEvent('query-change', {
            bubbles: true,
            composed: true,
            detail: {
                draft: changedDraft,
                query: nestedDocument,
                ruleCount: 3,
                valid: true,
                issues: []
            }
        }));
        await waitForUpdatesAsync();

        expect(element.selectedQueryIsDirty)
            .withContext(JSON.stringify(element.savedDrafts.get('nested')))
            .toBeFalse();
    });

    it('renames and explicitly saves only changed saved queries', async () => {
        ({ element, disconnect } = await setup());
        element.deleteHandler = async () => {
            await Promise.resolve();
        };
        let requestCount = 0;
        element.saveHandler = async request => {
            await Promise.resolve();
            requestCount += 1;
            return {
                id: request.id ?? 'created',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');

        const save = getRequiredElement<HTMLElement>('[data-action="save-query"]');
        const deleteButton = getRequiredElement<HTMLElement>('[data-action="request-delete"]');
        expect(save.hasAttribute('disabled')).toBeTrue();
        expect(deleteButton.hasAttribute('disabled')).toBeFalse();
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Failed production';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(save.hasAttribute('disabled')).toBeFalse();

        expect(element.selectedSavedQueryId).toBe('saved-a');
        save.click();
        await waitForUpdatesAsync();
        expect(requestCount).toBe(1);
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.selectedName).toBe('Failed production');
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        expect(menuButton.querySelector('.menu-button-label')?.textContent).toBe('Failed production');
        await openSavedMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="select-saved-query"][data-saved-query-id="saved-a"]')
            .textContent).toContain('Failed production');
    });

    it('updates a dirty saved query from the menu and offers Save as new', async () => {
        ({ element, disconnect } = await setup());
        let updateRequest: {
            kind: string,
            id?: string,
            name: string,
            document: QueryDocument
        } | undefined;
        element.saveHandler = async request => {
            updateRequest = request;
            await Promise.resolve();
            return {
                id: request.id ?? 'created',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');

        const editor = element.queryEditor;
        const conditionChips = editor?.shadowRoot?.querySelectorAll<HTMLElement>('[data-rule-id]');
        const durationChip = conditionChips?.[1];
        if (!editor || !durationChip) {
            throw new Error('Expected the saved duration condition chip.');
        }
        durationChip.click();
        await waitForUpdatesAsync();
        const valueControl = editor.shadowRoot?.querySelector<HTMLElement & { value: string }>(
            '[data-control="scalar-number"]'
        );
        if (!valueControl) {
            throw new Error('Expected the duration value control.');
        }
        valueControl.value = '750';
        valueControl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();

        await openSavedMenu();
        await waitForUpdatesAsync();
        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeTrue();
        const saveAsNew = getRequiredElement<HTMLElement>('[data-action="save-as-new"]');
        const update = getRequiredElement<HTMLElement>('[data-action="update-saved-query"]');
        expect(saveAsNew.hasAttribute('disabled')).toBeFalse();
        expect(update.hasAttribute('disabled')).toBeFalse();
        await activateSavedMenuItem('[data-action="update-saved-query"]');

        expect(updateRequest?.kind).toBe('update');
        expect(updateRequest?.id).toBe('saved-a');
        expect(updateRequest?.name).toBe('Failed queries');
        expect(JSON.stringify(updateRequest?.document)).toBe(JSON.stringify({
            version: 1,
            root: {
                kind: 'group',
                combinator: 'and',
                children: [
                    { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' },
                    { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 750 }
                ]
            }
        }));
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.selectedSavedQueryId).toBe('saved-a');
    });

    it('keeps failed saves dirty and allows retry', async () => {
        ({ element, disconnect } = await setup());
        let fail = true;
        element.saveHandler = async request => {
            await Promise.resolve();
            if (fail) {
                fail = false;
                throw new Error('temporary');
            }
            return { id: request.id ?? 'created', name: request.name, document: request.document };
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Updated';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const save = getRequiredElement<HTMLElement>('[data-action="save-query"]');
        save.click();
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.operationError).toBe(element.labels.saveFailed);

        save.click();
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.operationError).toBe('');
    });

    it('hides Done while editing a saved query without affecting save or apply', async () => {
        ({ element, disconnect } = await setup());
        const saveHandler = jasmine.createSpy('saveHandler').and.resolveTo(savedRecords[0]!);
        element.saveHandler = saveHandler;
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);

        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        expect(element.shadowRoot?.querySelector('[data-action="done-manager"]')).toBeNull();
        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();

        expect(saveHandler).not.toHaveBeenCalled();
        expect(apply).not.toHaveBeenCalled();
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        getRequiredElement<HTMLElement>('[data-action="apply-query"]').click();
        await waitForUpdatesAsync();
        expect(apply).toHaveBeenCalledTimes(1);
        expect((apply.calls.mostRecent().args[0] as CustomEvent<{ selectedId: string }>).detail.selectedId).toBe('saved-a');
        expect(saveHandler).not.toHaveBeenCalled();
    });

    it('does not rename the source query while entering a new saved-query name', async () => {
        ({ element, disconnect } = await setup());
        element.saveHandler = async request => {
            await Promise.resolve();
            return {
                id: request.id ?? 'copy',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="save-as-new"]');

        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Copy of failed queries';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.selectedName).toBe('Failed queries');
        expect(element.savedQueryName).toBe('Copy of failed queries');
    });

    it('saves the current query as a named saved query from the manager', async () => {
        ({ element, disconnect } = await setup());
        element.saveHandler = async request => {
            await Promise.resolve();
            return { id: 'saved-current', name: request.name, document: request.document };
        };
        await openSavedMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="save-as-new"]').textContent).toContain('Create saved query');
        await activateSavedMenuItem('[data-action="save-as-new"]');

        expect(getRequiredElement<HTMLElement>('.saved-query-manager').querySelectorAll('[data-saved-query-id]')).toHaveSize(0);

        const name = getRequiredElement<HTMLElement & { value: string, appearance: string }>(
            '[data-control="saved-query-name"]'
        );
        expect(name.appearance).toBe('outline');
        name.value = 'Current filters';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="save-query"]').click();
        await waitForUpdatesAsync();

        expect(element.savedQueries.find(record => record.id === 'saved-current')).toEqual({
            id: 'saved-current',
            name: 'Current filters',
            document: currentDocument
        });
        expect(element.selectedSavedQueryId).toBe('saved-current');
    });

    it('restores the committed saved-query name when canceling an applied selection', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        getRequiredElement<HTMLElement>('[data-action="apply-query"]').click();
        await waitForUpdatesAsync();

        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Unsaved name';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();

        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();

        expect(element.selectedSavedQueryId).toBe('saved-a');
        expect(element.savedQueryName).toBe('Failed queries');
        expect(element.selectedQueryIsDirty).toBeFalse();
    });

    it('cancels delete confirmation and selects Current query after successful deletion', async () => {
        ({ element, disconnect } = await setup());
        element.deleteHandler = async () => {
            await Promise.resolve();
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        getRequiredElement<HTMLElement>('[data-action="request-delete"]').click();
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="cancel-delete"]').click();
        await waitForUpdatesAsync();
        expect(element.savedQueries).toHaveSize(2);

        getRequiredElement<HTMLElement>('[data-action="request-delete"]').click();
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="confirm-delete"]').click();
        await waitForUpdatesAsync();
        expect(element.savedQueries.map(record => record.id)).toEqual(['saved-b']);
        expect(element.selectedSavedQueryId).toBeNull();
        expect(element.queryEditor?.query).toEqual(currentDocument);
    });

    it('cancels creation without changing the source selection or draft', async () => {
        ({ element, disconnect } = await setup());
        element.saveHandler = async request => {
            await Promise.resolve();
            return {
                id: request.id ?? 'created',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="save-as-new"]');

        expect(element.queryEditor?.query).toEqual(savedDocument);
        expect(element.queryEditor?.draft.tokens.length).toBeGreaterThan(0);
        getRequiredElement<HTMLElement>('[data-action="cancel-create"]').click();
        await waitForUpdatesAsync();
        expect(element.selectedSavedQueryId).toBe('saved-a');
        expect(element.savedQueries).toHaveSize(2);
        expect(element.queryEditor?.query).toEqual(savedDocument);
    });
});
