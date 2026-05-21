import { DesignSystem } from '@ni/fast-foundation';
import { observable, volatile } from '@ni/fast-element';
import { TableCellView } from '@ni/nimble-components/dist/esm/table-column/base/cell-view';
import type {
    TableColumnMultiStateButtonCellRecord,
    TableColumnMultiStateButtonColumnConfig
} from '..';
import { template } from './template';
import { styles } from './styles';
import { ExMultiStateButtonState, type ExMultiStateButtonColumnToggleEventDetail } from '../types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-ex-table-column-multi-state-button-cell-view': ExTableColumnMultiStateButtonCellView;
    }
}

/**
 * The cell view base class for displaying a string field as a multi-state button.
 */
export class ExTableColumnMultiStateButtonCellView extends TableCellView<
    TableColumnMultiStateButtonCellRecord,
    TableColumnMultiStateButtonColumnConfig
> {
    /** @internal */
    public button?: HTMLButtonElement;

    /** @internal */
    @volatile
    public get stateCssClass(): string {
        const cellValue = this.cellRecord?.value;
        if (typeof cellValue === 'string' && Object.keys(ExMultiStateButtonState).includes(cellValue)) {
            return `state-${cellValue}`;
        }
        return `state-${ExMultiStateButtonState.A}`;
    }

    public override get tabbableChildren(): HTMLElement[] {
        return [this.button!];
    }

    /** @internal */
    public onButtonClick(e: Event): void {
        // Stop propagation of the click event to prevent clicking the button
        // from affecting row selection.
        e.stopPropagation();

        const detail: ExMultiStateButtonColumnToggleEventDetail = {
            recordId: this.recordId!
        };
        this.$emit('toggle', detail);
    }
}

const multiStateButtonCellView = ExTableColumnMultiStateButtonCellView.compose({
    baseName: 'ex-table-column-multi-state-button-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('ok').register(multiStateButtonCellView());
export const tableColumnMultiStateButtonCellViewTag = 'ok-ex-table-column-multi-state-button-cell-view';
