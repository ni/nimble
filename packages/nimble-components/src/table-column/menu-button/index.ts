import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { tableColumnMenuButtonCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { ColumnValidator } from '../base/models/column-validator';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { TableColumn } from '../base';
import {
    MenuButtonColumnToggleEventDetail,
    cellViewMenuSlotName
} from './types';
import type { DelegatedEventEventDetails } from '../base/types';
import type { MenuButtonToggleEventDetail } from '../../menu-button/types';

export type TableColumnMenuButtonCellRecord = TableStringField<'value'>;

export interface TableColumnMenuButtonColumnConfig {
    menuSlot?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-menu-button': TableColumnMenuButton;
    }
}

/**
 * The table column for displaying string fields as the content within a menu button.
 */
export class TableColumnMenuButton extends mixinFractionalWidthColumnAPI(
    TableColumn<TableColumnMenuButtonColumnConfig>
) {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr({ attribute: 'menu-slot' })
    public menuSlot?: string;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('delegated-event', this.onDelegatedEvent);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('delegated-event', this.onDelegatedEvent);
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnMenuButtonCellViewTag,
            delegatedEvents: ['beforetoggle', 'toggle'],
            slotNames: [cellViewMenuSlotName],
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

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            menuSlot: this.menuSlot
        };
    }

    private readonly onDelegatedEvent = (e: Event): void => {
        const event = e as CustomEvent<DelegatedEventEventDetails>;
        const originalEvent = event.detail.originalEvent;

        if (
            originalEvent.type === 'beforetoggle'
            || originalEvent.type === 'toggle'
        ) {
            const newEventName = `menu-button-column-${originalEvent.type}`;
            const originalToggleEvent = originalEvent as CustomEvent<MenuButtonToggleEventDetail>;
            const detail: MenuButtonColumnToggleEventDetail = {
                ...originalToggleEvent.detail,
                recordId: event.detail.recordId
            };
            this.$emit(newEventName, detail);
        }
    };
}

const nimbleTableColumnMenuButton = TableColumnMenuButton.compose({
    baseName: 'table-column-menu-button',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnMenuButton());
export const tableColumnMenuButtonTag = 'nimble-table-column-menu-button';
