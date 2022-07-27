import { attr, html, observable, ref } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

export const USER_DISMISSED: unique symbol = Symbol('user dismissed');
export type UserDismissed = typeof USER_DISMISSED;

/**
 * This is a workaround for an incomplete definition of the native dialog element:
 * https://github.com/microsoft/TypeScript/issues/48267
 */
export interface ExtendedDialog extends HTMLDialogElement {
    showModal(): void;
    close(): void;
}

/**
 * A nimble-styled dialog.
 */
export class Dialog extends FoundationElement {
    /**
     * @public
     * @description
     * Prevents dismissing the dialog via the Escape key
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    @attr
    public role: string | null = null;

    @attr({ attribute: 'aria-label' })
    public override ariaLabel: string | null = null;

    /**
     * The ref to the internal dialog element.
     *
     * @internal
     */
    @observable
    public readonly dialogElement: ExtendedDialog | undefined;

    public get open(): boolean {
        return this.resolveShow !== null;
    }

    private resolveShow: ((reason: unknown) => void) | null = null;
    private closeReason: unknown = null;

    public override connectedCallback(): void {
        super.connectedCallback();

        this.updateDialogRole();
        this.updateDialogAriaLabel();
        this.dialogElement!.addEventListener('cancel', this.cancelHandler);
        this.dialogElement!.addEventListener('close', this.closeHandler);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        this.dialogElement!.removeEventListener('cancel', this.cancelHandler);
        this.dialogElement!.removeEventListener('close', this.closeHandler);
    }

    public async show(): Promise<unknown> {
        if (this.open) {
            throw new Error('Dialog is already open');
        }
        this.dialogElement?.showModal();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    public close(reason?: unknown): void {
        if (!this.open) {
            throw new Error('Dialog is not open');
        }
        this.closeReason = reason;
        this.dialogElement?.close();
    }

    private onClose(): void {
        if (this.resolveShow) {
            this.resolveShow(this.closeReason);
            this.resolveShow = null;
            this.closeReason = null;
        }
    }

    private roleChanged(_oldValue: string, _newValue: string): void {
        this.updateDialogRole();
    }

    private updateDialogRole(): void {
        if (this.role) {
            this.dialogElement?.setAttribute('role', this.role);
        } else {
            this.dialogElement?.setAttribute('role', 'alertdialog');
        }
    }

    private ariaLabelChanged(_oldValue: string, _newValue: string): void {
        this.updateDialogAriaLabel();
    }

    private updateDialogAriaLabel(): void {
        if (this.ariaLabel) {
            this.dialogElement?.setAttribute('aria-label', this.ariaLabel);
        } else {
            this.dialogElement?.removeAttribute('aria-label');
        }
    }

    private readonly cancelHandler = (event: Event): void => {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            this.closeReason = USER_DISMISSED;
        }
    };

    private readonly closeHandler = (_event: Event): void => {
        this.onClose();
    };
}

const template = html<Dialog>`
    <template>
        <dialog ${ref('dialogElement')}>
            <slot></slot>
        </dialog>
    </template>
`;

const nimbleDialog = Dialog.compose({
    baseName: 'dialog',
    template,
    styles,
    baseClass: Dialog
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDialog());
