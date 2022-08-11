import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

/**
 * Symbol that is returned as the dialog close reason (from the Promise returned by show()) when
 * the dialog was closed by pressing the ESC key (vs. calling the close() function).
 */
export const USER_DISMISSED: unique symbol = Symbol('user dismissed');
export type UserDismissed = typeof USER_DISMISSED;

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
    private closeReason!: CloseReason | UserDismissed;

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
        this.closeReason = reason;
        this.dialogElement.close();
    }

    /**
     * @internal
     */
    public closeHandler(): boolean {
        this.resolveShow!(this.closeReason);
        this.resolveShow = undefined;
        return true;
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.closeReason = USER_DISMISSED;
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
