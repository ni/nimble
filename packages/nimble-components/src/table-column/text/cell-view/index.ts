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
    public textField?: TextField;

    @observable
    public isEditing = false;

    public override onEditStart(): void {
        this.isEditing = true;
        const textFieldControl = this.textField!.control;
        window.requestAnimationFrame(() => {
            textFieldControl.focus();
            textFieldControl.setSelectionRange(
                textFieldControl.value.length,
                textFieldControl.value.length
            );
        });
    }

    public handleBlur(): void {
        this.isEditing = false;
        this.$emit('cell-editor-blur');
    }

    public onKeyDown(event: KeyboardEvent): boolean {
        if (event.key === 'Enter') {
            this.textField!.control.blur();
            return false;
        }
        return true;
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
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = 'nimble-table-column-text-cell-view';
