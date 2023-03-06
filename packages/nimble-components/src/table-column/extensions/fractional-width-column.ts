import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

export interface FractionalWidthColumn {
    fractionalWidth: number;
    disableResize: boolean;
    minPixelWidth: number | null;
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fractionalWidthColumn<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class FractionalWidthColumn extends base implements FractionalWidthColumn {
        public fractionalWidth = 1;

        public disableResize = false;

        public minPixelWidth?: number | null;

        public fractionalWidthChanged(): void {
            this.internalFractionalWidth = this.fractionalWidth;
        }

        public minPixelWidthChanged(): void {
            if (this.minPixelWidth !== null) {
                this.internalMinPixelWidth = this.minPixelWidth;
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
