import {
    DesignSystem,
    PickerListItem as FoundationPickerListItem,
    pickerListItemTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './picker-list-item.styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-picker-list-item': PickerListItem;
    }
}

/**
 * A nimble-styled HTML Picker
 */
export class PickerListItem extends FoundationPickerListItem {}

const nimblePickerListItem = PickerListItem.compose({
    baseName: 'picker-list-item',
    baseClass: FoundationPickerListItem,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimblePickerListItem());
