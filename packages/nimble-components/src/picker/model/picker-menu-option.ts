import {
    DesignSystem,
    PickerMenuOption as FoundationPickerMenuOption,
    pickerMenuOptionTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './picker-menu-option.styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-picker-menu-option': PickerMenuOption;
    }
}

/**
 * A menu item in the dropdown of a Picker
 */
export class PickerMenuOption extends FoundationPickerMenuOption {}

const nimblePickerMenuOption = PickerMenuOption.compose({
    baseName: 'picker-menu-option',
    baseClass: FoundationPickerMenuOption,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimblePickerMenuOption());
