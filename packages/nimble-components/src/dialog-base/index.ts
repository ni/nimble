import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';

/**
 * This is a workaround for an incomplete definition of the native dialog element. Remove when using Typescript >=4.8.3.
 * https://github.com/microsoft/TypeScript/issues/48267
 * @internal
 */
export interface ExtendedDialog extends HTMLDialogElement {
    showModal(): void;
    close(): void;
}

/**
 * A base class for components based on a native dialog.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export abstract class DialogBase<CloseReason = void> extends FoundationElement {
    /**
     * @public
     * @description
     * Prevents dismissing via the Escape key
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
     * True if the component is open/showing, false otherwise
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    protected resolveShow?: (reason: CloseReason | UserDismissed) => void;

    /**
     * Opens the component
     * @returns Promise that is resolved when the component is closed. The value of the resolved Promise is the reason value passed to the close() method, or UserDismissed if closed via the ESC key.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (this.open) {
            throw new Error('Already open');
        }
        this.openDialog();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    /**
     * Closes the component
     * @param reason An optional value indicating how/why the component was closed.
     */
    public close(reason: CloseReason): void {
        if (!this.open) {
            throw new Error('Not open');
        }
        this.dialogElement.close();
        this.notifyClosed(reason);
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.notifyClosed(UserDismissed);
        }
        return true;
    }

    /**
     * @internal
     */
    public closeHandler(): void {
        if (this.resolveShow) {
            // This happens if all of the following are true:
            //   1. the browser implements dialogs with the CloseWatcher API
            //   2. preventDismiss is true
            //   3. nothing in the component has focus
            //   4. the user pressed ESC twice without intervening user interaction (e.g. clicking)
            // In that case, cancel is not fired because of #1 & #4, we don't get a keydown
            // because of #3, and the dialog just closes.
            // Ideally, preventDismiss should always prevent ESC from closing the dialog,
            // but we can't work around this corner case.
            this.notifyClosed(UserDismissed);
        }
    }

    /**
     * @internal
     */
    public keydownHandler(event: KeyboardEvent): boolean {
        // Historically, we could expect a cancel event to fire every time the user presses ESC,
        // so a separate keydownHandler would not be needed. But with the advent of the CloseWatcher
        // API, cancel is not fired if there was no user interaction since the last ESC
        // (https://github.com/WICG/close-watcher?tab=readme-ov-file#asking-for-confirmation).
        // In that case, we have to rely on handling keydown instead. But we only get a keydown
        // if an element within the component has focus.
        return event.key === 'Escape' ? this.cancelHandler(event) : true;
    }

    protected openDialog(): void {
        this.dialogElement.showModal();
    }

    protected notifyClosed(reason: CloseReason | UserDismissed): void {
        this.resolveShow!(reason);
        this.resolveShow = undefined;
    }
}
