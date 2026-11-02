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
    private readonly pending = new Map<TField, string>();
    private readonly draft = new Map<TField, string>();

    public constructor(options: BulkEditStateOptions<TRecord, TField>) {
        this.records = options.records;
        this.id = options.id;
        this.read = options.read;
    }

    public get selectedIds(): readonly RecordId[] {
        return [...this.selected];
    }

    public get changes(): Readonly<PendingChanges<TField>> {
        return Object.fromEntries(this.pending) as PendingChanges<TField>;
    }

    public get selectedRecords(): readonly TRecord[] {
        return this.records.filter(record => this.selected.has(this.id(record)));
    }

    public field(field: TField): BulkEditFieldValue {
        if (this.pending.has(field)) {
            const value = this.pending.get(field)!;
            return { value, mixed: false, pending: true, willClear: value === '' };
        }

        const values = this.selectedRecords.map(record => this.read(record, field));
        const value = values[0] ?? '';
        const mixed = values.some(candidate => candidate !== value);
        return { value: this.draft.get(field) ?? (mixed ? '' : value), mixed, pending: false, willClear: false };
    }

    public edit(field: TField, value: string): void {
        if (this.selected.size === 0) {
            return;
        }
        if (value.trim() !== '' && this.selectedRecords.some(record => this.read(record, field) !== value)) {
            this.setPending(field, value);
        } else {
            this.pending.delete(field);
        }
        this.draft.set(field, value);
    }

    public clear(field: TField): void {
        if (this.selected.size === 0) {
            return;
        }
        if (this.selectedRecords.some(record => this.read(record, field) !== '')) {
            this.setPending(field, '');
        } else {
            this.pending.delete(field);
        }
        this.draft.set(field, '');
    }

    public resetField(field: TField): void {
        this.pending.delete(field);
        this.draft.delete(field);
    }

    public revert(): void {
        this.pending.clear();
        this.draft.clear();
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
        const changes = this.changes;
        const fields = [...this.pending.keys()];
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

    private setPending(field: TField, value: string): void {
        if (typeof field !== 'symbol') {
            for (const existing of this.pending.keys()) {
                if (typeof existing !== 'symbol'
                    && typeof existing !== typeof field
                    && String(existing) === String(field)) {
                    throw new TypeError('Numeric and string field keys that map to the same object key cannot both be pending.');
                }
            }
        }
        this.pending.set(field, value);
    }
}
