import { observable, Observable } from '@ni/fast-element';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { Dialog } from '@ni/nimble-components/dist/esm/dialog';
import type { TableRowSelectionEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { BulkEditState } from '@ni/ok-components/dist/esm/fv/bulk-edit-state';
import type { BulkEditFieldStatus } from '@ni/ok-components/dist/esm/fv/bulk-edit-field/types';
import type { CommitMessage } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';

export const fields = [
    { key: 'name', label: 'Name', section: 'General' },
    { key: 'location', label: 'Location', section: 'General' },
    { key: 'workspace', label: 'Workspace', section: 'General', options: ['Default', 'Battery Lab', 'Validation'] },
    { key: 'status', label: 'Status', section: 'General', options: ['Available', 'In use', 'Maintenance'] },
    { key: 'owner', label: 'Owner', section: 'General' },
    { key: 'vendor', label: 'Vendor', section: 'Properties' },
    { key: 'model', label: 'Model', section: 'Properties' },
    { key: 'serial', label: 'Serial number', section: 'Properties' },
    { key: 'notes', label: 'Notes', section: 'Properties' }
] as const;

export type Field = (typeof fields)[number]['key'];
export interface FieldDefinition {
    key: Field;
    label: string;
    section: string;
    options?: readonly string[];
}
type Asset = { id: string } & { [Key in Field]: string };

function createAssets(): Asset[] {
    const models = ['PXIe-4081', 'PXIe-4139', 'PXIe-6363', 'PXIe-5162', 'cDAQ-9178', 'PXIe-8840'];
    const names = ['Precision DMM', 'Source measure unit', 'Multifunction DAQ', 'Oscilloscope', 'DAQ chassis', 'Embedded controller'];
    return Array.from({ length: 120 }, (_, index) => ({
        id: `asset-${index + 1}`,
        name: `${names[index % 6]} ${String(Math.floor(index / 6) + 1).padStart(2, '0')}`,
        location: ['Austin / Lab A', 'Austin / Lab B', 'Munich / Lab C'][index % 3]!,
        workspace: index % 4 === 0 ? 'Battery Lab' : 'Default',
        status: ['Available', 'In use', 'Available', 'Maintenance'][index % 4]!,
        owner: ['Alex Morgan', 'Sam Chen', 'Jordan Lee'][index % 3]!,
        vendor: 'NI',
        model: models[index % 6]!,
        serial: `32${10000 + index}`,
        notes: index % 5 === 0 ? 'Annual calibration due in December.' : ''
    }));
}

/**
 * Application-owned data, filters, confirmation, and in-memory persistence.
 */
export class AssetInventory {
    @observable public declare records: Asset[];
    @observable public declare state: BulkEditState<Asset, Field>;
    @observable public declare search: string;
    @observable public declare statusFilter: string;
    @observable public declare collapsed: boolean;
    @observable public declare editMode: boolean;
    @observable public declare failNextSave: boolean;
    @observable public declare message: CommitMessage | undefined;
    @observable public declare busy: boolean;

    public table!: Table;
    public dialog!: Dialog<boolean>;
    public readonly fields: readonly FieldDefinition[] = fields;
    public readonly sections = ['General', 'Properties'];

    private initialized = false;
    private confirming = false;
    private additiveRange = false;
    private updates = Promise.resolve();
    private visibleIds: readonly string[] = [];

    public constructor() {
        this.records = createAssets();
        this.state = this.createState();
        this.search = '';
        this.statusFilter = '';
        this.collapsed = false;
        this.editMode = true;
        this.failNextSave = false;
        this.message = undefined;
        this.busy = false;
    }

    public get visibleRecords(): readonly Asset[] {
        const query = this.search.trim().toLowerCase();
        return this.records.filter(record => (!this.statusFilter || record.status === this.statusFilter)
            && (!query || Object.values(record).some(value => value.toLowerCase().includes(query))));
    }

    public get changeCount(): number {
        return Reflect.ownKeys(this.state.changes).length;
    }

    public get affectedCount(): number {
        return this.state.createCommit().affectedRecords.length;
    }

    public get hiddenAffectedCount(): number {
        const visible = new Set(this.visibleRecords.map(record => record.id));
        return this.state.createCommit().affectedRecords.filter(record => !visible.has(record.id)).length;
    }

    public initialize(): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        // Nimble 35.x row-body clicks need Ctrl for toggle/additive range selection.
        this.table.addEventListener('click', event => {
            const path = event.composedPath();
            const rowBody = path.some(target => target instanceof HTMLElement && target.localName === 'nimble-table-row');
            const interactive = path.some(target => target instanceof HTMLElement
                && (['nimble-checkbox', 'nimble-button', 'nimble-menu-button', 'a', 'button', 'input'].includes(target.localName)));
            if (!rowBody || interactive) {
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
        }, true);
        this.refresh();
    }

    public status(field: Field): BulkEditFieldStatus {
        const value = this.state.field(field);
        if (value.pending) {
            return value.willClear ? 'will-clear' : 'changed';
        }
        return value.mixed ? 'mixed' : 'unchanged';
    }

    public viewValue(field: Field): string {
        const value = this.state.field(field);
        return value.mixed ? 'Multiple values' : value.value || '—';
    }

    public toggleMode(): boolean {
        this.editMode = !this.editMode;
        return true;
    }

    public edit(field: Field, event: Event): boolean {
        this.state.edit(field, (event.target as HTMLInputElement).value);
        this.changed();
        return true;
    }

    public clear(field: Field): boolean {
        this.state.clear(field);
        this.changed();
        return true;
    }

    public reset(field: Field): boolean {
        this.state.resetField(field);
        this.changed();
        return true;
    }

    public filter(event: Event, status = false): boolean {
        const value = (event.target as HTMLInputElement).value;
        if (status) {
            this.statusFilter = value;
        } else {
            this.search = value;
        }
        this.refresh();
        return true;
    }

    public onSelection(event: CustomEvent<TableRowSelectionEventDetail>): boolean {
        const next = this.state.mergeVisible(this.visibleIds, event.detail.selectedRecordIds, this.additiveRange);
        this.additiveRange = false;
        void this.select(next);
        return true;
    }

    public async select(ids: readonly string[]): Promise<void> {
        if (this.confirming || this.busy) {
            this.refresh();
            return;
        }
        if (this.state.isSelection(ids)) {
            return;
        }
        if (this.changeCount > 0) {
            this.confirming = true;
            this.refresh();
            const discard = await this.dialog.show();
            this.confirming = false;
            if (discard !== true) {
                this.refresh();
                return;
            }
        }
        this.state.select(ids);
        this.changed();
    }

    public revert(): boolean {
        this.state.revert();
        Observable.notify(this, 'state');
        this.message = { severity: 'information', text: 'Pending changes reverted.' };
        this.refresh();
        return true;
    }

    public async save(): Promise<void> {
        if (this.busy || this.changeCount === 0) {
            return;
        }
        this.busy = true;
        const commit = this.state.createCommit();
        // ponytail: atomic in-memory save; a live API must reconcile per-row results.
        await Promise.resolve();
        if (this.failNextSave) {
            this.failNextSave = false;
            this.collapsed = false;
            this.message = {
                severity: 'error',
                text: 'Save failed. No records were changed. Pending edits are retained; retry Save or Revert.'
            };
        } else {
            const selected = new Set(commit.selectedIds);
            this.records = this.records.map(record => (selected.has(record.id) ? { ...record, ...commit.changes } : record));
            this.state.commitSucceeded(this.records);
            Observable.notify(this, 'state');
            this.message = {
                severity: 'information',
                text: `Saved changes to ${commit.affectedRecords.length} ${commit.affectedRecords.length === 1 ? 'row' : 'rows'}.`
            };
        }
        this.busy = false;
        this.refresh();
    }

    public refresh(): void {
        this.updates = this.updates.then(async () => {
            const records = this.visibleRecords;
            this.visibleIds = records.map(record => record.id);
            const affected = new Set(this.state.createCommit().affectedRecords.map(record => record.id));
            await this.table.setData(records.map(record => ({ ...record, hasChanges: affected.has(record.id) })));
            await this.table.setSelectedRecordIds([...this.state.visibleSelection(this.visibleIds)]);
        }).catch((error: unknown) => {
            this.collapsed = false;
            this.message = { severity: 'error', text: `Unable to update the table: ${String(error)}` };
        });
    }

    private changed(): void {
        this.message = undefined;
        Observable.notify(this, 'state');
        this.refresh();
    }

    private createState(): BulkEditState<Asset, Field> {
        return new BulkEditState<Asset, Field>({
            records: this.records,
            id: record => record.id,
            read: (record, field) => record[field]
        });
    }
}
