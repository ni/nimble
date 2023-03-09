import { DesignSystem } from '@microsoft/fast-foundation';
import { TextCellElement } from '../text/cell-element';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell-element-focusable-text': FocusableTextCellElement;
    }
}

/**
 * Partial/Prototype implementation of an editable column type that needs blur() to be
 * called on its elements when a scroll happens
 */
export class FocusableTextCellElement extends TextCellElement {
    public focusableElement!: HTMLElement;

    public override onBeforeBlur(): void {
        // eslint-disable-next-line no-console
        console.log('CellElement onBeforeBlur()');
        this.focusableElement.blur();
    }
}

const focusableTextCellElement = FocusableTextCellElement.compose({
    baseName: 'table-cell-element-focusable-text',
    template: cellTemplate,
    styles: cellStyles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(focusableTextCellElement());
export const focusableTextCellElementTag = DesignSystem.tagFor(
    FocusableTextCellElement
);
