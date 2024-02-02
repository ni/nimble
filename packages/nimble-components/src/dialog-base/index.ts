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
            // If
            // - the browser implements dialogs with the CloseWatcher API, and
            // - the user presses ESC without first interacting with the dialog (e.g. clicking, scrolling),
            // the cancel event is not fired and the dialog just closes.
            this.notifyClosed(UserDismissed);
        }
    }

    protected openDialog(): void {
        this.dialogElement.showModal();
    }

    protected notifyClosed(reason: CloseReason | UserDismissed): void {
        this.resolveShow!(reason);
        this.resolveShow = undefined;
    }
}
