import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

export interface FractionalWidthColum {
    fractionalWidth: number;
    disableResize: boolean;
    minPixelWidth: number;
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fractionalWidthColumn<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class FractionalWidthColumn extends base {
        public fractionalWidth = 1;

        public disableResize = false;

        public minPixelWidth: number | null = null;

        public fractionalWidthChanged(): void {
            this.internalFractionalWidth = this.fractionalWidth;
        }

        public minPixelWidthChanged(): void {
            if (this.minPixelWidth !== null) {
                this.internalMinPixelWidth = this.minPixelWidth;
            } else {
                this.internalMinPixelWidth = 0;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    attr({ attribute: 'fractional-width', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        FractionalWidthColumn.prototype,
        'fractionalWidth'
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    attr({ attribute: 'min-pixel-width', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        FractionalWidthColumn.prototype,
        'minPixelWidth'
    );
    return FractionalWidthColumn;
}
