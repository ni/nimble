import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../../text-base/cell-view/styles';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { MappingTextConfig } from '../../enum-base/models/mapping-text-config';

const baseName = 'table-column-enum-text-cell-view';
export const tableColumnEnumTextCellViewTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnEnumTextCellViewTag]: TableColumnEnumTextCellView;
    }
}

/**
 * A cell view for displaying mapped text
 */
export class TableColumnEnumTextCellView extends TableColumnTextCellViewBase<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        const value = this.cellRecord?.value;
        if (value === undefined || value === null) {
            this.text = '';
            return;
        }

        const config = this.columnConfig?.mappingConfigs.get(value);
        this.text = config instanceof MappingTextConfig && config.text
            ? config.text
            : '';
    }
}

const enumTextCellView = TableColumnEnumTextCellView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumTextCellView());
