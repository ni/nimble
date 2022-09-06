import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { USER_DISMISSED, UserDismissed } from '../patterns/dialog/constants';
import { styles } from './styles';
import { template } from './template';

export { USER_DISMISSED, UserDismissed } from '../patterns/dialog/constants';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

/**
 * This is a workaround for an incomplete definition of the native dialog element:
 * https://github.com/microsoft/TypeScript/issues/48267
 * @internal
 */
export interface ExtendedDialog extends HTMLDialogElement {
    showModal(): void;
    close(): void;
}

/**
 * A nimble-styled dialog.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Dialog<CloseReason = void> extends FoundationElement {
    // We want the member to match the name of the constant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly USER_DISMISSED = USER_DISMISSED;

    /**
     * @public
     * @description
     * Prevents dismissing the dialog via the Escape key
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    /**
     * The ref to the internal dialog element.
     *
     * @internal
     */
    public readonly dialogElement!: ExtendedDialog;

    /**
     * True if the dialog is open/showing, false otherwise
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;

    /**
     * Opens the dialog
     * @returns Promise that is resolved when the dialog is closed. The value of the resolved Promise is the reason value passed to the close() method, or USER_DISMISSED if the dialog was closed via the ESC key.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (this.open) {
            throw new Error('Dialog is already open');
        }
        this.dialogElement.showModal();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    /**
     * Closes the dialog
     * @param reason An optional value indicating how/why the dialog was closed.
     */
    public close(reason: CloseReason): void {
        if (!this.open) {
            throw new Error('Dialog is not open');
        }
        this.dialogElement.close();
        this.resolveShow!(reason);
        this.resolveShow = undefined;
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.resolveShow!(USER_DISMISSED);
            this.resolveShow = undefined;
        }
        return true;
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
