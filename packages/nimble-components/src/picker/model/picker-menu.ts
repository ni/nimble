import {
    DesignSystem,
    PickerMenu as FoundationPickerMenu,
    pickerMenuTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './picker-menu.styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-picker-menu': PickerMenu;
    }
}

/**
 * The dropdown menu of a Picker
 */
export class PickerMenu extends FoundationPickerMenu {}

const nimblePickerMenu = PickerMenu.compose({
    baseName: 'picker-menu',
    baseClass: FoundationPickerMenu,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimblePickerMenu());
