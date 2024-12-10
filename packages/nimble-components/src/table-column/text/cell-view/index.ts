import { observable } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from './template';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { styles } from './styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import type { TextField } from '../../../text-field';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-cell-view': TableColumnTextCellView;
    }
}

/**
 * A cell view for displaying string fields as text
 */
export class TableColumnTextCellView extends TableColumnTextCellViewBase<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public isEditable?: boolean;

    @observable
    public isEditing = false;

    @observable
    public isFocused = false;

    @observable
    public textField?: TextField;

    public handleClick(): void {
        if (this.isEditable && !this.isFocused) {
            this.isFocused = true;
        } else if (this.isEditable && this.isFocused) {
            this.isEditing = true;
            this.isFocused = false;
        }
    }

    public handleBlur(): void {
        this.isEditing = false;
        this.isFocused = false;
    }

    protected updateText(): void {
        this.text = typeof this.cellRecord?.value === 'string'
            ? this.cellRecord.value
            : '';
    }

    protected override columnConfigChanged(): void {
        super.columnConfigChanged();
        this.isEditable = this.columnConfig?.editable ?? false;
    }

    private isEditingChanged(): void {
        if (this.isEditing) {
            window.requestAnimationFrame(() => {
                this.textField?.focus();
            });
        }
    }
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = 'nimble-table-column-text-cell-view';
