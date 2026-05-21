import { DesignSystem } from '@ni/fast-foundation';
import { attr } from '@ni/fast-element';
import { template } from './template';
import { styles } from '@ni/nimble-components/dist/esm/table-column/base/styles';
import type { TableStringField } from '@ni/nimble-components/dist/esm//table/types';
import { ExTableColumnMultiStateButtonCellView, tableColumnMultiStateButtonCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '@ni/nimble-components/dist/esm/table-column/base/models/column-internals';
import { ColumnValidator } from '@ni/nimble-components/dist/esm/table-column/base/models/column-validator';
import { mixinFractionalWidthColumnAPI } from '@ni/nimble-components/dist/esm/table-column/mixins/fractional-width-column';
import { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import type { DelegatedEventEventDetails } from '@ni/nimble-components/dist/esm/table-column/base/types';
import type { ExMultiStateButtonColumnToggleEventDetail } from './types';

export type TableColumnMultiStateButtonCellRecord = TableStringField<'value'>;

export interface TableColumnMultiStateButtonColumnConfig {
    // menuSlot?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'ok-ex-table-column-multi-state-button': ExTableColumnMultiStateButton;
    }
}

/**
 * The table column for displaying string fields as the content within a menu button.
 */
export class ExTableColumnMultiStateButton extends mixinFractionalWidthColumnAPI(
    TableColumn<TableColumnMultiStateButtonColumnConfig>
) {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    /** @internal */
    public onDelegatedEvent(e: Event): void {
        e.stopImmediatePropagation();

        const event = e as CustomEvent<DelegatedEventEventDetails>;
        const originalEvent = event.detail.originalEvent;
        if (originalEvent.type === 'toggle') {
            const newEventName = `ex-multi-state-button-column-${originalEvent.type}`;
            const cellView = originalEvent.target as ExTableColumnMultiStateButtonCellView;
            const detail: ExMultiStateButtonColumnToggleEventDetail = {
                recordId: cellView.recordId!
            };
            this.$emit(newEventName, detail);
        }
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnMultiStateButtonCellViewTag,
            delegatedEvents: ['toggle'],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}

const tableColumnMultiStateButton = ExTableColumnMultiStateButton.compose({
    baseName: 'ex-table-column-multi-state-button',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('ok')
    .register(tableColumnMultiStateButton());
export const tableColumnMultiStateButtonTag = 'ok-ex-table-column-multi-state-button';
