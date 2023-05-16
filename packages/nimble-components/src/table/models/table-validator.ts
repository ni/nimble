import type { TableColumn } from '../../table-column/base';
import { TableRecord, TableRowSelectionMode, TableValidity } from '../types';

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
    private idFieldNameNotConfigured = false;
    private invalidColumnConfiguration = false;

    private readonly recordIds = new Set<string>();

    public getValidity(): TableValidity {
        return {
            duplicateRecordId: this.duplicateRecordId,
            missingRecordId: this.missingRecordId,
            invalidRecordId: this.invalidRecordId,
            duplicateColumnId: this.duplicateColumnId,
            missingColumnId: this.missingColumnId,
            duplicateSortIndex: this.duplicateSortIndex,
            duplicateGroupIndex: this.duplicateGroupIndex,
            idFieldNameNotConfigured: this.idFieldNameNotConfigured,
            invalidColumnConfiguration: this.invalidColumnConfiguration
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public areRecordIdsValid(): boolean {
        const validity = this.getValidity();
        return (
            !validity.duplicateRecordId
            && !validity.missingRecordId
            && !validity.invalidRecordId
        );
    }

    public validateSelectionMode(
        selectionMode: TableRowSelectionMode,
        idFieldName: string | undefined
    ): boolean {
        if (selectionMode === TableRowSelectionMode.none) {
            this.idFieldNameNotConfigured = false;
        } else {
            this.idFieldNameNotConfigured = typeof idFieldName !== 'string';
        }

        return !this.idFieldNameNotConfigured;
    }

    public validateRecordIds(
        data: TData[],
        idFieldName: string | undefined
    ): boolean {
        // Start off by assuming all IDs are valid.
        this.duplicateRecordId = false;
        this.missingRecordId = false;
        this.invalidRecordId = false;
        this.recordIds.clear();

        if (typeof idFieldName !== 'string') {
            return true;
        }

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

            if (this.recordIds.has(id)) {
                this.duplicateRecordId = true;
            }
            this.recordIds.add(id);
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
        this.duplicateSortIndex = !this.validateIndicesAreUnique(sortIndices);
        return !this.duplicateSortIndex;
    }

    public validateColumnGroupIndices(groupIndices: number[]): boolean {
        this.duplicateGroupIndex = !this.validateIndicesAreUnique(groupIndices);
        return !this.duplicateGroupIndex;
    }

    public validateColumnConfigurations(columns: TableColumn[]): boolean {
        this.invalidColumnConfiguration = columns.some(
            x => !x.columnInternals.validConfiguration
        );
        return !this.invalidColumnConfiguration;
    }

    public getPresentRecordIds(requestedRecordIds: string[]): string[] {
        return requestedRecordIds.filter(id => this.recordIds.has(id));
    }

    private validateIndicesAreUnique(indices: number[]): boolean {
        const numberSet = new Set<number>(indices);
        return numberSet.size === indices.length;
    }
}
