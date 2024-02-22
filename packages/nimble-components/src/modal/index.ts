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

export const ModalState = {
    opening: 'opening',
    open: 'open',
    closing: 'closing',
    closed: 'closed'
} as const;
export type ModalState =
    (typeof ModalState)[keyof typeof ModalState];

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
    protected readonly dialogElement!: ExtendedDialog;

    protected state: ModalState = ModalState.closed;

    /**
     * True if the Modal is open/showing, false otherwise
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;

    /**
     * Opens the Modal
     * @returns Promise that is resolved when the Modal is closed. The value of the resolved Promise is the reason value passed to the close() method, or UserDismissed if closed via the ESC key.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (this.open) {
            throw new Error('Already open');
        }
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
        if (!this.open || this.state === ModalState.closing) {
            throw new Error('Not open or already closing');
        }
        this.startClosing(reason);
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.startClosing(UserDismissed);
        }
        return true;
    }

    protected startOpening(): void {
        this.state = ModalState.opening;
        this.finishOpening();
    }

    protected finishOpening(): void {
        this.state = ModalState.open;
        this.dialogElement.showModal();
    }

    protected startClosing(reason: CloseReason | UserDismissed): void {
        this.state = ModalState.closing;
        this.finishClosing(reason);
    }

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
