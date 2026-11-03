import { observable, Observable } from '@ni/fast-element';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { Dialog } from '@ni/nimble-components/dist/esm/dialog';
import type { TableRowSelectionEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { BulkEditState } from '@ni/ok-components/dist/esm/fv/bulk-edit-state';
import type { BulkEditFieldStatus } from '@ni/ok-components/dist/esm/fv/bulk-edit-field/types';
import type { CommitMessage } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import type { FvQueryBuilder, QueryBuilderDefinition, QueryBuilderSavedQuery, QueryBuilderSaveHandler, QueryBuilderDeleteHandler, QueryDocument, QueryNode } from '@ni/ok-components/dist/esm/fv/query-builder';

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
    @observable public declare appliedQuery: QueryDocument;
    @observable public savedQueries: readonly QueryBuilderSavedQuery[] = [
        {
            id: 'available-assets',
            name: 'Available assets',
            document: {
                version: 1,
                root: { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'Available' }
            }
        },
        {
            id: 'battery-lab-assets',
            name: 'Battery Lab assets',
            document: {
                version: 1,
                root: { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'Battery Lab' }
            }
        }
    ];

    @observable public declare collapsed: boolean;
    @observable public declare editMode: boolean;
    @observable public declare failNextSave: boolean;
    @observable public declare message: CommitMessage | undefined;
    @observable public declare busy: boolean;

    public table!: Table;
    public queryBuilder!: FvQueryBuilder;
    public dialog!: Dialog<boolean>;
    public readonly fields: readonly FieldDefinition[] = fields;
    public readonly sections = ['General', 'Properties'];
    public readonly queryDefinition: QueryBuilderDefinition = {
        version: 1,
        fields: this.fields.map((field): QueryBuilderDefinition['fields'][number] => ({
            id: field.key,
            path: `/${field.key}`,
            label: field.label,
            valueSchema: field.options
                ? { oneOf: field.options.map(value => ({ const: value, title: value })) }
                : { type: 'string' },
            operatorIds: field.options ? ['is', 'is-not'] : ['is', 'is-not', 'contains'],
            ...(field.options ? { editor: { kind: 'select' } } : {})
        })),
        operators: [
            { id: 'is', label: 'Is', operand: { kind: 'field-value' } },
            { id: 'is-not', label: 'Is not', operand: { kind: 'field-value' } },
            { id: 'contains', label: 'Contains', operand: { kind: 'field-value' } }
        ]
    };

    private initialized = false;
    private confirming = false;
    private additiveRange = false;
    private updates = Promise.resolve();
    private visibleIds: readonly string[] = [];
    private nextQueryId = 0;

    public constructor() {
        this.records = createAssets();
        this.state = this.createState();
        this.search = '';
        this.appliedQuery = { version: 1, root: null };
        this.collapsed = false;
        this.editMode = true;
        this.failNextSave = false;
        this.message = undefined;
        this.busy = false;
    }

    public readonly saveQuery: QueryBuilderSaveHandler = async request => {
        await Promise.resolve();
        if (request.kind === 'create') {
            this.nextQueryId += 1;
        }
        const saved: QueryBuilderSavedQuery = {
            id: request.id ?? `asset-query-${this.nextQueryId}`,
            name: request.name,
            document: structuredClone(request.document)
        };
        this.savedQueries = [...this.savedQueries.filter(query => query.id !== saved.id), saved];
        return structuredClone(saved);
    };

    public readonly deleteQuery: QueryBuilderDeleteHandler = async id => {
        await Promise.resolve();
        this.savedQueries = this.savedQueries.filter(query => query.id !== id);
    };

    public get visibleRecords(): readonly Asset[] {
        const query = this.search.trim().toLowerCase();
        return this.records.filter(record => (this.appliedQuery.root === null || this.matchesQuery(record, this.appliedQuery.root))
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

    public filter(event: Event): boolean {
        this.search = (event.target as HTMLInputElement).value;
        this.refresh();
        return true;
    }

    public applyQuery(event: CustomEvent<{ readonly query: QueryDocument }>): boolean {
        this.appliedQuery = structuredClone(event.detail.query);
        this.refresh();
        return true;
    }

    public clearQuery(): void {
        this.appliedQuery = { version: 1, root: null };
        this.queryBuilder.query = this.appliedQuery;
        this.refresh();
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

    private matchesQuery(record: Asset, node: QueryNode): boolean {
        if (node.kind === 'group') {
            return node.combinator === 'and'
                ? node.children.every(child => this.matchesQuery(record, child))
                : node.children.some(child => this.matchesQuery(record, child));
        }
        const field = this.fields.find(candidate => candidate.key === node.fieldId);
        if (!field || typeof node.value !== 'string') {
            throw new Error('The asset filter requires a known field and a string value.');
        }
        const value = record[field.key];
        switch (node.operatorId) {
            case 'is':
                return value === node.value;
            case 'is-not':
                return value !== node.value;
            case 'contains':
                return value.toLowerCase().includes(node.value.toLowerCase());
            default:
                throw new Error(`Unsupported asset filter operator: ${node.operatorId}`);
        }
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
