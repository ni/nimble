import { attr } from '@ni/fast-element';
import type { TableColumn } from '../base';
import type { TableColumnPinLocation } from '../../table/types';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type PinnableTableColumn = Pick<TableColumn, 'columnInternals'>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PinnableTableColumnConstructor = abstract new (...args: any[]) => PinnableTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinPinnableColumnAPI<
    TBase extends PinnableTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow pinning
     * a fixed-width column within a table.
     */
    abstract class PinnableColumn extends base {
        public pinLocation?: TableColumnPinLocation;

        /** @internal */
        public pinLocationChanged(): void {
            this.columnInternals.pinLocation = this.pinLocation;
        }
    }

    attr({ attribute: 'pin-location' })(
        PinnableColumn.prototype,
        'pinLocation'
    );

    return PinnableColumn;
}