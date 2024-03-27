import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { TableColumnSortOperation } from '../base/types';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinColumnWithPlaceholderAPI } from '../mixins/placeholder';
import type { TableStringField } from '../../table/types';
import { tableColumnAnchorCellViewTag } from './cell-view';
import { tableColumnTextGroupHeaderViewTag } from '../text/group-header-view';
import type { AnchorAppearance } from '../../anchor/types';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnAnchorCellRecord = TableStringField<'label' | 'href'>;
export interface TableColumnAnchorColumnConfig {
    appearance: AnchorAppearance;
    underlineHidden?: boolean;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: string;
    rel?: string;
    target?: string;
    type?: string;
    download?: string;
    placeholder?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor': TableColumnAnchor;
    }
}

/**
 * A table column for displaying links.
 */
export class TableColumnAnchor extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(
        mixinColumnWithPlaceholderAPI(
            TableColumn<TableColumnAnchorColumnConfig>
        )
    )
) {
    @attr({ attribute: 'label-field-name' })
    public labelFieldName?: string;

    @attr({ attribute: 'href-field-name' })
    public hrefFieldName?: string;

    @attr
    public appearance?: AnchorAppearance;

    @attr({ attribute: 'underline-hidden', mode: 'boolean' })
    public underlineHidden = false;

    @attr
    public hreflang?: string;

    @attr
    public ping?: string;

    @attr
    public referrerpolicy?: string;

    @attr
    public rel?: string;

    @attr
    public target?: string;

    @attr
    public type?: string;

    @attr
    public download?: string;

    public placeholderChanged(): void {
        this.updateColumnConfig();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['label', 'href'],
            cellViewTag: tableColumnAnchorCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: ['click'],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        };
    }

    protected labelFieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [
            this.labelFieldName,
            this.hrefFieldName
        ] as const;
        this.columnInternals.operandDataRecordFieldName = this.labelFieldName;
    }

    protected hrefFieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [
            this.labelFieldName,
            this.hrefFieldName
        ] as const;
    }

    protected appearanceChanged(): void {
        this.updateColumnConfig();
    }

    protected underlineHiddenChanged(): void {
        this.updateColumnConfig();
    }

    protected hreflangChanged(): void {
        this.updateColumnConfig();
    }

    protected pingChanged(): void {
        this.updateColumnConfig();
    }

    protected referrerpolicyChanged(): void {
        this.updateColumnConfig();
    }

    protected relChanged(): void {
        this.updateColumnConfig();
    }

    protected targetChanged(): void {
        this.updateColumnConfig();
    }

    protected typeChanged(): void {
        this.updateColumnConfig();
    }

    protected downloadChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            appearance: this.appearance,
            underlineHidden: this.underlineHidden,
            hreflang: this.hreflang,
            ping: this.ping,
            referrerpolicy: this.referrerpolicy,
            rel: this.rel,
            target: this.target,
            type: this.type,
            download: this.download,
            placeholder: this.placeholder
        };
    }
}

const nimbleTableColumnAnchor = TableColumnAnchor.compose({
    baseName: 'table-column-anchor',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnAnchor());
export const tableColumnAnchorTag = 'nimble-table-column-anchor';
