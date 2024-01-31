import { TableRecord, TableRecordDelayedHierarchyState, type TableRecordHierarchyOptions } from '../types';
import type { TableValidator } from './table-validator';

/**
 * Manages the options that have been configured on a row.
 */
export class RowOptionsManager {
    private readonly options = new Map<string, TableRecordHierarchyOptions>();

    public constructor(private readonly tableValidator: TableValidator<TableRecord>) {}

    public setHierarchyOptions(hierarchyOptions: { id: string, options: TableRecordHierarchyOptions }[]): void {
        this.options.clear();

        for (const { id, options } of hierarchyOptions) {
            if (this.tableValidator.isRecordIdPresent(id)) {
                this.options.set(id, options);
            }
        }
    }

    public handleDataChange(): void {
        if (!this.tableValidator.areRecordIdsValid) {
            return;
        }

        const configuredRecordIds = this.options.keys();
        for (const id of configuredRecordIds) {
            if (!this.tableValidator.isRecordIdPresent(id)) {
                this.options.delete(id);
            }
        }
    }

    public reset(): void {
        this.options.clear();
    }

    public canLoadDelayedChildren(id: string): boolean {
        const configuredOptions = this.options.get(id);
        return configuredOptions?.delayedHierarchyState === TableRecordDelayedHierarchyState.canLoadChildren ?? false;
    }
}
