export type RecordId = string;
export type PendingChanges<TField extends PropertyKey> = {
    [Field in TField]?: string;
};

export interface BulkEditFieldValue {
    value: string;
    mixed: boolean;
    pending: boolean;
    willClear: boolean;
}

export interface BulkEditCommit<TRecord, TField extends PropertyKey> {
    selectedIds: readonly RecordId[];
    changes: Readonly<PendingChanges<TField>>;
    affectedRecords: readonly TRecord[];
}

export interface BulkEditStateOptions<TRecord, TField extends PropertyKey> {
    records: readonly TRecord[];
    id: (record: TRecord) => RecordId;
    read: (record: TRecord, field: TField) => string;
}

/**
 * Framework-neutral state for editing common fields across selected records.
 */
export class BulkEditState<TRecord, TField extends PropertyKey> {
    private records: readonly TRecord[];
    private readonly id: (record: TRecord) => RecordId;
    private readonly read: (record: TRecord, field: TField) => string;
    private selected = new Set<RecordId>();
    private pending: PendingChanges<TField> = {};
    private draft: PendingChanges<TField> = {};

    public constructor(options: BulkEditStateOptions<TRecord, TField>) {
        this.records = options.records;
        this.id = options.id;
        this.read = options.read;
    }

    public get selectedIds(): readonly RecordId[] {
        return [...this.selected];
    }

    public get changes(): Readonly<PendingChanges<TField>> {
        return { ...this.pending };
    }

    public get selectedRecords(): readonly TRecord[] {
        return this.records.filter(record => this.selected.has(this.id(record)));
    }

    public field(field: TField): BulkEditFieldValue {
        if (Object.prototype.hasOwnProperty.call(this.pending, field)) {
            const value = this.pending[field]!;
            return { value, mixed: false, pending: true, willClear: value === '' };
        }

        const values = this.selectedRecords.map(record => this.read(record, field));
        const value = values[0] ?? '';
        const mixed = values.some(candidate => candidate !== value);
        return { value: this.draft[field] ?? (mixed ? '' : value), mixed, pending: false, willClear: false };
    }

    public edit(field: TField, value: string): void {
        if (this.selected.size === 0) {
            return;
        }
        this.draft[field] = value;
        if (value.trim() !== '' && this.selectedRecords.some(record => this.read(record, field) !== value)) {
            this.pending[field] = value;
        } else {
            delete this.pending[field];
        }
    }

    public clear(field: TField): void {
        if (this.selected.size === 0) {
            return;
        }
        this.draft[field] = '';
        if (this.selectedRecords.some(record => this.read(record, field) !== '')) {
            this.pending[field] = '';
        } else {
            delete this.pending[field];
        }
    }

    public resetField(field: TField): void {
        delete this.pending[field];
        delete this.draft[field];
    }

    public revert(): void {
        this.pending = {};
        this.draft = {};
    }

    public isSelection(ids: readonly RecordId[]): boolean {
        const next = new Set(ids);
        return next.size === this.selected.size && [...next].every(id => this.selected.has(id));
    }

    public visibleSelection(visibleIds: readonly RecordId[]): readonly RecordId[] {
        return visibleIds.filter(id => this.selected.has(id));
    }

    public mergeVisible(
        visibleIds: readonly RecordId[],
        selectedVisibleIds: readonly RecordId[],
        additive = false
    ): readonly RecordId[] {
        const visible = new Set(visibleIds);
        const merged = additive
            ? new Set(this.selected)
            : new Set([...this.selected].filter(id => !visible.has(id)));
        selectedVisibleIds.filter(id => visible.has(id)).forEach(id => merged.add(id));
        return [...merged];
    }

    public select(ids: readonly RecordId[]): void {
        if (this.isSelection(ids)) {
            return;
        }
        this.selected = new Set(ids);
        this.revert();
    }

    public createCommit(): BulkEditCommit<TRecord, TField> {
        const changes = { ...this.pending };
        const fields = Reflect.ownKeys(changes) as TField[];
        return {
            selectedIds: this.selectedIds,
            changes,
            affectedRecords: this.selectedRecords.filter(
                record => fields.some(field => this.read(record, field) !== changes[field])
            )
        };
    }

    public commitSucceeded(updatedRecords?: readonly TRecord[]): void {
        if (updatedRecords) {
            this.records = updatedRecords;
        }
        this.revert();
    }
}
