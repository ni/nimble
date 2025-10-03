import { attr, nullableNumberConverter } from '@ni/fast-element';
import type { TableColumn } from '../base';
import { defaultMinPixelWidth, defaultFractionalWidth } from '../base/types';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type SizedTableColumn = Pick<TableColumn, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SizedTableColumnConstructor = abstract new (...args: any[]) => SizedTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinFractionalWidthColumnAPI<
    TBase extends SizedTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class FractionalWidthColumn extends base {
        public fractionalWidth?: number | null;

        public minPixelWidth?: number | null;

        public fractionalWidthChanged(): void {
            this.columnInternals.fractionalWidth = this.fractionalWidth ?? defaultFractionalWidth;
        }

        public minPixelWidthChanged(): void {
            this.columnInternals.minPixelWidth = this.minPixelWidth ?? defaultMinPixelWidth;
        }
    }

    attr({ attribute: 'fractional-width', converter: nullableNumberConverter })(

        FractionalWidthColumn.prototype,
        'fractionalWidth'
    );
    attr({ attribute: 'min-pixel-width', converter: nullableNumberConverter })(

        FractionalWidthColumn.prototype,
        'minPixelWidth'
    );
    return FractionalWidthColumn;
}
