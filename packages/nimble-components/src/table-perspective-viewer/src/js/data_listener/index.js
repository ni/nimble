/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

import {PRIVATE_PLUGIN_SYMBOL} from "../model";
import {format_cell} from "./format_cell.js";
import {format_tree_header} from "./format_tree_header.js";

/**
 * Creates a new DataListener, suitable for passing to `regular-table`'s
 * `.setDataListener()` method.  This should be called as a method on the
 * plugin.
 *
 * @returns A data listener for the plugin.
 */
export function createDataListener() {
    let last_meta;
    let last_column_paths;
    let last_ids;
    let last_reverse_ids;
    let last_reverse_columns;
    // TODO mraj switched from `this` references to adding a prameter based on
    // the following comment https://github.com/microsoft/TypeScript/issues/37832#issuecomment-693990248
    return async function dataListener(dataGrid, regularTable, x0, y0, x1, y1) {
        let columns = {};
        let new_window;
        if (x1 - x0 > 0 && y1 - y0 > 0) {
            dataGrid._is_old_viewport =
                dataGrid._last_window?.start_row === y0 &&
                dataGrid._last_window?.end_row === y1 &&
                dataGrid._last_window?.start_col === x0 &&
                dataGrid._last_window?.end_col === x1;

            new_window = {
                start_row: y0,
                start_col: x0,
                end_row: y1,
                end_col: x1,
                id: true,
            };

            columns = await dataGrid._view.to_columns(new_window);
            dataGrid._last_window = new_window;
            dataGrid._ids = columns.__ID__;
            dataGrid._reverse_columns = dataGrid._column_paths
                .slice(x0, x1)
                .reduce((acc, x, i) => {
                    acc.set(x, i);
                    return acc;
                }, new Map());

            dataGrid._reverse_ids = dataGrid._ids.reduce((acc, x, i) => {
                acc.set(x?.join("|"), i);
                return acc;
            }, new Map());
        } else {
            dataGrid._div_factory.clear();
        }

        const data = [],
            metadata = [],
            column_headers = [],
            column_paths = [];

        // for (const path of dataGrid._column_paths.slice(x0, x1)) {
        for (
            let ipath = x0;
            ipath < Math.min(x1, dataGrid._column_paths.length);
            ++ipath
        ) {
            const path = dataGrid._column_paths[ipath];
            const path_parts = path.split("|");
            const column = columns[path] || new Array(y1 - y0).fill(null);
            data.push(
                column.map((x) =>
                    format_cell.call(
                        dataGrid,
                        path_parts,
                        x,
                        regularTable[PRIVATE_PLUGIN_SYMBOL]
                    )
                )
            );
            metadata.push(column);
            column_headers.push(path_parts);
            column_paths.push(path);
        }

        // Only update the last state if dataGrid is not a "phantom" call.
        if (x1 - x0 > 0 && y1 - y0 > 0) {
            dataGrid.last_column_paths = last_column_paths;
            dataGrid.last_meta = last_meta;
            dataGrid.last_ids = last_ids;
            dataGrid.last_reverse_ids = last_reverse_ids;
            dataGrid.last_reverse_columns = last_reverse_columns;

            last_column_paths = column_paths;
            last_meta = metadata;
            last_ids = dataGrid._ids;
            last_reverse_ids = dataGrid._reverse_ids;
            last_reverse_columns = dataGrid._reverse_columns;
        }

        return {
            num_rows: dataGrid._num_rows,
            num_columns: dataGrid._column_paths.length,
            row_headers: Array.from(
                format_tree_header.call(
                    dataGrid,
                    columns.__ROW_PATH__,
                    dataGrid._config.group_by,
                    regularTable
                )
            ),
            column_headers,
            data,
            metadata,
        };
    };
}
