import type { TableRecord, TableValidity } from '../types';

/**
 * Helper class for the nimble-table to validate that the table's configuration
 * is valid and report which aspects of the configuration are valid or invalid.
 */
export class TableValidator<TData extends TableRecord> {
    private duplicateRecordId = false;
    private missingRecordId = false;
    private invalidRecordId = false;
    private duplicateColumnId = false;
    private missingColumnId = false;

    public getValidity(): TableValidity {
        return {
            duplicateRecordId: this.duplicateRecordId,
            missingRecordId: this.missingRecordId,
            invalidRecordId: this.invalidRecordId,
            duplicateColumnId: this.duplicateColumnId,
            missingColumnId: this.missingColumnId
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public validateRecordIds(
        data: TData[],
        idFieldName: string | null | undefined
    ): boolean {
        // Start off by assuming all IDs are valid.
        this.duplicateRecordId = false;
        this.missingRecordId = false;
        this.invalidRecordId = false;

        if (idFieldName === undefined || idFieldName === null) {
            return true;
        }

        const ids = new Set<string>();
        for (const record of data) {
            if (!Object.prototype.hasOwnProperty.call(record, idFieldName)) {
                this.missingRecordId = true;
                continue;
            }

            const id = record[idFieldName];
            if (typeof id !== 'string') {
                this.invalidRecordId = true;
                continue;
            }

            if (ids.has(id)) {
                this.duplicateRecordId = true;
            }
            ids.add(id);
        }

        return (
            !this.missingRecordId
            && !this.invalidRecordId
            && !this.duplicateRecordId
        );
    }

    public validateColumnIds(
        columnIds: (string | null | undefined)[]
    ): boolean {
        this.missingColumnId = false;
        this.duplicateColumnId = false;

        const anyColumnsHaveIds = columnIds.some(
            columnId => columnId !== undefined && columnId !== null
        );

        if (!anyColumnsHaveIds) {
            return true;
        }

        const idSet = new Set<string>();
        for (const columnId of columnIds) {
            if (typeof columnId !== 'string') {
                this.missingColumnId = true;
                continue;
            }

            if (idSet.has(columnId)) {
                this.duplicateColumnId = true;
            }
            idSet.add(columnId);
        }

        return !this.missingColumnId && !this.duplicateColumnId;
    }
}
