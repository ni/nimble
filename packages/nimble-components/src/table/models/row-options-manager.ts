import type { TableRowOptions } from '../types';

/**
 * Manages the options that have been configured on a row.
 */
export class RowOptionsManager {
    private readonly options = new Map<string, TableRowOptions>();

    public setRowOptions(id: string, options: TableRowOptions): void {
        this.options.set(id, options);
    }

    public reset(): void {
        this.options.clear();
    }

    public isRowForceExpandable(id: string): boolean {
        const configuredOptions = this.options.get(id);
        return configuredOptions?.forceExpandable ?? false;
    }
}
