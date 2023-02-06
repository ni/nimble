import type { TableRecord, TableValidity } from '../types';

/**
 * Helper class for the nimble-table to validate that the table's configuration
 * is valid and report which aspects of the configuration are valid or invalid.
 */
export class TableValidator<TData extends TableRecord> {
    private duplicateRecordId = false;
    private missingRecordId = false;
    private invalidRecordId = false;

    public getValidity(): TableValidity {
        return {
            duplicateRecordId: this.duplicateRecordId,
            missingRecordId: this.missingRecordId,
            invalidRecordId: this.invalidRecordId
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public validateRecordIds(
        data: TData[],
        idFieldName: string | undefined
    ): boolean {
        // Start off by assuming all IDs are valid.
        this.duplicateRecordId = false;
        this.missingRecordId = false;
        this.invalidRecordId = false;

        if (typeof idFieldName !== 'string') {
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
}
