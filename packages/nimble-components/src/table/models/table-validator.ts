import type { TableRecord, TableValidity } from '../types';

/**
 * Helper class for the nimble-table to validate that the table's configuration
 * is valid and report which aspects of the configuration are valid or invalid.
 */
export class TableValidator<TData extends TableRecord> {
    private duplicateRowId = false;
    private missingRowId = false;
    private invalidRowId = false;

    public getValidity(): TableValidity {
        return {
            duplicateRowId: this.duplicateRowId,
            missingRowId: this.missingRowId,
            invalidRowId: this.invalidRowId
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public validateDataIds(data: TData[], idFieldName: string | null | undefined): boolean {
        // Start off by assuming all IDs are valid.
        this.duplicateRowId = false;
        this.missingRowId = false;
        this.invalidRowId = false;

        if (idFieldName == null) {
            return true;
        }

        const ids = new Set<string>();
        for (const record of data) {
            if (
                !Object.prototype.hasOwnProperty.call(record, idFieldName)
            ) {
                this.missingRowId = true;
                continue;
            }

            const id = record[idFieldName];
            if (typeof id !== 'string') {
                this.invalidRowId = true;
                continue;
            }

            if (ids.has(id)) {
                this.duplicateRowId = true;
            }
            ids.add(id);
        }

        return !this.missingRowId && !this.invalidRowId && !this.duplicateRowId;
    }
}
