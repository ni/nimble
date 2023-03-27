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
    private duplicateSortIndex = false;
    private duplicateGroupIndex = false;

    public getValidity(): TableValidity {
        return {
            duplicateRecordId: this.duplicateRecordId,
            missingRecordId: this.missingRecordId,
            invalidRecordId: this.invalidRecordId,
            duplicateColumnId: this.duplicateColumnId,
            missingColumnId: this.missingColumnId,
            duplicateSortIndex: this.duplicateSortIndex,
            duplicateGroupIndex: this.duplicateGroupIndex
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

    public validateColumnIds(columnIds: (string | undefined)[]): boolean {
        this.missingColumnId = false;
        this.duplicateColumnId = false;

        const anyColumnsHaveIds = columnIds.some(id => id);

        if (!anyColumnsHaveIds) {
            return true;
        }

        const idSet = new Set<string>();
        for (const columnId of columnIds) {
            if (!columnId) {
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

    public validateColumnSortIndices(sortIndices: number[]): boolean {
        this.duplicateSortIndex = false;

        const sortIndexSet = new Set<number>();
        for (const sortIndex of sortIndices) {
            if (sortIndexSet.has(sortIndex)) {
                this.duplicateSortIndex = true;
            }
            sortIndexSet.add(sortIndex);
        }

        return !this.duplicateSortIndex;
    }

    public validateColumnGroupIndices(groupIndices: number[]): boolean {
        this.duplicateGroupIndex = false;

        const groupIndexSet = new Set<number>();
        for (const groupIndex of groupIndices) {
            if (groupIndexSet.has(groupIndex)) {
                this.duplicateGroupIndex = true;
            }
            groupIndexSet.add(groupIndex);
        }

        return !this.duplicateGroupIndex;
    }
}
