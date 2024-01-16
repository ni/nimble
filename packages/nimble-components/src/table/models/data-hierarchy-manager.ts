import { arrayToTree } from '../../utilities/models/array-to-tree';
import type { TableNode, TableRecord } from '../types';

/**
 * Manages data hierarchy within the table, including converting between a flat list of
 * data and hierarchical data.
 */
export class DataHierarchyManager<TData extends TableRecord> {
    private readonly isDataFlat: boolean = false;
    private readonly _hierarchicalData: TableNode<TData>[];
    private readonly _parentIdConfigurationValid: boolean;

    public constructor(
        records: readonly TData[],
        idFieldName: string | undefined,
        parentIdFieldName: string | undefined
    ) {
        if (
            typeof idFieldName === 'string'
            && typeof parentIdFieldName === 'string'
        ) {
            try {
                this._hierarchicalData = arrayToTree<TData>(records, {
                    id: idFieldName,
                    parentId: parentIdFieldName
                }) as TableNode<TData>[];
                this.isDataFlat = false;
                this._parentIdConfigurationValid = true;
            } catch {
                this.isDataFlat = true;
                this._hierarchicalData = records.map((record, index) => ({
                    clientRecord: { ...record },
                    originalIndex: index
                }));
                this._parentIdConfigurationValid = false;
            }
        } else {
            this.isDataFlat = true;
            this._hierarchicalData = records.map((record, index) => ({
                clientRecord: { ...record },
                originalIndex: index
            }));
            this._parentIdConfigurationValid = true;
        }
    }

    public get hierarchicalData(): TableNode<TData>[] {
        return this._hierarchicalData;
    }

    public get parentIdConfigurationValid(): boolean {
        return this._parentIdConfigurationValid;
    }

    public getAllRecords(sort = false): TData[] {
        const allNodes: TableNode<TData>[] = [];
        this.getAllNodes(this._hierarchicalData, allNodes);

        if (this.isDataFlat || !sort) {
            // If the data is flat, then it was never reordered to support hierarchy.
            // Therefore, there is no need to sort the nodes.
            return allNodes.map(x => x.clientRecord);
        }

        return allNodes
            .sort((a, b) => a.originalIndex - b.originalIndex)
            .map(x => x.clientRecord);
    }

    private getAllNodes(
        parentNodes: readonly TableNode<TData>[],
        allNodes: TableNode<TData>[]
    ): void {
        for (const parentNode of parentNodes) {
            allNodes.push(parentNode);
            if (parentNode.subRows) {
                this.getAllNodes(parentNode.subRows, allNodes);
            }
        }
    }
}
