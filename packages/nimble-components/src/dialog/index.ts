import {
    DesignSystem,
    Dialog as FoundationDialog,
    dialogTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

/**
 * A nimble-styled dialog.
 */
export class Dialog extends FoundationDialog {}

const nimbleDialog = Dialog.compose({
    baseClass: FoundationDialog,
    baseName: 'dialog',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDialog());
