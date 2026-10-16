import { ElementRef, ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NimbleTableModule, type Table } from '@ni/nimble-angular/table';
import { OkTableToggleSelectionDirective } from '../ok-table-toggle-selection.directive';

describe('OkTableToggleSelectionDirective', () => {
    let table: Table;
    let directive: OkTableToggleSelectionDirective;
    let write: jasmine.Spy;
    let errors: ErrorHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NimbleTableModule] });
        table = document.createElement('nimble-table');
        write = spyOn(table, 'setSelectedRecordIds').and.resolveTo();
        errors = new ErrorHandler();
        spyOn(errors, 'handleError');
        directive = new OkTableToggleSelectionDirective(new ElementRef(table), errors);
        directive.visibleIds = ['a', 'b', 'c'];
        directive.selectedIds = ['hidden', 'a'];
        directive.ngAfterViewInit();
    });

    afterEach(() => {
        directive.ngOnDestroy();
    });

    async function settle(): Promise<void> {
        await new Promise<void>(resolve => {
            setTimeout(resolve);
        });
    }

    function selection(ids: string[]): void {
        table.dispatchEvent(new CustomEvent('selection-change', { detail: { selectedRecordIds: ids } }));
    }

    it('writes only visible selection and reapplies it after filtering', async () => {
        await settle();
        expect(write).toHaveBeenCalledWith(['a']);
        directive.visibleIds = ['hidden'];
        await settle();
        expect(write).toHaveBeenCalledWith(['hidden']);
    });

    it('proposes native checkbox and keyboard selections while preserving hidden IDs', async () => {
        const changed = jasmine.createSpy();
        directive.selectionChange.subscribe(changed);
        selection(['a', 'b', 'c']);
        expect(changed).toHaveBeenCalledOnceWith(['hidden', 'a', 'b', 'c']);
        selection([]);
        expect(changed).toHaveBeenCalledWith(['hidden']);
        await settle();
        expect(write).toHaveBeenCalledWith([]);
    });

    it('restores the table when an additive shift range shrinks without changing selection', async () => {
        directive.selectedIds = [];
        await settle();
        selection(['a']);
        await settle();

        const shiftClickRow = (): void => {
            const row = document.createElement('nimble-table-row');
            table.append(row);
            row.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, shiftKey: true }));
        };

        shiftClickRow();
        selection(['a', 'b', 'c']);
        await settle();
        shiftClickRow();
        write.calls.reset();
        selection(['a', 'b']);
        await settle();

        expect(write).toHaveBeenCalledWith(['a', 'b', 'c']);
    });

    it('restores a rejected proposal and allows subsequent confirmation through selectedIds', async () => {
        const changed = jasmine.createSpy();
        directive.selectionChange.subscribe(changed);
        directive.proposedSelection.subscribe(proposal => proposal.preventDefault());
        selection(['b']);
        await settle();
        expect(changed).not.toHaveBeenCalled();
        expect(write).toHaveBeenCalledWith(['a']);
        directive.selectedIds = ['hidden', 'b'];
        await settle();
        expect(write).toHaveBeenCalledWith(['b']);
    });

    it('normalizes only noninteractive row-body clicks and leaves keyboard events native', () => {
        const row = document.createElement('nimble-table-row');
        const body = document.createElement('span');
        const input = document.createElement('input');
        row.append(body, input);
        table.append(row);
        const clicks: boolean[] = [];
        table.addEventListener('click', event => clicks.push(event.ctrlKey));
        body.click();
        expect(clicks).toEqual([true]);
        input.click();
        expect(clicks).toEqual([true, false]);
        const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        input.dispatchEvent(space);
        expect(space.defaultPrevented).toBeFalse();
    });

    it('surfaces asynchronous table errors through Angular', async () => {
        const error = new Error('Table write failed');
        write.and.rejectWith(error);
        await settle();
        expect(errors.handleError).toHaveBeenCalledWith(error);
    });

    it('removes listeners on destroy', () => {
        const changed = jasmine.createSpy();
        directive.selectionChange.subscribe(changed);
        directive.ngOnDestroy();
        selection(['b']);
        expect(changed).not.toHaveBeenCalled();
    });
});
