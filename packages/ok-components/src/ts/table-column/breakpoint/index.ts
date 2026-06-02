import { DesignSystem } from '@ni/fast-foundation';
import { attr } from '@ni/fast-element';
import type { TableStringField } from '@ni/nimble-components/dist/esm/table/types';
import type { ColumnInternalsOptions } from '@ni/nimble-components/dist/esm/table-column/base/models/column-internals';
import { singleIconColumnWidth } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { ColumnValidator } from '@ni/nimble-components/dist/esm/table-column/base/models/column-validator';
import { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import { styles } from '@ni/nimble-components/dist/esm/table-column/base/styles';
import type { DelegatedEventEventDetails } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { MenuButtonPosition, type MenuButtonPosition as BreakpointMenuPosition } from '@ni/nimble-components/dist/esm/menu-button/types';
import type { BreakpointToggleEventDetail, BreakpointContextMenuEventDetail } from './types';
import { breakpointCellViewMenuSlotName } from './types';
import { tsTableColumnBreakpointCellViewTag } from './cell-view';
import { template } from './template';

export type TsTableColumnBreakpointCellRecord = TableStringField<'value'>;

export interface TsTableColumnBreakpointColumnConfig {
    menuSlot?: string;
    position?: BreakpointMenuPosition;
}

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

    @attr({ attribute: 'menu-slot' })
    public menuSlot?: string;

    @attr
    public position: BreakpointMenuPosition = MenuButtonPosition.auto;

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
            slotNames: [breakpointCellViewMenuSlotName],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected menuSlotChanged(): void {
        this.updateColumnConfig();
    }

    protected positionChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            menuSlot: this.menuSlot,
            position: this.position
        };
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
