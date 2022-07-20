import { attr, html, observable, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
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
export class Dialog extends FoundationElement {
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    @attr
    public role: string | null = null;

    @attr({ attribute: 'aria-describedby' })
    public ariaDescribedBy: string | null = null;

    @attr({ attribute: 'aria-labelledby' })
    public ariaLabelledBy: string | null = null;

    @attr({ attribute: 'aria-label' })
    public ariaLabel: string | null = null;

    @observable
    public readonly dialogElement: HTMLDialogElement | undefined;

    private resolveShowModal: (() => void) | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();

        this.updateDialogRole();
        this.updateDialogAriaDescribedBy();
        this.updateDialogAriaLabelledBy();
        this.updateDialogAriaLabel();
        this.dialogElement!.addEventListener('cancel', this.cancelHandler);
        this.dialogElement!.addEventListener('close', this.closeHandler);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        this.dialogElement!.removeEventListener('cancel', this.cancelHandler);
        this.dialogElement!.removeEventListener('close', this.closeHandler);
    }

    public async showModal(): Promise<void> {
        this.dialogElement?.showModal();
        return new Promise((resolve, _reject) => {
            this.resolveShowModal = resolve;
        });
    }

    public close(): void {
        this.dialogElement?.close();
    }

    public onClose(): void {
        if (this.resolveShowModal) {
            this.resolveShowModal();
            this.resolveShowModal = null;
        }
    }

    private roleChanged(_oldValue: string, _newValue: string): void {
        this.updateDialogRole();
    }

    private updateDialogRole(): void {
        if (this.role) {
            this.dialogElement?.setAttribute('role', this.role);
        } else {
            this.dialogElement?.removeAttribute('role');
        }
    }

    private ariaDescribedByChanged(_oldValue: string, _newValue: string): void {
        this.updateDialogAriaDescribedBy();
    }

    private updateDialogAriaDescribedBy(): void {
        if (this.ariaDescribedBy) {
            this.dialogElement?.setAttribute('aria-describedby', this.ariaDescribedBy);
        } else {
            this.dialogElement?.removeAttribute('aria-describedby');
        }
    }

    private ariaLabelledByChanged(_oldValue: string, _newValue: string): void {
        this.updateDialogAriaLabelledBy();
    }

    private updateDialogAriaLabelledBy(): void {
        if (this.ariaLabelledBy) {
            this.dialogElement?.setAttribute('aria-labelledby', this.ariaLabelledBy);
        } else {
            this.dialogElement?.removeAttribute('aria-labelledby');
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
            const shouldDismiss = this.$emit(
                'cancel',
                {},
                { bubbles: event.bubbles, cancelable: event.cancelable, composed: event.composed }
            );
            if (!shouldDismiss) {
                event.preventDefault();
            }
        }
    };

    private readonly closeHandler = (event: Event): void => {
        this.onClose();
        this.$emit(
            'close',
            {},
            { bubbles: event.bubbles, cancelable: event.cancelable, composed: event.composed }
        );
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