import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';
import { ModalState } from './types';

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
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export abstract class Modal<CloseReason = void> extends FoundationElement {
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

    protected get state(): ModalState {
        return this._state;
    }

    private set state(value: ModalState) {
        this._state = value;
    }

    /**
     * False if the Modal is closed, true otherwise
     */
    public get open(): boolean {
        return this.state !== ModalState.closed;
    }

    private _state: ModalState = ModalState.closed;
    private resolveShow?: (reason: CloseReason | UserDismissed) => void;

    /**
     * Opens the Modal
     * @returns Promise that is resolved when the Modal is closed. The value of the resolved Promise is the reason value passed to the close() method, or UserDismissed if closed via the ESC key.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (
            this.state === ModalState.open
            || this.state === ModalState.opening
        ) {
            throw new Error('Already open or opening');
        }
        this.state = ModalState.opening;
        this.startOpening();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    /**
     * Closes the Modal
     * @param reason An optional value indicating how/why the Modal was closed.
     */
    public close(reason: CloseReason): void {
        if (this.state !== ModalState.open) {
            throw new Error('Not open');
        }
        this.state = ModalState.closing;
        this.startClosing(reason);
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.state = ModalState.closing;
            this.startClosing(UserDismissed);
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
            // the cancel event is not fired, but the close event still is, and the dialog just closes.
            this.finishClosing(UserDismissed);
        }
    }

    protected abstract startOpening(): void;

    protected finishOpening(): void {
        this.state = ModalState.open;
        this.dialogElement.showModal();
    }

    protected abstract startClosing(reason: CloseReason | UserDismissed): void;

    protected finishClosing(reason: CloseReason | UserDismissed): void {
        this.state = ModalState.closed;
        this.dialogElement.close();
        this.doResolveShow(reason);
    }

    protected doResolveShow(reason: CloseReason | UserDismissed): void {
        if (!this.resolveShow) {
            throw new Error(
                'Do not call doResolveShow unless there is a promise to resolve'
            );
        }
        this.resolveShow(reason);
        this.resolveShow = undefined;
    }
}
