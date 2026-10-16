import { Directive, ElementRef, ErrorHandler, EventEmitter, Input, Output } from '@angular/core';
import type { AfterViewInit, OnDestroy } from '@angular/core';
import type { Table, TableRowSelectionEventDetail } from '@ni/nimble-angular/table';

export interface OkTableSelectionProposal {
    readonly selectedIds: readonly string[];
    preventDefault(): void;
}

/**
 * Temporary toggle-selection behavior for Nimble tables.
 * Remove when the table supports toggle row clicks and additive Shift ranges natively.
 */
@Directive({
    selector: 'nimble-table[okTableToggleSelection]',
    standalone: false
})
export class OkTableToggleSelectionDirective implements AfterViewInit, OnDestroy {
    @Input()
    public set visibleIds(value: readonly string[]) {
        this.visible = [...new Set(value)];
        this.restoreSelection();
    }

    public get visibleIds(): readonly string[] {
        return this.visible;
    }

    @Input()
    public set selectedIds(value: readonly string[]) {
        this.currentSelection = [...new Set(value)];
        this.restoreSelection();
    }

    @Output() public proposedSelection = new EventEmitter<OkTableSelectionProposal>();
    @Output() public selectionChange = new EventEmitter<readonly string[]>();

    private readonly table: Table;
    private currentSelection: readonly string[] = [];
    private visible: readonly string[] = [];
    private initialized = false;
    private additiveRange = false;
    private updates = Promise.resolve();

    public constructor(elementRef: ElementRef<Table>, private readonly errorHandler: ErrorHandler) {
        this.table = elementRef.nativeElement;
    }

    public ngAfterViewInit(): void {
        this.table.addEventListener('click', this.handleClick, true);
        this.table.addEventListener('selection-change', this.handleSelection);
        this.initialized = true;
        this.restoreSelection();
    }

    public ngOnDestroy(): void {
        this.table.removeEventListener('click', this.handleClick, true);
        this.table.removeEventListener('selection-change', this.handleSelection);
        this.initialized = false;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const path = event.composedPath();
        const row = path.some(
            target => target instanceof HTMLElement && target.localName === 'nimble-table-row'
        );
        const interactive = path.some(target => target instanceof HTMLElement
            && (target.isContentEditable
                || target.matches('a, button, input, select, textarea, [role="button"], [role="checkbox"], [role="combobox"], [role="textbox"], nimble-checkbox, nimble-button, nimble-menu-button')));
        if (!row || interactive) {
            return;
        }
        this.additiveRange = event.shiftKey;
        if (!event.ctrlKey && !event.metaKey) {
            event.stopImmediatePropagation();
            (path[0] as HTMLElement).dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                composed: true,
                ctrlKey: true,
                shiftKey: event.shiftKey
            }));
        }
    };

    private readonly handleSelection = (event: Event): void => {
        const detail = (event as CustomEvent<TableRowSelectionEventDetail>).detail;
        const selected = new Set(this.additiveRange
            ? this.currentSelection
            : this.currentSelection.filter(id => !this.visible.includes(id)));
        this.additiveRange = false;
        detail.selectedRecordIds.filter(id => this.visible.includes(id)).forEach(id => selected.add(id));
        this.propose([...selected]);
    };

    private propose(selectedIds: readonly string[]): void {
        if (selectedIds.length === this.currentSelection.length
            && selectedIds.every(id => this.currentSelection.includes(id))) {
            this.restoreSelection();
            return;
        }
        const proposal = {
            selectedIds,
            defaultPrevented: false,
            preventDefault(): void {
                this.defaultPrevented = true;
            }
        };
        this.proposedSelection.emit(proposal);
        if (proposal.defaultPrevented) {
            this.restoreSelection();
            return;
        }
        this.currentSelection = [...selectedIds];
        this.restoreSelection();
        this.selectionChange.emit(selectedIds);
    }

    private restoreSelection(): void {
        if (!this.initialized) {
            return;
        }
        this.updates = this.updates
            .then(async () => {
                if (this.initialized) {
                    await this.table.setSelectedRecordIds(this.currentSelection.filter(id => this.visible.includes(id)));
                }
            })
            .catch((error: unknown) => this.errorHandler.handleError(error));
    }
}
