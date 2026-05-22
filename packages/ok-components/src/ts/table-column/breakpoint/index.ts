import { DesignSystem } from '@ni/fast-foundation';
import { attr } from '@ni/fast-element';
import type { TableStringField } from '@ni/nimble-components/dist/esm/table/types';
import type { ColumnInternalsOptions } from '@ni/nimble-components/dist/esm/table-column/base/models/column-internals';
import { singleIconColumnWidth } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { ColumnValidator } from '@ni/nimble-components/dist/esm/table-column/base/models/column-validator';
import { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import type { DelegatedEventEventDetails } from '@ni/nimble-components/dist/esm/table-column/base/types';
import type { BreakpointToggleEventDetail, BreakpointContextMenuEventDetail } from './types';
import { tsTableColumnBreakpointCellViewTag } from './cell-view';
import { styles } from './styles';
import { template } from './template';

export type TsTableColumnBreakpointCellRecord = TableStringField<'value'>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TsTableColumnBreakpointColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'ok-ts-table-column-breakpoint': TsTableColumnBreakpoint;
    }
}

/**
 * A table column that displays a breakpoint indicator with toggle functionality.
 */
export class TsTableColumnBreakpoint extends TableColumn<TsTableColumnBreakpointColumnConfig> {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    public constructor() {
        super();
        // Breakpoint columns are icon-only and should remain fixed-size and non-resizable.
        this.columnInternals.resizingDisabled = true;
        this.columnInternals.pixelWidth = singleIconColumnWidth;
        this.columnInternals.minPixelWidth = singleIconColumnWidth;
    }

    /** @internal */
    public onDelegatedEvent(e: Event): void {
        e.stopImmediatePropagation();

        const event = e as CustomEvent<DelegatedEventEventDetails>;

        if (event.detail.originalEvent.type === 'breakpoint-column-toggle') {
            const originalEvent = event.detail.originalEvent as CustomEvent<BreakpointToggleEventDetail>;
            const detail: BreakpointToggleEventDetail = {
                ...originalEvent.detail,
                recordId: event.detail.recordId
            };
            this.$emit('breakpoint-column-toggle', detail);
        } else if (event.detail.originalEvent.type === 'breakpoint-column-context-menu') {
            const originalEvent = event.detail.originalEvent as CustomEvent<BreakpointContextMenuEventDetail>;
            const detail: BreakpointContextMenuEventDetail = {
                ...originalEvent.detail,
                recordId: event.detail.recordId
            };
            this.$emit('breakpoint-column-context-menu', detail);
        }
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tsTableColumnBreakpointCellViewTag,
            delegatedEvents: ['breakpoint-column-toggle', 'breakpoint-column-context-menu'],
            slotNames: ['menu'],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}

const tsTableColumnBreakpoint = TsTableColumnBreakpoint.compose({
    baseName: 'ts-table-column-breakpoint',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('ok')
    .register(tsTableColumnBreakpoint());
export const tsTableColumnBreakpointTag = 'ok-ts-table-column-breakpoint';
