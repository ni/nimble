import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';
import { TableColumnSortDirection } from '../../table/types';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type SortableTableColumn = Pick<TableColumn, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SortableTableColumnConstructor = abstract new (...args: any[]) => SortableTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinSortableColumnAPI<
    TBase extends SortableTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow sorting
     * by the values in that column.
     */
    abstract class SortableColumn extends base {
        public sortingDisabled = false;

        public sortIndex?: number | null = null;

        public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

        /** @internal */
        public sortingDisabledChanged(): void {
            this.columnInternals.sortingDisabled = this.sortingDisabled;
            if (this.sortingDisabled) {
                this.columnInternals.currentSortDirection = TableColumnSortDirection.none;
                this.columnInternals.currentSortIndex = undefined;
            } else {
                this.columnInternals.currentSortDirection = this.sortDirection;
                this.columnInternals.currentSortIndex = this.sortIndex ?? undefined;
            }
        }

        /** @internal */
        public sortDirectionChanged(): void {
            if (!this.sortingDisabled) {
                this.columnInternals.currentSortDirection = this.sortDirection;
            }
        }

        /** @internal */
        public sortIndexChanged(): void {
            if (!this.sortingDisabled) {
                this.columnInternals.currentSortIndex = this.sortIndex ?? undefined;
            }
        }
    }
    attr({ attribute: 'sorting-disabled', mode: 'boolean' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        SortableColumn.prototype,
        'sortingDisabled'
    );
    attr({ attribute: 'sort-index', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        SortableColumn.prototype,
        'sortIndex'
    );
    attr({ attribute: 'sort-direction' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        SortableColumn.prototype,
        'sortDirection'
    );

    return SortableColumn;
}
