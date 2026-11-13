import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitForEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import { ChatInputPageObject } from '@ni/spright-components/dist/esm/chat/input/testing/chat-input.pageobject';
import type { Dialog } from '@ni/nimble-components/dist/esm/dialog';
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
        const region = result.element.queryPopoverRegion;
        if (!region) {
            throw new Error('Expected the query popover region.');
        }
        const loaded = new Promise<void>(resolve => {
            region.addEventListener('loaded', () => resolve(), { once: true });
        });
        editItem.click();
        await loaded;
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

    async function activatePrimaryAction(): Promise<void> {
        const primary = getRequiredElement<FvSplitButton>('.query-action-split-button')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!primary) {
            throw new Error('Expected the query action primary button.');
        }
        primary.click();
        await waitForUpdatesAsync();
    }

    async function openActionMenu(): Promise<void> {
        const splitButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        if (!splitButton.open) {
            splitButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle')?.click();
            await waitForUpdatesAsync();
        }
    }

    async function activateActionMenuItem(selector: string): Promise<void> {
        await openActionMenu();
        await activateSavedMenuItem(selector);
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
        expect(menuButton.label).toBe('Query');
        const startSlot = menuButton.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="start"]');
        expect(startSlot?.assignedElements()).toEqual([menuButton.querySelector('[slot="start"]')!]);
        expect(menuButton.querySelector('nimble-icon-arrow-down')).toBeNull();
        expect(menuButton.querySelector('nimble-menu')?.querySelectorAll('nimble-menu-item')).toHaveSize(5);
        expect(menuButton.querySelector('[data-action="select-current-query"]')?.getAttribute('aria-current')).toBe('true');
        expect(getRequiredElement<HTMLElement>('.query-popover').hasAttribute('hidden')).toBeTrue();
        expect(element.queryPopoverRegion?.horizontalDefaultPosition).toBe('center');
        expect(element.queryPopoverRegion?.horizontalInset).toBeTrue();
        expect(element.queryPopoverRegion?.horizontalViewportLock).toBeTrue();
        expect(element.queryPopoverRegion?.verticalPositioningMode).toBe('dynamic');
        expect(element.queryPopoverRegion?.verticalViewportLock).toBeTrue();
    });

    it('rejects malformed assigned queries without throwing or replacing the working query', async () => {
        ({ element, disconnect } = await setup());
        const original = element.query;
        const cyclic: { [key: string]: unknown } = {};
        cyclic.self = cyclic;
        const checkInvalid = async (invalid: unknown): Promise<void> => {
            expect(() => {
                element.query = invalid as QueryDocument;
            }).not.toThrow();
            await waitForUpdatesAsync();
            expect(element.valid).toBeFalse();
            expect(element.validate()).toBeFalse();
            expect(element.issues.some(issue => issue.target === 'query')).toBeTrue();
            expect(element.query).toEqual(original);
        };
        await checkInvalid(null);
        await checkInvalid({ version: 1, root: { kind: 'group', combinator: 'and' } });
        await checkInvalid(cyclic);
        const validity: boolean[] = [];
        element.addEventListener('validity-change', event => {
            validity.push((event as CustomEvent<{ valid: boolean }>).detail.valid);
        });
        element.query = {
            version: 1, root: { kind: 'predicate', fieldId: 'unknown', operatorId: 'is', value: 'passed' }
        };
        await waitForUpdatesAsync();
        expect(validity).not.toContain(true);
        expect(element.valid).toBeFalse();
        element.query = currentDocument;
        await waitForUpdatesAsync();
        expect(element.valid).toBeTrue();
    });

    it('reports a malformed query assigned before connection', async () => {
        const result = await fixture<FvQueryBuilder>(html`<${fvQueryBuilderTag}></${fvQueryBuilderTag}>`);
        ({ element, disconnect } = result);
        element.query = null as unknown as QueryDocument;
        await result.connect();
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();
        expect(element.issues.some(issue => issue.target === 'query')).toBeTrue();
    });

    it('ignores saved-query refresh callbacks before draft state is initialized', () => {
        const builder = document.createElement(fvQueryBuilderTag);
        const earlyBuilder = builder as unknown as {
            savedDrafts?: Map<string, unknown>,
            orphanedDrafts?: Map<string, unknown>,
            selectedSavedQueryId?: string | null
        };
        earlyBuilder.savedDrafts = undefined;
        earlyBuilder.orphanedDrafts = undefined;
        earlyBuilder.selectedSavedQueryId = undefined;

        expect(() => builder.savedQueriesChanged()).not.toThrow();
    });

    it('renders the split button without an internal toolbar', async () => {
        ({ element, disconnect } = await setup(false));

        const group = getRequiredElement<HTMLElement>('.query-builder');
        expect(group.getAttribute('role')).toBe('group');
        expect(group.firstElementChild).toBe(getRequiredElement<HTMLElement>('.queries-menu-button'));
        expect(element.shadowRoot?.querySelector('[role="toolbar"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('.builder-toolbar')).toBeNull();
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
        expect(region.anchorElement).toBeNull();
        const loaded = new Promise<void>(resolve => {
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
        expect(region.anchorElement).toBe(element.savedQueryMenuButton ?? null);
        expect(element.isQuickEdit).toBeTrue();
        expect(element.isSavedMenuOpen).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        const actionSplitButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        expect(actionSplitButton.label).toBe('Apply');
        expect(actionSplitButton.disabled).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-action="save-as-new"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="cancel-query"]')?.textContent?.trim()).toBe('Cancel');
        expect(element.shadowRoot?.querySelector('[data-action="clear-query"]')).toBeNull();
        expect(element.queryEditor?.shadowRoot?.activeElement?.classList.contains('query-input')).toBeTrue();

        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
        expect(region.anchorElement).toBeNull();
        expect(element.savedQueryMenuButton?.shadowRoot?.activeElement).toBe(trigger);
    });

    describe('popover dragging', () => {
        function dispatchPointer(target: Element, type: string, x: number, y: number, init: PointerEventInit = {}): PointerEvent {
            const event = new PointerEvent(type, {
                pointerId: 1,
                isPrimary: true,
                button: 0,
                clientX: x,
                clientY: y,
                bubbles: true,
                composed: true,
                cancelable: true,
                ...init
            });
            target.dispatchEvent(event);
            return event;
        }

        function drag(header: Element, dx: number, dy: number, init: PointerEventInit = {}): void {
            dispatchPointer(header, 'pointerdown', 100, 100, init);
            dispatchPointer(header, 'pointermove', 100 + dx, 100 + dy, init);
            dispatchPointer(header, 'pointerup', 100 + dx, 100 + dy, init);
        }

        let header: HTMLElement;
        let setPointerCapture: jasmine.Spy;
        let popoverWidth: number;

        function dragOffset(): { x: string, y: string } {
            const style = element.queryPopoverRegion!.style;
            return {
                x: style.getPropertyValue('--query-popover-drag-x'),
                y: style.getPropertyValue('--query-popover-drag-y')
            };
        }

        beforeEach(async () => {
            ({ element, disconnect } = await setup());
            header = getRequiredElement<HTMLElement>('.popover-header');
            setPointerCapture = spyOn(header, 'setPointerCapture');
            // Fixture layout depends on the Karma window, so report a fixed undragged rect plus the applied offset.
            const popover = getRequiredElement<HTMLElement>('.query-popover');
            popoverWidth = 200;
            spyOn(popover, 'getBoundingClientRect').and.callFake(() => {
                const offset = dragOffset();
                return new DOMRect(
                    100 + (offset.x ? parseFloat(offset.x) : 0),
                    100 + (offset.y ? parseFloat(offset.y) : 0),
                    popoverWidth,
                    150
                );
            });
        });

        it('moves the popover with a header drag without closing it', async () => {
            const down = dispatchPointer(header, 'pointerdown', 100, 100);
            dispatchPointer(header, 'pointermove', 95, 104);
            dispatchPointer(header, 'pointerup', 95, 104);
            await waitForUpdatesAsync();

            expect(down.defaultPrevented).toBeTrue();
            expect(setPointerCapture).toHaveBeenCalledWith(1);
            expect(element.isManagerOpen).toBeTrue();
            expect(dragOffset()).toEqual({ x: '-5px', y: '4px' });
        });

        it('moves the popover without creating a containing block for fixed condition popovers', () => {
            drag(header, -5, 4);

            const style = getComputedStyle(getRequiredElement<HTMLElement>('.query-popover'));
            expect(style.translate).toBe('none');
            expect(style.transform).toBe('none');
            expect(style.position).toBe('relative');
            expect(style.left).toBe('-5px');
            expect(style.top).toBe('4px');
        });

        it('accumulates offsets across drags', () => {
            drag(header, -5, 4);
            drag(header, 10, 6);

            expect(dragOffset()).toEqual({ x: '5px', y: '10px' });
        });

        it('keeps the dragged popover at least 8px inside the viewport', () => {
            const { clientWidth, clientHeight } = document.documentElement;

            drag(header, -10000, -10000);
            expect(dragOffset()).toEqual({ x: '-92px', y: '-92px' });

            drag(header, 20000, 20000);
            expect(dragOffset()).toEqual({
                x: `${clientWidth - 8 - 200 - 100}px`,
                y: `${clientHeight - 8 - 150 - 100}px`
            });
        });

        it('ignores secondary buttons and stops following the pointer after release', () => {
            drag(header, -5, 4, { button: 2 });
            expect(dragOffset()).toEqual({ x: '', y: '' });
            expect(setPointerCapture).not.toHaveBeenCalled();

            drag(header, -5, 4);
            dispatchPointer(header, 'pointermove', 50, 50);
            expect(dragOffset()).toEqual({ x: '-5px', y: '4px' });
        });

        it('resets the position on double-click and when the popover closes', async () => {
            drag(header, -5, 4);
            header.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
            expect(dragOffset()).withContext('after double-click').toEqual({ x: '', y: '' });

            drag(header, -5, 4);
            getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape', bubbles: true, composed: true, cancelable: true
            }));
            window.dispatchEvent(new Event('resize'));
            await waitForUpdatesAsync();
            expect(element.isManagerOpen).toBeFalse();
            expect(dragOffset()).withContext('after close').toEqual({ x: '', y: '' });
        });

        it('re-clamps a dragged popover when the viewport changes', async () => {
            drag(header, 20000, 20000);
            const clamped = dragOffset();
            drag(header, -10, -10);
            window.dispatchEvent(new Event('resize'));
            await waitForUpdatesAsync();

            expect(dragOffset()).toEqual({
                x: `${parseFloat(clamped.x) - 10}px`,
                y: `${parseFloat(clamped.y) - 10}px`
            });
        });

        it('re-clamps the drag offset after responsive popover resizing', async () => {
            const popover = getRequiredElement<HTMLElement>('.query-popover');
            spyOn(element.queryViewport!, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 375, 500));

            drag(header, 20000, 0);
            expect(dragOffset().x).toBe('67px');

            window.dispatchEvent(new Event('resize'));
            await waitForUpdatesAsync();
            popoverWidth = 359;
            popover.style.width = '359px';
            await new Promise<void>(resolve => {
                window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
            });

            expect(dragOffset().x).toBe('-92px');
        });
    });

    it('places the query popover using viewport bounds when the document is short', async () => {
        const rootStyle = document.documentElement.getAttribute('style');
        const bodyStyle = document.body.getAttribute('style');
        document.documentElement.style.setProperty('height', '162px', 'important');
        document.body.style.setProperty('height', '162px', 'important');
        try {
            ({ element, disconnect } = await setup());
            element.savedQueryMenuButton!.style.marginTop = '66px';
            element.queryPopoverRegion!.update();
            await new Promise<void>(resolve => {
                window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
            });
            const anchor = element.savedQueryMenuButton!.getBoundingClientRect();
            const popover = getRequiredElement<HTMLElement>('.query-popover').getBoundingClientRect();
            expect(document.documentElement.getBoundingClientRect().height).toBeLessThan(window.innerHeight);
            expect(popover.top).toBeGreaterThanOrEqual(anchor.bottom - 1);
        } finally {
            if (rootStyle === null) {
                document.documentElement.removeAttribute('style');
            } else {
                document.documentElement.setAttribute('style', rootStyle);
            }
            if (bodyStyle === null) {
                document.body.removeAttribute('style');
            } else {
                document.body.setAttribute('style', bodyStyle);
            }
        }
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
        expect(element.shadowRoot?.querySelector('[data-action="update-saved-query"]')).toBeNull();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        expect(element.isQuickEdit).toBeFalse();
        expect(getRequiredElement<HTMLElement>('[data-control="saved-query-name"]').getAttribute('appearance')).toBe('outline');
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').disabled).toBeFalse();
        expect(element.queryEditor?.ruleCount).toBe(0);

        await openSavedMenu();
        await activateSavedMenuItem('[data-action="save-as-new"]');
        expect(element.isCreatingSavedQuery).toBeTrue();
        expect(element.isQuickEdit).toBeFalse();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).not.toBeNull();
    });

    it('applies the active query and closes the popover without saving', async () => {
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
        await activatePrimaryAction();

        expect(applySpy).toHaveBeenCalledTimes(1);
        expect((applySpy.calls.mostRecent().args[0] as CustomEvent<{ query: QueryDocument }>).detail.query).toEqual(currentDocument);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(element.isManagerOpen).toBeFalse();
    });

    it('keeps Working query edits when Cancel closes the popover', async () => {
        ({ element, disconnect } = await setup(false));
        const trigger = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        if (!trigger) {
            throw new Error('Expected the Configure query button.');
        }
        trigger.click();
        await waitForUpdatesAsync();
        const input = element.queryEditor?.shadowRoot
            ?.querySelector<HTMLElement>('.query-input')
            ?.shadowRoot?.querySelector<HTMLInputElement>('input');
        if (!input) {
            throw new Error('Expected the Nimble query input.');
        }
        input.value = 'dur';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
        expect(element.queryEditor?.draft.inputText).toBe('dur');

        trigger.click();
        await waitForUpdatesAsync();
        expect(element.queryEditor?.draft.inputText).toBe('dur');
        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
        expect(element.queryEditor?.draft.inputText).toBe('dur');
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

        expect(region.anchorElement).toBe(menuButton);
        expect(nameControl.getBoundingClientRect().height).toBeLessThan(100);
        expect(nameControl.getBoundingClientRect().top - dialogTitle.getBoundingClientRect().bottom).toBe(8);
        expect(queryConditions.getBoundingClientRect().top - queryControlsHeader.getBoundingClientRect().bottom).toBe(16);
        const editorLabel = queryConditions.shadowRoot?.querySelector<HTMLElement>('.conditions-heading strong');
        expect(editorLabel?.textContent).toBe(element.labels.queryConditions);
        expect(editorLabel?.getBoundingClientRect().height).toBeGreaterThan(0);
        expect(element.shadowRoot?.querySelector('.conditions-label')).toBeNull();
        const editorField = queryConditions.shadowRoot?.querySelector<HTMLElement>('.editor-field');
        const askNigelButton = getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]');
        if (!editorField || !editorLabel) {
            throw new Error('Expected the editor field and its label.');
        }
        expect(editorField.getBoundingClientRect().top - editorLabel.getBoundingClientRect().bottom).toBe(8);
        expect(askNigelButton.getBoundingClientRect().bottom).toBe(nameControl.getBoundingClientRect().bottom);
        expect(queryConditions.shadowRoot?.querySelector('.add-filter-button')).toBeNull();
        const nameInput = getRequiredElement<HTMLElement>('.query-name-input');
        expect(nameInput.textContent).toBe('Name');
        expect(element.shadowRoot?.querySelector('.query-name-label')).toBeNull();
    });

    it('uses descriptive query titles and matching saved-query menu labels', async () => {
        ({ element, disconnect } = await setup(false));
        expect(getRequiredElement<FvSplitButton>('.queries-menu-button').label).toBe('Query');
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
        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();

        await selectSavedQuery('saved-a');
        expect(getRequiredElement<FvSplitButton>('.queries-menu-button').label).toBe('Failed queries');
        expect(getRequiredElement<HTMLElement>('.popover-header h2').textContent?.trim()).toBe('Edit saved query');
        expect(element.shadowRoot?.querySelector('[data-action="cancel-query"]')).not.toBeNull();

        await openSavedMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="select-current-query"]').textContent?.trim())
            .toContain('Working query');
        expect(getRequiredElement<HTMLElement>('[data-action="edit-saved-queries"]').textContent?.trim())
            .toBe('Edit saved query');
        expect(getRequiredElement<HTMLElement>('[data-action="save-as-new"]').textContent?.trim())
            .toBe('Save as new…');
        await activateSavedMenuItem('[data-action="save-as-new"]');
        expect(getRequiredElement<HTMLElement>('.popover-header h2').textContent?.trim()).toBe('Create saved query');
    });

    it('uses the action split button and keeps delete in its menu', async () => {
        ({ element, disconnect } = await setup());

        expect(getRequiredElement<HTMLElement>('.queries-menu-button').getAttribute('appearance')).toBe('ghost');
        const actionButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        expect(actionButton.label).toBe('Save');
        expect(actionButton.getAttribute('appearance')).toBe('block');
        expect(actionButton.getAttribute('appearance-variant')).toBe('accent');
        expect(getRequiredElement<HTMLElement>('[data-control="ai-prompt"]').tagName.toLowerCase()).toBe('spright-chat-input');
        expect(getRequiredElement<HTMLElement>('[data-action="toggle-ai-prompt"]')).toBeDefined();
        expect(element.shadowRoot?.querySelectorAll('[appearance="block"][appearance-variant="accent"]')).toHaveSize(1);
        expect(getRequiredElement<HTMLElement>('.builder-footer').querySelector('[data-action]')?.getAttribute('data-action'))
            .toBe('apply-query');
        expect(element.shadowRoot?.querySelector('[data-action="clear-query"]')).toBeNull();
        const cancel = getRequiredElement<HTMLElement>('[data-action="cancel-query"]');
        expect(actionButton.getBoundingClientRect().right).toBeGreaterThan(cancel.getBoundingClientRect().right);

        await selectSavedQuery('saved-a');
        expect(getRequiredElement<HTMLElement>('.query-action-menu [data-action="request-delete"]')).toBeDefined();
        expect(element.shadowRoot?.querySelector('.footer-secondary-actions')).toBeNull();
    });

    it('closes the action menu before the query popover on Escape', async () => {
        ({ element, disconnect } = await setup(false));
        const loaded = new Promise<void>(resolve => {
            element.queryPopoverRegion!.addEventListener('loaded', () => resolve(), { once: true });
        });
        element.openQuickEditor();
        await loaded;
        await waitForUpdatesAsync();
        await openActionMenu();
        const splitButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        const toggle = splitButton.shadowRoot!.querySelector<HTMLButtonElement>('.split-button-toggle')!;
        toggle.focus();
        toggle.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(splitButton.open).toBeFalse();
        expect(element.isManagerOpen).toBeTrue();
        expect(splitButton.shadowRoot?.activeElement).toBe(toggle);
    });

    it('keeps the action menu visible beyond the query popover edges', async () => {
        ({ element, disconnect } = await setup(false));
        element.saveHandler = async request => {
            await Promise.resolve();
            return {
                id: request.id ?? 'saved-new',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Updated saved query';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await openActionMenu();
        const actionRegion = getRequiredElement<FvSplitButton>('.query-action-split-button').region;
        if (!actionRegion) {
            throw new Error('Expected the action menu region.');
        }
        if (!actionRegion.initialLayoutComplete) {
            await waitForEvent(actionRegion, 'loaded');
        }
        await new Promise<void>(resolve => {
            window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
        });

        const popover = getRequiredElement<HTMLElement>('.query-popover');
        const splitButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        const popupRegion = splitButton.region;
        const menu = getRequiredElement<HTMLElement>('.query-action-menu');
        const toggle = splitButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle');
        expect(popupRegion?.matches(':popover-open')).toBeTrue();
        const popoverBounds = popover.getBoundingClientRect();
        const regionBounds = popupRegion?.getBoundingClientRect();
        const menuBounds = menu.getBoundingClientRect();
        if (!regionBounds || !toggle) {
            throw new Error('Expected the action menu region and toggle button.');
        }
        const menuBottomBeyondPopover = Math.min(menuBounds.bottom, regionBounds.bottom) - popoverBounds.bottom;
        expect(menuBottomBeyondPopover).withContext(
            `Popover: ${JSON.stringify(popoverBounds.toJSON())}; region: ${JSON.stringify(regionBounds.toJSON())};`
                + ` menu: ${JSON.stringify(menuBounds.toJSON())}; toggle: ${JSON.stringify(toggle.getBoundingClientRect().toJSON())}`
        ).toBeGreaterThan(0);
        const isMenuElement = (hit: Element | null): boolean => {
            let current = hit;
            while (current && current !== menu) {
                const root = current.getRootNode();
                current = current.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
            }
            return current === menu;
        };
        const isMenuHitAt = (x: number, y: number): boolean => {
            let hit: Element | null = document.elementFromPoint(x, y);
            while (hit?.shadowRoot) {
                const shadowHit = hit.shadowRoot.elementFromPoint(x, y);
                if (!shadowHit || shadowHit === hit) {
                    break;
                }
                hit = shadowHit;
            }
            return isMenuElement(hit);
        };
        const menuItemContent = menu.querySelector<HTMLElement>('[data-action="request-delete"]')
            ?.shadowRoot?.querySelector('[part="content"]');
        if (!menuItemContent) {
            throw new Error('Expected the action menu item content.');
        }
        expect(isMenuElement(menuItemContent)).withContext('Menu item shadow content belongs to the menu.').toBeTrue();
        expect(isMenuElement(popover)).toBeFalse();
        const testVerticalX = menuBounds.left + menuBounds.width / 2;
        const testVerticalY = popoverBounds.bottom + menuBottomBeyondPopover / 2;
        expect(isMenuHitAt(testVerticalX, testVerticalY))
            .withContext(`Expected the menu at (${testVerticalX}, ${testVerticalY}) below the popover.`)
            .toBeTrue();

        const menuRightBeyondPopover = Math.min(menuBounds.right, regionBounds.right) - popoverBounds.right;
        if (menuRightBeyondPopover > 0) {
            const testHorizontalX = popoverBounds.right + menuRightBeyondPopover / 2;
            const testHorizontalY = menuBounds.top + menuBounds.height / 2;
            expect(isMenuHitAt(testHorizontalX, testHorizontalY))
                .withContext(`Expected the menu at (${testHorizontalX}, ${testHorizontalY}) beyond the popover's right edge.`)
                .toBeTrue();
        }
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
        expect(element.shadowRoot?.querySelector('[data-action="edit-saved-queries"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-as-new"]')).not.toBeNull();
    });

    it('shows the saved-query menu divider only when actions follow it', async () => {
        ({ element, disconnect } = await setup(false));
        const menu = getRequiredElement<HTMLElement>('.saved-query-menu');
        expect(menu.querySelector('[role="separator"]')).not.toBeNull();

        element.allowSavedQueryCreation = false;
        await waitForUpdatesAsync();
        expect(menu.querySelector('[role="separator"]')).toBeNull();

        await selectSavedQuery('saved-a');
        expect(menu.querySelector('[role="separator"]')).not.toBeNull();

        element.allowSavedQueryEditing = false;
        await waitForUpdatesAsync();
        expect(menu.querySelector('[role="separator"]')).not.toBeNull();

        element.allowSavedQueryDeletion = false;
        await waitForUpdatesAsync();
        expect(menu.querySelector('[role="separator"]')).toBeNull();

        element.allowSavedQueryCreation = true;
        await waitForUpdatesAsync();
        expect(menu.querySelector('[role="separator"]')).not.toBeNull();
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
        await activatePrimaryAction();

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

    it('keeps deletion management open without editing controls when editing is disabled at runtime', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        element.allowSavedQueryEditing = false;
        await waitForUpdatesAsync();

        expect(element.isManagerOpen).toBeTrue();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-query"]')).toBeNull();
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').label).toBe('Apply');
        expect(element.shadowRoot?.querySelector('[data-action="request-delete"]')).not.toBeNull();
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
        expect(getRequiredElement<Dialog>('nimble-dialog').open).toBeFalse();
    });

    it('updates menu selection and dirty indicators when saved queries load after connection', async () => {
        const result = await fixture<FvQueryBuilder>(html`<${fvQueryBuilderTag}></${fvQueryBuilderTag}>`);
        ({ element, disconnect } = result);
        element.definition = definition;
        element.query = currentDocument;
        await result.connect();
        await waitForUpdatesAsync();
        element.savedQueries = savedRecords;
        await waitForUpdatesAsync();
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Edited after catalog load';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const savedOption = getRequiredElement<HTMLElement>('[data-saved-query-id="saved-a"]');
        expect(savedOption.getAttribute('aria-current')).toBe('true');
        expect(savedOption.querySelector('.dirty-indicator')).not.toBeNull();
        expect(getRequiredElement<FvSplitButton>('.queries-menu-button').querySelector('[slot="end"] .dirty-indicator')).not.toBeNull();
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
        const menuButton = getRequiredElement<FvSplitButton>('.queries-menu-button');
        const endSlot = menuButton.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="end"]');
        const indicator = menuButton.querySelector('[slot="end"]');
        expect(endSlot?.assignedElements()).toEqual([indicator!]);
        expect(indicator?.querySelector('.visually-hidden')?.textContent).toBe(element.labels.unsavedChanges);
        const savedOption = getRequiredElement<HTMLElement>('[data-saved-query-id="saved-a"]');
        expect(savedOption.getAttribute('aria-current')).toBe('true');
        expect(savedOption.querySelector('.dirty-indicator')).not.toBeNull();
        expect(savedOption.querySelector('.visually-hidden')?.textContent).toBe(element.labels.unsavedChanges);
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
            selectedValues: string[]
        }>('[data-control="collection-multi-select"]');
        if (!valueControl) {
            throw new Error('Expected the collection selector value control.');
        }
        valueControl.selectedValues = ['option-1'];
        valueControl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
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

    it('automatically applies saved queries and Working query without saving', async () => {
        ({ element, disconnect } = await setup(false));
        const applied: { query: QueryDocument, selectedId?: string }[] = [];
        element.addEventListener('query-apply', event => {
            applied.push((event as CustomEvent<{ query: QueryDocument, selectedId?: string }>).detail);
        });
        const save = jasmine.createSpy('save');
        element.saveHandler = save;

        await selectSavedQuery('saved-a');
        await selectSavedQuery('saved-b');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="select-current-query"]');

        expect(applied).toEqual([
            { query: savedDocument, selectedId: 'saved-a' },
            { query: secondSavedDocument, selectedId: 'saved-b' },
            { query: currentDocument, selectedId: undefined }
        ]);
        expect(save).not.toHaveBeenCalled();
        expect(element.isManagerOpen).toBeFalse();
    });

    it('does not apply an incomplete saved-query draft when reselected', async () => {
        ({ element, disconnect } = await setup(false));
        await selectSavedQuery('saved-a');
        const input = element.queryEditor?.shadowRoot?.querySelector<HTMLElement & { value: string }>('.query-input');
        if (!input) {
            throw new Error('Expected the query input.');
        }
        input.value = 'sta';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await selectSavedQuery('saved-b');
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await selectSavedQuery('saved-a');

        expect(element.queryEditor?.draft.inputText).toBe('sta');
        expect(element.valid).toBeFalse();
        expect(apply).not.toHaveBeenCalled();
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

    it('saves and applies renamed saved queries', async () => {
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

        const saveButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        const deleteButton = getRequiredElement<HTMLElement>('[data-action="request-delete"]');
        expect(saveButton.disabled).toBeFalse();
        expect(saveButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary')?.disabled).toBeFalse();
        expect(saveButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle')?.disabled).toBeFalse();
        expect(deleteButton.hasAttribute('disabled')).toBeFalse();
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Failed production';
        expect(name.hasAttribute('required')).toBeTrue();
        expect(name.hasAttribute('required-visible')).toBeTrue();
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(saveButton.disabled).toBeFalse();

        expect(element.selectedSavedQueryId).toBe('saved-a');
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await activatePrimaryAction();
        expect(requestCount).toBe(1);
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.selectedName).toBe('Failed production');
        expect(apply).toHaveBeenCalledTimes(1);
        expect(element.isManagerOpen).toBeFalse();
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        expect(menuButton.label).toBe('Failed production');
        await openSavedMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="select-saved-query"][data-saved-query-id="saved-a"]')
            .textContent).toContain('Failed production');
    });

    it('applies an unchanged saved query without persisting it and keeps Delete available', async () => {
        ({ element, disconnect } = await setup());
        const save = jasmine.createSpy('save');
        element.saveHandler = save;
        element.deleteHandler = async () => {};
        await selectSavedQuery('saved-a');
        const button = getRequiredElement<FvSplitButton>('.query-action-split-button');
        expect(button.disabled).toBeFalse();
        await openActionMenu();
        expect(getRequiredElement<HTMLElement>('[data-action="request-delete"]').hasAttribute('disabled')).toBeFalse();
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await activatePrimaryAction();
        expect(save).not.toHaveBeenCalled();
        expect(apply).toHaveBeenCalledTimes(1);
        expect(element.isManagerOpen).toBeFalse();
    });

    it('reports invalid saves while keeping the action menu available', async () => {
        ({ element, disconnect } = await setup());
        element.saveHandler = jasmine.createSpy('save');
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = '';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await activatePrimaryAction();
        expect(element.operationError).toBe(element.labels.nameRequired);
        expect(element.isManagerOpen).toBeTrue();
        await openActionMenu();
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').open).toBeTrue();
        expect(element.saveHandler).not.toHaveBeenCalled();
    });

    it('reports an invalid query or unavailable save without closing the editor', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Changed';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        await activatePrimaryAction();
        expect(element.operationError).toBe(element.labels.saveUnavailable);
        expect(element.isManagerOpen).toBeTrue();

        element.saveHandler = jasmine.createSpy('save');
        const input = element.queryEditor!.shadowRoot!.querySelector<HTMLElement & { value: string }>('.query-input')!;
        input.value = 'incomplete';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.valid).toBeFalse();
        await activatePrimaryAction();
        expect(element.operationError).toBe(element.issues[0]!.message);
        expect(element.saveHandler).not.toHaveBeenCalled();
        expect(element.isManagerOpen).toBeTrue();
    });

    it('saves a dirty saved query with the primary action and applies it', async () => {
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

        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await activatePrimaryAction();

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
        expect(apply).toHaveBeenCalledTimes(1);
        expect(element.isManagerOpen).toBeFalse();
    });

    it('updates a dirty saved query from the action menu without applying it', async () => {
        ({ element, disconnect } = await setup());
        const saveRequests: QueryBuilderSaveRequest[] = [];
        element.saveHandler = async request => {
            await Promise.resolve();
            saveRequests.push(request);
            return {
                id: request.id ?? 'created',
                name: request.name,
                document: request.document
            };
        };
        await selectSavedQuery('saved-a');
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');

        expect(element.shadowRoot?.querySelector('[data-action="save-query"]')).toBeNull();
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Updated failures';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const updateAction = getRequiredElement<HTMLElement>('[data-action="save-query"]');
        expect(updateAction.textContent?.trim()).toBe('Update saved query');
        expect(updateAction.hasAttribute('disabled')).toBeFalse();
        await activateActionMenuItem('[data-action="save-query"]');

        expect(saveRequests).toEqual([{
            kind: 'update',
            id: 'saved-a',
            name: 'Updated failures',
            document: savedDocument
        }]);
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.isManagerOpen).toBeTrue();
        expect(apply).not.toHaveBeenCalled();
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

        await activatePrimaryAction();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.operationError).toBe(element.labels.saveFailed);

        await activatePrimaryAction();
        expect(element.selectedQueryIsDirty).toBeFalse();
        expect(element.operationError).toBe('');
        expect(element.isManagerOpen).toBeFalse();
    });

    it('closes after applying a saved query without affecting save', async () => {
        ({ element, disconnect } = await setup());
        const saveHandler = jasmine.createSpy('saveHandler').and.resolveTo(savedRecords[0]!);
        element.saveHandler = saveHandler;
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);

        await selectSavedQuery('saved-a');
        expect(apply).toHaveBeenCalledTimes(1);
        apply.calls.reset();
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        expect(element.shadowRoot?.querySelector('[data-action="cancel-query"]')).not.toBeNull();
        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();

        expect(saveHandler).not.toHaveBeenCalled();
        expect(apply).not.toHaveBeenCalled();
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        await activateActionMenuItem('[data-action="apply-query"]');
        expect(apply).toHaveBeenCalledTimes(1);
        expect((apply.calls.mostRecent().args[0] as CustomEvent<{ selectedId: string }>).detail.selectedId).toBe('saved-a');
        expect(saveHandler).not.toHaveBeenCalled();
        expect(element.isManagerOpen).toBeFalse();
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

    it('saves and applies a new query created from the Working query action menu', async () => {
        ({ element, disconnect } = await setup(false));
        element.saveHandler = async request => {
            await Promise.resolve();
            return { id: 'saved-current', name: request.name, document: request.document };
        };
        const queryButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        queryButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary')?.click();
        await waitForUpdatesAsync();
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').label).toBe('Apply');
        await activateActionMenuItem('[data-action="save-as-new"]');

        expect(getRequiredElement<HTMLElement>('.saved-query-manager').querySelectorAll('[data-saved-query-id]')).toHaveSize(0);

        const name = getRequiredElement<HTMLElement & { value: string, appearance: string }>(
            '[data-control="saved-query-name"]'
        );
        expect(name.appearance).toBe('outline');
        name.value = 'Current filters';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').label).toBe('Save');
        const apply = jasmine.createSpy('query-apply');
        element.addEventListener('query-apply', apply);
        await activatePrimaryAction();

        expect(element.savedQueries.find(record => record.id === 'saved-current')).toEqual({
            id: 'saved-current',
            name: 'Current filters',
            document: currentDocument
        });
        expect(element.selectedSavedQueryId).toBe('saved-current');
        expect(apply).toHaveBeenCalledTimes(1);
        expect((apply.calls.mostRecent().args[0] as CustomEvent<{ selectedId: string }>).detail.selectedId)
            .toBe('saved-current');
        expect(element.isManagerOpen).toBeFalse();
    });

    it('keeps saved-query edits when Cancel closes the editor', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        await activateActionMenuItem('[data-action="apply-query"]');

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
        expect(element.savedQueryName).toBe('Unsaved name');
        expect(element.selectedQueryIsDirty).toBeTrue();
    });

    it('cancels delete confirmation and selects Working query after successful deletion', async () => {
        ({ element, disconnect } = await setup());
        element.deleteHandler = async () => {
            await Promise.resolve();
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        await activateActionMenuItem('[data-action="request-delete"]');
        const actionMenu = getRequiredElement<FvSplitButton>('.query-action-split-button');
        const dialog = getRequiredElement<Dialog>('nimble-dialog');
        expect(actionMenu.open).toBeFalse();
        expect(dialog.open).toBeTrue();
        expect(dialog.dialogElement.matches(':modal')).toBeTrue();
        expect(dialog.textContent).toContain(element.labels.deleteConfirmation);
        expect(element.shadowRoot?.activeElement).toBe(getRequiredElement('[data-action="cancel-delete"]'));
        await activateSavedMenuItem('[data-action="cancel-delete"]');
        expect(element.savedQueries).toHaveSize(2);
        expect(dialog.open).toBeFalse();
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        expect(actionMenu.shadowRoot?.activeElement).toBe(actionMenu.toggleButton);

        await activateActionMenuItem('[data-action="request-delete"]');
        await activateSavedMenuItem('[data-action="confirm-delete"]');
        expect(element.savedQueries.map(record => record.id)).toEqual(['saved-b']);
        expect(element.selectedSavedQueryId).toBeNull();
        expect(element.queryEditor?.query).toEqual(currentDocument);
    });

    it('clears delete confirmation when the dialog is dismissed', async () => {
        ({ element, disconnect } = await setup());
        element.deleteHandler = async () => {};
        await selectSavedQuery('saved-a');
        await activateActionMenuItem('[data-action="request-delete"]');
        const dialog = getRequiredElement<Dialog>('nimble-dialog');
        dialog.dialogElement.dispatchEvent(new Event('cancel', { cancelable: true }));
        dialog.dialogElement.close();
        await waitForUpdatesAsync();
        expect(element.confirmingDelete).toBeFalse();
        expect(element.isManagerOpen).toBeTrue();
        expect(element.savedQueries).toHaveSize(2);
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        const actionMenu = getRequiredElement<FvSplitButton>('.query-action-split-button');
        expect(actionMenu.shadowRoot?.activeElement).toBe(actionMenu.toggleButton);
    });

    it('does not delete through the closed confirmation dialog', async () => {
        ({ element, disconnect } = await setup());
        const deleteHandler = jasmine.createSpy('deleteHandler').and.resolveTo();
        element.deleteHandler = deleteHandler;
        await selectSavedQuery('saved-a');
        await activateSavedMenuItem('[data-action="confirm-delete"]');
        expect(deleteHandler).not.toHaveBeenCalled();
        expect(element.savedQueries).toHaveSize(2);
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
        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();
        expect(element.selectedSavedQueryId).toBe('saved-a');
        expect(element.savedQueries).toHaveSize(2);
        expect(element.queryEditor?.query).toEqual(savedDocument);
    });

    it('reconciles refreshed and removed saved queries without losing drafts or emitting deleted IDs', async () => {
        ({ element, disconnect } = await setup(false));
        await selectSavedQuery('saved-a');
        const changedDocument: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'is', value: 'Refreshed' }
        };
        element.savedQueries = [
            { id: 'saved-a', name: 'Refreshed name', document: changedDocument },
            savedRecords[1]!
        ];
        await waitForUpdatesAsync();

        expect(element.selectedName).toBe('Refreshed name');
        expect(element.queryEditor?.query).toEqual(changedDocument);
        expect(element.query).toEqual(currentDocument);

        const editor = element.queryEditor;
        const changedDraft = editor?.draft;
        if (!editor || !changedDraft) {
            throw new Error('Expected the query editor draft.');
        }
        const dirtyDraft = {
            ...changedDraft,
            inputText: 'unfinished'
        };
        editor.dispatchEvent(new CustomEvent('query-change', {
            bubbles: true,
            composed: true,
            detail: {
                draft: dirtyDraft,
                query: changedDocument,
                ruleCount: 1,
                valid: true,
                issues: []
            }
        }));
        await waitForUpdatesAsync();
        const applied: { selectedId?: string, query: QueryDocument }[] = [];
        element.addEventListener('query-apply', event => {
            applied.push((event as CustomEvent<{ selectedId?: string, query: QueryDocument }>).detail);
        });

        element.savedQueries = [savedRecords[1]!];
        await waitForUpdatesAsync();

        expect(element.selectedSavedQueryId).toBeNull();
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.queryEditor?.query).toEqual(changedDocument);
        expect(element.query).toEqual(currentDocument);
        expect(element.savedQueryViews.some(view => view.name.includes('Refreshed name'))).toBeTrue();
        const unsavedDraft = getRequiredElement<HTMLElement>(
            '[data-action="select-unsaved-draft"][data-saved-query-id="saved-a"]'
        );
        expect(unsavedDraft.textContent).toContain(element.labels.unsavedDraft);
        expect(applied).toEqual([]);

        let canceledSelectionId: string | undefined;
        element.addEventListener('query-cancel', event => {
            canceledSelectionId = (event as CustomEvent<{ selectedId?: string }>).detail.selectedId;
        });
        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();
        expect(canceledSelectionId).toBeUndefined();
    });

    it('preserves dirty selected drafts when their host record is refreshed', async () => {
        ({ element, disconnect } = await setup(false));
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'My unsaved name';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const refreshedDocument: QueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'name', operatorId: 'is', value: 'New host value' }
        };
        element.savedQueries = [
            { id: 'saved-a', name: 'Host name', document: refreshedDocument },
            savedRecords[1]!
        ];
        await waitForUpdatesAsync();

        expect(element.selectedSavedQueryId).toBe('saved-a');
        expect(element.savedQueryName).toBe('My unsaved name');
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.queryEditor?.query).toEqual(refreshedDocument);
        expect(element.savedDrafts.get('saved-a')?.document).toEqual(refreshedDocument);
    });

    it('ignores stale save completions after host catalog changes and blocks selection while pending', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Pending update';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        let resolveSave!: (saved: QueryBuilderSavedQuery) => void;
        element.saveHandler = async () => {
            const result = await new Promise<QueryBuilderSavedQuery>(resolve => {
                resolveSave = resolve;
            });
            return result;
        };
        await waitForUpdatesAsync();

        expect(element.savedQueryName).toBe('Pending update');
        expect(element.selectedQueryIsDirty).toBeTrue();
        expect(element.canSaveChanges).toBeTrue();
        const actionSplitButton = getRequiredElement<FvSplitButton>('.query-action-split-button');
        expect(actionSplitButton.disabled).toBeFalse();
        await activatePrimaryAction();
        expect(element.isOperationPending).withContext(`Save state for ${element.savedQueryName}`).toBeTrue();
        await waitForUpdatesAsync();
        expect(actionSplitButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary')?.disabled).toBeTrue();
        expect(actionSplitButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle')?.disabled).toBeTrue();
        expect(getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]').disabled).toBeTrue();
        const invokeSelection = (element as unknown as { selectSavedQuery: (id: string | null) => void }).selectSavedQuery;
        invokeSelection.call(element, 'saved-b');
        expect(element.selectedSavedQueryId).toBe('saved-a');
        element.savedQueries = [savedRecords[1]!];
        await waitForUpdatesAsync();
        resolveSave({ id: 'saved-a', name: 'Pending update', document: savedDocument });
        await waitForUpdatesAsync();

        expect(element.isOperationPending).toBeFalse();
        expect(element.savedQueries.map(record => record.id)).toEqual(['saved-b']);
        expect(element.selectedSavedQueryId).toBeNull();
        expect(element.operationError).toBe(element.labels.saveFailed);
    });

    it('blocks selection and ignores stale delete completions after host catalog changes', async () => {
        ({ element, disconnect } = await setup());
        await selectSavedQuery('saved-a');
        let resolveDelete!: () => void;
        element.deleteHandler = async () => {
            await new Promise<void>(resolve => {
                resolveDelete = resolve;
            });
        };
        await waitForUpdatesAsync();
        await activateActionMenuItem('[data-action="request-delete"]');
        await activateSavedMenuItem('[data-action="confirm-delete"]');
        expect(element.isOperationPending).toBeTrue();
        const dialog = getRequiredElement<Dialog>('nimble-dialog');
        expect(dialog.open).toBeTrue();
        expect(dialog.preventDismiss).toBeTrue();
        const cancel = new Event('cancel', { cancelable: true });
        dialog.dialogElement.dispatchEvent(cancel);
        expect(cancel.defaultPrevented).toBeTrue();

        const invokeSelection = (element as unknown as { selectSavedQuery: (id: string | null) => void }).selectSavedQuery;
        invokeSelection.call(element, 'saved-b');
        expect(element.selectedSavedQueryId).toBe('saved-a');
        element.savedQueries = [savedRecords[1]!];
        await waitForUpdatesAsync();
        resolveDelete();
        await waitForUpdatesAsync();

        expect(element.isOperationPending).toBeFalse();
        expect(element.savedQueries.map(record => record.id)).toEqual(['saved-b']);
        expect(element.selectedSavedQueryId).toBeNull();
        expect(element.operationError).toBe(element.labels.deleteFailed);
    });

    it('restores the source query name when create is canceled or dismissed', async () => {
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

        const openCreate = async (): Promise<void> => {
            await openSavedMenu();
            await activateSavedMenuItem('[data-action="save-as-new"]');
        };
        await openCreate();
        getRequiredElement<HTMLElement>('[data-action="cancel-query"]').click();
        await waitForUpdatesAsync();
        expect(element.savedQueryName).toBe('Failed queries');

        await openCreate();
        getRequiredElement<HTMLElement>('.query-popover').dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.savedQueryName).toBe('Failed queries');

        await openCreate();
        document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(element.savedQueryName).toBe('Failed queries');

        await openCreate();
        element.allowSavedQueryCreation = false;
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
        expect(element.savedQueryName).toBe('Failed queries');
    });

    it('keeps a visible retryable error when the primary save fails', async () => {
        ({ element, disconnect } = await setup());
        let fail = true;
        element.saveHandler = async request => {
            if (fail) {
                fail = false;
                await Promise.resolve();
                throw new Error('temporary');
            }
            await Promise.resolve();
            return { id: request.id ?? 'created', name: request.name, document: request.document };
        };
        await selectSavedQuery('saved-a');
        const name = getRequiredElement<HTMLElement & { value: string }>('[data-control="saved-query-name"]');
        name.value = 'Menu retry';
        name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        await activatePrimaryAction();

        expect(element.isManagerOpen).toBeTrue();
        expect(element.operationError).toBe(element.labels.saveFailed);
        expect(getRequiredElement<HTMLElement>('[role="alert"]').textContent).toContain(element.labels.saveFailed);
        expect(element.savedQueryName).toBe('Menu retry');
        expect(getRequiredElement<FvSplitButton>('.query-action-split-button').disabled).toBeFalse();

        await activatePrimaryAction();
        expect(element.selectedQueryIsDirty).toBeFalse();
    });

    it('keeps deletion reachable without exposing saved-query name editing or update', async () => {
        ({ element, disconnect } = await setup());
        element.allowSavedQueryEditing = false;
        element.deleteHandler = async () => {
            await Promise.resolve();
        };
        await selectSavedQuery('saved-a');
        await openSavedMenu();

        expect(getRequiredElement<HTMLElement>('[data-action="edit-saved-queries"]')).not.toBeNull();
        await activateSavedMenuItem('[data-action="edit-saved-queries"]');
        expect(element.isManagerOpen).toBeTrue();
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        expect(element.shadowRoot?.querySelector('[data-action="save-query"]')).toBeNull();
        expect(getRequiredElement<HTMLElement>('[data-action="request-delete"]')).not.toBeNull();
    });

    it('shows a retryable delete error when saved-query editing is disabled', async () => {
        ({ element, disconnect } = await setup());
        element.allowSavedQueryEditing = false;
        let attempts = 0;
        element.deleteHandler = async () => {
            attempts += 1;
            await Promise.resolve();
            if (attempts === 1) {
                throw new Error('temporary');
            }
        };
        await selectSavedQuery('saved-a');
        await activateActionMenuItem('[data-action="request-delete"]');
        await activateSavedMenuItem('[data-action="confirm-delete"]');

        expect(element.selectedSavedQueryId).toBe('saved-a');
        expect(element.shadowRoot?.querySelector('[data-control="saved-query-name"]')).toBeNull();
        expect(getRequiredElement<HTMLElement>('nimble-dialog .operation-error[role="alert"]').textContent).toContain(element.labels.deleteFailed);
        await activateSavedMenuItem('[data-action="confirm-delete"]');
        expect(attempts).toBe(2);
        expect(element.savedQueries.map(record => record.id)).toEqual(['saved-b']);
    });

    it('uses false-default declarative disable flags while keeping features enabled by default', async () => {
        ({ element, disconnect } = await setup(false));
        expect(element.allowSavedQueryCreation).toBeTrue();
        expect(element.allowSavedQueryEditing).toBeTrue();
        expect(element.allowSavedQueryDeletion).toBeTrue();
        expect(element.hasAttribute('disable-saved-query-creation')).toBeFalse();
        expect(element.hasAttribute('disable-saved-query-editing')).toBeFalse();
        expect(element.hasAttribute('disable-saved-query-deletion')).toBeFalse();
        element.setAttribute('disable-saved-query-creation', '');
        element.setAttribute('disable-saved-query-editing', '');
        element.setAttribute('disable-saved-query-deletion', '');
        element.setAttribute('hide-nigel-prompt', '');
        await waitForUpdatesAsync();
        expect(element.savedQueryCreationEnabled).toBeFalse();
        expect(element.savedQueryEditingEnabled).toBeFalse();
        expect(element.savedQueryDeletionEnabled).toBeFalse();
        expect(element.isNigelPromptEnabled).toBeFalse();
    });

    it('emits query-change for clear and AI preview actions', async () => {
        ({ element, disconnect } = await setup());
        const changes: { query: QueryDocument | null, valid: boolean }[] = [];
        element.addEventListener('query-change', event => {
            const detail = (event as CustomEvent<{ query: QueryDocument | null, valid: boolean }>).detail;
            changes.push({ query: detail.query, valid: detail.valid });
        });

        element.clear();
        await waitForUpdatesAsync();
        expect(changes[changes.length - 1]).toEqual({
            query: { version: 1, root: null },
            valid: true
        });

        element.aiQueryPreview = secondSavedDocument;
        await waitForUpdatesAsync();
        getRequiredElement<HTMLElement>('[data-action="use-ai-preview"]').click();
        await waitForUpdatesAsync();
        expect(changes[changes.length - 1]).toEqual({ query: secondSavedDocument, valid: true });
    });

    it('moves focus into the saved-query menu and restores it on Escape', async () => {
        ({ element, disconnect } = await setup(false));
        const toggle = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]')
            .shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle');
        if (!toggle) {
            throw new Error('Expected the saved-query menu toggle.');
        }
        toggle.focus();
        toggle.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        const region = element.savedQueryMenuButton?.region;
        if (!region) {
            throw new Error('Expected the saved-query menu region.');
        }
        if (!region.initialLayoutComplete) {
            await waitForEvent(region, 'loaded');
        }

        expect(element.isSavedMenuOpen).toBeTrue();
        const menuItem = getRequiredElement<HTMLElement>('[data-action="select-current-query"]');
        expect(element.shadowRoot?.activeElement).toBe(menuItem);
        const focusedMenuItem = element.shadowRoot?.activeElement as HTMLElement | null;
        if (!focusedMenuItem) {
            throw new Error('Expected the saved-query menu item to receive focus.');
        }
        focusedMenuItem.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.isSavedMenuOpen).toBeFalse();
        expect(element.savedQueryMenuButton?.shadowRoot?.activeElement).toBe(toggle);
    });

    it('moves the query popover with arrow keys when the popover itself has focus', async () => {
        ({ element, disconnect } = await setup());
        const popover = getRequiredElement<HTMLElement>('.query-popover');
        expect(popover.tabIndex).toBe(0);
        expect(getRequiredElement<HTMLElement>(`#${popover.getAttribute('aria-describedby')}`).textContent).toContain('arrow keys');
        expect(element.shadowRoot?.querySelector('.popover-move-controls')).toBeNull();
        popover.focus();
        expect(element.shadowRoot?.activeElement).toBe(popover);

        for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
            const before = popover.getBoundingClientRect();
            const event = new KeyboardEvent('keydown', {
                key, bubbles: true, composed: true, cancelable: true
            });
            popover.dispatchEvent(event);
            expect(event.defaultPrevented).toBeTrue();
            const after = popover.getBoundingClientRect();
            if (key === 'ArrowRight') {
                expect(after.left).toBeGreaterThan(before.left);
            } else if (key === 'ArrowDown') {
                expect(after.top).toBeGreaterThan(before.top);
            } else if (key === 'ArrowLeft') {
                expect(after.left).toBeLessThan(before.left);
            } else {
                expect(after.top).toBeLessThan(before.top);
            }
        }

        popover.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.isManagerOpen).toBeFalse();
    });

    it('does not move the query popover when arrow keys are used in a child control', async () => {
        ({ element, disconnect } = await setup());
        const popover = getRequiredElement<HTMLElement>('.query-popover');
        const control = getRequiredElement<HTMLElement>('[data-control="saved-query-name"]');
        const initial = popover.getBoundingClientRect();
        control.focus();
        for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
            const event = new KeyboardEvent('keydown', {
                key, bubbles: true, composed: true, cancelable: true
            });
            control.dispatchEvent(event);
            expect(event.defaultPrevented).toBeFalse();
        }
        expect(popover.getBoundingClientRect().left).toBeCloseTo(initial.left, 1);
        expect(popover.getBoundingClientRect().top).toBeCloseTo(initial.top, 1);
    });

    it('connects builder menu and dialog triggers to their targets by element references', async () => {
        ({ element, disconnect } = await setup());
        const menuButton = getRequiredElement<FvSplitButton>('[data-control="saved-query-menu-button"]');
        const primary = menuButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary') as (
            HTMLButtonElement & { ariaControlsElements?: Element[] }
        ) | null;
        const toggle = menuButton.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle') as (
            HTMLButtonElement & { ariaControlsElements?: Element[] }
        ) | null;
        const dialog = getRequiredElement<HTMLElement>('.query-popover');
        const menu = getRequiredElement<HTMLElement>('.saved-query-menu');

        expect(primary?.ariaControlsElements).toEqual([dialog]);
        expect(toggle?.ariaControlsElements).toEqual([menu]);
    });
});
