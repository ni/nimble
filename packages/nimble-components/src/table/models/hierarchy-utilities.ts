import { arrayToTree } from '../../utilities/thirdparty/performant-array-to-tree/arrayToTree';
import type { TableNode, TableRecord } from '../types';
import type { TableValidator } from './table-validator';

/**
 * Manages data hierarchy within the table, including converting between a flat list of
 * data and hierarchical data.
 */
export class DataHierarchyManager<TData extends TableRecord> {
    private isDataFlat = false;

    public constructor(
        private readonly tableValidator: TableValidator<TData>
    ) {}

    public getTableNodes(
        records: readonly TData[],
        idFieldName: string | undefined,
        parentIdFieldName: string | undefined
    ): TableNode<TData>[] {
        let hierarchicalData: TableNode<TData>[];
        if (
            typeof idFieldName === 'string'
            && typeof parentIdFieldName === 'string'
        ) {
            try {
                // The call to arrayToTree will perform a deep copy of the data, but it does allow a
                // configuration that will do shallow copies, and thus it's signature doesn't support
                // immutable arrays. Thus, we need to cast to a mutable type.
                const data = records as TData[];
                hierarchicalData = arrayToTree(data, {
                    dataField: 'clientRecord',
                    childrenField: 'subRows',
                    indexField: 'originalIndex',
                    id: idFieldName,
                    parentId: parentIdFieldName,
                    nestedIds: false,
                    throwIfOrphans: true,
                    rootParentIds: {}
                }) as TableNode<TData>[];
                this.isDataFlat = false;
            } catch {
                this.tableValidator.setParentIdConfigurationValidity(false);
                this.isDataFlat = true;
                return records.map((record, index) => {
                    return {
                        clientRecord: { ...record },
                        originalIndex: index
                    };
                });
            }
        } else {
            this.isDataFlat = true;
            hierarchicalData = records.map((record, index) => {
                return { clientRecord: { ...record }, originalIndex: index };
            });
        }

        this.tableValidator.setParentIdConfigurationValidity(true);
        return hierarchicalData;
    }

    public getAllRecords(
        tableNodes: readonly TableNode<TData>[],
        sort = false
    ): TData[] {
        const allNodes: TableNode<TData>[] = [];
        this.getAllNodes(tableNodes, allNodes);

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
