import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fractionalWidthColumn<TBase extends abstract new (...args: any[]) => TableColumn>(base: TBase): TBase {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class FractionalWidthColumn extends base {
        public fractionalWidth = 1;

        public disableResize = false;

        public minWidth?: number;

        public fractionalWidthChanged(): void {
            this.currentFractionalWidth = this.fractionalWidth;
        }

        public disableResizeChanged(): void {
            this.columnDisableResize = this.disableResize;
        }

        public minWidthChanged(): void {
            if (this.minWidth !== undefined) {
                this.columnMinPixelWidth = this.minWidth;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    (attr({ attribute: 'fractional-width', converter: nullableNumberConverter }))(FractionalWidthColumn.prototype, 'fractionalWidth');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    (attr({ attribute: 'disable-resize', mode: 'boolean' }))(FractionalWidthColumn.prototype, 'disableResize');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    (attr({ attribute: 'min-width' }))(FractionalWidthColumn.prototype, 'minWidth');
    return FractionalWidthColumn;
}