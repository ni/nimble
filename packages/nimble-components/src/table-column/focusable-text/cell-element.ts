import { DesignSystem } from '@microsoft/fast-foundation';
import { TextCellView } from '../text/cell-element';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell-view-focusable-text': FocusableTextCellView;
    }
}

/**
 * Partial/Prototype implementation of an editable column type that needs blur() to be
 * called on its elements when a scroll happens
 */
export class FocusableTextCellView extends TextCellView {
    public focusableElement!: HTMLElement;

    public override focusedRecycleCallback(): void {
        // eslint-disable-next-line no-console
        console.log('CellElement focusedRecycleCallback()');
        this.focusableElement.blur();
    }
}

const focusableTextCellElement = FocusableTextCellView.compose({
    baseName: 'table-cell-view-focusable-text',
    template: cellTemplate,
    styles: cellStyles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(focusableTextCellElement());
export const focusableTextCellElementTag = DesignSystem.tagFor(
    FocusableTextCellView
);
