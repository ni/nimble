import {
    aggregationFn_sum as aggregationFnSum,
    columnGroupingFeature,
    createExpandedRowModel,
    createGroupedRowModel,
    createSortedRowModel,
    rowAggregationFeature,
    rowExpandingFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
    type TableFeatures
} from '@tanstack/table-core';
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings';

const dataFeatures = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    columnGroupingFeature,
    groupedRowModel: createGroupedRowModel(),
    rowAggregationFeature,
    aggregationFns: { sum: aggregationFnSum },
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
    rowSelectionFeature
});

// Keep emitted declarations resolvable without TanStack's reactivity subpath.
export type TanStackTableFeatures = typeof dataFeatures & {
    coreReactivityFeature: NonNullable<TableFeatures['coreReactivityFeature']>
};

export const tanStackTableFeatures: TanStackTableFeatures = {
    ...dataFeatures,
    coreReactivityFeature: storeReactivityBindings()
};
