import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';
import { defaultMinPixelWidth } from '../base/types';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type SizedTableColumn = Pick<TableColumn, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SizedTableColumnConstructor = abstract new (...args: any[]) => SizedTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinFixedWidthColumnAPI<
    TBase extends SizedTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to support being set
     * to a fixed width within a Table.
     */
    abstract class FixedWidthColumn extends base {
        public pixelWidth?: number | null = null;

        public pixelWidthChanged(): void {
            if (typeof this.pixelWidth === 'number') {
                this.columnInternals.currentPixelWidth = this.pixelWidth;
            } else {
                this.columnInternals.currentPixelWidth = defaultMinPixelWidth;
            }
        }
    }

    attr({ attribute: 'pixel-width', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        FixedWidthColumn.prototype,
        'pixelWidth'
    );
    return FixedWidthColumn;
}
