// Modified from https://github.com/philipstanislaus/performant-array-to-tree/blob/v1.11.0/src/arrayToTree.ts
// Copyright (c) 2022 philipstanislaus
// SPDX-License-Identifier: MIT

import type { TableNode, TableRecord } from '../types';

export interface Config<Item> {
    id: keyof Item;
    parentId: keyof Item;
}

type TableNodePartial = Partial<TableNode>;

/**
 * Unflattens an array to a tree with runtime O(n)
 */
export function arrayToTree<TData extends TableRecord>(
    items: readonly TData[],
    config: Config<TData>
): TableNode<TData>[] {
    const conf = config;

    // the resulting unflattened tree
    const rootItems: TableNodePartial[] = [];

    // stores all already processed items with their ids as key so we can easily look them up
    const lookup: { [id: string]: TableNodePartial } = {};

    // stores all item ids that have not been added to the resulting unflattened tree yet
    // this is an opt-in property, since it has a slight runtime overhead
    const orphanIds: null | Set<string | number> = new Set();

    // idea of this loop:
    // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
    // in the lookup object and fill it with the data of the parent later
    // if an item has no parentId, add it as a root element to rootItems
    // Convert to a for-loop to have access to the item's index in the flat list
    for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const itemId = item[conf.id] as string;
        const parentId = item[conf.parentId] as string | undefined | null;

        // look whether item already exists in the lookup table
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // item is not yet there, so add a preliminary item (its data will be added later)
            lookup[itemId] = {
                subRows: [],
                clientRecord: undefined,
                originalIndex: undefined
            };
        }

        // if we track orphans, delete this item from the orphan set if it is in it
        if (orphanIds) {
            orphanIds.delete(itemId);
        }

        // add the current item's data to the item in the lookup table
        lookup[itemId]!.clientRecord = item;
        const treeItem = lookup[itemId]!;

        // Add the index to the item
        treeItem.originalIndex = i;

        if (parentId === null || parentId === undefined) {
            // is a root item
            rootItems.push(treeItem);
        } else {
            // has a parent

            // look whether the parent already exists in the lookup table
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // parent is not yet there, so add a preliminary parent (its data will be added later)
                lookup[parentId] = {
                    subRows: [],
                    clientRecord: undefined,
                    originalIndex: undefined
                };

                // if we track orphans, add the generated parent to the orphan list
                if (orphanIds) {
                    orphanIds.add(parentId);
                }
            }

            // add the current item to the parent
            lookup[parentId]!.subRows!.push(treeItem as TableNode<TData>);
        }
    }

    if (orphanIds?.size) {
        const orphans = Array.from(orphanIds.values()).join(',');
        throw new Error(
            `The items array contains orphans that point to the following parentIds: [${orphans}]. These parentIds do not exist in the items array.`
        );
    }

    if (countNodes(rootItems) < Object.keys(lookup).length) {
        throw new Error(
            'The items array contains nodes with a circular parent/child relationship.'
        );
    }

    return rootItems as TableNode<TData>[];
}

/**
 * Returns the number of nodes in a tree in a recursive way
 * @param tree An array of nodes (tree items), each having a field `childrenField` that contains an array of nodes
 * @returns Number of nodes in the tree
 */
export function countNodes(tree: TableNodePartial[]): number {
    return tree.reduce(
        (sum, n) => sum + 1 + (n.subRows! && countNodes(n.subRows)),
        0
    );
}
