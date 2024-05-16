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
import { ButtonAppearance, ButtonAppearanceVariant } from '../../button/types';
import { menuSlotName } from './types';

export type TableColumnMenuButtonCellRecord = TableStringField<'value'>;

export interface TableColumnMenuButtonColumnConfig {
    appearance: ButtonAppearance;
    appearanceVariant: ButtonAppearanceVariant;
    menuSlot?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-menu-button': TableColumnMenuButton;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnMenuButton extends mixinFractionalWidthColumnAPI(
    TableColumn<TableColumnMenuButtonColumnConfig>
) {
    public override sortingDisabled = true;

    @attr
    public appearance: ButtonAppearance = ButtonAppearance.outline;

    @attr({ attribute: 'menu-slot' })
    public menuSlot?: string;

    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: ButtonAppearanceVariant;

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnMenuButtonCellViewTag,
            groupHeaderViewTag: undefined,
            delegatedEvents: ['beforetoggle', 'toggle'],
            slotNames: [menuSlotName],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected appearanceChanged(): void {
        this.updateColumnConfig();
    }

    protected appearanceVariantChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            appearance: this.appearance,
            appearanceVariant: this.appearanceVariant,
            menuSlot: this.menuSlot
        };
    }
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
