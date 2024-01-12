import type { TableRowState2 } from '../types';

/**
 * Class to manage the client-specified state associated with rows.
 */
export class RowStateManager {
    private static readonly defaultRowState: TableRowState2 = {
        loading: false
    };

    private state = new Map<string, TableRowState2>();

    public reset(): void {
        this.state.clear();
    }

    public getRowState(id: string): TableRowState2 {
        if (this.state.has(id)) {
            return this.state.get(id)!;
        }

        return RowStateManager.defaultRowState;
    }

    public setRowState(id: string, state: TableRowState2): void {
        this.state.set(id, state);
    }

    public handleDataUpdate(updatedRecordIds: string[]): void {
        const updatedState = new Map<string, TableRowState2>();
        for (const id of updatedRecordIds) {
            if (this.state.has(id)) {
                updatedState.set(id, this.state.get(id)!);
            }
        }

        this.state = updatedState;
    }
}