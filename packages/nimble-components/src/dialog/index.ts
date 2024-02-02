import { attr, observable } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem
} from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';
import { DialogBase } from '../dialog-base';
import { styles } from './styles';
import { template } from './template';

export { UserDismissed };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

/**
 * A nimble-styled dialog.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Dialog<CloseReason = void> extends DialogBase<CloseReason> {
    // We want the member to match the name of the constant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly UserDismissed = UserDismissed;

    /**
     * @public
     * @description
     * Hides the header of the dialog.
     */
    @attr({ attribute: 'header-hidden', mode: 'boolean' })
    public headerHidden = false;

    /**
     * @public
     * @description
     * Hides the footer of the dialog.
     */
    @attr({ attribute: 'footer-hidden', mode: 'boolean' })
    public footerHidden = false;

    /** @internal */
    @observable
    public footerIsEmpty = true;

    /** @internal */
    @observable
    public readonly slottedFooterElements?: HTMLElement[];

    public slottedFooterElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.footerIsEmpty = !next?.length;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Dialog extends ARIAGlobalStatesAndProperties {}
applyMixins(Dialog, ARIAGlobalStatesAndProperties);

const nimbleDialog = Dialog.compose({
    baseName: 'dialog',
    template,
    styles,
    baseClass: Dialog
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDialog());
export const dialogTag = 'nimble-dialog';
