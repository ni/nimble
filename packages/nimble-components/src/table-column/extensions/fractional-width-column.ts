import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

export interface FractionalWidthColumn {
    fractionalWidth?: number | null;
    minPixelWidth?: number | null;
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fractionalWidthColumn<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class FractionalWidthColumn extends base implements FractionalWidthColumn {
        public fractionalWidth?: number | null = 1;

        public minPixelWidth?: number | null;

        public fractionalWidthChanged(): void {
            if (typeof this.fractionalWidth === 'number') {
                this.internalFractionalWidth = this.fractionalWidth;
            } else {
                this.internalFractionalWidth = 1;
            }
        }

        public minPixelWidthChanged(): void {
            if (typeof this.minPixelWidth === 'number') {
                this.internalMinPixelWidth = this.minPixelWidth;
            } else {
                this.internalMinPixelWidth = this.defaultMinPixelWidth;
            }
        }
    }

    attr({ attribute: 'fractional-width', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        FractionalWidthColumn.prototype,
        'fractionalWidth'
    );
    attr({ attribute: 'min-pixel-width', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        FractionalWidthColumn.prototype,
        'minPixelWidth'
    );
    return FractionalWidthColumn;
}
