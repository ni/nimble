import { attr, observable } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';
import { styles } from './styles';
import { template } from './template';

export { UserDismissed };

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
    public static readonly UserDismissed = UserDismissed;

    /**
     * @public
     * @description
     * Prevents dismissing the dialog via the Escape key
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

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

    /**
     * The ref to the internal dialog element.
     *
     * @internal
     */
    public readonly dialogElement!: ExtendedDialog;

    /** @internal */
    @observable
    public footerIsEmpty = true;

    /** @internal */
    @observable
    public readonly slottedFooterElements?: HTMLElement[];

    /**
     * True if the dialog is open/showing, false otherwise
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;

    /**
     * Opens the dialog
     * @returns Promise that is resolved when the dialog is closed. The value of the resolved Promise is the reason value passed to the close() method, or UserDismissed if the dialog was closed via the ESC key.
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

    public slottedFooterElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.footerIsEmpty = !next?.length;
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.resolveShow!(UserDismissed);
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
